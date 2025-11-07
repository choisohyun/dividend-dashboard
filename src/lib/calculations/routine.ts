import { CashFlow } from "@/lib/db/schema";

/**
 * Calculate routine adherence for a specific month
 * @param cashFlows Array of cash flow records
 * @param year Target year
 * @param month Target month (1-12)
 * @param monthlyInvestPlan Target monthly investment amount
 * @returns Adherence percentage (0-100+)
 */
export function calculateRoutineAdherence(
  cashFlows: CashFlow[],
  year: number,
  month: number,
  monthlyInvestPlan: number
): number {
  const monthlyDeposit = cashFlows
    .filter((cf) => {
      const date = new Date(cf.date);
      return (
        cf.amount > 0 && // Only count deposits (positive amounts)
        date.getFullYear() === year &&
        date.getMonth() + 1 === month
      );
    })
    .reduce((sum, cf) => sum + cf.amount, 0);

  if (monthlyInvestPlan === 0) return 0;
  return (monthlyDeposit / monthlyInvestPlan) * 100;
}

/**
 * Calculate investment streak (consecutive months meeting goal)
 * @param cashFlows Array of cash flow records
 * @param monthlyInvestPlan Target monthly investment amount
 * @param threshold Minimum percentage to count as "met" (default 80%)
 * @returns Number of consecutive months
 */
export function calculateInvestmentStreak(
  cashFlows: CashFlow[],
  monthlyInvestPlan: number,
  threshold: number = 80
): number {
  // Group by month
  const monthlyTotals = new Map<string, number>();

  cashFlows.forEach((cf) => {
    if (cf.amount <= 0) return; // Skip withdrawals

    const date = new Date(cf.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    monthlyTotals.set(monthKey, (monthlyTotals.get(monthKey) || 0) + cf.amount);
  });

  // Sort months descending (most recent first)
  const sortedMonths = Array.from(monthlyTotals.entries()).sort((a, b) =>
    b[0].localeCompare(a[0])
  );

  // Count consecutive months meeting threshold
  let streak = 0;
  for (const [, total] of sortedMonths) {
    const adherence = (total / monthlyInvestPlan) * 100;
    if (adherence >= threshold) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate total deposits for a given year
 * @param cashFlows Array of cash flow records
 * @param year Target year
 * @returns Total deposit amount
 */
export function calculateYearlyDeposits(
  cashFlows: CashFlow[],
  year: number
): number {
  return cashFlows
    .filter((cf) => {
      const date = new Date(cf.date);
      return cf.amount > 0 && date.getFullYear() === year;
    })
    .reduce((sum, cf) => sum + cf.amount, 0);
}

/**
 * Get monthly deposit totals for charting
 * @param cashFlows Array of cash flow records
 * @returns Array of { month: 'YYYY-MM', deposits: number, withdrawals: number }
 */
export function groupCashFlowsByMonth(
  cashFlows: CashFlow[]
): Array<{ month: string; deposits: number; withdrawals: number }> {
  const grouped = new Map<
    string,
    { deposits: number; withdrawals: number }
  >();

  cashFlows.forEach((cf) => {
    const date = new Date(cf.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!grouped.has(monthKey)) {
      grouped.set(monthKey, { deposits: 0, withdrawals: 0 });
    }

    const entry = grouped.get(monthKey)!;
    if (cf.amount > 0) {
      entry.deposits += cf.amount;
    } else {
      entry.withdrawals += Math.abs(cf.amount);
    }
  });

  return Array.from(grouped.entries())
    .map(([month, values]) => ({ month, ...values }))
    .sort((a, b) => a.month.localeCompare(b.month));
}



