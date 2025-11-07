"use server";

import { db } from "@/lib/db";
import { dividends } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { InsertDividend } from "@/lib/db/schema";

export async function getAllDividends() {
  const session = await requireAuth();
  
  const results = await db
    .select()
    .from(dividends)
    .where(eq(dividends.userId, session.user.id))
    .orderBy(desc(dividends.payDate));
  
  return results;
}

export async function getDividendsByDateRange(startDate: string, endDate: string) {
  const session = await requireAuth();
  
  const results = await db
    .select()
    .from(dividends)
    .where(
      and(
        eq(dividends.userId, session.user.id),
        gte(dividends.payDate, startDate),
        lte(dividends.payDate, endDate)
      )
    )
    .orderBy(desc(dividends.payDate));
  
  return results;
}

export async function getDividendById(id: string) {
  const session = await requireAuth();
  
  const result = await db
    .select()
    .from(dividends)
    .where(and(eq(dividends.id, id), eq(dividends.userId, session.user.id)))
    .limit(1);
  
  return result[0] || null;
}

export async function createDividend(data: Omit<InsertDividend, "userId">) {
  const session = await requireAuth();
  
  const result = await db
    .insert(dividends)
    .values({
      ...data,
      userId: session.user.id,
    })
    .returning();
  
  revalidatePath("/dividends");
  revalidatePath("/");
  
  return result[0];
}

export async function updateDividend(id: string, data: Partial<InsertDividend>) {
  const session = await requireAuth();
  
  const result = await db
    .update(dividends)
    .set(data)
    .where(and(eq(dividends.id, id), eq(dividends.userId, session.user.id)))
    .returning();
  
  revalidatePath("/dividends");
  revalidatePath("/");
  
  return result[0];
}

export async function deleteDividend(id: string) {
  const session = await requireAuth();
  
  await db
    .delete(dividends)
    .where(and(eq(dividends.id, id), eq(dividends.userId, session.user.id)));
  
  revalidatePath("/dividends");
  revalidatePath("/");
  
  return { success: true };
}

