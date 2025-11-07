"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ColumnMapping } from "@/lib/csv/parser";

interface MappingPreviewProps {
  headers: string[];
  previewData: string[][];
  mapping: ColumnMapping;
  availableColumns: string[];
  onMappingChange: (csvHeader: string, dbColumn: string) => void;
}

export function MappingPreview({
  headers,
  previewData,
  mapping,
  availableColumns,
  onMappingChange,
}: MappingPreviewProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">열 매핑</h3>
        <div className="grid gap-2">
          {headers.map((header) => (
            <div key={header} className="flex items-center gap-4">
              <span className="text-sm w-32 text-gray-600">{header}</span>
              <span className="text-gray-400">→</span>
              <Select
                value={mapping[header] || ""}
                onValueChange={(value) => onMappingChange(header, value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="매핑할 컬럼 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">매핑 안함</SelectItem>
                  {availableColumns.map((col) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">데이터 미리보기 (첫 5행)</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.slice(0, 5).map((row, index) => (
                <TableRow key={index}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="text-sm">
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

