"use client";

import { useMemo } from "react";
import { Flame, TrendingUp, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatKRW, formatPercentage } from "@/lib/format/currency";
import { calculateRoutineAdherence, calculateInvestmentStreak } from "@/lib/calculations/routine";
import type { CashFlow } from "@/lib/db/schema";

interface RoutineTrackerProps {
  cashFlows: CashFlow[];
  monthlyTarget: number;
}

export function RoutineTracker({ cashFlows, monthlyTarget }: RoutineTrackerProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Calculate current month deposits
    const thisMonthDeposits = cashFlows
      .filter((cf) => {
        const date = new Date(cf.date);
        return (
          cf.amount > 0 &&
          date.getFullYear() === currentYear &&
          date.getMonth() + 1 === currentMonth
        );
      })
      .reduce((sum, cf) => sum + cf.amount, 0);

    // Calculate adherence
    const adherence = calculateRoutineAdherence(
      cashFlows,
      currentYear,
      currentMonth,
      monthlyTarget
    );

    // Calculate streak
    const streak = calculateInvestmentStreak(cashFlows, monthlyTarget, 80);

    // Get last 6 months achievement
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const monthAdherence = calculateRoutineAdherence(
        cashFlows,
        year,
        month,
        monthlyTarget
      );

      return {
        month: `${month}월`,
        achieved: monthAdherence >= 80,
      };
    }).reverse();

    return {
      thisMonthDeposits,
      adherence,
      streak,
      last6Months,
    };
  }, [cashFlows, monthlyTarget]);

  return (
    <div className="space-y-6">
      {/* Current Month Progress */}
      <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">이번 달 목표</h3>
          </div>
          <Badge variant={stats.adherence >= 100 ? "default" : "secondary"}>
            {formatPercentage(stats.adherence, 0)}
          </Badge>
        </div>

        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {formatKRW(stats.thisMonthDeposits)} / {formatKRW(monthlyTarget)}
          </span>
          <span className="font-medium">
            {formatKRW(monthlyTarget - stats.thisMonthDeposits)} 남음
          </span>
        </div>

        <Progress value={Math.min(stats.adherence, 100)} className="h-3" />
      </div>

      {/* Streak */}
      <div className="rounded-lg border bg-gradient-to-br from-orange-50 to-white p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-orange-100 p-3">
            <Flame className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">연속 달성 기록</p>
            <p className="text-3xl font-bold text-orange-600">{stats.streak}개월</p>
          </div>
        </div>
      </div>

      {/* Last 6 Months */}
      <div className="rounded-lg border bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold">최근 6개월 달성 이력</h3>
        </div>

        <div className="flex gap-2">
          {stats.last6Months.map((month, index) => (
            <div key={index} className="flex-1 text-center">
              <div
                className={cn(
                  "mb-1 h-12 rounded-lg border-2",
                  month.achieved
                    ? "border-green-500 bg-green-100"
                    : "border-gray-200 bg-gray-50"
                )}
              />
              <p className="text-xs text-gray-600">{month.month}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          목표의 80% 이상 입금 시 달성으로 표시됩니다
        </p>
      </div>
    </div>
  );
}

