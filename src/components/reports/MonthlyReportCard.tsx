"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, Download, ChevronDown, ChevronUp } from "lucide-react";
import { formatKRW, formatPercentage } from "@/lib/format/currency";
import type { MonthlyReport } from "@/types";
import { useState } from "react";

interface MonthlyReportCardProps {
  report: MonthlyReport;
  onImageExport?: () => void;
}

export function MonthlyReportCard({ report, onImageExport }: MonthlyReportCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const generateReportText = () => {
    return `
📊 월간 배당 리포트
기간: ${report.period.year}년 ${report.period.month}월

💰 배당 수령
- 총액: ${formatKRW(report.dividends.total)}
- 건수: ${report.dividends.count}건

종목별 배당 (Top 5):
${report.dividends.bySymbol.slice(0, 5).map((s) => `• ${s.symbol}: ${formatKRW(s.amount)}`).join("\n")}

💳 입금
- 총액: ${formatKRW(report.deposits.total)}
- 준수율: ${report.deposits.adherence.toFixed(1)}%

📈 투자 현황
- 목표 달성률: ${report.goalProgress.toFixed(1)}%
- TTM 배당: ${formatKRW(report.ttm)}
- 예상 연배당: ${formatKRW(report.projectedAnnual)}
    `.trim();
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateReportText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      alert("복사 실패");
    }
  };

  const handleShare = async () => {
    const text = generateReportText();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${report.period.year}년 ${report.period.month}월 배당 리포트`,
          text,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow" id="monthly-report-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {report.period.year}년 {report.period.month}월 리포트
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyText}
              title="텍스트 복사"
            >
              <Copy className="h-4 w-4" />
            </Button>
            {onImageExport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onImageExport}
                title="이미지 저장"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              title="공유"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Stats */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-gray-600">배당 수령</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatKRW(report.dividends.total)}
            </p>
            <p className="text-xs text-gray-500">{report.dividends.count}건</p>
          </div>

          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm text-gray-600">입금 준수율</p>
            <p className="text-2xl font-bold text-green-600">
              {formatPercentage(report.deposits.adherence, 1)}
            </p>
            <p className="text-xs text-gray-500">
              {formatKRW(report.deposits.total)}
            </p>
          </div>
        </div>

        {/* Goal Progress */}
        <div className="rounded-lg border bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">목표 달성률</span>
            <Badge variant={report.goalProgress >= 100 ? "default" : "secondary"}>
              {formatPercentage(report.goalProgress, 1)}
            </Badge>
          </div>
        </div>

        {/* Expandable Section */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="w-full justify-between"
          >
            종목별 배당 상세
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {expanded && (
            <div className="mt-3 space-y-2">
              {report.dividends.bySymbol.slice(0, 10).map((item) => (
                <div key={item.symbol} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.symbol}</span>
                  <span className="font-medium">{formatKRW(item.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Stats */}
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">TTM 배당</span>
            <span className="font-medium">{formatKRW(report.ttm)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">예상 연배당</span>
            <span className="font-medium">{formatKRW(report.projectedAnnual)}</span>
          </div>
        </div>

        {copied && (
          <div className="rounded-lg bg-green-100 p-2 text-center text-sm text-green-800">
            클립보드에 복사되었습니다
          </div>
        )}
      </CardContent>
    </Card>
  );
}

