"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Calculator } from "lucide-react";
import { formatDate, formatISODate } from "@/lib/format/date";
import { formatNumber } from "@/lib/format/currency";
import { cn } from "@/lib/utils";

interface AddDividendFormProps {
  onSubmit: (data: {
    symbol: string;
    payDate: string;
    exDate: string | null;
    grossAmount: string;
    withholdingTax: string;
    netAmount: string;
  }) => Promise<void>;
  onCancel?: () => void;
  defaultSymbol?: string;
}

export function AddDividendForm({
  onSubmit,
  onCancel,
  defaultSymbol,
}: AddDividendFormProps) {
  const [symbol, setSymbol] = useState(defaultSymbol || "");
  const [payDate, setPayDate] = useState<Date>(new Date());
  const [exDate, setExDate] = useState<Date | undefined>();
  const [grossAmount, setGrossAmount] = useState("");
  const [withholdingTax, setWithholdingTax] = useState("");
  const [netAmount, setNetAmount] = useState("");
  const [autoCalc, setAutoCalc] = useState<"net" | "tax" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-calculate net or tax
  useEffect(() => {
    if (autoCalc === "net" && grossAmount && withholdingTax) {
      const net = parseFloat(grossAmount) - parseFloat(withholdingTax);
      setNetAmount(net.toString());
    } else if (autoCalc === "tax" && grossAmount && netAmount) {
      const tax = parseFloat(grossAmount) - parseFloat(netAmount);
      setWithholdingTax(tax.toString());
    }
  }, [grossAmount, withholdingTax, netAmount, autoCalc]);

  const calculate15Percent = () => {
    if (grossAmount) {
      const tax = parseFloat(grossAmount) * 0.15;
      const net = parseFloat(grossAmount) - tax;
      setWithholdingTax(tax.toFixed(2));
      setNetAmount(net.toFixed(2));
      setAutoCalc("net");
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!symbol.trim()) {
      newErrors.symbol = "종목을 입력하세요";
    }

    if (!grossAmount || parseFloat(grossAmount) <= 0) {
      newErrors.grossAmount = "세전 금액은 0보다 커야 합니다";
    }

    if (!netAmount || parseFloat(netAmount) <= 0) {
      newErrors.netAmount = "세후 금액은 0보다 커야 합니다";
    }

    if (parseFloat(netAmount) > parseFloat(grossAmount)) {
      newErrors.netAmount = "세후 금액은 세전 금액보다 클 수 없습니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setSymbol(defaultSymbol || "");
    setGrossAmount("");
    setWithholdingTax("");
    setNetAmount("");
    setExDate(undefined);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        symbol: symbol.trim(),
        payDate: formatISODate(payDate),
        exDate: exDate ? formatISODate(exDate) : null,
        grossAmount,
        withholdingTax: withholdingTax || "0",
        netAmount,
      });

      // Reset form
      handleReset();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Symbol */}
      <div className="space-y-2">
        <Label htmlFor="symbol">종목 *</Label>
        <Input
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="SCHD, KOSEF_배당 등"
          disabled={isSubmitting}
        />
        {errors.symbol && (
          <p className="text-sm text-red-600">{errors.symbol}</p>
        )}
      </div>

      {/* Pay Date */}
      <div className="space-y-2">
        <Label>지급일 *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !payDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {payDate ? formatDate(payDate, "long") : "날짜 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={payDate}
              onSelect={(date) => date && setPayDate(date)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Ex-Date (Optional) */}
      <div className="space-y-2">
        <Label>배당락일 (선택)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {exDate ? formatDate(exDate, "long") : "날짜 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={exDate}
              onSelect={(date) => setExDate(date)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Gross Amount */}
      <div className="space-y-2">
        <Label htmlFor="grossAmount">세전 금액 *</Label>
        <Input
          id="grossAmount"
          type="number"
          step="0.01"
          value={grossAmount}
          onChange={(e) => {
            setGrossAmount(e.target.value);
            setAutoCalc("net");
          }}
          placeholder="100000"
          disabled={isSubmitting}
        />
        {errors.grossAmount && (
          <p className="text-sm text-red-600">{errors.grossAmount}</p>
        )}
      </div>

      {/* Tax Auto-calculate */}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={calculate15Percent}
        disabled={!grossAmount || isSubmitting}
        className="w-full"
      >
        <Calculator className="mr-2 h-4 w-4" />
        15% 세금 자동 계산 (해외 배당)
      </Button>

      {/* Withholding Tax */}
      <div className="space-y-2">
        <Label htmlFor="withholdingTax">원천징수세</Label>
        <Input
          id="withholdingTax"
          type="number"
          step="0.01"
          value={withholdingTax}
          onChange={(e) => {
            setWithholdingTax(e.target.value);
            setAutoCalc("net");
          }}
          placeholder="15000"
          disabled={isSubmitting}
        />
      </div>

      {/* Net Amount */}
      <div className="space-y-2">
        <Label htmlFor="netAmount">세후 금액 (실수령액) *</Label>
        <Input
          id="netAmount"
          type="number"
          step="0.01"
          value={netAmount}
          onChange={(e) => {
            setNetAmount(e.target.value);
            setAutoCalc("tax");
          }}
          placeholder="85000"
          disabled={isSubmitting}
        />
        {errors.netAmount && (
          <p className="text-sm text-red-600">{errors.netAmount}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            취소
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isSubmitting}
        >
          초기화
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}

