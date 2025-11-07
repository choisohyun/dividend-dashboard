/**
 * Format date for Asia/Seoul timezone
 * @param date Date to format
 * @param format Format options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  format: "short" | "long" | "full" = "short"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Seoul",
    ...(format === "short" && { year: "numeric", month: "2-digit", day: "2-digit" }),
    ...(format === "long" && { year: "numeric", month: "long", day: "numeric" }),
    ...(format === "full" && {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }),
  };

  return new Intl.DateTimeFormat("ko-KR", options).format(dateObj);
}

/**
 * Format date to YYYY-MM-DD (ISO date string)
 * @param date Date to format
 * @returns ISO date string
 */
export function formatISODate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().split("T")[0];
}

/**
 * Format date to Korean year-month format (e.g., "2025년 11월")
 * @param date Date to format
 * @returns Korean month format
 */
export function formatYearMonth(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    timeZone: "Asia/Seoul",
  }).format(dateObj);
}

/**
 * Format date to month-day format (e.g., "11월 5일")
 * @param date Date to format
 * @returns Korean month-day format
 */
export function formatMonthDay(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(dateObj);
}

/**
 * Get relative time string (e.g., "2일 전", "1개월 후")
 * @param date Date to compare
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat("ko-KR", { numeric: "auto" });

  if (Math.abs(diffDays) < 1) {
    return "오늘";
  } else if (Math.abs(diffDays) < 7) {
    return rtf.format(diffDays, "day");
  } else if (Math.abs(diffDays) < 30) {
    return rtf.format(Math.floor(diffDays / 7), "week");
  } else if (Math.abs(diffDays) < 365) {
    return rtf.format(Math.floor(diffDays / 30), "month");
  } else {
    return rtf.format(Math.floor(diffDays / 365), "year");
  }
}

/**
 * Get current date in Asia/Seoul timezone
 * @returns Current date
 */
export function getCurrentSeoulDate(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
}

/**
 * Parse YYYY-MM-DD string to Date
 * @param dateString Date string in YYYY-MM-DD format
 * @returns Date object
 */
export function parseISODate(dateString: string): Date {
  return new Date(dateString + "T00:00:00+09:00"); // Ensure Seoul timezone
}



