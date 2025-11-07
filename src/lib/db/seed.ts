/**
 * Seed data for development testing
 * 
 * Usage:
 * 1. First, sign up through the app to create a user account
 * 2. Get your user_id from Supabase Dashboard > Authentication > Users
 * 3. Replace 'YOUR_USER_ID' in the functions below with your actual user_id
 * 4. Run seed functions through Supabase SQL Editor or create a seed script
 * 
 * Note: This is for local development only. Do not run in production.
 */

import { db } from "./index";
import { holdings, transactions, dividends, cashFlows, symbolMeta } from "./schema";

export const seedData = {
  // Sample Holdings
  holdings: [
    {
      symbol: "KOSEF_배당",
      name: "KODEX 배당성장",
      sector: "국내 ETF",
      quantity: "100",
      avgCost: "11250",
      expectedDividendPerShareYear: "450",
    },
    {
      symbol: "TIGER_미국배당",
      name: "TIGER 미국S&P500배당귀족",
      sector: "해외 ETF",
      quantity: "50",
      avgCost: "12500",
      expectedDividendPerShareYear: "600",
    },
    {
      symbol: "SCHD",
      name: "Schwab US Dividend Equity ETF",
      sector: "해외 ETF",
      quantity: "30",
      avgCost: "28000",
      expectedDividendPerShareYear: "2500",
    },
    {
      symbol: "KODEX_200",
      name: "KODEX 200",
      sector: "국내 ETF",
      quantity: "20",
      avgCost: "35000",
      expectedDividendPerShareYear: "800",
    },
  ],

  // Sample Transactions
  transactions: [
    {
      symbol: "KOSEF_배당",
      tradeDate: "2024-01-05",
      side: "BUY" as const,
      quantity: "50",
      price: "11000",
      feeTax: "0",
    },
    {
      symbol: "KOSEF_배당",
      tradeDate: "2024-06-15",
      side: "BUY" as const,
      quantity: "50",
      price: "11500",
      feeTax: "0",
    },
    {
      symbol: "TIGER_미국배당",
      tradeDate: "2024-02-10",
      side: "BUY" as const,
      quantity: "50",
      price: "12500",
      feeTax: "0",
    },
    {
      symbol: "SCHD",
      tradeDate: "2024-03-15",
      side: "BUY" as const,
      quantity: "30",
      price: "28000",
      feeTax: "0",
    },
    {
      symbol: "KODEX_200",
      tradeDate: "2024-07-20",
      side: "BUY" as const,
      quantity: "20",
      price: "35000",
      feeTax: "0",
    },
  ],

  // Sample Dividends (past 12 months)
  dividends: [
    // January 2024
    { symbol: "KOSEF_배당", payDate: "2024-01-15", grossAmount: "20000", withholdingTax: "2000", netAmount: "18000" },
    // February 2024
    { symbol: "TIGER_미국배당", payDate: "2024-02-20", grossAmount: "25000", withholdingTax: "3750", netAmount: "21250" },
    // March 2024
    { symbol: "SCHD", payDate: "2024-03-25", grossAmount: "70000", withholdingTax: "14000", netAmount: "56000" },
    { symbol: "KODEX_200", payDate: "2024-03-28", grossAmount: "15000", withholdingTax: "1500", netAmount: "13500" },
    // April 2024
    { symbol: "KOSEF_배당", payDate: "2024-04-15", grossAmount: "22000", withholdingTax: "2200", netAmount: "19800" },
    // May 2024
    { symbol: "TIGER_미국배당", payDate: "2024-05-20", grossAmount: "28000", withholdingTax: "4200", netAmount: "23800" },
    // June 2024
    { symbol: "SCHD", payDate: "2024-06-25", grossAmount: "72000", withholdingTax: "14400", netAmount: "57600" },
    { symbol: "KODEX_200", payDate: "2024-06-28", grossAmount: "16000", withholdingTax: "1600", netAmount: "14400" },
    // July 2024
    { symbol: "KOSEF_배당", payDate: "2024-07-15", grossAmount: "23000", withholdingTax: "2300", netAmount: "20700" },
    // August 2024
    { symbol: "TIGER_미국배당", payDate: "2024-08-20", grossAmount: "30000", withholdingTax: "4500", netAmount: "25500" },
    // September 2024
    { symbol: "SCHD", payDate: "2024-09-25", grossAmount: "75000", withholdingTax: "15000", netAmount: "60000" },
    { symbol: "KODEX_200", payDate: "2024-09-28", grossAmount: "16000", withholdingTax: "1600", netAmount: "14400" },
    // October 2024
    { symbol: "KOSEF_배당", payDate: "2024-10-15", grossAmount: "22500", withholdingTax: "2250", netAmount: "20250" },
    // November 2024
    { symbol: "TIGER_미국배당", payDate: "2024-11-20", grossAmount: "30000", withholdingTax: "4500", netAmount: "25500" },
  ],

  // Sample Cash Flows (past 12 months)
  cashFlows: [
    { date: "2024-01-02", amount: 2000000, memo: "1월 정기입금" },
    { date: "2024-02-02", amount: 2000000, memo: "2월 정기입금" },
    { date: "2024-03-02", amount: 2000000, memo: "3월 정기입금" },
    { date: "2024-04-02", amount: 2000000, memo: "4월 정기입금" },
    { date: "2024-05-02", amount: 2000000, memo: "5월 정기입금" },
    { date: "2024-06-02", amount: 2000000, memo: "6월 정기입금" },
    { date: "2024-07-02", amount: 2000000, memo: "7월 정기입금" },
    { date: "2024-08-02", amount: 2000000, memo: "8월 정기입금" },
    { date: "2024-09-02", amount: 2000000, memo: "9월 정기입금" },
    { date: "2024-10-02", amount: 2000000, memo: "10월 정기입금" },
    { date: "2024-11-02", amount: 2000000, memo: "11월 정기입금" },
    { date: "2024-11-05", amount: 500000, memo: "추가 입금" },
  ],

  // Sample Symbol Metadata
  symbolMeta: [
    {
      symbol: "KOSEF_배당",
      exchange: "KRX",
      defaultSector: "국내 ETF",
      payoutMonths: [1, 4, 7, 10], // Quarterly
    },
    {
      symbol: "TIGER_미국배당",
      exchange: "KRX",
      defaultSector: "해외 ETF",
      payoutMonths: [2, 5, 8, 11], // Quarterly
    },
    {
      symbol: "SCHD",
      exchange: "NYSE",
      defaultSector: "해외 ETF",
      payoutMonths: [3, 6, 9, 12], // Quarterly
    },
    {
      symbol: "KODEX_200",
      exchange: "KRX",
      defaultSector: "국내 ETF",
      payoutMonths: [3, 6, 9, 12], // Quarterly
    },
  ],
};

