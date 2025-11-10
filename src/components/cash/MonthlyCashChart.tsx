"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  TooltipProps,
} from "recharts";
import { formatKRW } from "@/lib/format/currency";
import type { CashFlowDataPoint } from "@/types";

interface MonthlyCashChartProps {
  data: CashFlowDataPoint[];
  monthlyTarget?: number;
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-white p-3 shadow-lg">
        <p className="text-sm font-medium mb-2">{data.month}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-blue-500" />
            <span className="text-sm">입금: {formatKRW(data.deposits)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-red-500" />
            <span className="text-sm">출금: {formatKRW(data.withdrawals)}</span>
          </div>
          <div className="border-t pt-1 mt-1">
            <span className="text-sm font-medium">
              순입금: {formatKRW(data.deposits - data.withdrawals)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function MonthlyCashChart({
  data,
  monthlyTarget = 2000000,
}: MonthlyCashChartProps) {
  const last12Months = data.slice(-12);

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
        <Legend
          wrapperStyle={{ fontSize: "12px" }}
          iconType="rect"
        />
        <ReferenceLine
          y={monthlyTarget}
          stroke="#f97316"
          strokeDasharray="5 5"
          label={{
            value: "목표",
            position: "right",
            fill: "#f97316",
            fontSize: 12,
          }}
        />
        <Bar dataKey="deposits" fill="#3b82f6" name="입금" radius={[4, 4, 0, 0]} />
        <Bar dataKey="withdrawals" fill="#ef4444" name="출금" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

