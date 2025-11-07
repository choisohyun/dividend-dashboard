/**
 * Format number as KRW currency
 * @param amount Amount to format
 * @param options Optional Intl.NumberFormatOptions
 * @returns Formatted currency string
 */
export function formatKRW(
  amount: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  }).format(amount);
}

/**
 * Format number with Korean locale (no currency symbol)
 * @param amount Amount to format
 * @param decimals Number of decimal places (default 0)
 * @returns Formatted number string
 */
export function formatNumber(amount: number, decimals: number = 0): string {
  return new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Format percentage
 * @param value Percentage value (0-100)
 * @param decimals Number of decimal places (default 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format compact number (e.g., 1.5M, 250K)
 * @param amount Amount to format
 * @returns Compact formatted string
 */
export function formatCompact(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    notation: "compact",
    compactDisplay: "short",
  }).format(amount);
}

/**
 * Parse formatted KRW string back to number
 * @param formattedAmount Formatted currency string
 * @returns Numeric value
 */
export function parseKRW(formattedAmount: string): number {
  return parseFloat(formattedAmount.replace(/[^0-9.-]/g, ""));
}



