"use server";

import { db } from "@/lib/db";
import { transactions, dividends, cashFlows } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import type { InsertTransaction, InsertDividend, InsertCashFlow } from "@/lib/db/schema";

export async function importTransactions(data: Omit<InsertTransaction, "userId">[]) {
  const session = await requireAuth();
  
  try {
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

