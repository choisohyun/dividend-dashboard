"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getBackupHistory, triggerManualBackup, downloadBackupFile, deleteBackupFile } from "@/app/actions/backup-storage";
import { updateUserSettings } from "@/app/actions/users";
import { restoreFromBackup } from "@/app/actions/restore";
import { formatDate } from "@/lib/format/date";
import { Download, Trash2, RefreshCw, Play } from "lucide-react";
import { toast } from "sonner";

interface BackupSettingsProps {
  autoBackupEnabled: boolean;
  lastBackupAt: Date | null;
}

export function BackupSettings({ autoBackupEnabled, lastBackupAt }: BackupSettingsProps) {
  const [enabled, setEnabled] = useState(autoBackupEnabled);
  const [history, setHistory] = useState<Array<{ name: string; createdAt: string; size: number }>>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    const data = await getBackupHistory();
    setHistory(data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleToggle = async (checked: boolean) => {
    setEnabled(checked);
    try {
      await updateUserSettings({ autoBackupEnabled: checked });
      toast.success(checked ? "자동 백업이 활성화되었습니다" : "자동 백업이 비활성화되었습니다");
    } catch (error) {
      setEnabled(!checked); // Rollback
      toast.error("설정 변경 실패");
    }
  };

  const handleManualBackup = async () => {
    setLoading(true);
    try {
      const result = await triggerManualBackup();
      if (result.success) {
        toast.success("백업이 완료되었습니다");
        loadHistory();
      } else {
        throw new Error("백업 실패");
      }
    } catch (error) {
      toast.error("백업 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (fileName: string) => {
    if (!confirm("이 백업으로 데이터를 복원하시겠습니까? 현재 데이터에 병합됩니다.")) return;

    setLoading(true);
    try {
      const jsonContent = await downloadBackupFile(fileName);
      const result = await restoreFromBackup(jsonContent, "merge");
      
      if (result.success) {
        toast.success("복원 완료!");
      } else {
        toast.error(`복원 실패: ${result.error}`);
      }
    } catch (error) {
      toast.error("복원 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm("이 백업 파일을 삭제하시겠습니까?")) return;

    try {
      await deleteBackupFile(fileName);
      toast.success("삭제되었습니다");
      loadHistory();
    } catch (error) {
      toast.error("삭제 실패");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>자동 백업</CardTitle>
        <CardDescription>
          매주 일요일 자동으로 데이터를 백업합니다
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-backup">자동 백업 활성화</Label>
            <p className="text-xs text-gray-500">
              마지막 백업: {lastBackupAt ? formatDate(lastBackupAt, "long") : "없음"}
            </p>
          </div>
          <Switch
            id="auto-backup"
            checked={enabled}
            onCheckedChange={handleToggle}
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium">백업 기록</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualBackup}
              disabled={loading}
            >
              <Play className="mr-2 h-3 w-3" />
              지금 백업
            </Button>
          </div>

          {history.length > 0 ? (
            <div className="space-y-2">
              {history.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between rounded-lg border bg-gray-50 p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{formatDate(file.createdAt, "long")}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRestore(file.name)}
                      title="복원"
                      disabled={loading}
                    >
                      <RefreshCw className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(file.name)}
                      title="삭제"
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500 py-4">
              저장된 백업이 없습니다
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

