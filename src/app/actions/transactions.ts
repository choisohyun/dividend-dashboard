"use server";

import { db } from "@/lib/db";
import { transactions, holdings, users } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { InsertTransaction } from "@/lib/db/schema";
import { getPlanLimits } from "@/lib/config/subscription";

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
  
  // Check holdings limit if it's a new symbol
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { tier: true },
  });
  
  const plan = getPlanLimits(user?.tier || "FREE");
  
  if (plan.limits.holdings !== Infinity) {
    // Check if user already holds this symbol
    const existingHolding = await db.query.holdings.findFirst({
      where: and(
        eq(holdings.userId, session.user.id),
        eq(holdings.symbol, data.symbol)
      ),
    });

    if (!existingHolding) {
      // If not, check if they have reached the limit
      const holdingsCount = await db
        .select({ count: holdings.id })
        .from(holdings)
        .where(eq(holdings.userId, session.user.id))
        .then((res) => res.length);
      
      if (holdingsCount >= plan.limits.holdings) {
        throw new Error(`무료 플랜은 최대 ${plan.limits.holdings}개의 종목만 보유할 수 있습니다.`);
      }
    }
  }

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
