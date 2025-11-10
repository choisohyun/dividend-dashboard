import { describe, it, expect } from "vitest";
import { calculateYOC, calculatePortfolioYOC } from "../yoc";
import type { Holding } from "@/lib/db/schema";

const mockHolding: Holding = {
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
};

const mockHoldings: Holding[] = [
  mockHolding,
  {
    id: "2",
    userId: "user1",
    symbol: "KOSEF",
    name: "KODEX 배당성장",
    sector: "국내 ETF",
    quantity: "50",
    avgCost: "10000",
    expectedDividendPerShareYear: "400",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("YOC Calculations", () => {
  describe("calculateYOC", () => {
    it("should calculate yield on cost percentage", () => {
      const result = calculateYOC(mockHolding);
      // Annual dividend: 100 * 2400 = 240000
      // Total cost: 100 * 30000 = 3000000
      // YOC: (240000 / 3000000) * 100 = 8%
      expect(result).toBe(8);
    });

    it("should return 0 when no expected dividend", () => {
      const holding: Holding = {
        ...mockHolding,
        expectedDividendPerShareYear: null,
      };
      const result = calculateYOC(holding);
      expect(result).toBe(0);
    });

    it("should return 0 when cost is 0", () => {
      const holding: Holding = {
        ...mockHolding,
        avgCost: "0",
      };
      const result = calculateYOC(holding);
      expect(result).toBe(0);
    });

    it("should handle high YOC correctly", () => {
      const holding: Holding = {
        ...mockHolding,
        avgCost: "10000",
        expectedDividendPerShareYear: "1200",
      };
      const result = calculateYOC(holding);
      // (100 * 1200) / (100 * 10000) * 100 = 12%
      expect(result).toBe(12);
    });
  });

  describe("calculatePortfolioYOC", () => {
    it("should calculate portfolio-wide YOC", () => {
      const result = calculatePortfolioYOC(mockHoldings);
      // SCHD: 100 * 2400 = 240000 dividend, 100 * 30000 = 3000000 cost
      // KOSEF: 50 * 400 = 20000 dividend, 50 * 10000 = 500000 cost
      // Total: 260000 / 3500000 * 100 = 7.43%
      expect(result).toBeCloseTo(7.43, 1);
    });

    it("should return 0 for empty portfolio", () => {
      const result = calculatePortfolioYOC([]);
      expect(result).toBe(0);
    });
  });
});

