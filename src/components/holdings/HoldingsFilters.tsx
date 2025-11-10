"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

interface HoldingsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSectors: string[];
  availableSectors: string[];
  onSectorToggle: (sector: string) => void;
  onClearFilters: () => void;
}

export function HoldingsFilters({
  searchQuery,
  onSearchChange,
  selectedSectors,
  availableSectors,
  onSectorToggle,
  onClearFilters,
}: HoldingsFiltersProps) {
  const hasActiveFilters = searchQuery || selectedSectors.length > 0;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="종목명 또는 심볼 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sector Filters */}
      {availableSectors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">섹터</p>
          <div className="flex flex-wrap gap-2">
            {availableSectors.map((sector) => {
              const isSelected = selectedSectors.includes(sector);
              return (
                <Badge
                  key={sector}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onSectorToggle(sector)}
                >
                  {sector}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <X className="h-4 w-4" />
          필터 초기화
        </button>
      )}
    </div>
  );
}

