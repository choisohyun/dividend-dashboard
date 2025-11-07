"use server";

import { db } from "@/lib/db";
import { holdings } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { InsertHolding } from "@/lib/db/schema";

export async function getAllHoldings() {
  const session = await requireAuth();
  
  const results = await db
    .select()
    .from(holdings)
    .where(eq(holdings.userId, session.user.id))
    .orderBy(holdings.symbol);
  
  return results;
}

export async function getHoldingById(id: string) {
  const session = await requireAuth();
  
  const result = await db
    .select()
    .from(holdings)
    .where(and(eq(holdings.id, id), eq(holdings.userId, session.user.id)))
    .limit(1);
  
  return result[0] || null;
}

export async function createHolding(data: Omit<InsertHolding, "userId">) {
  const session = await requireAuth();
  
  const result = await db
    .insert(holdings)
    .values({
      ...data,
      userId: session.user.id,
    })
    .returning();
  
  revalidatePath("/holdings");
  revalidatePath("/");
  
  return result[0];
}

export async function updateHolding(id: string, data: Partial<InsertHolding>) {
  const session = await requireAuth();
  
  const result = await db
    .update(holdings)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(holdings.id, id), eq(holdings.userId, session.user.id)))
    .returning();
  
  revalidatePath("/holdings");
  revalidatePath("/");
  
  return result[0];
}

export async function deleteHolding(id: string) {
  const session = await requireAuth();
  
  await db
    .delete(holdings)
    .where(and(eq(holdings.id, id), eq(holdings.userId, session.user.id)));
  
  revalidatePath("/holdings");
  revalidatePath("/");
  
  return { success: true };
}

