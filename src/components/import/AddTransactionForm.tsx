"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { formatDate, formatISODate } from "@/lib/format/date";
import { formatNumber } from "@/lib/format/currency";
import { cn } from "@/lib/utils";

interface AddTransactionFormProps {
  onSubmit: (data: {
    tradeDate: string;
    symbol: string;
    side: "BUY" | "SELL" | "DIVIDEND_REINVEST";
    quantity: string;
    price: string;
    feeTax: string;
  }) => Promise<void>;
  onCancel?: () => void;
  defaultSymbol?: string;
}

export function AddTransactionForm({
  onSubmit,
  onCancel,
  defaultSymbol,
}: AddTransactionFormProps) {
  const [tradeDate, setTradeDate] = useState<Date>(new Date());
  const [symbol, setSymbol] = useState(defaultSymbol || "");
  const [side, setSide] = useState<"BUY" | "SELL" | "DIVIDEND_REINVEST">("BUY");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [feeTax, setFeeTax] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!symbol.trim()) {
      newErrors.symbol = "종목을 입력하세요";
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      newErrors.quantity = "수량은 0보다 커야 합니다";
    }

    if (!price || parseFloat(price) <= 0) {
      newErrors.price = "가격은 0보다 커야 합니다";
    }

    if (feeTax && parseFloat(feeTax) < 0) {
      newErrors.feeTax = "수수료는 0 이상이어야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        tradeDate: formatISODate(tradeDate),
        symbol: symbol.trim(),
        side,
        quantity,
        price,
        feeTax: feeTax || "0",
      });

      // Reset form
      setSymbol(defaultSymbol || "");
      setQuantity("");
      setPrice("");
      setFeeTax("0");
      setErrors({});
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSymbol(defaultSymbol || "");
    setQuantity("");
    setPrice("");
    setFeeTax("0");
    setErrors({});
  };

  const totalAmount =
    quantity && price
      ? parseFloat(quantity) * parseFloat(price) + (parseFloat(feeTax) || 0)
      : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Trade Date */}
      <div className="space-y-2">
        <Label htmlFor="tradeDate">거래일</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !tradeDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {tradeDate ? formatDate(tradeDate, "long") : "날짜 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={tradeDate}
              onSelect={(date) => date && setTradeDate(date)}
            />
          </PopoverContent>
        </Popover>
      </div>

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

      {/* Side */}
      <div className="space-y-2">
        <Label htmlFor="side">거래 유형 *</Label>
        <Select
          value={side}
          onValueChange={(value) => setSide(value as typeof side)}
          disabled={isSubmitting}
        >
          <SelectTrigger id="side">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BUY">매수</SelectItem>
            <SelectItem value="SELL">매도</SelectItem>
            <SelectItem value="DIVIDEND_REINVEST">배당 재투자</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <Label htmlFor="quantity">수량 *</Label>
        <Input
          id="quantity"
          type="number"
          step="0.01"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="100"
          disabled={isSubmitting}
        />
        {errors.quantity && (
          <p className="text-sm text-red-600">{errors.quantity}</p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">가격 *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="30000"
          disabled={isSubmitting}
        />
        {errors.price && (
          <p className="text-sm text-red-600">{errors.price}</p>
        )}
      </div>

      {/* Fee/Tax */}
      <div className="space-y-2">
        <Label htmlFor="feeTax">수수료/세금</Label>
        <Input
          id="feeTax"
          type="number"
          step="0.01"
          value={feeTax}
          onChange={(e) => setFeeTax(e.target.value)}
          placeholder="0"
          disabled={isSubmitting}
        />
        {errors.feeTax && (
          <p className="text-sm text-red-600">{errors.feeTax}</p>
        )}
      </div>

      {/* Total Amount */}
      <div className="rounded-lg bg-gray-50 p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">총 금액</span>
          <span className="text-lg font-bold">
            ₩{formatNumber(totalAmount, 0)}
          </span>
        </div>
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

