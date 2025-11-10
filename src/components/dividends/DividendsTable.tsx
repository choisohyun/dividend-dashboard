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
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, EyeOff } from "lucide-react";
import { formatKRW } from "@/lib/format/currency";
import { formatDate } from "@/lib/format/date";
import type { Dividend } from "@/lib/db/schema";

interface DividendsTableProps {
  dividends: Dividend[];
  selectedYear?: number;
  selectedMonth?: number;
}

type SortField = "payDate" | "symbol" | "amount";
type SortDirection = "asc" | "desc";

export function DividendsTable({
  dividends,
  selectedYear,
  selectedMonth,
}: DividendsTableProps) {
  const [sortField, setSortField] = useState<SortField>("payDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [showGross, setShowGross] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "payDate" ? "desc" : "asc");
    }
  };

  const filteredAndSortedDividends = useMemo(() => {
    let filtered = dividends;

    // Apply year filter
    if (selectedYear) {
      filtered = filtered.filter((d) => {
        const year = new Date(d.payDate).getFullYear();
        return year === selectedYear;
      });
    }

    // Apply month filter
    if (selectedMonth) {
      filtered = filtered.filter((d) => {
        const month = new Date(d.payDate).getMonth() + 1;
        return month === selectedMonth;
      });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "payDate":
          comparison = new Date(a.payDate).getTime() - new Date(b.payDate).getTime();
          break;
        case "symbol":
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case "amount":
          const amountA = showGross ? parseFloat(a.grossAmount) : parseFloat(a.netAmount);
          const amountB = showGross ? parseFloat(b.grossAmount) : parseFloat(b.netAmount);
          comparison = amountA - amountB;
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [dividends, selectedYear, selectedMonth, sortField, sortDirection, showGross]);

  const total = useMemo(() => {
    return filteredAndSortedDividends.reduce((sum, d) => {
      const amount = showGross ? parseFloat(d.grossAmount) : parseFloat(d.netAmount);
      return sum + amount;
    }, 0);
  }, [filteredAndSortedDividends, showGross]);

  const totalTax = useMemo(() => {
    return filteredAndSortedDividends.reduce(
      (sum, d) => sum + parseFloat(d.withholdingTax),
      0
    );
  }, [filteredAndSortedDividends]);

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-gray-900"
    >
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  if (filteredAndSortedDividends.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-12 text-center">
        <p className="text-gray-500">배당 내역이 없습니다.</p>
        <p className="mt-2 text-sm text-gray-400">
          데이터 임포트 페이지에서 배당 내역 CSV를 업로드하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      {/* Toggle Gross/Net */}
      <div className="border-b p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowGross(!showGross)}
        >
          {showGross ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
          {showGross ? "세후 금액 보기" : "세전 금액 보기"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortButton field="payDate">지급일</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="symbol">종목</SortButton>
            </TableHead>
            <TableHead className="text-right">
              <SortButton field="amount">{showGross ? "세전 금액" : "세후 금액"}</SortButton>
            </TableHead>
            <TableHead className="text-right">원천징수세</TableHead>
            {!showGross && <TableHead className="text-right">실수령액</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedDividends.map((dividend) => {
            const gross = parseFloat(dividend.grossAmount);
            const net = parseFloat(dividend.netAmount);
            const tax = parseFloat(dividend.withholdingTax);

            return (
              <TableRow key={dividend.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{formatDate(dividend.payDate, "short")}</p>
                    {dividend.exDate && (
                      <p className="text-xs text-gray-500">
                        배당락: {formatDate(dividend.exDate, "short")}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{dividend.symbol}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatKRW(showGross ? gross : net)}
                </TableCell>
                <TableCell className="text-right text-red-600">
                  {formatKRW(tax)}
                </TableCell>
                {!showGross && (
                  <TableCell className="text-right font-semibold text-blue-600">
                    {formatKRW(net)}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Summary Footer */}
      <div className="border-t bg-gray-50 px-6 py-4">
        <div className="flex justify-between text-sm">
          <span className="font-medium">
            합계 ({filteredAndSortedDividends.length}건)
          </span>
          <div className="flex gap-6">
            <div>
              <span className="text-gray-600">총 {showGross ? "세전" : "세후"}:</span>{" "}
              <span className="font-bold text-blue-600">{formatKRW(total)}</span>
            </div>
            <div>
              <span className="text-gray-600">원천징수세:</span>{" "}
              <span className="font-bold text-red-600">{formatKRW(totalTax)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

