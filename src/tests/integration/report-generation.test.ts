import { describe, it, expect } from "vitest";
import { generateWeeklyReport, generateMonthlyReport } from "@/lib/calculations/reports";
import type { Dividend, CashFlow, Holding } from "@/lib/db/schema";

const mockDividends: Dividend[] = [
  {
    id: "1",
    userId: "user1",
    symbol: "SCHD",
    payDate: "2024-11-15",
    exDate: null,
    grossAmount: "100000",
    withholdingTax: "15000",
    netAmount: "85000",
    createdAt: new Date().toISOString(),
  },
];

const mockCashFlows: CashFlow[] = [
  {
    id: "1",
    userId: "user1",
    date: "2024-11-02",
    amount: 2000000,
    memo: "11월 입금",
    createdAt: new Date().toISOString(),
  },
];

const mockHoldings: Holding[] = [
  {
    id: "1",
    userId: "user1",
    symbol: "SCHD",
    name: null,
    sector: "해외 ETF",
    quantity: "100",
    avgCost: "30000",
    expectedDividendPerShareYear: "2400",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("Report Generation Integration", () => {
  describe("generateWeeklyReport", () => {
    it("should generate weekly report with correct data", () => {
      const start = new Date("2024-11-10");
      const end = new Date("2024-11-16");

      const report = generateWeeklyReport(
        start,
        end,
        mockDividends,
        mockCashFlows,
        900000
      );

      expect(report.period.start).toBe("2024-11-10");
      expect(report.period.end).toBe("2024-11-16");
      expect(report.dividends.total).toBe(85000);
      expect(report.dividends.count).toBe(1);
      expect(report.deposits.total).toBe(0); // Cash flow is on 11/02, outside range
    });

    it("should include highlights", () => {
      const start = new Date("2024-11-10");
      const end = new Date("2024-11-16");

      const report = generateWeeklyReport(
        start,
        end,
        mockDividends,
        mockCashFlows,
        900000
      );

      expect(report.highlights.length).toBeGreaterThan(0);
      expect(report.highlights.some((h) => h.includes("SCHD"))).toBe(true);
    });
  });

  describe("generateMonthlyReport", () => {
    it("should generate monthly report with correct data", () => {
      const report = generateMonthlyReport(
        2024,
        11,
        mockDividends,
        mockCashFlows,
        mockHoldings,
        900000,
        2000000
      );

      expect(report.period.year).toBe(2024);
      expect(report.period.month).toBe(11);
      expect(report.dividends.total).toBe(85000);
      expect(report.dividends.count).toBe(1);
      expect(report.deposits.total).toBe(2000000);
      expect(report.deposits.adherence).toBe(100);
    });

    it("should include symbol breakdown", () => {
      const report = generateMonthlyReport(
        2024,
        11,
        mockDividends,
        mockCashFlows,
        mockHoldings,
        900000,
        2000000
      );

      expect(report.dividends.bySymbol).toHaveLength(1);
      expect(report.dividends.bySymbol[0].symbol).toBe("SCHD");
      expect(report.dividends.bySymbol[0].amount).toBe(85000);
    });

    it("should calculate projected annual dividend", () => {
      const report = generateMonthlyReport(
        2024,
        11,
        mockDividends,
        mockCashFlows,
        mockHoldings,
        900000,
        2000000
      );

      // 100 * 2400 = 240000
      expect(report.projectedAnnual).toBe(240000);
    });
  });
});

