"use client";

import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { CsvParseError } from "@/lib/csv/parser";

interface UploadProgressProps {
  totalRows: number;
  successCount: number;
  failCount: number;
  errors: CsvParseError[];
  isComplete: boolean;
}

export function UploadProgress({
  totalRows,
  successCount,
  failCount,
  errors,
  isComplete,
}: UploadProgressProps) {
  const progress = totalRows > 0 ? (successCount / totalRows) * 100 : 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-600">업로드 진행</span>
          <span className="font-medium">
            {successCount} / {totalRows}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <div className="flex items-center gap-2 rounded-lg border p-3">
          <div className="rounded-full bg-gray-100 p-2">
            <AlertCircle className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600">전체</p>
            <p className="text-lg font-semibold">{totalRows}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border p-3">
          <div className="rounded-full bg-green-100 p-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600">성공</p>
            <p className="text-lg font-semibold text-green-600">
              {successCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border p-3">
          <div className="rounded-full bg-red-100 p-2">
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600">실패</p>
            <p className="text-lg font-semibold text-red-600">{failCount}</p>
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h4 className="mb-2 text-sm font-medium text-red-900">
            오류 목록 ({errors.length}개)
          </h4>
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {errors.map((error, index) => (
              <div
                key={index}
                className="text-xs text-red-700 border-l-2 border-red-300 pl-2"
              >
                <span className="font-medium">행 {error.row}:</span>{" "}
                {error.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {isComplete && errors.length === 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
          <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-green-600" />
          <p className="text-sm font-medium text-green-900">
            모든 데이터가 성공적으로 업로드되었습니다!
          </p>
        </div>
      )}
    </div>
  );
}

