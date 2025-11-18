"use server";

import { requireAuth } from "@/lib/auth/session";
import { getAllHoldings } from "./holdings";
import { getAllDividends } from "./dividends";
import { getAllCashFlows } from "./cashflows";
import { getAllTransactions } from "./transactions";

export interface BackupData {
  version: string;
  exportDate: string;
  userId: string;
  data: {
    holdings: any[];
    dividends: any[];
    cashFlows: any[];
    transactions: any[];
  };
}

export async function createBackup(): Promise<BackupData> {
  const session = await requireAuth();

  const [holdings, dividends, cashFlows, transactions] = await Promise.all([
    getAllHoldings(),
    getAllDividends(),
    getAllCashFlows(),
    getAllTransactions(),
  ]);

  const backup: BackupData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    userId: session.user.id,
    data: {
      holdings,
      dividends,
      cashFlows,
      transactions,
    },
  };

  return backup;
}

export async function downloadBackup(): Promise<string> {
  const backup = await createBackup();
  return JSON.stringify(backup, null, 2);
}

