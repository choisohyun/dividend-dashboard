import { describe, it, expect } from "vitest";
import {
  calculateTTMDividend,
  calculateMonthlyDividend,
  projectAnnualDividend,
  projectMonthlyDividend,
  groupDividendsByMonth,
} from "../dividend";
import type { Dividend, Holding } from "@/lib/db/schema";

const mockDividends: Dividend[] = [
  {
    id: "1",
    userId: "user1",
    symbol: "SCHD",
    payDate: "2024-01-15",
    exDate: "2024-01-10",
    grossAmount: "100000",
    withholdingTax: "15000",
    netAmount: "85000",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "user1",
    symbol: "SCHD",
    payDate: "2024-04-15",
    exDate: "2024-04-10",
    grossAmount: "100000",
    withholdingTax: "15000",
    netAmount: "85000",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    userId: "user1",
    symbol: "KOSEF",
    payDate: "2023-01-15",
    exDate: null,
    grossAmount: "50000",
    withholdingTax: "5000",
    netAmount: "45000",
    createdAt: new Date().toISOString(),
  },
];

const mockHoldings: Holding[] = [
  {
    id: "1",
    userId: "user1",
    symbol: "SCHD",
    name: "Schwab US Dividend",
    sector: "해외 ETF",
    quantity: "100",
    avgCost: "30000",
    expectedDividendPerShareYear: "2400",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    userId: "user1",
    symbol: "KOSEF",
    name: "KODEX 배당성장",
    sector: "국내 ETF",
    quantity: "50",
    avgCost: "11000",
    expectedDividendPerShareYear: "450",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("Dividend Calculations", () => {
  describe("calculateTTMDividend", () => {
    it("should calculate trailing 12 months dividend (net)", () => {
      // Mock dividends have dates in 2024 and 2023, but TTM needs recent dates
      // Creating fresh dividends with recent dates for this test
      const now = new Date();
      const recentDividends: Dividend[] = [
        { ...mockDividends[0], payDate: new Date(now.getFullYear(), now.getMonth() - 2, 15).toISOString().split('T')[0] },
        { ...mockDividends[1], payDate: new Date(now.getFullYear(), now.getMonth() - 5, 15).toISOString().split('T')[0] },
      ];
      const result = calculateTTMDividend(recentDividends, true);
      expect(result).toBe(170000); // 85000 + 85000
    });

    it("should calculate trailing 12 months dividend (gross)", () => {
      const now = new Date();
      const recentDividends: Dividend[] = [
        { ...mockDividends[0], payDate: new Date(now.getFullYear(), now.getMonth() - 2, 15).toISOString().split('T')[0] },
        { ...mockDividends[1], payDate: new Date(now.getFullYear(), now.getMonth() - 5, 15).toISOString().split('T')[0] },
      ];
      const result = calculateTTMDividend(recentDividends, false);
      expect(result).toBe(200000); // 100000 + 100000
    });

    it("should return 0 for empty array", () => {
      const result = calculateTTMDividend([], true);
      expect(result).toBe(0);
    });
  });

  describe("calculateMonthlyDividend", () => {
    it("should calculate monthly dividend for specific month", () => {
      const result = calculateMonthlyDividend(mockDividends, 2024, 1, true);
      expect(result).toBe(85000);
    });

    it("should return 0 for month with no dividends", () => {
      const result = calculateMonthlyDividend(mockDividends, 2024, 2, true);
      expect(result).toBe(0);
    });
  });

  describe("projectAnnualDividend", () => {
    it("should project annual dividend from holdings", () => {
      const result = projectAnnualDividend(mockHoldings);
      // (100 * 2400) + (50 * 450) = 240000 + 22500 = 262500
      expect(result).toBe(262500);
    });

    it("should return 0 for empty holdings", () => {
      const result = projectAnnualDividend([]);
      expect(result).toBe(0);
    });
  });

  describe("projectMonthlyDividend", () => {
    it("should project monthly dividend (annual / 12)", () => {
      const result = projectMonthlyDividend(mockHoldings);
      expect(result).toBe(Math.round(262500 / 12)); // 21875
    });
  });

  describe("groupDividendsByMonth", () => {
    it("should group dividends by month", () => {
      const result = groupDividendsByMonth(mockDividends, true);
      expect(result).toHaveLength(3); // 2023-01, 2024-01, 2024-04
      expect(result[0]).toEqual({ month: "2023-01", value: 45000 });
      expect(result[1]).toEqual({ month: "2024-01", value: 85000 });
      expect(result[2]).toEqual({ month: "2024-04", value: 85000 });
    });

    it("should handle gross amounts", () => {
      const result = groupDividendsByMonth(mockDividends, false);
      expect(result[0]).toEqual({ month: "2023-01", value: 50000 });
    });
  });
});

