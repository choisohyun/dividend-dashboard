"use server";

import { requireAuth } from "@/lib/auth/session";
import { getAllDividends } from "./dividends";
import { getAllCashFlows } from "./cashflows";
import { getAllHoldings } from "./holdings";
import { getUserSettings } from "./users";
import { generateWeeklyReport, generateMonthlyReport, getLastNWeeks, getLastNMonths } from "@/lib/calculations/reports";
import type { WeeklyReport, MonthlyReport } from "@/types";

export async function generateWeeklyReportAction(
  startDate?: string,
  endDate?: string
): Promise<WeeklyReport> {
  await requireAuth();

  const dividends = await getAllDividends();
  const cashFlows = await getAllCashFlows();
  const settings = await getUserSettings();

  let start: Date;
  let end: Date;

  if (startDate && endDate) {
    start = new Date(startDate);
    end = new Date(endDate);
  } else {
    // Default to last week
    const weeks = getLastNWeeks(1);
    start = weeks[0].start;
    end = weeks[0].end;
  }

  return generateWeeklyReport(
    start,
    end,
    dividends,
    cashFlows,
    settings?.goalMonthlyDividend || 900000
  );
}

export async function generateMonthlyReportAction(
  year?: number,
  month?: number
): Promise<MonthlyReport> {
  await requireAuth();

  const dividends = await getAllDividends();
  const cashFlows = await getAllCashFlows();
  const holdings = await getAllHoldings();
  const settings = await getUserSettings();

  let targetYear: number;
  let targetMonth: number;

  if (year && month) {
    targetYear = year;
    targetMonth = month;
  } else {
    // Default to last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    targetYear = lastMonth.getFullYear();
    targetMonth = lastMonth.getMonth() + 1;
  }

  return generateMonthlyReport(
    targetYear,
    targetMonth,
    dividends,
    cashFlows,
    holdings,
    settings?.goalMonthlyDividend || 900000,
    settings?.monthlyInvestPlan || 2000000
  );
}

export async function getRecentWeeklyReports(count: number = 4): Promise<WeeklyReport[]> {
  await requireAuth();

  const dividends = await getAllDividends();
  const cashFlows = await getAllCashFlows();
  const settings = await getUserSettings();

  const weeks = getLastNWeeks(count);
  
  return Promise.all(
    weeks.map((week) =>
      generateWeeklyReport(
        week.start,
        week.end,
        dividends,
        cashFlows,
        settings?.goalMonthlyDividend || 900000
      )
    )
  );
}

export async function getRecentMonthlyReports(count: number = 6): Promise<MonthlyReport[]> {
  await requireAuth();

  const dividends = await getAllDividends();
  const cashFlows = await getAllCashFlows();
  const holdings = await getAllHoldings();
  const settings = await getUserSettings();

  const months = getLastNMonths(count);
  
  return Promise.all(
    months.map((m) =>
      generateMonthlyReport(
        m.year,
        m.month,
        dividends,
        cashFlows,
        holdings,
        settings?.goalMonthlyDividend || 900000,
        settings?.monthlyInvestPlan || 2000000
      )
    )
  );
}

