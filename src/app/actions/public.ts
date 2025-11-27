import { db } from "@/lib/db";
import { users, dividends, holdings, symbolMeta } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export type PublicProfile = {
  id: string;
  displayName: string | null;
  username: string | null;
  goalMonthlyDividend: number;
  currency: string;
};

// Cache public profile data for 1 hour
export const getPublicProfile = unstable_cache(
  async (identifier: string) => {
    const user = await db.query.users.findFirst({
      where: or(eq(users.username, identifier), eq(users.id, identifier)),
      columns: {
        id: true,
        displayName: true,
        username: true,
        goalMonthlyDividend: true,
        isPublicProfile: true,
        currency: true,
      },
    });

    if (!user || !user.isPublicProfile) {
      return null;
    }

    return user;
  },
  ["public-profile"],
  { revalidate: 3600 }
);

// Cache public data for 10 minutes
export const getPublicDashboardData = unstable_cache(
  async (userId: string) => {
    // Verify user is public again just in case, though usually handled by caller
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { isPublicProfile: true },
    });

    if (!user || !user.isPublicProfile) {
      return null;
    }

    const [userDividends, userHoldings] = await Promise.all([
      db.query.dividends.findMany({
        where: eq(dividends.userId, userId),
        orderBy: (dividends, { desc }) => [desc(dividends.payDate)],
      }),
      db.query.holdings.findMany({
        where: eq(holdings.userId, userId),
        orderBy: (holdings, { desc }) => [desc(holdings.quantity)],
      }),
    ]);

    return {
      dividends: userDividends,
      holdings: userHoldings,
    };
  },
  ["public-dashboard-data"],
  { revalidate: 600 }
);

