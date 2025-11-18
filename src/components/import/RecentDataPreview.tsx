"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/format/date";
import { formatKRW } from "@/lib/format/currency";
import { toast } from "sonner";

interface RecentDataPreviewProps<T> {
  data: T[];
  type: "transaction" | "dividend" | "cashflow";
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  limit?: number;
}

export function RecentDataPreview<T extends { id: string; [key: string]: any }>({
  data,
  type,
  onEdit,
  onDelete,
  limit = 10,
}: RecentDataPreviewProps<T>) {
  const displayData = data.slice(0, limit);

  const handleDelete = (id: string) => {
    if (confirm("삭제하시겠습니까?")) {
      onDelete?.(id);
      toast.success("삭제되었습니다");
    }
  };

  if (displayData.length === 0) {
    return (
      <div className="rounded-lg border bg-gray-50 p-8 text-center text-sm text-gray-500">
        최근 추가된 데이터가 없습니다
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <div className="border-b p-4">
        <h4 className="font-medium">최근 추가된 데이터</h4>
        <p className="text-xs text-gray-500 mt-1">최근 {limit}건</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>날짜</TableHead>
            {type === "transaction" && (
              <>
                <TableHead>종목</TableHead>
                <TableHead>유형</TableHead>
                <TableHead className="text-right">수량</TableHead>
                <TableHead className="text-right">가격</TableHead>
              </>
            )}
            {type === "dividend" && (
              <>
                <TableHead>종목</TableHead>
                <TableHead className="text-right">세전</TableHead>
                <TableHead className="text-right">세후</TableHead>
              </>
            )}
            {type === "cashflow" && (
              <>
                <TableHead>메모</TableHead>
                <TableHead className="text-right">금액</TableHead>
              </>
            )}
            <TableHead className="w-24">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-sm">
                {type === "transaction" && formatDate(item.tradeDate, "short")}
                {type === "dividend" && formatDate(item.payDate, "short")}
                {type === "cashflow" && formatDate(item.date, "short")}
              </TableCell>
              
              {type === "transaction" && (
                <>
                  <TableCell>
                    <Badge variant="secondary">{item.symbol}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.side === "BUY" ? "default" : "outline"}>
                      {item.side === "BUY" ? "매수" : item.side === "SELL" ? "매도" : "재투자"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {parseFloat(item.quantity).toLocaleString("ko-KR")}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {formatKRW(parseFloat(item.price))}
                  </TableCell>
                </>
              )}

              {type === "dividend" && (
                <>
                  <TableCell>
                    <Badge variant="secondary">{item.symbol}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {formatKRW(parseFloat(item.grossAmount))}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium text-blue-600">
                    {formatKRW(parseFloat(item.netAmount))}
                  </TableCell>
                </>
              )}

              {type === "cashflow" && (
                <>
                  <TableCell className="text-sm text-gray-600">
                    {item.memo || "-"}
                  </TableCell>
                  <TableCell className={`text-right text-sm font-medium ${item.amount > 0 ? "text-blue-600" : "text-red-600"}`}>
                    {item.amount > 0 ? "+" : ""}
                    {formatKRW(item.amount)}
                  </TableCell>
                </>
              )}

              <TableCell>
                <div className="flex gap-1">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(item)}
                      title="수정"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(item.id)}
                      title="삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

