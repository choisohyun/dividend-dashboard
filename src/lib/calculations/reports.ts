import type { Dividend, CashFlow, Holding } from "@/lib/db/schema";
import type { WeeklyReport, MonthlyReport } from "@/types";
import { calculateTTMDividend, projectAnnualDividend } from "./dividend";
import { calculateRoutineAdherence } from "./routine";
import { calculateGoalProgress } from "./goal";

/**
 * Generate weekly report for a specific date range
 */
export function generateWeeklyReport(
  startDate: Date,
  endDate: Date,
  dividends: Dividend[],
  cashFlows: CashFlow[],
  goalMonthlyDividend: number
): WeeklyReport {
  // Filter data within date range
  const weekDividends = dividends.filter((d) => {
    const payDate = new Date(d.payDate);
    return payDate >= startDate && payDate <= endDate;
  });

  const weekCashFlows = cashFlows.filter((cf) => {
    const date = new Date(cf.date);
    return date >= startDate && date <= endDate && cf.amount > 0;
  });

  // Calculate totals
  const totalDividends = weekDividends.reduce(
    (sum, d) => sum + parseFloat(d.netAmount),
    0
  );

  const totalDeposits = weekCashFlows.reduce(
    (sum, cf) => sum + cf.amount,
    0
  );

  // Calculate goal progress (use projected monthly)
  const goalProgress = (totalDividends / goalMonthlyDividend) * 100;

  // Generate highlights
  const highlights: string[] = [];

  if (weekDividends.length > 0) {
    // Find highest dividend
    const maxDividend = weekDividends.reduce((max, d) =>
      parseFloat(d.netAmount) > parseFloat(max.netAmount) ? d : max
    );
    highlights.push(
      `최고 배당: ${maxDividend.symbol} (₩${parseFloat(maxDividend.netAmount).toLocaleString("ko-KR")})`
    );

    // Count unique symbols
    const uniqueSymbols = new Set(weekDividends.map((d) => d.symbol));
    highlights.push(`${uniqueSymbols.size}개 종목에서 배당 수령`);
  }

  if (totalDeposits > 0) {
    highlights.push(
      `총 입금: ₩${totalDeposits.toLocaleString("ko-KR")} (${weekCashFlows.length}회)`
    );
  }

  return {
    period: {
      start: startDate.toISOString().split("T")[0],
      end: endDate.toISOString().split("T")[0],
    },
    dividends: {
      total: totalDividends,
      count: weekDividends.length,
    },
    deposits: {
      total: totalDeposits,
      count: weekCashFlows.length,
    },
    goalProgress,
    highlights,
  };
}

/**
 * Generate monthly report for a specific month
 */
export function generateMonthlyReport(
  year: number,
  month: number,
  dividends: Dividend[],
  cashFlows: CashFlow[],
  holdings: Holding[],
  goalMonthlyDividend: number,
  monthlyInvestPlan: number
): MonthlyReport {
  // Filter month data
  const monthDividends = dividends.filter((d) => {
    const payDate = new Date(d.payDate);
    return payDate.getFullYear() === year && payDate.getMonth() + 1 === month;
  });

  // Calculate dividend breakdown by symbol
  const bySymbol = monthDividends.reduce((acc, d) => {
    const symbol = d.symbol;
    const amount = parseFloat(d.netAmount);
    
    if (!acc[symbol]) {
      acc[symbol] = 0;
    }
    acc[symbol] += amount;
    
    return acc;
  }, {} as Record<string, number>);

  const dividendsBySymbol = Object.entries(bySymbol)
    .map(([symbol, amount]) => ({ symbol, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Calculate total
  const totalDividends = monthDividends.reduce(
    (sum, d) => sum + parseFloat(d.netAmount),
    0
  );

  // Calculate deposits
  const monthDeposits = cashFlows.filter((cf) => {
    const date = new Date(cf.date);
    return (
      cf.amount > 0 &&
      date.getFullYear() === year &&
      date.getMonth() + 1 === month
    );
  }).reduce((sum, cf) => sum + cf.amount, 0);

  // Calculate adherence
  const adherence = calculateRoutineAdherence(
    cashFlows,
    year,
    month,
    monthlyInvestPlan
  );

  // Calculate goal progress
  const goalProgress = calculateGoalProgress(
    totalDividends,
    goalMonthlyDividend
  );

  // Calculate TTM
  const ttm = calculateTTMDividend(dividends, true);

  // Calculate projected annual
  const projectedAnnual = projectAnnualDividend(holdings);

  return {
    period: { year, month },
    dividends: {
      total: totalDividends,
      count: monthDividends.length,
      bySymbol: dividendsBySymbol,
    },
    deposits: {
      total: monthDeposits,
      adherence,
    },
    goalProgress,
    ttm,
    projectedAnnual,
  };
}

/**
 * Get last N weeks date ranges
 */
export function getLastNWeeks(n: number): Array<{ start: Date; end: Date }> {
  const weeks: Array<{ start: Date; end: Date }> = [];
  const today = new Date();

  for (let i = 0; i < n; i++) {
    const end = new Date(today);
    end.setDate(end.getDate() - i * 7);
    
    const start = new Date(end);
    start.setDate(start.getDate() - 6);

    weeks.push({ start, end });
  }

  return weeks;
}

/**
 * Get last N months
 */
export function getLastNMonths(n: number): Array<{ year: number; month: number }> {
  const months: Array<{ year: number; month: number }> = [];
  const today = new Date();

  for (let i = 0; i < n; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    });
  }

  return months;
}

