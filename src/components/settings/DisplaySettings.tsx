"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DisplaySettingsProps {
  currency: string;
  timezone: string;
}

export function DisplaySettings({ currency, timezone }: DisplaySettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>표시 설정</CardTitle>
        <CardDescription>통화 및 타임존 설정</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currency">통화</Label>
          <Select value={currency} disabled>
            <SelectTrigger id="currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="KRW">KRW (₩)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">현재는 KRW만 지원됩니다</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">타임존</Label>
          <Select value={timezone} disabled>
            <SelectTrigger id="timezone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Seoul">Asia/Seoul (KST)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">현재는 Asia/Seoul만 지원됩니다</p>
        </div>
      </CardContent>
    </Card>
  );
}

