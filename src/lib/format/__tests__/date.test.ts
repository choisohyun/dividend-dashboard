import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatISODate,
  formatYearMonth,
  formatMonthDay,
  parseISODate,
} from "../date";

describe("Date Formatting", () => {
  const testDate = new Date("2024-03-15T12:00:00+09:00");

  describe("formatDate", () => {
    it("should format date in short format", () => {
      const result = formatDate(testDate, "short");
      expect(result).toContain("2024");
      expect(result).toContain("03");
      expect(result).toContain("15");
    });

    it("should format date in long format", () => {
      const result = formatDate(testDate, "long");
      expect(result).toContain("2024");
      expect(result).toContain("3");
      expect(result).toContain("15");
    });

    it("should handle string input", () => {
      const result = formatDate("2024-03-15", "short");
      expect(result).toContain("2024");
    });
  });

  describe("formatISODate", () => {
    it("should format as YYYY-MM-DD", () => {
      const result = formatISODate(testDate);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result).toContain("2024-03-15");
    });

    it("should handle string input", () => {
      const result = formatISODate("2024-03-15");
      expect(result).toBe("2024-03-15");
    });
  });

  describe("formatYearMonth", () => {
    it("should format as Korean year-month", () => {
      const result = formatYearMonth(testDate);
      expect(result).toContain("2024");
      expect(result).toContain("3");
    });
  });

  describe("formatMonthDay", () => {
    it("should format as Korean month-day", () => {
      const result = formatMonthDay(testDate);
      expect(result).toContain("3");
      expect(result).toContain("15");
    });
  });

  describe("parseISODate", () => {
    it("should parse ISO date string", () => {
      const result = parseISODate("2024-03-15");
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2); // 0-indexed
      expect(result.getDate()).toBe(15);
    });
  });
});

