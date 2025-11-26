"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { testGoogleSheetConnection, fetchSheetHeaders } from "@/app/actions/sync";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, Link as LinkIcon } from "lucide-react";

interface GoogleSheetConfigProps {
  onConfigured: (config: {
    url: string;
    range: string;
    type: "transactions" | "dividends" | "cashflows";
    headers: string[];
    preview: string[][];
  }) => void;
}

export function GoogleSheetConfig({ onConfigured }: GoogleSheetConfigProps) {
  const [url, setUrl] = useState("");
  const [range, setRange] = useState("");
  const [type, setType] = useState<"transactions" | "dividends" | "cashflows">("transactions");
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    message?: string;
  } | null>(null);

  const handleTestConnection = async () => {
    if (!url) {
      toast.error("구글 시트 URL을 입력해주세요");
      return;
    }

    if (!range) {
      toast.error("범위를 입력해주세요 (예: Sheet1!A1:F)");
      return;
    }

    setIsTesting(true);
    setConnectionStatus(null);

    try {
      // 1. Test connection
      const connection = await testGoogleSheetConnection(url);
      
      if (!connection.success) {
        setConnectionStatus({
          success: false,
          message: connection.error || "연결 실패",
        });
        return;
      }

      // 2. Fetch headers if connected
      const data = await fetchSheetHeaders(url, range);
      
      setConnectionStatus({
        success: true,
        message: `연결 성공: ${connection.title}`,
      });

      // 3. Pass config to parent
      onConfigured({
        url,
        range,
        type,
        headers: data.headers,
        preview: data.preview,
      });

    } catch (error: any) {
      setConnectionStatus({
        success: false,
        message: error.message || "알 수 없는 오류",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">구글 시트 URL</Label>
        <div className="flex gap-2">
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(url, "_blank")}
            disabled={!url}
            title="시트 열기"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="range">범위 (탭이름!범위)</Label>
          <Input
            id="range"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            placeholder="Sheet1!A1:F"
          />
          <p className="text-xs text-gray-500">
            첫 행은 헤더여야 합니다. 예: Sheet1!A1:E
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">데이터 유형</Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as any)}
          >
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transactions">거래내역</SelectItem>
              <SelectItem value="dividends">배당내역</SelectItem>
              <SelectItem value="cashflows">입금내역</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {connectionStatus && (
        <div
          className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
            connectionStatus.success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {connectionStatus.success ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {connectionStatus.message}
        </div>
      )}

      <Button
        onClick={handleTestConnection}
        disabled={isTesting || !url || !range}
        className="w-full"
      >
        {isTesting ? "연결 확인 중..." : "연결 테스트 및 다음 단계"}
      </Button>
    </div>
  );
}

