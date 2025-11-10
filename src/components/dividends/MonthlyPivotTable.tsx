"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatKRW } from "@/lib/format/currency";
import type { Dividend } from "@/lib/db/schema";

interface MonthlyPivotTableProps {
  dividends: Dividend[];
  year?: number;
}

export function MonthlyPivotTable({ dividends, year }: MonthlyPivotTableProps) {
  const pivotData = useMemo(() => {
    const targetYear = year || new Date().getFullYear();

    // Filter by year
    const yearDividends = dividends.filter((d) => {
      return new Date(d.payDate).getFullYear() === targetYear;
    });

    // Get unique symbols
    const symbols = Array.from(new Set(yearDividends.map((d) => d.symbol))).sort();

    // Create pivot structure
    const pivot = symbols.map((symbol) => {
      const row: any = { symbol };
      let rowTotal = 0;

      for (let month = 1; month <= 12; month++) {
        const monthDividends = yearDividends.filter((d) => {
          const payDate = new Date(d.payDate);
          return d.symbol === symbol && payDate.getMonth() + 1 === month;
        });

        const monthTotal = monthDividends.reduce(
          (sum, d) => sum + parseFloat(d.netAmount),
          0
        );

        row[`month${month}`] = monthTotal;
        rowTotal += monthTotal;
      }

      row.total = rowTotal;
      return row;
    });

    // Calculate column totals
    const columnTotals: any = { symbol: "합계" };
    let grandTotal = 0;

    for (let month = 1; month <= 12; month++) {
      const monthTotal = pivot.reduce((sum, row) => sum + row[`month${month}`], 0);
      columnTotals[`month${month}`] = monthTotal;
      grandTotal += monthTotal;
    }
    columnTotals.total = grandTotal;

    return { pivot, columnTotals };
  }, [dividends, year]);

  const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

  if (pivotData.pivot.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-12 text-center">
        <p className="text-gray-500">선택한 연도의 배당 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-white">종목</TableHead>
            {months.map((month, index) => (
              <TableHead key={index} className="text-right">
                {month}
              </TableHead>
            ))}
            <TableHead className="text-right font-semibold">합계</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pivotData.pivot.map((row) => (
            <TableRow key={row.symbol}>
              <TableCell className="sticky left-0 bg-white font-medium">
                {row.symbol}
              </TableCell>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                const value = row[`month${month}`];
                return (
                  <TableCell key={month} className="text-right text-sm">
                    {value > 0 ? formatKRW(value) : "-"}
                  </TableCell>
                );
              })}
              <TableCell className="text-right font-semibold text-blue-600">
                {formatKRW(row.total)}
              </TableCell>
            </TableRow>
          ))}
          {/* Totals Row */}
          <TableRow className="bg-gray-50 font-semibold">
            <TableCell className="sticky left-0 bg-gray-50">
              {pivotData.columnTotals.symbol}
            </TableCell>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
              const value = pivotData.columnTotals[`month${month}`];
              return (
                <TableCell key={month} className="text-right">
                  {value > 0 ? formatKRW(value) : "-"}
                </TableCell>
              );
            })}
            <TableCell className="text-right text-blue-600">
              {formatKRW(pivotData.columnTotals.total)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

