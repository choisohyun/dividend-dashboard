export interface CsvParseResult<T> {
  data: T[];
  errors: CsvParseError[];
  totalRows: number;
  successCount: number;
  failCount: number;
}

export interface CsvParseError {
  row: number;
  field: string;
  value: any;
  message: string;
}

export interface ColumnMapping {
  [csvHeader: string]: string; // csvHeader -> dbColumn
}

/**
 * Parse CSV file content
 */
export function parseCsvContent(content: string): string[][] {
  const lines = content.trim().split("\n");
  const rows: string[][] = [];

  for (const line of lines) {
    // Simple CSV parsing (doesn't handle quotes/commas within fields perfectly)
    // For production, consider using a library like papaparse
    const row = line.split(",").map((cell) => cell.trim());
    rows.push(row);
  }

  return rows;
}

/**
 * Extract headers from first row
 */
export function extractHeaders(rows: string[][]): string[] {
  if (rows.length === 0) return [];
  return rows[0];
}

/**
 * Convert CSV rows to objects based on mapping
 */
export function mapCsvToObjects<T>(
  rows: string[][],
  mapping: ColumnMapping,
  validator?: (row: any) => { valid: boolean; errors: string[] }
): CsvParseResult<T> {
  if (rows.length === 0) {
    return {
      data: [],
      errors: [],
      totalRows: 0,
      successCount: 0,
      failCount: 0,
    };
  }

  const headers = rows[0];
  const dataRows = rows.slice(1);
  const results: T[] = [];
  const errors: CsvParseError[] = [];

  dataRows.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because index starts at 0 and we skipped header
    const obj: any = {};

    // Map CSV columns to object properties
    headers.forEach((header, colIndex) => {
      const dbColumn = mapping[header];
      if (dbColumn) {
        obj[dbColumn] = row[colIndex] || "";
      }
    });

    // Validate if validator provided
    if (validator) {
      const validation = validator(obj);
      if (!validation.valid) {
        validation.errors.forEach((error) => {
          errors.push({
            row: rowNumber,
            field: "",
            value: obj,
            message: error,
          });
        });
        return;
      }
    }

    results.push(obj as T);
  });

  return {
    data: results,
    errors,
    totalRows: dataRows.length,
    successCount: results.length,
    failCount: errors.length,
  };
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function isValidDate(dateString: string): boolean {
  if (!dateString) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validate number
 */
export function isValidNumber(value: string): boolean {
  if (!value) return false;
  return !isNaN(parseFloat(value));
}

/**
 * Validate required fields
 */
export function validateRequiredFields(
  obj: any,
  requiredFields: string[]
): string[] {
  const errors: string[] = [];

  requiredFields.forEach((field) => {
    if (!obj[field] || obj[field] === "") {
      errors.push(`필수 필드 누락: ${field}`);
    }
  });

  return errors;
}

/**
 * Transaction CSV validator
 */
export function validateTransactionRow(row: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields
  const required = ["trade_date", "symbol", "side", "quantity", "price"];
  errors.push(...validateRequiredFields(row, required));

  // Date validation
  if (row.trade_date && !isValidDate(row.trade_date)) {
    errors.push("거래일 형식 오류 (YYYY-MM-DD 형식이어야 합니다)");
  }

  // Number validations
  if (row.quantity && !isValidNumber(row.quantity)) {
    errors.push("수량은 숫자여야 합니다");
  }

  if (row.price && !isValidNumber(row.price)) {
    errors.push("가격은 숫자여야 합니다");
  }

  // Side validation
  if (
    row.side &&
    !["BUY", "SELL", "DIVIDEND_REINVEST"].includes(row.side.toUpperCase())
  ) {
    errors.push("거래 유형은 BUY, SELL, DIVIDEND_REINVEST 중 하나여야 합니다");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Dividend CSV validator
 */
export function validateDividendRow(row: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields
  const required = ["pay_date", "symbol", "gross_amount", "net_amount"];
  errors.push(...validateRequiredFields(row, required));

  // Date validation
  if (row.pay_date && !isValidDate(row.pay_date)) {
    errors.push("지급일 형식 오류 (YYYY-MM-DD 형식이어야 합니다)");
  }

  if (row.ex_date && row.ex_date !== "" && !isValidDate(row.ex_date)) {
    errors.push("배당락일 형식 오류 (YYYY-MM-DD 형식이어야 합니다)");
  }

  // Number validations
  if (row.gross_amount && !isValidNumber(row.gross_amount)) {
    errors.push("총액은 숫자여야 합니다");
  }

  if (row.net_amount && !isValidNumber(row.net_amount)) {
    errors.push("실수령액은 숫자여야 합니다");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Cash Flow CSV validator
 */
export function validateCashFlowRow(row: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields
  const required = ["date", "amount"];
  errors.push(...validateRequiredFields(row, required));

  // Date validation
  if (row.date && !isValidDate(row.date)) {
    errors.push("날짜 형식 오류 (YYYY-MM-DD 형식이어야 합니다)");
  }

  // Number validation
  if (row.amount && !isValidNumber(row.amount)) {
    errors.push("금액은 숫자여야 합니다");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Read CSV file
 */
export async function readCsvFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };

    reader.onerror = () => {
      reject(new Error("파일 읽기 실패"));
    };

    reader.readAsText(file);
  });
}

