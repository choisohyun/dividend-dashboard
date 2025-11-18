import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { requireAuth } from "@/lib/auth/session";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WelcomeDialog } from "@/components/onboarding/WelcomeDialog";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <ErrorBoundary>
      <QueryProvider>
        <DashboardLayout>
          {children}
          <WelcomeDialog />
        </DashboardLayout>
      </QueryProvider>
    </ErrorBoundary>
  );
}



