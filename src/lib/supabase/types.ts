// Supabase Database Types
// These will be auto-generated from your Supabase schema in production
// For now, we'll use a basic structure that matches our Drizzle schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          currency: string;
          timezone: string;
          goal_monthly_dividend: number;
          monthly_invest_plan: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          currency?: string;
          timezone?: string;
          goal_monthly_dividend?: number;
          monthly_invest_plan?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          currency?: string;
          timezone?: string;
          goal_monthly_dividend?: number;
          monthly_invest_plan?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      holdings: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          name: string | null;
          sector: string | null;
          quantity: string;
          avg_cost: string;
          expected_dividend_per_share_year: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          symbol: string;
          name?: string | null;
          sector?: string | null;
          quantity: string;
          avg_cost: string;
          expected_dividend_per_share_year?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          symbol?: string;
          name?: string | null;
          sector?: string | null;
          quantity?: string;
          avg_cost?: string;
          expected_dividend_per_share_year?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          trade_date: string;
          side: "BUY" | "SELL" | "DIVIDEND_REINVEST";
          quantity: string;
          price: string;
          fee_tax: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          symbol: string;
          trade_date: string;
          side: "BUY" | "SELL" | "DIVIDEND_REINVEST";
          quantity: string;
          price: string;
          fee_tax?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          symbol?: string;
          trade_date?: string;
          side?: "BUY" | "SELL" | "DIVIDEND_REINVEST";
          quantity?: string;
          price?: string;
          fee_tax?: string;
          created_at?: string;
        };
      };
      dividends: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          ex_date: string | null;
          pay_date: string;
          gross_amount: string;
          withholding_tax: string;
          net_amount: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          symbol: string;
          ex_date?: string | null;
          pay_date: string;
          gross_amount: string;
          withholding_tax?: string;
          net_amount: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          symbol?: string;
          ex_date?: string | null;
          pay_date?: string;
          gross_amount?: string;
          withholding_tax?: string;
          net_amount?: string;
          created_at?: string;
        };
      };
      cash_flows: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          amount: number;
          memo: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          amount: number;
          memo?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          amount?: number;
          memo?: string | null;
          created_at?: string;
        };
      };
      symbol_meta: {
        Row: {
          symbol: string;
          exchange: string | null;
          default_sector: string | null;
          payout_months: number[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          symbol: string;
          exchange?: string | null;
          default_sector?: string | null;
          payout_months?: number[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          symbol?: string;
          exchange?: string | null;
          default_sector?: string | null;
          payout_months?: number[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}



