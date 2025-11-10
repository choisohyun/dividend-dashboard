import { describe, it, expect } from "vitest";
import {
  calculateRoutineAdherence,
  calculateInvestmentStreak,
  calculateYearlyDeposits,
  groupCashFlowsByMonth,
} from "../routine";
import type { CashFlow } from "@/lib/db/schema";

const mockCashFlows: CashFlow[] = [
  {
    id: "1",
    userId: "user1",
    date: "2024-01-02",
    amount: 2000000,
    memo: "1월 입금",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "user1",
    date: "2024-02-02",
    amount: 2000000,
    memo: "2월 입금",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    userId: "user1",
    date: "2024-03-02",
    amount: 1500000,
    memo: "3월 입금 (부족)",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    userId: "user1",
    date: "2024-04-02",
    amount: 2000000,
    memo: "4월 입금",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    userId: "user1",
    date: "2024-04-15",
    amount: -500000,
    memo: "출금",
    createdAt: new Date().toISOString(),
  },
];

describe("Routine Calculations", () => {
  describe("calculateRoutineAdherence", () => {
    it("should calculate adherence for a month", () => {
      const result = calculateRoutineAdherence(
        mockCashFlows,
        2024,
        1,
        2000000
      );
      expect(result).toBe(100);
    });

    it("should calculate partial adherence", () => {
      const result = calculateRoutineAdherence(
        mockCashFlows,
        2024,
        3,
        2000000
      );
      expect(result).toBe(75); // 1500000 / 2000000 * 100
    });

    it("should ignore withdrawals", () => {
      const result = calculateRoutineAdherence(
        mockCashFlows,
        2024,
        4,
        2000000
      );
      expect(result).toBe(100); // Only counts deposits
    });

    it("should return 0 for month with no deposits", () => {
      const result = calculateRoutineAdherence(
        mockCashFlows,
        2024,
        12,
        2000000
      );
      expect(result).toBe(0);
    });
  });

  describe("calculateInvestmentStreak", () => {
    it("should calculate consecutive months meeting threshold", () => {
      const result = calculateInvestmentStreak(mockCashFlows, 2000000, 80);
      // April (100%), March (75% - below 80%), stops
      expect(result).toBe(1);
    });

    it("should count all months if all meet threshold", () => {
      const flows = mockCashFlows.filter((cf) => cf.amount >= 0);
      const result = calculateInvestmentStreak(flows, 2000000, 70);
      // All months have >= 70% (except March has 75%)
      expect(result).toBeGreaterThan(0);
    });
  });

  describe("calculateYearlyDeposits", () => {
    it("should calculate total deposits for a year", () => {
      const result = calculateYearlyDeposits(mockCashFlows, 2024);
      expect(result).toBe(7500000); // 2M + 2M + 1.5M + 2M
    });

    it("should ignore withdrawals", () => {
      const total = mockCashFlows
        .filter((cf) => cf.amount > 0)
        .reduce((sum, cf) => sum + cf.amount, 0);
      const result = calculateYearlyDeposits(mockCashFlows, 2024);
      expect(result).toBe(total);
    });
  });

  describe("groupCashFlowsByMonth", () => {
    it("should group cash flows by month", () => {
      const result = groupCashFlowsByMonth(mockCashFlows);
      
      const jan = result.find((r) => r.month === "2024-01");
      expect(jan?.deposits).toBe(2000000);
      expect(jan?.withdrawals).toBe(0);

      const apr = result.find((r) => r.month === "2024-04");
      expect(apr?.deposits).toBe(2000000);
      expect(apr?.withdrawals).toBe(500000);
    });

    it("should return empty array for no cash flows", () => {
      const result = groupCashFlowsByMonth([]);
      expect(result).toEqual([]);
    });
  });
});

