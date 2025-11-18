"use server";

import { db } from "@/lib/db";
import { holdings, dividends, cashFlows, transactions } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { BackupData } from "./backup";

export async function validateBackupData(backupJson: string): Promise<{
  valid: boolean;
  error?: string;
  data?: BackupData;
}> {
  try {
    const data: BackupData = JSON.parse(backupJson);

    // Version check
    if (data.version !== "1.0") {
      return { valid: false, error: "지원하지 않는 백업 버전입니다" };
    }

    // Structure check
    if (!data.data || !data.data.holdings || !data.data.dividends) {
      return { valid: false, error: "백업 파일 형식이 올바르지 않습니다" };
    }

    return { valid: true, data };
  } catch (error) {
    return { valid: false, error: "백업 파일을 읽을 수 없습니다" };
  }
}

export async function restoreFromBackup(
  backupJson: string,
  mode: "merge" | "replace" = "merge"
): Promise<{ success: boolean; error?: string; counts?: any }> {
  const session = await requireAuth();

  // Validate backup
  const validation = await validateBackupData(backupJson);
  if (!validation.valid || !validation.data) {
    return { success: false, error: validation.error };
  }

  const backup = validation.data;

  try {
    // If replace mode, delete existing data
    if (mode === "replace") {
      await Promise.all([
        db.delete(holdings).where(eq(holdings.userId, session.user.id)),
        db.delete(dividends).where(eq(dividends.userId, session.user.id)),
        db.delete(cashFlows).where(eq(cashFlows.userId, session.user.id)),
        db.delete(transactions).where(eq(transactions.userId, session.user.id)),
      ]);
    }

    // Restore data
    const counts = {
      holdings: 0,
      dividends: 0,
      cashFlows: 0,
      transactions: 0,
    };

    if (backup.data.holdings.length > 0) {
      const holdingsData = backup.data.holdings.map((h: any) => ({
        ...h,
        userId: session.user.id,
        id: undefined, // Generate new IDs
      }));
      await db.insert(holdings).values(holdingsData);
      counts.holdings = holdingsData.length;
    }

    if (backup.data.dividends.length > 0) {
      const dividendsData = backup.data.dividends.map((d: any) => ({
        ...d,
        userId: session.user.id,
        id: undefined,
      }));
      await db.insert(dividends).values(dividendsData);
      counts.dividends = dividendsData.length;
    }

    if (backup.data.cashFlows.length > 0) {
      const cashFlowsData = backup.data.cashFlows.map((cf: any) => ({
        ...cf,
        userId: session.user.id,
        id: undefined,
      }));
      await db.insert(cashFlows).values(cashFlowsData);
      counts.cashFlows = cashFlowsData.length;
    }

    if (backup.data.transactions.length > 0) {
      const transactionsData = backup.data.transactions.map((t: any) => ({
        ...t,
        userId: session.user.id,
        id: undefined,
      }));
      await db.insert(transactions).values(transactionsData);
      counts.transactions = transactionsData.length;
    }

    // Revalidate all pages
    revalidatePath("/");
    revalidatePath("/holdings");
    revalidatePath("/dividends");
    revalidatePath("/cash");

    return { success: true, counts };
  } catch (error) {
    console.error("Restore error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "복원 실패",
    };
  }
}

export async function deleteAllData(): Promise<{ success: boolean; error?: string }> {
  const session = await requireAuth();

  try {
    await Promise.all([
      db.delete(holdings).where(eq(holdings.userId, session.user.id)),
      db.delete(dividends).where(eq(dividends.userId, session.user.id)),
      db.delete(cashFlows).where(eq(cashFlows.userId, session.user.id)),
      db.delete(transactions).where(eq(transactions.userId, session.user.id)),
    ]);

    revalidatePath("/");
    revalidatePath("/holdings");
    revalidatePath("/dividends");
    revalidatePath("/cash");

    return { success: true };
  } catch (error) {
    console.error("Delete all data error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "삭제 실패",
    };
  }
}

