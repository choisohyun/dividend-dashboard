"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Upload, Settings, BarChart } from "lucide-react";
import Link from "next/link";

export function WelcomeDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen welcome dialog
    const hasSeenWelcome = localStorage.getItem(
      "dividend-dashboard-welcome-seen"
    );

    if (!hasSeenWelcome) {
      // Show after a brief delay
      const timer = setTimeout(() => setOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("dividend-dashboard-welcome-seen", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            배당 대시보드에 오신 것을 환영합니다! 🎉
          </DialogTitle>
          <DialogDescription>3단계로 시작하는 배당 투자 추적</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
              <Settings className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">1. 목표 설정</h4>
              <p className="text-sm text-gray-600">
                설정 페이지에서 월 배당 목표와 정기 입금 목표를 설정하세요
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
              <Upload className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">2. 데이터 업로드</h4>
              <p className="text-sm text-gray-600">
                데이터 임포트 페이지에서 거래/배당/입금 내역 CSV를 업로드하세요
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
              <BarChart className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">3. 대시보드 확인</h4>
              <p className="text-sm text-gray-600">
                실시간으로 업데이트되는 차트와 KPI로 투자 현황을 추적하세요
              </p>
            </div>
          </div>

          {/* Quick Start */}
          <div className="rounded-lg bg-blue-50 p-4 mt-6">
            <p className="text-sm font-medium text-blue-900 mb-2">빠른 시작</p>
            <p className="text-sm text-blue-800 mb-3">
              샘플 데이터로 시작하고 싶으신가요?
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/import">데이터 임포트 페이지로 이동</Link>
            </Button>
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            나중에
          </Button>
          <Button onClick={handleClose} asChild className="flex-1">
            <Link href="/settings">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              시작하기
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
