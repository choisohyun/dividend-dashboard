/**
 * Calculate goal progress percentage
 * @param currentMonthlyDividend Current or projected monthly dividend
 * @param goalMonthlyDividend Target monthly dividend goal
 * @returns Progress percentage (0-100+)
 */
export function calculateGoalProgress(
  currentMonthlyDividend: number,
  goalMonthlyDividend: number
): number {
  if (goalMonthlyDividend === 0) return 0;
  return (currentMonthlyDividend / goalMonthlyDividend) * 100;
}

/**
 * Calculate how much more is needed to reach goal
 * @param currentMonthlyDividend Current or projected monthly dividend
 * @param goalMonthlyDividend Target monthly dividend goal
 * @returns Amount needed to reach goal (0 if already met)
 */
export function calculateRemainingToGoal(
  currentMonthlyDividend: number,
  goalMonthlyDividend: number
): number {
  const remaining = goalMonthlyDividend - currentMonthlyDividend;
  return remaining > 0 ? remaining : 0;
}

/**
 * Estimate months to reach goal based on average monthly growth
 * @param currentMonthlyDividend Current monthly dividend
 * @param goalMonthlyDividend Target monthly dividend goal
 * @param averageMonthlyGrowth Average monthly increase in dividend (KRW)
 * @returns Estimated months to reach goal (Infinity if no growth)
 */
export function estimateMonthsToGoal(
  currentMonthlyDividend: number,
  goalMonthlyDividend: number,
  averageMonthlyGrowth: number
): number {
  if (currentMonthlyDividend >= goalMonthlyDividend) return 0;
  if (averageMonthlyGrowth <= 0) return Infinity;

  const remaining = goalMonthlyDividend - currentMonthlyDividend;
  return Math.ceil(remaining / averageMonthlyGrowth);
}



