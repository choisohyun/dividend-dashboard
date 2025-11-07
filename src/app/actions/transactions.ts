"use server";

import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { InsertTransaction } from "@/lib/db/schema";

export async function getAllTransactions() {
  const session = await requireAuth();
  
  const results = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, session.user.id))
    .orderBy(desc(transactions.tradeDate));
  
  return results;
}

export async function getTransactionsByDateRange(startDate: string, endDate: string) {
  const session = await requireAuth();
  
  const results = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, session.user.id),
        gte(transactions.tradeDate, startDate),
        lte(transactions.tradeDate, endDate)
      )
    )
    .orderBy(desc(transactions.tradeDate));
  
  return results;
}

export async function getTransactionById(id: string) {
  const session = await requireAuth();
  
  const result = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, session.user.id)))
    .limit(1);
  
  return result[0] || null;
}

export async function createTransaction(data: Omit<InsertTransaction, "userId">) {
  const session = await requireAuth();
  
  const result = await db
    .insert(transactions)
    .values({
      ...data,
      userId: session.user.id,
    })
    .returning();
  
  revalidatePath("/holdings");
  revalidatePath("/");
  
  return result[0];
}

export async function updateTransaction(id: string, data: Partial<InsertTransaction>) {
  const session = await requireAuth();
  
  const result = await db
    .update(transactions)
    .set(data)
    .where(and(eq(transactions.id, id), eq(transactions.userId, session.user.id)))
    .returning();
  
  revalidatePath("/holdings");
  revalidatePath("/");
  
  return result[0];
}

export async function deleteTransaction(id: string) {
  const session = await requireAuth();
  
  await db
    .delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, session.user.id)));
  
  revalidatePath("/holdings");
  revalidatePath("/");
  
  return { success: true };
}

