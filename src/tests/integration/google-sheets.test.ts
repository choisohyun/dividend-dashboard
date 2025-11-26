import { describe, it, expect, vi } from "vitest";
import { syncSheetData } from "@/app/actions/sync";
import * as googleSheets from "@/lib/integrations/google-sheets";

// Mock Google Sheets utility
vi.mock("@/lib/integrations/google-sheets", async () => {
  const actual = await vi.importActual<typeof googleSheets>("@/lib/integrations/google-sheets");
  return {
    ...actual,
    readGoogleSheet: vi.fn(),
    extractSpreadsheetId: vi.fn(),
  };
});

// Mock auth session
vi.mock("@/lib/auth/session", () => ({
  requireAuth: vi.fn().mockResolvedValue({ user: { id: "test-user" } }),
}));

// Mock import actions
vi.mock("@/app/actions/import", () => ({
  importTransactions: vi.fn().mockResolvedValue({ success: true, count: 1 }),
  importDividends: vi.fn().mockResolvedValue({ success: true, count: 1 }),
  importCashFlows: vi.fn().mockResolvedValue({ success: true, count: 1 }),
}));

describe("Google Sheets Sync", () => {
  const mockUrl = "https://docs.google.com/spreadsheets/d/1234567890abcdef/edit";
  const mockRange = "Sheet1!A1:F";
  
  it("should sync transactions correctly", async () => {
    // Setup mocks
    vi.mocked(googleSheets.extractSpreadsheetId).mockReturnValue("1234567890abcdef");
    vi.mocked(googleSheets.readGoogleSheet).mockResolvedValue([
      ["Date", "Ticker", "Type", "Qty", "Price", "Fee"], // Headers
      ["2024-01-15", "SCHD", "BUY", "10", "100.50", "0"], // Data
    ]);

    const mapping = {
      "Date": "trade_date",
      "Ticker": "symbol",
      "Type": "side",
      "Qty": "quantity",
      "Price": "price",
      "Fee": "fee_tax"
    };

    const result = await syncSheetData(mockUrl, mockRange, "transactions", mapping);

    expect(result.success).toBe(true);
    expect(result.total).toBe(1);
    expect(result.imported).toBe(1);
    expect(result.failed).toBe(0);
  });

  it("should handle mapping errors", async () => {
    vi.mocked(googleSheets.extractSpreadsheetId).mockReturnValue("1234567890abcdef");
    vi.mocked(googleSheets.readGoogleSheet).mockResolvedValue([
      ["Date", "Ticker"], 
      ["invalid-date", "SCHD"], 
    ]);

    const mapping = {
      "Date": "trade_date",
      "Ticker": "symbol",
    };

    // Should fail validation because required fields (side, quantity, price) are missing
    const result = await syncSheetData(mockUrl, mockRange, "transactions", mapping);

    expect(result.success).toBe(true);
    expect(result.total).toBe(1);
    expect(result.imported).toBe(0);
    expect(result.failed).toBe(1);
    expect(result.errors[0].message).toContain("필수 필드 누락");
  });

  it("should throw error for invalid URL", async () => {
    vi.mocked(googleSheets.extractSpreadsheetId).mockReturnValue(null);

    await expect(
      syncSheetData("invalid-url", mockRange, "transactions", {})
    ).rejects.toThrow("유효하지 않은 구글 시트 URL입니다.");
  });
});

