"use client";

import { useQuery } from "@tanstack/react-query";
import { useDividends } from "./useDividends";
import { useHoldings } from "./useHoldings";
import { useCashFlows } from "./useCashFlows";
import {
  calculateTTMDividend,
  calculateMonthlyDividend,
  projectMonthlyDividend,
} from "@/lib/calculations/dividend";
import { calculateGoalProgress } from "@/lib/calculations/goal";
import { calculateRoutineAdherence } from "@/lib/calculations/routine";
import type { KpiData } from "@/types";

export function useKpiData(
  goalMonthlyDividend: number = 900000,
  monthlyInvestPlan: number = 2000000
) {
  const { data: dividends = [] } = useDividends();
  const { data: holdings = [] } = useHoldings();
  const { data: cashFlows = [] } = useCashFlows();

  return useQuery({
    queryKey: ["kpi", dividends.length, holdings.length, cashFlows.length],
    queryFn: (): KpiData => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      // Calculate this month's dividends
      const thisMonthDividend = calculateMonthlyDividend(
        dividends,
        currentYear,
        currentMonth,
        true // use net amount
      );

      // Calculate TTM dividends
      const ttmDividend = calculateTTMDividend(dividends, true);

      // Calculate projected monthly dividend and goal progress
      const projectedMonthly = projectMonthlyDividend(holdings);
      const goalProgress = calculateGoalProgress(
        projectedMonthly,
        goalMonthlyDividend
      );

      // Calculate routine adherence for current month
      const routineAdherence = calculateRoutineAdherence(
        cashFlows,
        currentYear,
        currentMonth,
        monthlyInvestPlan
      );

      return {
        thisMonthDividend,
        ttmDividend,
        goalProgress,
        routineAdherence,
      };
    },
    enabled: true,
  });
}

