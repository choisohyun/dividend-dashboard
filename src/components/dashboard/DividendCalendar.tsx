"use client";

import { useMemo } from "react";
import { formatKRW } from "@/lib/format/currency";
import { cn } from "@/lib/utils";
import type { CalendarDataPoint } from "@/types";

interface DividendCalendarProps {
  data: CalendarDataPoint[];
  months?: number;
}

export function DividendCalendar({ data, months = 3 }: DividendCalendarProps) {
  const calendarData = useMemo(() => {
    // Get last N months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months + 1);
    startDate.setDate(1);

    // Create a map of date -> amount
    const dataMap = new Map(data.map((d) => [d.date, d.amount]));

    // Get max amount for color scaling
    const maxAmount = Math.max(...data.map((d) => d.amount), 1);

    // Generate calendar days
    const days: Array<{
      date: string;
      amount: number;
      intensity: number;
      dayOfWeek: number;
      monthLabel?: string;
    }> = [];

    const current = new Date(startDate);
    let lastMonth = -1;

    while (current <= endDate) {
      const dateStr = current.toISOString().split("T")[0];
      const amount = dataMap.get(dateStr) || 0;
      const intensity = maxAmount > 0 ? amount / maxAmount : 0;
      const dayOfWeek = current.getDay();
      const currentMonth = current.getMonth();

      days.push({
        date: dateStr,
        amount,
        intensity,
        dayOfWeek,
        monthLabel: currentMonth !== lastMonth ? `${currentMonth + 1}월` : undefined,
      });

      lastMonth = currentMonth;
      current.setDate(current.getDate() + 1);
    }

    return { days, maxAmount };
  }, [data, months]);

  const getColorClass = (intensity: number) => {
    if (intensity === 0) return "bg-gray-100";
    if (intensity < 0.25) return "bg-green-200";
    if (intensity < 0.5) return "bg-green-400";
    if (intensity < 0.75) return "bg-green-600";
    return "bg-green-800";
  };

  // Group days by week
  type DayData = {
    date: string;
    amount: number;
    intensity: number;
    dayOfWeek: number;
    monthLabel?: string;
  };
  
  const weeks: DayData[][] = [];
  let currentWeek: DayData[] = [];
  
  // Pad first week
  if (calendarData.days.length > 0) {
    const firstDayOfWeek = calendarData.days[0].dayOfWeek;
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: "",
        amount: 0,
        intensity: 0,
        dayOfWeek: i,
      });
    }
  }

  calendarData.days.forEach((day) => {
    currentWeek.push(day);
    if (day.dayOfWeek === 6 || day === calendarData.days[calendarData.days.length - 1]) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>최근 {months}개월</span>
        <div className="flex items-center gap-2">
          <span>적음</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-sm bg-gray-100" />
            <div className="h-3 w-3 rounded-sm bg-green-200" />
            <div className="h-3 w-3 rounded-sm bg-green-400" />
            <div className="h-3 w-3 rounded-sm bg-green-600" />
            <div className="h-3 w-3 rounded-sm bg-green-800" />
          </div>
          <span>많음</span>
        </div>
      </div>

      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-1">
            {week.map((day, dayIndex) => (
              <div key={dayIndex} className="group relative">
                {day.date ? (
                  <>
                    <div
                      className={cn(
                        "h-3 w-3 rounded-sm transition-transform hover:scale-125",
                        getColorClass(day.intensity)
                      )}
                    />
                    {day.amount > 0 && (
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded-lg border bg-white p-2 text-xs shadow-lg group-hover:block">
                        <p className="font-medium">{day.date}</p>
                        <p className="text-green-600">{formatKRW(day.amount)}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-3 w-3" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span>일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span>토</span>
        </div>
      </div>
    </div>
  );
}

