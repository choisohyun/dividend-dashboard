"use client";

import { useCashFlows } from "@/hooks/queries/useCashFlows";
import { CashFlowTimeline } from "@/components/cash/CashFlowTimeline";
import { MonthlyCashChart } from "@/components/cash/MonthlyCashChart";
import { RoutineTracker } from "@/components/cash/RoutineTracker";
import { groupCashFlowsByMonth } from "@/lib/calculations/routine";

const MONTHLY_TARGET = 2000000;

export default function CashPage() {
  const { data: cashFlows = [], isLoading } = useCashFlows();

  const monthlyData = groupCashFlowsByMonth(cashFlows);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">데이터 로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">입출금</h1>
        <p className="text-gray-600">투자 자금 입출금 내역 및 루틴 체크</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Routine Tracker */}
        <div className="lg:col-span-1">
          <RoutineTracker cashFlows={cashFlows} monthlyTarget={MONTHLY_TARGET} />
        </div>

        {/* Monthly Chart */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">월별 입출금 추이</h3>
            {monthlyData.length > 0 ? (
              <MonthlyCashChart data={monthlyData} monthlyTarget={MONTHLY_TARGET} />
            ) : (
              <div className="flex h-64 items-center justify-center bg-gray-50 text-gray-500">
                데이터가 없습니다
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">입출금 내역</h3>
          <p className="text-sm text-gray-600">최근 입출금 내역을 확인하세요</p>
        </div>
        <CashFlowTimeline cashFlows={cashFlows} limit={20} />
      </div>
    </div>
  );
}



