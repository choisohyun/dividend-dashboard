import { Holding } from "@/lib/db/schema";

/**
 * Calculate Yield on Cost (YOC) for a holding
 * @param holding Holding record with quantity, avgCost, and expectedDividendPerShareYear
 * @returns YOC percentage (0-100)
 */
export function calculateYOC(holding: Holding): number {
  const quantity = parseFloat(holding.quantity);
  const avgCost = parseFloat(holding.avgCost);
  const divPerShare = holding.expectedDividendPerShareYear
    ? parseFloat(holding.expectedDividendPerShareYear)
    : 0;

  const totalCost = quantity * avgCost;
  if (totalCost === 0) return 0;

  const annualDividend = quantity * divPerShare;
  return (annualDividend / totalCost) * 100;
}

/**
 * Calculate portfolio-wide YOC
 * @param holdings Array of holdings
 * @returns Portfolio YOC percentage (0-100)
 */
export function calculatePortfolioYOC(holdings: Holding[]): number {
  let totalCost = 0;
  let totalAnnualDividend = 0;

  holdings.forEach((holding) => {
    const quantity = parseFloat(holding.quantity);
    const avgCost = parseFloat(holding.avgCost);
    const divPerShare = holding.expectedDividendPerShareYear
      ? parseFloat(holding.expectedDividendPerShareYear)
      : 0;

    totalCost += quantity * avgCost;
    totalAnnualDividend += quantity * divPerShare;
  });

  if (totalCost === 0) return 0;
  return (totalAnnualDividend / totalCost) * 100;
}



