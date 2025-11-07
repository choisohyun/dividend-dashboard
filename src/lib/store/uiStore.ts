import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DateRange {
  from: Date;
  to: Date;
}

interface UIState {
  sidebarOpen: boolean;
  selectedDateRange: DateRange | null;
  selectedSectors: string[];
  showGrossAmounts: boolean;
  
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setDateRange: (range: DateRange | null) => void;
  setSelectedSectors: (sectors: string[]) => void;
  toggleShowGrossAmounts: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      selectedDateRange: null,
      selectedSectors: [],
      showGrossAmounts: false,

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setDateRange: (range) => set({ selectedDateRange: range }),
      setSelectedSectors: (sectors) => set({ selectedSectors: sectors }),
      toggleShowGrossAmounts: () => set((state) => ({ showGrossAmounts: !state.showGrossAmounts })),
    }),
    {
      name: "dividend-dashboard-ui",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        showGrossAmounts: state.showGrossAmounts,
      }),
    }
  )
);



