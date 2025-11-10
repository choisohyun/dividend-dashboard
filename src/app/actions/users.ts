"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getUserSettings() {
  const session = await requireAuth();
  
  const result = await db
    .select({
      currency: users.currency,
      timezone: users.timezone,
      goalMonthlyDividend: users.goalMonthlyDividend,
      monthlyInvestPlan: users.monthlyInvestPlan,
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
}) {
  const session = await requireAuth();
  
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

