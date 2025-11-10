"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { formatKRW } from "@/lib/format/currency";
import type { MonthlyDataPoint } from "@/types";

interface MonthlyDividendChartProps {
  data: MonthlyDataPoint[];
  showGross?: boolean;
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white p-3 shadow-lg">
        <p className="text-sm font-medium">{payload[0].payload.month}</p>
        <p className="text-lg font-bold text-blue-600">
          {formatKRW(payload[0].value as number)}
        </p>
      </div>
    );
  }
  return null;
}

export function MonthlyDividendChart({
  data,
  showGross = false,
}: MonthlyDividendChartProps) {
  // Get last 12 months
  const last12Months = data.slice(-12);

  // Get current month for highlighting
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={last12Months} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => {
            const [, month] = value.split("-");
            return `${month}월`;
          }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
            return value.toString();
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="value"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
          animationDuration={500}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

