"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateUserSettings } from "@/app/actions/users";
import { formatNumber } from "@/lib/format/currency";
import { CheckCircle2 } from "lucide-react";

interface GoalSettingsProps {
  goalMonthlyDividend: number;
  monthlyInvestPlan: number;
}

export function GoalSettings({
  goalMonthlyDividend: initialGoal,
  monthlyInvestPlan: initialPlan,
}: GoalSettingsProps) {
  const [goalMonthlyDividend, setGoalMonthlyDividend] = useState(initialGoal);
  const [monthlyInvestPlan, setMonthlyInvestPlan] = useState(initialPlan);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);

    try {
      await updateUserSettings({
        goalMonthlyDividend,
        monthlyInvestPlan,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Settings save error:", error);
      alert("저장 실패");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    goalMonthlyDividend !== initialGoal || monthlyInvestPlan !== initialPlan;

  return (
    <Card>
      <CardHeader>
        <CardTitle>투자 목표</CardTitle>
        <CardDescription>월별 배당 목표와 정기 입금 목표를 설정하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="goalMonthlyDividend">목표 월 배당 (₩)</Label>
          <Input
            id="goalMonthlyDividend"
            type="number"
            value={goalMonthlyDividend}
            onChange={(e) => setGoalMonthlyDividend(parseInt(e.target.value) || 0)}
            disabled={isSaving}
          />
          <p className="text-xs text-gray-500">
            현재: {formatNumber(goalMonthlyDividend)} 원
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthlyInvestPlan">월 정기입금 목표 (₩)</Label>
          <Input
            id="monthlyInvestPlan"
            type="number"
            value={monthlyInvestPlan}
            onChange={(e) => setMonthlyInvestPlan(parseInt(e.target.value) || 0)}
            disabled={isSaving}
          />
          <p className="text-xs text-gray-500">
            현재: {formatNumber(monthlyInvestPlan)} 원
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="w-full"
        >
          {isSaving ? "저장 중..." : "저장"}
        </Button>

        {saved && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            저장되었습니다
          </div>
        )}
      </CardContent>
    </Card>
  );
}