/**
 * Generate SQL INSERT statements for manual seeding
 * Run these in Supabase SQL Editor after replacing YOUR_USER_ID
 */
export function generateSeedSQL(userId: string): string {
  const sql: string[] = [];

  // Holdings
  sql.push("-- Insert Holdings");
  seedData.holdings.forEach((h) => {
    sql.push(
      `INSERT INTO holdings (user_id, symbol, name, sector, quantity, avg_cost, expected_dividend_per_share_year) VALUES ('${userId}', '${h.symbol}', '${h.name}', '${h.sector}', ${h.quantity}, ${h.avgCost}, ${h.expectedDividendPerShareYear});`
    );
  });

  // Transactions
  sql.push("\n-- Insert Transactions");
  seedData.transactions.forEach((t) => {
    sql.push(
      `INSERT INTO transactions (user_id, symbol, trade_date, side, quantity, price, fee_tax) VALUES ('${userId}', '${t.symbol}', '${t.tradeDate}', '${t.side}', ${t.quantity}, ${t.price}, ${t.feeTax});`
    );
  });

  // Dividends
  sql.push("\n-- Insert Dividends");
  seedData.dividends.forEach((d) => {
    sql.push(
      `INSERT INTO dividends (user_id, symbol, pay_date, gross_amount, withholding_tax, net_amount) VALUES ('${userId}', '${d.symbol}', '${d.payDate}', ${d.grossAmount}, ${d.withholdingTax}, ${d.netAmount});`
    );
  });

  // Cash Flows
  sql.push("\n-- Insert Cash Flows");
  seedData.cashFlows.forEach((cf) => {
    sql.push(
      `INSERT INTO cash_flows (user_id, date, amount, memo) VALUES ('${userId}', '${cf.date}', ${cf.amount}, '${cf.memo}');`
    );
  });

  // Symbol Meta
  sql.push("\n-- Insert Symbol Metadata");
  seedData.symbolMeta.forEach((sm) => {
    const months = `ARRAY[${sm.payoutMonths.join(",")}]`;
    sql.push(
      `INSERT INTO symbol_meta (symbol, exchange, default_sector, payout_months) VALUES ('${sm.symbol}', '${sm.exchange}', '${sm.defaultSector}', ${months});`
    );
  });

  return sql.join("\n");
}

// Example usage:
// console.log(generateSeedSQL('your-user-id-here'));



