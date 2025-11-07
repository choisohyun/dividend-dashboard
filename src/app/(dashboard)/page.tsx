import { KpiCard } from "@/components/dashboard/KpiCard";
import { TrendingUp, Target, Calendar, Wallet } from "lucide-react";

export default function DashboardPage() {
  // Mock data - will be replaced with real data in Week 2
  const mockData = {
    thisMonthDividend: 0,
    ttmDividend: 0,
    goalProgress: 0,
    routineAdherence: 0,
  };

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
          value={`₩${mockData.thisMonthDividend.toLocaleString("ko-KR")}`}
          icon={TrendingUp}
          subtitle="2025년 11월"
        />
        <KpiCard
          title="TTM 배당"
          value={`₩${mockData.ttmDividend.toLocaleString("ko-KR")}`}
          icon={Calendar}
          subtitle="최근 12개월"
        />
        <KpiCard
          title="목표 달성률"
          value={`${mockData.goalProgress.toFixed(1)}%`}
          icon={Target}
          subtitle="목표: ₩900,000/월"
        />
        <KpiCard
          title="루틴 준수율"
          value={`${mockData.routineAdherence.toFixed(1)}%`}
          icon={Wallet}
          subtitle="목표: ₩2,000,000/월"
        />
      </div>

      {/* Chart Sections - Placeholder */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">월별 배당 추이</h3>
          <div className="flex h-64 items-center justify-center bg-gray-50 text-gray-500">
            월별 막대 차트 (Week 2)
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">배당 달력</h3>
          <div className="flex h-64 items-center justify-center bg-gray-50 text-gray-500">
            히트맵 달력 (Week 2)
          </div>
        </div>
      </div>

      {/* Goal Progress - Placeholder */}
      <div className="mt-6 rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">목표 진행률</h3>
        <div className="flex h-32 items-center justify-center bg-gray-50 text-gray-500">
          게이지 차트 (Week 2)
        </div>
      </div>

      {/* Recent Report Card - Placeholder */}
      <div className="mt-6 rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">최근 리포트</h3>
        <div className="text-sm text-gray-500">
          <p>리포트 생성 기능은 Week 3에 구현됩니다.</p>
          <p className="mt-2">이번 주/이번 달 요약을 자동으로 생성합니다.</p>
        </div>
      </div>
    </div>
  );
}



