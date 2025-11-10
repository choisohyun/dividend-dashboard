"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserSettings } from "@/app/actions/users";
import { GoalSettings } from "@/components/settings/GoalSettings";
import { DisplaySettings } from "@/components/settings/DisplaySettings";
import { AccountInfo } from "@/components/settings/AccountInfo";

export default function SettingsPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["userSettings"],
    queryFn: getUserSettings,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">설정 로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
        <p className="text-gray-600">목표 설정 및 개인 환경설정</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Goal Settings */}
        <GoalSettings
          goalMonthlyDividend={settings?.goalMonthlyDividend || 900000}
          monthlyInvestPlan={settings?.monthlyInvestPlan || 2000000}
        />

        {/* Display Settings */}
        <DisplaySettings
          currency={settings?.currency || "KRW"}
          timezone={settings?.timezone || "Asia/Seoul"}
        />

        {/* Account Info */}
        <div className="lg:col-span-2">
          <AccountInfo />
        </div>
      </div>

      {/* Data Management */}
      <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-6">
        <h3 className="mb-2 font-semibold text-orange-900">데이터 관리</h3>
        <p className="text-sm text-orange-800">
          Week 3에서 데이터 백업/복원 기능이 추가될 예정입니다.
        </p>
      </div>
    </div>
  );
}



