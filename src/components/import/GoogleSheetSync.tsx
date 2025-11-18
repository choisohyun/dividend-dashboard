"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export function GoogleSheetSync() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>구글 시트 동기화</CardTitle>
        <CardDescription>구글 시트에서 데이터 가져오기 (읽기 전용)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm text-yellow-800">
                <p className="font-medium">Week 4 예정 기능</p>
                <p>
                  구글 시트 연동은 다음 업데이트에서 추가됩니다.
                  현재는 CSV 파일 업로드를 사용해주세요.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 opacity-50">
            <Label htmlFor="sheetUrl">시트 URL</Label>
            <Input
              id="sheetUrl"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              disabled
            />
          </div>

          <div className="space-y-2 opacity-50">
            <Label htmlFor="range">범위</Label>
            <Input
              id="range"
              placeholder="A1:F100"
              disabled
            />
          </div>

          <Button disabled className="w-full">
            동기화 (준비 중)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

