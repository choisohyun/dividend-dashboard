// Re-export database types
export type {
  User,
  InsertUser,
  Holding,
  InsertHolding,
  Transaction,
  InsertTransaction,
  Dividend,
  InsertDividend,
  CashFlow,
  InsertCashFlow,
  SymbolMeta,
  InsertSymbolMeta,
} from "@/lib/db/schema";

// KPI Data Types
export interface KpiData {
  thisMonthDividend: number;
  ttmDividend: number;
  goalProgress: number;
  routineAdherence: number;
}

// Holding Row with calculated fields
export interface HoldingRow {
  id: string;
  symbol: string;
  name?: string;
  sector?: string;
  quantity: number;
  avgCost: number;
  yoc?: number;
  expDivPerShareYear?: number;
  payoutMonths?: number[];
  totalValue?: number;
  totalCost?: number;
  annualDividend?: number;
}

// Dividend Record for display
export interface DividendRecord {
  id: string;
  symbol: string;
  payDate: string;
  grossAmount: number;
  withholdingTax: number;
  netAmount: number;
  exDate?: string;
}

// Transaction Record
export interface TransactionRecord {
  id: string;
  symbol: string;
  tradeDate: string;
  side: "BUY" | "SELL" | "DIVIDEND_REINVEST";
  quantity: number;
  price: number;
  feeTax: number;
  total: number;
}

// Cash Flow Record
export interface CashFlowRecord {
  id: string;
  date: string;
  amount: number;
  memo?: string;
  type: "deposit" | "withdrawal";
}

// Chart Data Types
export interface MonthlyDataPoint {
  month: string; // YYYY-MM
  value: number;
}

export interface CalendarDataPoint {
  date: string; // YYYY-MM-DD
  amount: number;
}

export interface CashFlowDataPoint {
  month: string; // YYYY-MM
  deposits: number;
  withdrawals: number;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
}

// Import/CSV Types
export interface CsvImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

export interface CsvMappingConfig {
  fileName: string;
  headers: string[];
  mapping: Record<string, string>;
  preview: Array<Record<string, string>>;
}

// Report Types
export interface WeeklyReport {
  period: {
    start: string;
    end: string;
  };
  dividends: {
    total: number;
    count: number;
  };
  deposits: {
    total: number;
    count: number;
  };
  goalProgress: number;
  highlights: string[];
}

export interface MonthlyReport {
  period: {
    year: number;
    month: number;
  };
  dividends: {
    total: number;
    count: number;
    bySymbol: Array<{ symbol: string; amount: number }>;
  };
  deposits: {
    total: number;
    adherence: number;
  };
  goalProgress: number;
  ttm: number;
  projectedAnnual: number;
}

// User Settings
export interface UserSettings {
  currency: string;
  timezone: string;
  goalMonthlyDividend: number;
  monthlyInvestPlan: number;
}

// Date Range
export interface DateRange {
  from: Date;
  to: Date;
}

// Filter Options
export interface FilterOptions {
  sectors?: string[];
  symbols?: string[];
  dateRange?: DateRange;
}



