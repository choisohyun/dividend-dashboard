"use client";

import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { formatKRW } from "@/lib/format/currency";
import { formatDate } from "@/lib/format/date";
import type { CashFlow } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface CashFlowTimelineProps {
  cashFlows: CashFlow[];
  limit?: number;
}

export function CashFlowTimeline({ cashFlows, limit }: CashFlowTimelineProps) {
  const displayedFlows = limit ? cashFlows.slice(0, limit) : cashFlows;

  if (displayedFlows.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-12 text-center">
        <p className="text-gray-500">입출금 내역이 없습니다.</p>
        <p className="mt-2 text-sm text-gray-400">
          데이터 임포트 페이지에서 입금 내역 CSV를 업로드하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayedFlows.map((flow) => {
        const isDeposit = flow.amount > 0;
        const absAmount = Math.abs(flow.amount);

        return (
          <div
            key={flow.id}
            className="flex items-center gap-4 rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div
              className={cn(
                "rounded-full p-2",
                isDeposit ? "bg-blue-100" : "bg-red-100"
              )}
            >
              {isDeposit ? (
                <ArrowDownCircle className="h-5 w-5 text-blue-600" />
              ) : (
                <ArrowUpCircle className="h-5 w-5 text-red-600" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {formatDate(flow.date, "long")}
                  </p>
                  {flow.memo && (
                    <p className="text-xs text-gray-500 mt-1">{flow.memo}</p>
                  )}
                </div>
                <p
                  className={cn(
                    "text-lg font-bold",
                    isDeposit ? "text-blue-600" : "text-red-600"
                  )}
                >
                  {isDeposit ? "+" : "-"}
                  {formatKRW(absAmount)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

