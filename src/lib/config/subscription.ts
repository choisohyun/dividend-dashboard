export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: "Free",
    limits: {
      holdings: 10,
      reportHistoryMonths: 3,
    },
    features: {
      googleSheetSync: false,
      autoBackup: false,
      publicProfile: true, // Allow public profile for everyone for now to encourage viral growth
    },
  },
  PRO: {
    name: "Pro",
    limits: {
      holdings: Infinity,
      reportHistoryMonths: Infinity,
    },
    features: {
      googleSheetSync: true,
      autoBackup: true,
      publicProfile: true,
    },
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_PLANS;

export function getPlanLimits(tier: string | null) {
  const planTier = (tier as SubscriptionTier) || "FREE";
  return SUBSCRIPTION_PLANS[planTier];
}

