"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, Copy } from "lucide-react";
import { updateUserSettings } from "@/app/actions/users";
import { toast } from "sonner";

interface PublicProfileSettingsProps {
  isPublicProfile: boolean;
  username: string | null;
  displayName: string | null;
}

export function PublicProfileSettings({
  isPublicProfile: initialIsPublic,
  username: initialUsername,
  displayName: initialDisplayName,
}: PublicProfileSettingsProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [username, setUsername] = useState(initialUsername || "");
  const [displayName, setDisplayName] = useState(initialDisplayName || "");
  const [loading, setLoading] = useState(false);
  
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserSettings({
        isPublicProfile: isPublic,
        username: username || undefined,
        displayName: displayName || undefined,
      });
      toast.success("프로필 설정이 저장되었습니다.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "저장 실패");
    } finally {
      setLoading(false);
    }
  };

  const publicUrl = typeof window !== "undefined" && username 
    ? `${window.location.origin}/p/${username}`
    : "";

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    toast.success("링크가 복사되었습니다.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          공개 프로필 설정
        </CardTitle>
        <CardDescription>
          포트폴리오를 다른 사람들과 공유할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="public-profile" className="flex flex-col space-y-1">
            <span>프로필 공개</span>
            <span className="font-normal text-xs text-muted-foreground">
              활성화하면 누구나 내 포트폴리오를 볼 수 있습니다.
            </span>
          </Label>
          <Switch
            id="public-profile"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
        </div>

        {isPublic && (
          <>
            <div className="space-y-2">
              <Label htmlFor="username">사용자 아이디 (URL)</Label>
              <div className="flex gap-2">
                <span className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 border rounded-md">
                  /p/
                </span>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  placeholder="username"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                영문 소문자, 숫자, 하이픈(-), 언더바(_)만 가능합니다.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">표시 이름</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="홍길동"
              />
            </div>

            {username && (
              <div className="rounded-md bg-muted p-3 flex items-center justify-between">
                <code className="text-sm overflow-hidden text-ellipsis mr-2">
                  {publicUrl}
                </code>
                <Button size="icon" variant="ghost" onClick={copyUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        <Button onClick={handleSave} disabled={loading}>
          {loading ? "저장 중..." : "저장하기"}
        </Button>
      </CardContent>
    </Card>
  );
}

