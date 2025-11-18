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
import { HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HelpDialogProps {
  page?: "dashboard" | "holdings" | "dividends" | "cash" | "import" | "reports" | "settings";
}

export function HelpDialog({ page = "dashboard" }: HelpDialogProps) {
  const [open, setOpen] = useState(false);

  const helpContent = {
    dashboard: {
      title: "대시보드 사용법",
      sections: [
        {
          title: "KPI 카드",
          content: "이번 달 배당, TTM 배당, 목표 달성률, 루틴 준수율을 실시간으로 확인할 수 있습니다.",
        },
        {
          title: "월별 배당 차트",
          content: "최근 12개월 배당 추이를 막대 그래프로 표시합니다. 마우스를 올리면 상세 금액을 확인할 수 있습니다.",
        },
        {
          title: "배당 달력",
          content: "일별 배당 수령 현황을 히트맵으로 표시합니다. 색이 진할수록 금액이 많습니다.",
        },
      ],
    },
    holdings: {
      title: "보유현황 사용법",
      sections: [
        {
          title: "종목 필터링",
          content: "검색창에서 종목명이나 심볼로 검색하고, 섹터 배지를 클릭하여 필터링할 수 있습니다.",
        },
        {
          title: "정렬",
          content: "테이블 헤더를 클릭하면 해당 컬럼 기준으로 오름차순/내림차순 정렬됩니다.",
        },
        {
          title: "YOC (Yield on Cost)",
          content: "매입 원가 대비 배당 수익률입니다. 높을수록 좋은 투자입니다.",
        },
      ],
    },
    import: {
      title: "데이터 임포트 가이드",
      sections: [
        {
          title: "CSV 형식",
          content: "각 탭에서 '템플릿 다운로드' 버튼을 클릭하여 올바른 CSV 형식을 확인하세요.",
        },
        {
          title: "날짜 형식",
          content: "모든 날짜는 YYYY-MM-DD 형식으로 입력해야 합니다. 예: 2025-01-15",
        },
        {
          title: "열 매핑",
          content: "CSV 헤더가 다를 경우, 미리보기 화면에서 올바른 컬럼으로 매핑할 수 있습니다.",
        },
      ],
    },
    reports: {
      title: "리포트 사용법",
      sections: [
        {
          title: "리포트 생성",
          content: "'리포트 생성' 버튼을 클릭하여 원하는 기간의 주간/월간 리포트를 만들 수 있습니다.",
        },
        {
          title: "공유",
          content: "각 리포트 카드의 복사 버튼을 클릭하여 텍스트를 클립보드에 복사하거나 공유할 수 있습니다.",
        },
        {
          title: "이미지 저장",
          content: "다운로드 버튼을 클릭하면 리포트를 이미지로 저장할 수 있습니다.",
        },
      ],
    },
    settings: {
      title: "설정 가이드",
      sections: [
        {
          title: "투자 목표",
          content: "목표 월 배당과 월 정기입금 목표를 설정하면 대시보드의 달성률이 자동으로 계산됩니다.",
        },
        {
          title: "데이터 백업",
          content: "정기적으로 데이터를 백업하여 안전하게 보관하세요. JSON 파일로 다운로드됩니다.",
        },
        {
          title: "데이터 복원",
          content: "백업 파일을 업로드하여 데이터를 복원할 수 있습니다. 병합 또는 교체 모드를 선택하세요.",
        },
      ],
    },
  };

  const content = helpContent[page] || helpContent.dashboard;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="도움말">
          <HelpCircle className="h-5 w-5 text-gray-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>
            이 페이지의 기능과 사용법을 안내합니다
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {content.sections.map((section, index) => (
            <div key={index}>
              <h4 className="mb-2 font-semibold">{section.title}</h4>
              <p className="text-sm text-gray-600">{section.content}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="tips">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tips">팁</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="tips" className="space-y-2 text-sm">
            <p>• 데이터는 자동으로 저장되며 로그인하면 언제든지 확인할 수 있습니다</p>
            <p>• CSV 업로드 시 중복 데이터는 자동으로 추가됩니다</p>
            <p>• 차트와 KPI는 데이터가 업데이트되면 즉시 반영됩니다</p>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4 text-sm">
            <div>
              <p className="font-medium">Q. 데이터가 표시되지 않아요</p>
              <p className="text-gray-600">A. 데이터 임포트 페이지에서 CSV 파일을 먼저 업로드해주세요</p>
            </div>
            <div>
              <p className="font-medium">Q. 목표를 변경하려면?</p>
              <p className="text-gray-600">A. 설정 페이지에서 목표 금액을 수정할 수 있습니다</p>
            </div>
            <div>
              <p className="font-medium">Q. 데이터를 백업하려면?</p>
              <p className="text-gray-600">A. 설정 페이지의 데이터 관리 섹션에서 백업 다운로드를 클릭하세요</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={() => setOpen(false)}>닫기</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

