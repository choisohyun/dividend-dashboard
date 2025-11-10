"use client";

import { Progress } from "@/components/ui/progress";
import { formatKRW, formatPercentage } from "@/lib/format/currency";
import { Target, TrendingUp } from "lucide-react";

interface GoalProgressGaugeProps {
  currentMonthly: number;
  goalMonthly: number;
  projectedAnnual?: number;
}

export function GoalProgressGauge({
  currentMonthly,
  goalMonthly,
  projectedAnnual,
}: GoalProgressGaugeProps) {
  const progress = Math.min((currentMonthly / goalMonthly) * 100, 100);
  const remaining = Math.max(goalMonthly - currentMonthly, 0);
  const isGoalMet = currentMonthly >= goalMonthly;

  return (
    <div className="space-y-6">
      {/* Main Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">목표 달성률</span>
          <span className="text-2xl font-bold">
            {formatPercentage(progress, 1)}
          </span>
        </div>
        <Progress value={progress} className="h-4" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-gray-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>현재 월 배당</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {formatKRW(currentMonthly)}
          </p>
        </div>

        <div className="rounded-lg border bg-gray-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
            <Target className="h-4 w-4" />
            <span>목표 월 배당</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatKRW(goalMonthly)}
          </p>
        </div>
      </div>

      {/* Remaining or Exceeded */}
      {isGoalMet ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
          <p className="text-sm font-medium text-green-900">
            🎉 목표를 달성했습니다!
          </p>
          <p className="mt-1 text-xs text-green-700">
            목표보다 {formatKRW(currentMonthly - goalMonthly)} 초과
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">목표까지 남은 금액</span>
            <span className="text-lg font-bold text-orange-600">
              {formatKRW(remaining)}
            </span>
          </div>
          {projectedAnnual && (
            <p className="mt-2 text-xs text-gray-500">
              연 예상 배당: {formatKRW(projectedAnnual)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

