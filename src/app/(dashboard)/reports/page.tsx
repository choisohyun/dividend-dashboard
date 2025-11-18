"use client";

import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyReportCard } from "@/components/reports/WeeklyReportCard";
import { MonthlyReportCard } from "@/components/reports/MonthlyReportCard";
import { ReportGeneratorDialog } from "@/components/reports/ReportGeneratorDialog";
import { getRecentWeeklyReports, getRecentMonthlyReports } from "@/app/actions/reports";
import { FileText } from "lucide-react";

export default function ReportsPage() {
  const { data: weeklyReports = [], isLoading: weeklyLoading } = useQuery({
    queryKey: ["weeklyReports"],
    queryFn: () => getRecentWeeklyReports(4),
  });

  const { data: monthlyReports = [], isLoading: monthlyLoading } = useQuery({
    queryKey: ["monthlyReports"],
    queryFn: () => getRecentMonthlyReports(6),
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">리포트</h1>
          <p className="text-gray-600">주간/월간 투자 성과 리포트</p>
        </div>
        <ReportGeneratorDialog />
      </div>

      <Tabs defaultValue="monthly">
        <TabsList>
          <TabsTrigger value="weekly">주간</TabsTrigger>
          <TabsTrigger value="monthly">월간</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-6">
          {weeklyLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">리포트 생성 중...</p>
              </div>
            </div>
          ) : weeklyReports.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {weeklyReports.map((report, index) => (
                <WeeklyReportCard key={index} report={report} />
              ))}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border bg-gray-50">
              <FileText className="mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600">리포트가 없습니다</p>
              <p className="text-sm text-gray-500">데이터를 추가하면 자동으로 생성됩니다</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          {monthlyLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">리포트 생성 중...</p>
              </div>
            </div>
          ) : monthlyReports.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {monthlyReports.map((report, index) => (
                <MonthlyReportCard key={index} report={report} />
              ))}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border bg-gray-50">
              <FileText className="mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600">리포트가 없습니다</p>
              <p className="text-sm text-gray-500">데이터를 추가하면 자동으로 생성됩니다</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

