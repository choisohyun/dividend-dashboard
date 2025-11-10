import { describe, it, expect } from "vitest";
import {
  formatKRW,
  formatNumber,
  formatPercentage,
  formatCompact,
  parseKRW,
} from "../currency";

describe("Currency Formatting", () => {
  describe("formatKRW", () => {
    it("should format Korean won correctly", () => {
      const result = formatKRW(1000000);
      expect(result).toContain("1,000,000");
      expect(result).toContain("₩");
    });

    it("should handle zero", () => {
      const result = formatKRW(0);
      expect(result).toContain("0");
    });

    it("should handle negative numbers", () => {
      const result = formatKRW(-500000);
      expect(result).toContain("500,000");
    });
  });

  describe("formatNumber", () => {
    it("should format number with Korean locale", () => {
      const result = formatNumber(1234567);
      expect(result).toBe("1,234,567");
    });

    it("should handle decimals", () => {
      const result = formatNumber(1234.567, 2);
      expect(result).toBe("1,234.57");
    });

    it("should handle zero decimals", () => {
      const result = formatNumber(1234.567, 0);
      expect(result).toBe("1,235");
    });
  });

  describe("formatPercentage", () => {
    it("should format percentage with 1 decimal", () => {
      const result = formatPercentage(45.678, 1);
      expect(result).toBe("45.7%");
    });

    it("should format percentage with 2 decimals", () => {
      const result = formatPercentage(45.678, 2);
      expect(result).toBe("45.68%");
    });

    it("should handle 0%", () => {
      const result = formatPercentage(0);
      expect(result).toBe("0.0%");
    });
  });

  describe("formatCompact", () => {
    it("should format large numbers compactly", () => {
      const result = formatCompact(1500000);
      expect(result).toMatch(/1\.5|150/); // Could be "1.5M" or "150만" depending on locale
    });

    it("should format small numbers normally", () => {
      const result = formatCompact(1234);
      expect(result).toContain("1");
    });
  });

  describe("parseKRW", () => {
    it("should parse formatted KRW string", () => {
      const result = parseKRW("₩1,000,000");
      expect(result).toBe(1000000);
    });

    it("should handle plain numbers", () => {
      const result = parseKRW("1234567");
      expect(result).toBe(1234567);
    });

    it("should handle negative numbers", () => {
      const result = parseKRW("-₩500,000");
      expect(result).toBe(-500000);
    });
  });
});

