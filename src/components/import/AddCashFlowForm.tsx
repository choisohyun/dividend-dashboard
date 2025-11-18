"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { cn } from "@/lib/utils";

interface AddCashFlowFormProps {
  onSubmit: (data: {
    date: string;
    amount: number;
    memo: string | null;
  }) => Promise<void>;
  onCancel?: () => void;
}

export function AddCashFlowForm({ onSubmit, onCancel }: AddCashFlowFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [flowType, setFlowType] = useState<"deposit" | "withdrawal">("deposit");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const quickAmounts = [500000, 1000000, 2000000, 3000000];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "금액은 0보다 커야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const amountValue = parseFloat(amount);
      const finalAmount = flowType === "withdrawal" ? -amountValue : amountValue;

      await onSubmit({
        date: formatISODate(date),
        amount: finalAmount,
        memo: memo.trim() || null,
      });

      // Reset form
      setAmount("");
      setMemo("");
      setErrors({});
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Date */}
      <div className="space-y-2">
        <Label>날짜 *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? formatDate(date, "long") : "날짜 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label htmlFor="flowType">유형 *</Label>
        <Select
          value={flowType}
          onValueChange={(value) => setFlowType(value as typeof flowType)}
          disabled={isSubmitting}
        >
          <SelectTrigger id="flowType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deposit">입금</SelectItem>
            <SelectItem value="withdrawal">출금</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Amount Buttons */}
      <div className="space-y-2">
        <Label>빠른 입력</Label>
        <div className="grid grid-cols-2 gap-2">
          {quickAmounts.map((value) => (
            <Button
              key={value}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickAmount(value)}
              disabled={isSubmitting}
            >
              ₩{(value / 10000).toFixed(0)}만
            </Button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">금액 *</Label>
        <Input
          id="amount"
          type="number"
          step="1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="2000000"
          disabled={isSubmitting}
        />
        {errors.amount && (
          <p className="text-sm text-red-600">{errors.amount}</p>
        )}
      </div>

      {/* Memo */}
      <div className="space-y-2">
        <Label htmlFor="memo">메모 (선택)</Label>
        <Textarea
          id="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="월 정기입금"
          rows={2}
          disabled={isSubmitting}
        />
      </div>

      {/* Preview */}
      <div className="rounded-lg bg-gray-50 p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {flowType === "deposit" ? "입금" : "출금"}
          </span>
          <span className={cn(
            "text-lg font-bold",
            flowType === "deposit" ? "text-blue-600" : "text-red-600"
          )}>
            {flowType === "withdrawal" && "-"}₩{amount ? parseFloat(amount).toLocaleString("ko-KR") : "0"}
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
          onClick={() => {
            setAmount("");
            setMemo("");
            setErrors({});
          }}
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

