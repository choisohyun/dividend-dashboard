"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import { formatKRW } from "@/lib/format/currency";
import { generateWeeklyReportAction, generateMonthlyReportAction } from "@/app/actions/reports";
import Link from "next/link";

export function RecentReportsWidget() {
  const { data: thisWeek } = useQuery({
    queryKey: ["thisWeekReport"],
    queryFn: () => generateWeeklyReportAction(),
  });

  const { data: thisMonth } = useQuery({
    queryKey: ["thisMonthReport"],
    queryFn: () => generateMonthlyReportAction(),
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            최근 리포트
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/reports">
              전체 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* This Week */}
        {thisWeek && (
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-medium">이번 주</h4>
              <span className="text-xs text-gray-500">
                {thisWeek.period.start} ~ {thisWeek.period.end}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-600">배당</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatKRW(thisWeek.dividends.total)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">입금</p>
                <p className="text-lg font-bold text-green-600">
                  {formatKRW(thisWeek.deposits.total)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* This Month */}
        {thisMonth && (
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-medium">이번 달</h4>
              <span className="text-xs text-gray-500">
                {thisMonth.period.year}년 {thisMonth.period.month}월
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-600">배당</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatKRW(thisMonth.dividends.total)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">준수율</p>
                <p className="text-lg font-bold text-green-600">
                  {thisMonth.deposits.adherence.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {!thisWeek && !thisMonth && (
          <div className="text-center py-6 text-sm text-gray-500">
            데이터를 추가하면 자동으로 리포트가 생성됩니다
          </div>
        )}
      </CardContent>
    </Card>
  );
}

