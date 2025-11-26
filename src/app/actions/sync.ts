"use server";

import { requireAuth } from "@/lib/auth/session";
import {
  readGoogleSheet,
  testSheetConnection,
  extractSpreadsheetId,
  type GoogleSheetsConfig,
} from "@/lib/integrations/google-sheets";
import { importTransactions, importDividends, importCashFlows } from "./import";
import { mapCsvToObjects, validateTransactionRow, validateDividendRow, validateCashFlowRow, type CsvParseResult } from "@/lib/csv/parser";

export async function testGoogleSheetConnection(url: string) {
  await requireAuth();

  const spreadsheetId = extractSpreadsheetId(url);
  if (!spreadsheetId) {
    return { success: false, error: "유효하지 않은 구글 시트 URL입니다." };
  }

  const result = await testSheetConnection(spreadsheetId);
  return result;
}

export async function fetchSheetHeaders(url: string, range: string) {
  await requireAuth();

  const spreadsheetId = extractSpreadsheetId(url);
  if (!spreadsheetId) {
    throw new Error("유효하지 않은 구글 시트 URL입니다.");
  }

  // Read only the first row to get headers
  // Assuming headers are in the first row of the range
  // If range is "Sheet1!A1:E", we fetch "Sheet1!A1:E1"
  const headerRange = range.replace(/:[A-Z]+[0-9]*$/, "1"); // Simple heuristic, might need robustness
  
  // Better approach: just fetch first 5 rows to get headers + preview
  try {
    const rows = await readGoogleSheet({
      spreadsheetId,
      range, // Fetch the user provided range
    });

    if (rows.length === 0) {
      return { headers: [], preview: [] };
    }

    return {
      headers: rows[0],
      preview: rows.slice(1, 6), // Return next 5 rows as preview
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function syncSheetData(
  url: string,
  range: string,
  type: "transactions" | "dividends" | "cashflows",
  mapping: Record<string, string>
) {
  await requireAuth();

  const spreadsheetId = extractSpreadsheetId(url);
  if (!spreadsheetId) {
    throw new Error("유효하지 않은 구글 시트 URL입니다.");
  }

  try {
    const rows = await readGoogleSheet({
      spreadsheetId,
      range,
    });

    if (rows.length < 2) {
      throw new Error("데이터가 없습니다.");
    }

    let result: CsvParseResult<any>;

    // Validate and map data
    if (type === "transactions") {
      result = mapCsvToObjects(rows, mapping, validateTransactionRow);
      if (result.data.length > 0) {
        await importTransactions(result.data);
      }
    } else if (type === "dividends") {
      result = mapCsvToObjects(rows, mapping, validateDividendRow);
      if (result.data.length > 0) {
        await importDividends(result.data);
      }
    } else {
      result = mapCsvToObjects(rows, mapping, validateCashFlowRow);
      if (result.data.length > 0) {
        await importCashFlows(result.data);
      }
    }

    return {
      success: true,
      total: result.totalRows,
      imported: result.successCount,
      failed: result.failCount,
      errors: result.errors,
    };
  } catch (error: any) {
    console.error("Sync error:", error);
    throw new Error(error.message);
  }
}

