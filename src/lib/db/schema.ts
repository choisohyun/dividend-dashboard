import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  date,
  timestamp,
  smallint,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  currency: text("currency").notNull().default("KRW"),
  timezone: text("timezone").notNull().default("Asia/Seoul"),
  displayName: text("display_name"),
  username: text("username").unique(),
  tier: text("tier", { enum: ["FREE", "PRO"] }).notNull().default("FREE"),
  isPublicProfile: boolean("is_public_profile").notNull().default(false),
  goalMonthlyDividend: integer("goal_monthly_dividend")
    .notNull()
    .default(900000),
  monthlyInvestPlan: integer("monthly_invest_plan").notNull().default(2000000),
  autoBackupEnabled: boolean("auto_backup_enabled").notNull().default(false),
  lastBackupAt: timestamp("last_backup_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Holdings table (current holdings snapshot)
export const holdings = pgTable("holdings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  name: text("name"),
  sector: text("sector"),
  quantity: numeric("quantity", { precision: 20, scale: 8 }).notNull(),
  avgCost: numeric("avg_cost", { precision: 20, scale: 2 }).notNull(),
  expectedDividendPerShareYear: numeric("expected_dividend_per_share_year", {
    precision: 20,
    scale: 2,
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Transactions table (buy/sell history)
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  tradeDate: date("trade_date").notNull(),
  side: text("side", { enum: ["BUY", "SELL", "DIVIDEND_REINVEST"] }).notNull(),
  quantity: numeric("quantity", { precision: 20, scale: 8 }).notNull(),
  price: numeric("price", { precision: 20, scale: 2 }).notNull(),
  feeTax: numeric("fee_tax", { precision: 20, scale: 2 })
    .notNull()
    .default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Dividends table (dividend payment history)
export const dividends = pgTable("dividends", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  exDate: date("ex_date"),
  payDate: date("pay_date").notNull(),
  grossAmount: numeric("gross_amount", { precision: 20, scale: 2 }).notNull(),
  withholdingTax: numeric("withholding_tax", { precision: 20, scale: 2 })
    .notNull()
    .default("0"),
  netAmount: numeric("net_amount", { precision: 20, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Cash flows table (deposits/withdrawals)
export const cashFlows = pgTable("cash_flows", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  amount: integer("amount").notNull(),
  memo: text("memo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Symbol metadata table (sector info, payout schedules)
export const symbolMeta = pgTable("symbol_meta", {
  symbol: text("symbol").primaryKey(),
  exchange: text("exchange"),
  defaultSector: text("default_sector"),
  payoutMonths: smallint("payout_months").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  holdings: many(holdings),
  transactions: many(transactions),
  dividends: many(dividends),
  cashFlows: many(cashFlows),
}));

export const holdingsRelations = relations(holdings, ({ one }) => ({
  user: one(users, {
    fields: [holdings.userId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const dividendsRelations = relations(dividends, ({ one }) => ({
  user: one(users, {
    fields: [dividends.userId],
    references: [users.id],
  }),
}));

export const cashFlowsRelations = relations(cashFlows, ({ one }) => ({
  user: one(users, {
    fields: [cashFlows.userId],
    references: [users.id],
  }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Holding = typeof holdings.$inferSelect;
export type InsertHolding = typeof holdings.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

export type Dividend = typeof dividends.$inferSelect;
export type InsertDividend = typeof dividends.$inferInsert;

export type CashFlow = typeof cashFlows.$inferSelect;
export type InsertCashFlow = typeof cashFlows.$inferInsert;

export type SymbolMeta = typeof symbolMeta.$inferSelect;
export type InsertSymbolMeta = typeof symbolMeta.$inferInsert;
