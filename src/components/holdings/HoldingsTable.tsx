"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { formatKRW, formatNumber, formatPercentage } from "@/lib/format/currency";
import { calculateYOC } from "@/lib/calculations/yoc";
import type { Holding } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface HoldingsTableProps {
  holdings: Holding[];
  selectedSectors?: string[];
}

type SortField = "symbol" | "quantity" | "avgCost" | "yoc" | "totalValue";
type SortDirection = "asc" | "desc";

export function HoldingsTable({ holdings, selectedSectors = [] }: HoldingsTableProps) {
  const [sortField, setSortField] = useState<SortField>("symbol");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedHoldings = useMemo(() => {
    let filtered = holdings;

    // Apply sector filter
    if (selectedSectors.length > 0) {
      filtered = filtered.filter((h) =>
        selectedSectors.includes(h.sector || "")
      );
    }

    // Calculate derived fields and sort
    const withCalculations = filtered.map((h) => {
      const quantity = parseFloat(h.quantity);
      const avgCost = parseFloat(h.avgCost);
      const totalCost = quantity * avgCost;
      const yoc = calculateYOC(h);
      const expDivPerShare = h.expectedDividendPerShareYear
        ? parseFloat(h.expectedDividendPerShareYear)
        : 0;
      const annualDividend = quantity * expDivPerShare;

      return {
        ...h,
        quantityNum: quantity,
        avgCostNum: avgCost,
        totalCost,
        yoc,
        annualDividend,
      };
    });

    // Sort
    withCalculations.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "symbol":
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case "quantity":
          comparison = a.quantityNum - b.quantityNum;
          break;
        case "avgCost":
          comparison = a.avgCostNum - b.avgCostNum;
          break;
        case "yoc":
          comparison = a.yoc - b.yoc;
          break;
        case "totalValue":
          comparison = a.totalCost - b.totalCost;
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return withCalculations;
  }, [holdings, selectedSectors, sortField, sortDirection]);

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-gray-900"
    >
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  if (filteredAndSortedHoldings.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-12 text-center">
        <p className="text-gray-500">보유 종목이 없습니다.</p>
        <p className="mt-2 text-sm text-gray-400">
          데이터 임포트 페이지에서 CSV를 업로드하거나 수동으로 추가하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortButton field="symbol">종목</SortButton>
            </TableHead>
            <TableHead>섹터</TableHead>
            <TableHead className="text-right">
              <SortButton field="quantity">보유수량</SortButton>
            </TableHead>
            <TableHead className="text-right">
              <SortButton field="avgCost">평균단가</SortButton>
            </TableHead>
            <TableHead className="text-right">
              <SortButton field="totalValue">총 매입금액</SortButton>
            </TableHead>
            <TableHead className="text-right">예상 연배당</TableHead>
            <TableHead className="text-right">
              <SortButton field="yoc">YOC</SortButton>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedHoldings.map((holding) => (
            <TableRow key={holding.id}>
              <TableCell className="font-medium">
                <div>
                  <p className="font-semibold">{holding.symbol}</p>
                  {holding.name && (
                    <p className="text-xs text-gray-500">{holding.name}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {holding.sector && (
                  <Badge variant="secondary" className="text-xs">
                    {holding.sector}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                {formatNumber(holding.quantityNum, 2)}
              </TableCell>
              <TableCell className="text-right">
                {formatKRW(holding.avgCostNum)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatKRW(holding.totalCost)}
              </TableCell>
              <TableCell className="text-right">
                {formatKRW(holding.annualDividend)}
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={cn(
                    "font-medium",
                    holding.yoc >= 4 ? "text-green-600" : "text-gray-600"
                  )}
                >
                  {formatPercentage(holding.yoc, 2)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Summary Footer */}
      <div className="border-t bg-gray-50 px-6 py-4">
        <div className="flex justify-between text-sm">
          <span className="font-medium">합계 ({filteredAndSortedHoldings.length}개 종목)</span>
          <div className="flex gap-6">
            <div>
              <span className="text-gray-600">총 투자:</span>{" "}
              <span className="font-bold">
                {formatKRW(
                  filteredAndSortedHoldings.reduce((sum, h) => sum + h.totalCost, 0)
                )}
              </span>
            </div>
            <div>
              <span className="text-gray-600">예상 연배당:</span>{" "}
              <span className="font-bold text-blue-600">
                {formatKRW(
                  filteredAndSortedHoldings.reduce((sum, h) => sum + h.annualDividend, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

