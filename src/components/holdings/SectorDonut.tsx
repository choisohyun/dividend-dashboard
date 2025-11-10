"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatKRW } from "@/lib/format/currency";
import type { Holding } from "@/lib/db/schema";

interface SectorDonutProps {
  holdings: Holding[];
}

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

export function SectorDonut({ holdings }: SectorDonutProps) {
  // Group by sector
  const sectorData = holdings.reduce((acc, holding) => {
    const sector = holding.sector || "기타";
    const quantity = parseFloat(holding.quantity);
    const avgCost = parseFloat(holding.avgCost);
    const value = quantity * avgCost;

    if (!acc[sector]) {
      acc[sector] = 0;
    }
    acc[sector] += value;

    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(sectorData)
    .map(([sector, value]) => ({
      name: sector,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        데이터가 없습니다
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatKRW(value)}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="space-y-2">
        {chartData.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{formatKRW(item.value)}</span>
                <span className="text-gray-500 w-12 text-right">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t pt-3">
        <div className="flex justify-between text-sm font-semibold">
          <span>총 투자금액</span>
          <span>{formatKRW(total)}</span>
        </div>
      </div>
    </div>
  );
}

