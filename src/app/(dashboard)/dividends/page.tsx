"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDividends } from "@/hooks/queries/useDividends";
import { DividendsTable } from "@/components/dividends/DividendsTable";
import { MonthlyPivotTable } from "@/components/dividends/MonthlyPivotTable";
import { MonthlyDividendChart } from "@/components/dashboard/MonthlyDividendChart";
import { groupDividendsByMonth } from "@/lib/calculations/dividend";

export default function DividendsPage() {
  const { data: dividends = [], isLoading } = useDividends();
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>();

  // Get available years
  const availableYears = Array.from(
    new Set(dividends.map((d) => new Date(d.payDate).getFullYear()))
  ).sort((a, b) => b - a);

  const monthlyData = groupDividendsByMonth(dividends, true);

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
        <h1 className="text-2xl font-bold text-gray-900">배당내역</h1>
        <p className="text-gray-600">월별/연도별 배당 수령 내역</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <Select
          value={selectedYear?.toString() || "all"}
          onValueChange={(value) =>
            setSelectedYear(value === "all" ? undefined : parseInt(value))
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="연도" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}년
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedMonth?.toString() || "all"}
          onValueChange={(value) =>
            setSelectedMonth(value === "all" ? undefined : parseInt(value))
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="월" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <SelectItem key={month} value={month.toString()}>
                {month}월
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">내역</TabsTrigger>
          <TabsTrigger value="pivot">월별 요약</TabsTrigger>
          <TabsTrigger value="chart">차트</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <DividendsTable
            dividends={dividends}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
          />
        </TabsContent>

        <TabsContent value="pivot" className="mt-6">
          <MonthlyPivotTable dividends={dividends} year={selectedYear} />
        </TabsContent>

        <TabsContent value="chart" className="mt-6">
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">월별 배당 추이</h3>
            {monthlyData.length > 0 ? (
              <MonthlyDividendChart data={monthlyData} />
            ) : (
              <div className="flex h-64 items-center justify-center bg-gray-50 text-gray-500">
                데이터가 없습니다
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}



