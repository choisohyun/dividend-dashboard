import { createClient } from "@supabase/supabase-js";
import { db } from "@/lib/db";
import {
  users,
  holdings,
  dividends,
  cashFlows,
  transactions,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Use service role key for cron jobs (bypasses RLS)
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase admin credentials");
  }

  return createClient(url, key);
}

export async function performBackupForUser(userId: string) {
  try {
    const supabaseAdmin = getAdminClient();

    // 1. Fetch all user data
    const [userHoldings, userDividends, userCashFlows, userTransactions] =
      await Promise.all([
        db.select().from(holdings).where(eq(holdings.userId, userId)),
        db.select().from(dividends).where(eq(dividends.userId, userId)),
        db.select().from(cashFlows).where(eq(cashFlows.userId, userId)),
        db.select().from(transactions).where(eq(transactions.userId, userId)),
      ]);

    // 2. Create backup object
    const backupData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      userId,
      data: {
        holdings: userHoldings,
        dividends: userDividends,
        cashFlows: userCashFlows,
        transactions: userTransactions,
      },
    };

    // 3. Upload to Storage
    const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const fileName = `${userId}/${dateStr}-auto.json`;
    const fileContent = JSON.stringify(backupData);

    const { error: uploadError } = await supabaseAdmin.storage
      .from("backups")
      .upload(fileName, fileContent, {
        contentType: "application/json",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 4. Update lastBackupAt
    await db
      .update(users)
      .set({ lastBackupAt: new Date() })
      .where(eq(users.id, userId));

    // 5. Cleanup old backups (keep last 4 weeks)
    await cleanupOldBackups(userId);

    return { success: true };
  } catch (error) {
    console.error(`Backup failed for user ${userId}:`, error);
    return { success: false, error };
  }
}

async function cleanupOldBackups(userId: string) {
  try {
    const supabaseAdmin = getAdminClient();

    const { data: files } = await supabaseAdmin.storage
      .from("backups")
      .list(userId, { sortBy: { column: "created_at", order: "desc" } });

    if (!files || files.length <= 4) return;

    // Keep top 4, delete the rest
    const filesToDelete = files.slice(4).map((f) => `${userId}/${f.name}`);

    if (filesToDelete.length > 0) {
      await supabaseAdmin.storage.from("backups").remove(filesToDelete);
    }
  } catch (error) {
    console.error(`Cleanup failed for user ${userId}:`, error);
  }
}

export async function runAutoBackup() {
  // Find users with auto backup enabled
  const enabledUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.autoBackupEnabled, true));

  console.log(`Starting auto backup for ${enabledUsers.length} users...`);

  const results = await Promise.allSettled(
    enabledUsers.map((user) => performBackupForUser(user.id))
  );

  const successCount = results.filter(
    (r) => r.status === "fulfilled" && r.value.success
  ).length;
  const failureCount = results.length - successCount;

  return {
    total: enabledUsers.length,
    success: successCount,
    failed: failureCount,
  };
}
