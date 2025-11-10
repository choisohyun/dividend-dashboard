import { describe, it, expect } from "vitest";
import {
  calculateGoalProgress,
  calculateRemainingToGoal,
  estimateMonthsToGoal,
} from "../goal";

describe("Goal Calculations", () => {
  describe("calculateGoalProgress", () => {
    it("should calculate progress percentage", () => {
      const result = calculateGoalProgress(450000, 900000);
      expect(result).toBe(50);
    });

    it("should handle over 100% progress", () => {
      const result = calculateGoalProgress(1000000, 900000);
      expect(result).toBeGreaterThan(100);
      expect(result).toBeCloseTo(111.11, 1);
    });

    it("should return 0 when goal is 0", () => {
      const result = calculateGoalProgress(100000, 0);
      expect(result).toBe(0);
    });

    it("should return 0 when current is 0", () => {
      const result = calculateGoalProgress(0, 900000);
      expect(result).toBe(0);
    });
  });

  describe("calculateRemainingToGoal", () => {
    it("should calculate remaining amount", () => {
      const result = calculateRemainingToGoal(450000, 900000);
      expect(result).toBe(450000);
    });

    it("should return 0 when goal is met", () => {
      const result = calculateRemainingToGoal(1000000, 900000);
      expect(result).toBe(0);
    });

    it("should return 0 when goal is exactly met", () => {
      const result = calculateRemainingToGoal(900000, 900000);
      expect(result).toBe(0);
    });
  });

  describe("estimateMonthsToGoal", () => {
    it("should estimate months to reach goal", () => {
      const result = estimateMonthsToGoal(600000, 900000, 50000);
      expect(result).toBe(6); // 300000 remaining / 50000 = 6 months
    });

    it("should return 0 when goal is already met", () => {
      const result = estimateMonthsToGoal(900000, 900000, 50000);
      expect(result).toBe(0);
    });

    it("should return Infinity when no growth", () => {
      const result = estimateMonthsToGoal(600000, 900000, 0);
      expect(result).toBe(Infinity);
    });

    it("should round up months", () => {
      const result = estimateMonthsToGoal(600000, 900000, 100000);
      expect(result).toBe(3); // 300000 / 100000 = 3
    });
  });
});

