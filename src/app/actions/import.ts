"use server";

import { db } from "@/lib/db";
import { transactions, dividends, cashFlows, users, holdings } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import type { InsertTransaction, InsertDividend, InsertCashFlow } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getPlanLimits } from "@/lib/config/subscription";

export async function importTransactions(data: Omit<InsertTransaction, "userId">[]) {
  const session = await requireAuth();
  
  try {
    // Check holdings limit
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { tier: true },
    });
    
    const plan = getPlanLimits(user?.tier || "FREE");
    
    if (plan.limits.holdings !== Infinity) {
      // Get current unique symbols
      const currentHoldings = await db.query.holdings.findMany({
        where: eq(holdings.userId, session.user.id),
        columns: { symbol: true },
      });
      const currentSymbols = new Set(currentHoldings.map(h => h.symbol));
      
      // Get new symbols from import data
      const newSymbols = new Set(data.map(d => d.symbol));
      
      // Calculate total unique symbols after import
      const totalSymbols = new Set([...currentSymbols, ...newSymbols]);
      
      if (totalSymbols.size > plan.limits.holdings) {
        throw new Error(`무료 플랜은 최대 ${plan.limits.holdings}개의 종목만 보유할 수 있습니다. (현재: ${currentSymbols.size}개, 추가 시: ${totalSymbols.size}개)`);
      }
    }

    const records = data.map((item) => ({
      ...item,
      userId: session.user.id,
    }));

    await db.insert(transactions).values(records);

    revalidatePath("/holdings");
    revalidatePath("/");

    return { success: true, count: records.length };
  } catch (error) {
    console.error("Transaction import error:", error);
    // Re-throw the error message if it's our custom error
    if (error instanceof Error && error.message.includes("무료 플랜")) {
      throw error;
    }
    throw new Error("거래 내역 업로드 실패");
  }
}

export async function importDividends(data: Omit<InsertDividend, "userId">[]) {
  const session = await requireAuth();
  
  try {
    const records = data.map((item) => ({
      ...item,
      userId: session.user.id,
    }));

    await db.insert(dividends).values(records);

    revalidatePath("/dividends");
    revalidatePath("/");

    return { success: true, count: records.length };
  } catch (error) {
    console.error("Dividend import error:", error);
    throw new Error("배당 내역 업로드 실패");
  }
}

export async function importCashFlows(data: Omit<InsertCashFlow, "userId">[]) {
  const session = await requireAuth();
  
  try {
    const records = data.map((item) => ({
      ...item,
      userId: session.user.id,
    }));

    await db.insert(cashFlows).values(records);

    revalidatePath("/cash");
    revalidatePath("/");

    return { success: true, count: records.length };
  } catch (error) {
    console.error("Cash flow import error:", error);
    throw new Error("입출금 내역 업로드 실패");
  }
}
