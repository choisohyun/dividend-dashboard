"use client";

import { KpiCard } from "@/components/dashboard/KpiCard";
import { MonthlyDividendChart } from "@/components/dashboard/MonthlyDividendChart";
import { DividendCalendar } from "@/components/dashboard/DividendCalendar";
import { GoalProgressGauge } from "@/components/dashboard/GoalProgressGauge";
import { TrendingUp, Target, Calendar, Wallet } from "lucide-react";
import { useKpiData } from "@/hooks/queries/useKpiData";
import { useDividends } from "@/hooks/queries/useDividends";
import { useHoldings } from "@/hooks/queries/useHoldings";
import { groupDividendsByMonth, projectAnnualDividend } from "@/lib/calculations/dividend";
import { formatKRW, formatPercentage } from "@/lib/format/currency";
import { formatYearMonth } from "@/lib/format/date";
import type { CalendarDataPoint } from "@/types";

export default function DashboardPage() {
  const { data: kpiData, isLoading: kpiLoading } = useKpiData();
  const { data: dividends = [], isLoading: dividendsLoading } = useDividends();
  const { data: holdings = [] } = useHoldings();

  // Prepare chart data
  const monthlyData = groupDividendsByMonth(dividends, true);
  
  const calendarData: CalendarDataPoint[] = dividends.map((d) => ({
    date: d.payDate,
    amount: parseFloat(d.netAmount),
  }));

  const projectedAnnual = projectAnnualDividend(holdings);
  const now = new Date();

  if (kpiLoading || dividendsLoading) {
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
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600">배당 투자 현황을 한눈에 확인하세요</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="이번 달 배당"
          value={formatKRW(kpiData?.thisMonthDividend || 0)}
          icon={TrendingUp}
          subtitle={formatYearMonth(now)}
        />
        <KpiCard
          title="TTM 배당"
          value={formatKRW(kpiData?.ttmDividend || 0)}
          icon={Calendar}
          subtitle="최근 12개월"
        />
        <KpiCard
          title="목표 달성률"
          value={formatPercentage(kpiData?.goalProgress || 0, 1)}
          icon={Target}
          subtitle="목표: ₩900,000/월"
        />
        <KpiCard
          title="루틴 준수율"
          value={formatPercentage(kpiData?.routineAdherence || 0, 1)}
          icon={Wallet}
          subtitle="목표: ₩2,000,000/월"
        />
      </div>

      {/* Chart Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">월별 배당 추이</h3>
          {monthlyData.length > 0 ? (
            <MonthlyDividendChart data={monthlyData} />
          ) : (
            <div className="flex h-64 items-center justify-center bg-gray-50 text-gray-500">
              데이터가 없습니다. CSV를 업로드해주세요.
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">배당 달력</h3>
          {calendarData.length > 0 ? (
            <DividendCalendar data={calendarData} months={3} />
          ) : (
            <div className="flex h-64 items-center justify-center bg-gray-50 text-gray-500">
              데이터가 없습니다. CSV를 업로드해주세요.
            </div>
          )}
        </div>
      </div>

      {/* Goal Progress */}
      <div className="mt-6 rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">목표 진행률</h3>
        <GoalProgressGauge
          currentMonthly={kpiData?.thisMonthDividend || 0}
          goalMonthly={900000}
          projectedAnnual={projectedAnnual}
        />
      </div>

      {/* Quick Tips */}
      <div className="mt-6 rounded-lg border bg-blue-50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-blue-900">💡 빠른 시작</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>1. <a href="/import" className="underline font-medium">데이터 임포트</a> 페이지에서 CSV 파일을 업로드하세요</p>
          <p>2. 거래내역, 배당내역, 입금내역을 추가하면 대시보드가 자동으로 업데이트됩니다</p>
          <p>3. <a href="/settings" className="underline font-medium">설정</a>에서 목표 금액을 조정할 수 있습니다</p>
        </div>
      </div>
    </div>
  );
}



