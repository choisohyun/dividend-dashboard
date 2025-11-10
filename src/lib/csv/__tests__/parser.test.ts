import { describe, it, expect } from "vitest";
import {
  parseCsvContent,
  extractHeaders,
  mapCsvToObjects,
  isValidDate,
  isValidNumber,
  validateRequiredFields,
  validateTransactionRow,
  validateDividendRow,
  validateCashFlowRow,
} from "../parser";

describe("CSV Parser", () => {
  describe("parseCsvContent", () => {
    it("should parse CSV content into rows", () => {
      const content = "header1,header2,header3\nvalue1,value2,value3\nvalue4,value5,value6";
      const result = parseCsvContent(content);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(["header1", "header2", "header3"]);
      expect(result[1]).toEqual(["value1", "value2", "value3"]);
    });

    it("should trim whitespace", () => {
      const content = "  header1  ,  header2  \n  value1  ,  value2  ";
      const result = parseCsvContent(content);
      expect(result[0]).toEqual(["header1", "header2"]);
      expect(result[1]).toEqual(["value1", "value2"]);
    });
  });

  describe("extractHeaders", () => {
    it("should extract first row as headers", () => {
      const rows = [["h1", "h2", "h3"], ["v1", "v2", "v3"]];
      const result = extractHeaders(rows);
      expect(result).toEqual(["h1", "h2", "h3"]);
    });

    it("should return empty array for empty input", () => {
      const result = extractHeaders([]);
      expect(result).toEqual([]);
    });
  });

  describe("mapCsvToObjects", () => {
    it("should map CSV rows to objects", () => {
      const rows = [
        ["name", "age", "city"],
        ["Alice", "30", "Seoul"],
        ["Bob", "25", "Busan"],
      ];
      const mapping = { name: "name", age: "age", city: "city" };

      const result = mapCsvToObjects(rows, mapping);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toEqual({ name: "Alice", age: "30", city: "Seoul" });
      expect(result.successCount).toBe(2);
      expect(result.failCount).toBe(0);
    });

    it("should handle validation errors", () => {
      const rows = [
        ["name", "age"],
        ["Alice", "30"],
        ["Bob", ""],
      ];
      const mapping = { name: "name", age: "age" };
      const validator = (row: any) => {
        const errors: string[] = [];
        if (!row.age) errors.push("Age is required");
        return { valid: errors.length === 0, errors };
      };

      const result = mapCsvToObjects(rows, mapping, validator);
      expect(result.successCount).toBe(1);
      expect(result.failCount).toBe(1);
      expect(result.errors).toHaveLength(1);
    });
  });

  describe("isValidDate", () => {
    it("should validate correct date format", () => {
      expect(isValidDate("2024-03-15")).toBe(true);
      expect(isValidDate("2024-12-31")).toBe(true);
    });

    it("should reject invalid formats", () => {
      expect(isValidDate("2024/03/15")).toBe(false);
      expect(isValidDate("15-03-2024")).toBe(false);
      expect(isValidDate("2024-13-01")).toBe(false);
      expect(isValidDate("")).toBe(false);
    });
  });

  describe("isValidNumber", () => {
    it("should validate numbers", () => {
      expect(isValidNumber("123")).toBe(true);
      expect(isValidNumber("123.45")).toBe(true);
      expect(isValidNumber("-123")).toBe(true);
    });

    it("should reject non-numbers", () => {
      expect(isValidNumber("abc")).toBe(false);
      expect(isValidNumber("")).toBe(false);
    });
  });

  describe("validateRequiredFields", () => {
    it("should detect missing required fields", () => {
      const obj = { name: "Alice", age: "" };
      const errors = validateRequiredFields(obj, ["name", "age"]);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain("age");
    });

    it("should pass when all fields present", () => {
      const obj = { name: "Alice", age: "30" };
      const errors = validateRequiredFields(obj, ["name", "age"]);
      expect(errors).toHaveLength(0);
    });
  });

  describe("validateTransactionRow", () => {
    it("should validate correct transaction row", () => {
      const row = {
        trade_date: "2024-03-15",
        symbol: "SCHD",
        side: "BUY",
        quantity: "100",
        price: "30000",
        fee_tax: "0",
      };
      const result = validateTransactionRow(row);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect invalid date", () => {
      const row = {
        trade_date: "invalid-date",
        symbol: "SCHD",
        side: "BUY",
        quantity: "100",
        price: "30000",
      };
      const result = validateTransactionRow(row);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should detect invalid side", () => {
      const row = {
        trade_date: "2024-03-15",
        symbol: "SCHD",
        side: "INVALID",
        quantity: "100",
        price: "30000",
      };
      const result = validateTransactionRow(row);
      expect(result.valid).toBe(false);
    });
  });

  describe("validateDividendRow", () => {
    it("should validate correct dividend row", () => {
      const row = {
        pay_date: "2024-03-15",
        symbol: "SCHD",
        gross_amount: "100000",
        net_amount: "85000",
      };
      const result = validateDividendRow(row);
      expect(result.valid).toBe(true);
    });

    it("should detect missing required fields", () => {
      const row = {
        pay_date: "2024-03-15",
        symbol: "",
      };
      const result = validateDividendRow(row);
      expect(result.valid).toBe(false);
    });
  });

  describe("validateCashFlowRow", () => {
    it("should validate correct cash flow row", () => {
      const row = {
        date: "2024-03-15",
        amount: "2000000",
        memo: "입금",
      };
      const result = validateCashFlowRow(row);
      expect(result.valid).toBe(true);
    });

    it("should detect invalid amount", () => {
      const row = {
        date: "2024-03-15",
        amount: "not-a-number",
      };
      const result = validateCashFlowRow(row);
      expect(result.valid).toBe(false);
    });
  });
});

