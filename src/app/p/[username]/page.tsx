import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPublicProfile, getPublicDashboardData } from "@/app/actions/public";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { MonthlyDividendChart } from "@/components/dashboard/MonthlyDividendChart";
import { DividendCalendar } from "@/components/dashboard/DividendCalendar";
import { GoalProgressGauge } from "@/components/dashboard/GoalProgressGauge";
import { TrendingUp, Target, Calendar } from "lucide-react";
import {
  calculateMonthlyDividend,
  calculateTTMDividend,
  groupDividendsByMonth,
  projectAnnualDividend,
  projectMonthlyDividend,
} from "@/lib/calculations/dividend";
import { calculateGoalProgress } from "@/lib/calculations/goal";
import { formatKRW, formatPercentage } from "@/lib/format/currency";
import { formatYearMonth } from "@/lib/format/date";
import type { CalendarDataPoint } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ username: string }>;
}

async function getPageData(username: string) {
  const profile = await getPublicProfile(username);

  if (!profile) return null;

  const data = await getPublicDashboardData(profile.id);
  const dividends = data?.dividends || [];
  const holdings = data?.holdings || [];

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Calculate KPIs
  const thisMonthDividend = calculateMonthlyDividend(
    dividends,
    currentYear,
    currentMonth,
    true
  );

  const projectedMonthly = projectMonthlyDividend(holdings);
  const goalProgress = calculateGoalProgress(
    projectedMonthly,
    profile.goalMonthlyDividend
  );

  return {
    profile,
    dividends,
    holdings,
    metrics: {
      thisMonthDividend,
      goalProgress,
      projectedMonthly,
    }
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const data = await getPageData(username);

  if (!data) {
    return {
      title: "User Not Found",
    };
  }

  const { profile, metrics } = data;
  const title = `${profile.displayName || profile.username || "사용자"}님의 배당 포트폴리오`;
  const description = `${profile.displayName || "사용자"}님의 월 배당금 현황과 포트폴리오를 확인해보세요.`;

  // Generate OG Image URL
  const ogUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL || "https://dividend-dashboard.com"}/api/og`);
  ogUrl.searchParams.set("username", username);
  if (profile.displayName) ogUrl.searchParams.set("displayName", profile.displayName);
  ogUrl.searchParams.set("monthly", formatKRW(metrics.thisMonthDividend));
  ogUrl.searchParams.set("progress", formatPercentage(metrics.goalProgress, 0).replace("%", ""));

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function PublicDashboardPage({ params }: Props) {
  const { username } = await params;
  const data = await getPageData(username);

  if (!data) {
    notFound();
  }

  const { profile, dividends, holdings, metrics } = data;
  const now = new Date();
  const ttmDividend = calculateTTMDividend(dividends, true);
  const projectedAnnual = projectAnnualDividend(holdings);

  // Prepare chart data
  const monthlyData = groupDividendsByMonth(dividends, true);
  const calendarData: CalendarDataPoint[] = dividends.map((d) => ({
    date: d.payDate,
    amount: parseFloat(d.netAmount),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Public Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl">Dividend Dashboard</span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
              Public View
            </span>
          </div>
          <Link href="/login">
            <Button variant="outline" size="sm">
              나도 만들기
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {profile.displayName || profile.username || "사용자"}님의 포트폴리오
          </h1>
          <p className="text-gray-600">
            목표 월 배당금: {formatKRW(profile.goalMonthlyDividend)}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard
            title="이번 달 배당"
            value={formatKRW(metrics.thisMonthDividend)}
            icon={TrendingUp}
            subtitle={formatYearMonth(now)}
          />
          <KpiCard
            title="TTM 배당 (최근 12개월)"
            value={formatKRW(ttmDividend)}
            icon={Calendar}
            subtitle="연간 배당금 합계"
          />
          <KpiCard
            title="목표 달성률"
            value={formatPercentage(metrics.goalProgress, 1)}
            icon={Target}
            subtitle={`목표: ${formatKRW(profile.goalMonthlyDividend)}/월`}
          />
        </div>

        {/* Chart Sections */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">월별 배당 추이</h3>
            {monthlyData.length > 0 ? (
              <MonthlyDividendChart data={monthlyData} />
            ) : (
              <div className="flex h-64 items-center justify-center bg-gray-50 text-gray-500">
                데이터가 없습니다.
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">배당 달력</h3>
            {calendarData.length > 0 ? (
              <DividendCalendar data={calendarData} months={3} />
            ) : (
              <div className="flex h-64 items-center justify-center bg-gray-50 text-gray-500">
                데이터가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* Goal Progress */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">목표 진행률</h3>
          <GoalProgressGauge
            currentMonthly={metrics.thisMonthDividend}
            goalMonthly={profile.goalMonthlyDividend}
            projectedAnnual={projectedAnnual}
          />
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">나만의 배당 포트폴리오를 관리하세요</h2>
          <p className="mb-6 text-blue-100">
            엑셀보다 쉽고, 더 강력한 인사이트를 제공합니다. 무료로 시작해보세요.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="font-semibold">
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
