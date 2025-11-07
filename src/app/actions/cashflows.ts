"use server";

import { db } from "@/lib/db";
import { cashFlows } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { InsertCashFlow } from "@/lib/db/schema";

export async function getAllCashFlows() {
  const session = await requireAuth();
  
  const results = await db
    .select()
    .from(cashFlows)
    .where(eq(cashFlows.userId, session.user.id))
    .orderBy(desc(cashFlows.date));
  
  return results;
}

export async function getCashFlowsByDateRange(startDate: string, endDate: string) {
  const session = await requireAuth();
  
  const results = await db
    .select()
    .from(cashFlows)
    .where(
      and(
        eq(cashFlows.userId, session.user.id),
        gte(cashFlows.date, startDate),
        lte(cashFlows.date, endDate)
      )
    )
    .orderBy(desc(cashFlows.date));
  
  return results;
}

export async function getCashFlowById(id: string) {
  const session = await requireAuth();
  
  const result = await db
    .select()
    .from(cashFlows)
    .where(and(eq(cashFlows.id, id), eq(cashFlows.userId, session.user.id)))
    .limit(1);
  
  return result[0] || null;
}

export async function createCashFlow(data: Omit<InsertCashFlow, "userId">) {
  const session = await requireAuth();
  
  const result = await db
    .insert(cashFlows)
    .values({
      ...data,
      userId: session.user.id,
    })
    .returning();
  
  revalidatePath("/cash");
  revalidatePath("/");
  
  return result[0];
}

export async function updateCashFlow(id: string, data: Partial<InsertCashFlow>) {
  const session = await requireAuth();
  
  const result = await db
    .update(cashFlows)
    .set(data)
    .where(and(eq(cashFlows.id, id), eq(cashFlows.userId, session.user.id)))
    .returning();
  
  revalidatePath("/cash");
  revalidatePath("/");
  
  return result[0];
}

export async function deleteCashFlow(id: string) {
  const session = await requireAuth();
  
  await db
    .delete(cashFlows)
    .where(and(eq(cashFlows.id, id), eq(cashFlows.userId, session.user.id)));
  
  revalidatePath("/cash");
  revalidatePath("/");
  
  return { success: true };
}

