"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { FileText, Plus } from "lucide-react";
import { generateWeeklyReportAction, generateMonthlyReportAction } from "@/app/actions/reports";
import type { WeeklyReport, MonthlyReport } from "@/types";

interface ReportGeneratorDialogProps {
  onReportGenerated?: (report: WeeklyReport | MonthlyReport) => void;
}

export function ReportGeneratorDialog({ onReportGenerated }: ReportGeneratorDialogProps) {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState<"weekly" | "monthly">("weekly");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);

    try {
      let report: WeeklyReport | MonthlyReport;

      if (reportType === "weekly") {
        // Generate weekly report for the week containing selectedDate
        const start = new Date(selectedDate);
        start.setDate(start.getDate() - start.getDay()); // Start of week (Sunday)
        
        const end = new Date(start);
        end.setDate(end.getDate() + 6); // End of week (Saturday)

        report = await generateWeeklyReportAction(
          start.toISOString().split("T")[0],
          end.toISOString().split("T")[0]
        );
      } else {
        report = await generateMonthlyReportAction(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + 1
        );
      }

      onReportGenerated?.(report);
      setOpen(false);
    } catch (error) {
      console.error("Report generation error:", error);
      alert("리포트 생성 실패");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          리포트 생성
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>리포트 생성</DialogTitle>
          <DialogDescription>
            주간 또는 월간 리포트를 생성하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Report Type */}
          <div className="space-y-2">
            <Label>리포트 유형</Label>
            <Select
              value={reportType}
              onValueChange={(value) => setReportType(value as "weekly" | "monthly")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">주간 리포트</SelectItem>
                <SelectItem value="monthly">월간 리포트</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>
              {reportType === "weekly" ? "주 선택 (해당 주의 날짜)" : "월 선택"}
            </Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </div>

          {/* Info */}
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            <FileText className="mb-1 h-4 w-4" />
            {reportType === "weekly" ? (
              <p>선택한 날짜가 포함된 주(일요일~토요일)의 리포트가 생성됩니다.</p>
            ) : (
              <p>
                {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 리포트가
                생성됩니다.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button onClick={handleGenerate} disabled={generating}>
            {generating ? "생성 중..." : "생성"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

