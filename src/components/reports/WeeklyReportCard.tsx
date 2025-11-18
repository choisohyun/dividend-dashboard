"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Download } from "lucide-react";
import { formatKRW } from "@/lib/format/currency";
import { formatDate } from "@/lib/format/date";
import type { WeeklyReport } from "@/types";
import { useState } from "react";

interface WeeklyReportCardProps {
  report: WeeklyReport;
  onImageExport?: () => void;
}

export function WeeklyReportCard({ report, onImageExport }: WeeklyReportCardProps) {
  const [copied, setCopied] = useState(false);

  const generateReportText = () => {
    return `
📊 주간 배당 리포트
기간: ${formatDate(report.period.start, "short")} ~ ${formatDate(report.period.end, "short")}

💰 배당 수령
- 총액: ${formatKRW(report.dividends.total)}
- 건수: ${report.dividends.count}건

💳 입금
- 총액: ${formatKRW(report.deposits.total)}
- 횟수: ${report.deposits.count}회

🎯 목표 진행률: ${report.goalProgress.toFixed(1)}%

✨ 주요 하이라이트
${report.highlights.map((h) => `• ${h}`).join("\n")}
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
          title: "주간 배당 리포트",
          text,
        });
      } catch (error) {
        // User cancelled or error
        console.log("Share cancelled");
      }
    } else {
      // Fallback to copy
      handleCopyText();
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow" id="weekly-report-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">주간 리포트</CardTitle>
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
        <p className="text-sm text-gray-600">
          {formatDate(report.period.start, "short")} ~{" "}
          {formatDate(report.period.end, "short")}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dividends */}
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-gray-600">배당 수령</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatKRW(report.dividends.total)}
          </p>
          <p className="text-xs text-gray-500">{report.dividends.count}건</p>
        </div>

        {/* Deposits */}
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm text-gray-600">입금</p>
          <p className="text-2xl font-bold text-green-600">
            {formatKRW(report.deposits.total)}
          </p>
          <p className="text-xs text-gray-500">{report.deposits.count}회</p>
        </div>

        {/* Goal Progress */}
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-600">목표 달성률</p>
          <p className="text-2xl font-bold">
            {report.goalProgress.toFixed(1)}%
          </p>
        </div>

        {/* Highlights */}
        {report.highlights.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">주요 하이라이트</p>
            <ul className="space-y-1">
              {report.highlights.map((highlight, index) => (
                <li key={index} className="text-sm text-gray-600">
                  • {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {copied && (
          <div className="rounded-lg bg-green-100 p-2 text-center text-sm text-green-800">
            클립보드에 복사되었습니다
          </div>
        )}
      </CardContent>
    </Card>
  );
}

