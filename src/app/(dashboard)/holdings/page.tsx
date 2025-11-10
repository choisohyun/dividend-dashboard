"use client";

import { useState, useMemo } from "react";
import { useHoldings } from "@/hooks/queries/useHoldings";
import { HoldingsTable } from "@/components/holdings/HoldingsTable";
import { HoldingsFilters } from "@/components/holdings/HoldingsFilters";
import { SectorDonut } from "@/components/holdings/SectorDonut";

export default function HoldingsPage() {
  const { data: holdings = [], isLoading } = useHoldings();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  // Get available sectors
  const availableSectors = useMemo(() => {
    const sectors = new Set(
      holdings.map((h) => h.sector).filter((s): s is string => Boolean(s))
    );
    return Array.from(sectors).sort();
  }, [holdings]);

  // Filter holdings
  const filteredHoldings = useMemo(() => {
    return holdings.filter((h) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSymbol = h.symbol.toLowerCase().includes(query);
        const matchesName = h.name?.toLowerCase().includes(query);
        if (!matchesSymbol && !matchesName) return false;
      }

      // Sector filter
      if (selectedSectors.length > 0) {
        if (!h.sector || !selectedSectors.includes(h.sector)) {
          return false;
        }
      }

      return true;
    });
  }, [holdings, searchQuery, selectedSectors]);

  const handleSectorToggle = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSectors([]);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">데이터 로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">보유현황</h1>
        <p className="text-gray-600">현재 보유 중인 자산과 종목 정보</p>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border bg-white p-6">
        <HoldingsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSectors={selectedSectors}
          availableSectors={availableSectors}
          onSectorToggle={handleSectorToggle}
          onClearFilters={handleClearFilters}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Holdings Table */}
        <div className="lg:col-span-2">
          <HoldingsTable
            holdings={filteredHoldings}
            selectedSectors={selectedSectors}
          />
        </div>

        {/* Sector Analysis */}
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">섹터별 투자 비중</h3>
          <SectorDonut holdings={holdings} />
        </div>
      </div>
    </div>
  );
}



