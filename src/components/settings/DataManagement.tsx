"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Upload, Trash2, AlertTriangle } from "lucide-react";
import { downloadBackup } from "@/app/actions/backup";
import { restoreFromBackup, deleteAllData } from "@/app/actions/restore";
import { useRouter } from "next/navigation";

interface DataManagementProps {
  stats?: {
    holdings: number;
    dividends: number;
    cashFlows: number;
    transactions: number;
  };
}

export function DataManagement({ stats }: DataManagementProps) {
  const router = useRouter();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreMode, setRestoreMode] = useState<"merge" | "replace">("merge");
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const backupJson = await downloadBackup();
      const blob = new Blob([backupJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dividend-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Backup error:", error);
      alert("백업 실패");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreFile) return;

    setIsRestoring(true);
    try {
      const content = await restoreFile.text();
      const result = await restoreFromBackup(content, restoreMode);

      if (result.success) {
        alert(
          `복원 완료!\n보유종목: ${result.counts?.holdings}개\n배당: ${result.counts?.dividends}건\n입금: ${result.counts?.cashFlows}건\n거래: ${result.counts?.transactions}건`
        );
        router.refresh();
        setRestoreFile(null);
      } else {
        alert(`복원 실패: ${result.error}`);
      }
    } catch (error) {
      console.error("Restore error:", error);
      alert("복원 실패");
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAllData();
      if (result.success) {
        alert("모든 데이터가 삭제되었습니다");
        setDeleteDialogOpen(false);
        router.refresh();
      } else {
        alert(`삭제 실패: ${result.error}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("삭제 실패");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>데이터 통계</CardTitle>
            <CardDescription>현재 저장된 데이터 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">보유 종목</span>
                <span className="font-bold">{stats.holdings}개</span>
              </div>
              <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">배당 내역</span>
                <span className="font-bold">{stats.dividends}건</span>
              </div>
              <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">입출금 내역</span>
                <span className="font-bold">{stats.cashFlows}건</span>
              </div>
              <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">거래 내역</span>
                <span className="font-bold">{stats.transactions}건</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup */}
      <Card>
        <CardHeader>
          <CardTitle>데이터 백업</CardTitle>
          <CardDescription>모든 데이터를 JSON 파일로 내보내기</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleBackup} disabled={isBackingUp} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            {isBackingUp ? "백업 생성 중..." : "백업 다운로드"}
          </Button>
          <p className="mt-2 text-xs text-gray-500">
            보유종목, 배당, 입출금, 거래 내역이 포함됩니다
          </p>
        </CardContent>
      </Card>

      {/* Restore */}
      <Card>
        <CardHeader>
          <CardTitle>데이터 복원</CardTitle>
          <CardDescription>백업 파일에서 데이터 복원</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="restoreFile">백업 파일</Label>
            <Input
              id="restoreFile"
              type="file"
              accept=".json"
              onChange={(e) =>
                setRestoreFile(e.target.files?.[0] || null)
              }
              disabled={isRestoring}
            />
          </div>

          <div className="space-y-2">
            <Label>복원 모드</Label>
            <Select
              value={restoreMode}
              onValueChange={(value) => setRestoreMode(value as "merge" | "replace")}
              disabled={isRestoring}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="merge">병합 (기존 데이터 유지)</SelectItem>
                <SelectItem value="replace">교체 (기존 데이터 삭제 후 복원)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleRestore}
            disabled={!restoreFile || isRestoring}
            className="w-full"
            variant="secondary"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isRestoring ? "복원 중..." : "복원 실행"}
          </Button>
        </CardContent>
      </Card>

      {/* Delete All */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">위험 영역</CardTitle>
          <CardDescription>모든 데이터를 삭제합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            모든 데이터 삭제
          </Button>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              모든 데이터 삭제
            </DialogTitle>
            <DialogDescription>
              이 작업은 되돌릴 수 없습니다. 모든 보유종목, 배당, 입출금, 거래
              내역이 영구적으로 삭제됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
            <p className="font-medium mb-2">삭제 전 백업을 권장합니다!</p>
            <p>계속하시겠습니까?</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAll}
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "확인, 삭제합니다"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

