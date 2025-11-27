"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq, and, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getUserSettings() {
  const session = await requireAuth();
  
  const result = await db
    .select({
      currency: users.currency,
      timezone: users.timezone,
      goalMonthlyDividend: users.goalMonthlyDividend,
      monthlyInvestPlan: users.monthlyInvestPlan,
      autoBackupEnabled: users.autoBackupEnabled,
      lastBackupAt: users.lastBackupAt,
      isPublicProfile: users.isPublicProfile,
      username: users.username,
      displayName: users.displayName,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  
  return result[0] || null;
}

export async function updateUserSettings(settings: {
  currency?: string;
  timezone?: string;
  goalMonthlyDividend?: number;
  monthlyInvestPlan?: number;
  autoBackupEnabled?: boolean;
  isPublicProfile?: boolean;
  username?: string;
  displayName?: string;
}) {
  const session = await requireAuth();
  
  if (settings.username) {
    // Check for username collision, excluding current user
    const existing = await db.query.users.findFirst({
      where: and(
        eq(users.username, settings.username),
        ne(users.id, session.user.id)
      )
    });
    
    if (existing) {
      throw new Error("이미 사용 중인 아이디입니다.");
    }
  }

  const result = await db
    .update(users)
    .set({
      ...settings,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id))
    .returning();
  
  revalidatePath("/settings");
  revalidatePath("/");
  
  return result[0];
}
