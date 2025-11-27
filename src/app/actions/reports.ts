"use server";

import { requireAuth } from "@/lib/auth/session";
import { getAllDividends } from "./dividends";
import { getAllCashFlows } from "./cashflows";
import { getAllHoldings } from "./holdings";
import { getUserSettings } from "./users";
import { generateWeeklyReport, generateMonthlyReport, getLastNWeeks, getLastNMonths } from "@/lib/calculations/reports";
import type { WeeklyReport, MonthlyReport } from "@/types";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getPlanLimits } from "@/lib/config/subscription";

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
  const session = await requireAuth();

  // Check historical limit for free users
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { tier: true },
  });
  const plan = getPlanLimits(user?.tier || "FREE");

  if (year && month && plan.limits.reportHistoryMonths !== Infinity) {
    const reportDate = new Date(year, month - 1);
    const limitDate = new Date();
    limitDate.setMonth(limitDate.getMonth() - plan.limits.reportHistoryMonths);
    
    if (reportDate < limitDate) {
      throw new Error(`무료 플랜은 최근 ${plan.limits.reportHistoryMonths}개월 간의 리포트만 조회할 수 있습니다.`);
    }
  }

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
  const session = await requireAuth();

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { tier: true },
  });
  const plan = getPlanLimits(user?.tier || "FREE");

  // Cap the count if user is on Free plan
  const effectiveCount = plan.limits.reportHistoryMonths !== Infinity 
    ? Math.min(count, plan.limits.reportHistoryMonths) 
    : count;

  const dividends = await getAllDividends();
  const cashFlows = await getAllCashFlows();
  const holdings = await getAllHoldings();
  const settings = await getUserSettings();

  const months = getLastNMonths(effectiveCount);
  
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
