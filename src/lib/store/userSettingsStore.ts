import { create } from "zustand";

interface UserSettings {
  currency: string;
  timezone: string;
  goalMonthlyDividend: number;
  monthlyInvestPlan: number;
}

interface UserSettingsState {
  settings: UserSettings | null;
  setSettings: (settings: UserSettings) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
}

export const useUserSettingsStore = create<UserSettingsState>()((set) => ({
  settings: null,
  
  setSettings: (settings) => set({ settings }),
  
  updateSettings: (updates) =>
    set((state) => ({
      settings: state.settings ? { ...state.settings, ...updates } : null,
    })),
}));



