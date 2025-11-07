import { Dividend, Holding } from "@/lib/db/schema";

/**
 * Calculate TTM (Trailing 12 Months) dividend total
 * @param dividends Array of dividend records
 * @param useNet Whether to use net amount (true) or gross amount (false)
 * @returns Total dividend amount for the last 12 months
 */
export function calculateTTMDividend(
  dividends: Dividend[],
  useNet: boolean = true
): number {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  return dividends
    .filter((d) => new Date(d.payDate) >= twelveMonthsAgo)
    .reduce((sum, d) => {
      const amount = useNet
        ? parseFloat(d.netAmount)
        : parseFloat(d.grossAmount);
      return sum + amount;
    }, 0);
}

/**
 * Calculate monthly dividend total for a specific month
 * @param dividends Array of dividend records
 * @param year Target year
 * @param month Target month (1-12)
 * @param useNet Whether to use net amount (true) or gross amount (false)
 * @returns Total dividend amount for the specified month
 */
export function calculateMonthlyDividend(
  dividends: Dividend[],
  year: number,
  month: number,
  useNet: boolean = true
): number {
  return dividends
    .filter((d) => {
      const payDate = new Date(d.payDate);
      return (
        payDate.getFullYear() === year && payDate.getMonth() + 1 === month
      );
    })
    .reduce((sum, d) => {
      const amount = useNet
        ? parseFloat(d.netAmount)
        : parseFloat(d.grossAmount);
      return sum + amount;
    }, 0);
}

/**
 * Project annual dividend based on current holdings
 * @param holdings Array of current holdings
 * @returns Projected annual dividend amount
 */
export function projectAnnualDividend(holdings: Holding[]): number {
  return holdings.reduce((sum, holding) => {
    const quantity = parseFloat(holding.quantity);
    const divPerShare = holding.expectedDividendPerShareYear
      ? parseFloat(holding.expectedDividendPerShareYear)
      : 0;
    return sum + quantity * divPerShare;
  }, 0);
}

/**
 * Project monthly dividend based on current holdings
 * If payout_months is specified in symbol_meta, distribute accordingly
 * Otherwise, divide annual dividend by 12
 * @param holdings Array of current holdings
 * @param targetMonth Target month (1-12), optional
 * @returns Projected monthly dividend amount
 */
export function projectMonthlyDividend(
  holdings: Holding[],
  targetMonth?: number
): number {
  const annual = projectAnnualDividend(holdings);
  
  // For MVP, simply divide by 12
  // In Week 2+, we'll implement payout_months logic
  return Math.round(annual / 12);
}

/**
 * Group dividends by month for charting
 * @param dividends Array of dividend records
 * @param useNet Whether to use net amount (true) or gross amount (false)
 * @returns Array of { month: 'YYYY-MM', value: number }
 */
export function groupDividendsByMonth(
  dividends: Dividend[],
  useNet: boolean = true
): Array<{ month: string; value: number }> {
  const grouped = new Map<string, number>();

  dividends.forEach((d) => {
    const payDate = new Date(d.payDate);
    const monthKey = `${payDate.getFullYear()}-${String(
      payDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const amount = useNet
      ? parseFloat(d.netAmount)
      : parseFloat(d.grossAmount);

    grouped.set(monthKey, (grouped.get(monthKey) || 0) + amount);
  });

  return Array.from(grouped.entries())
    .map(([month, value]) => ({ month, value }))
    .sort((a, b) => a.month.localeCompare(b.month));
}



