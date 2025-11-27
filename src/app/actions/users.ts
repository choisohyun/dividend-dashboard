"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq, and, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getPlanLimits } from "@/lib/config/subscription";

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
      tier: users.tier,
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
  
  // Check subscription limits for auto backup
  if (settings.autoBackupEnabled) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { tier: true },
    });
    
    const plan = getPlanLimits(user?.tier || "FREE");
    if (!plan.features.autoBackup) {
      throw new Error("자동 백업은 Pro 플랜 전용 기능입니다.");
    }
  }

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
