"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, LogOut } from "lucide-react";
import { formatDate } from "@/lib/format/date";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AccountInfo() {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>계정 정보</CardTitle>
        <CardDescription>로그인된 계정 정보</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-gray-600">이메일</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <User className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-gray-600">사용자 ID</p>
              <p className="font-mono text-xs">{user.id.slice(0, 8)}...</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-gray-600">가입일</p>
              <p className="font-medium">
                {user.created_at ? formatDate(user.created_at, "long") : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

