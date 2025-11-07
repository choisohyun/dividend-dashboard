import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { requireAuth } from "@/lib/auth/session";
import { QueryProvider } from "@/lib/providers/QueryProvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <QueryProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </QueryProvider>
  );
}



