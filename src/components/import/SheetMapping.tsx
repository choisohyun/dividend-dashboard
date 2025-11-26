"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MappingPreview } from "./MappingPreview";
import { syncSheetData } from "@/app/actions/sync";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SheetMappingProps {
  config: {
    url: string;
    range: string;
    type: "transactions" | "dividends" | "cashflows";
    headers: string[];
    preview: string[][];
  };
  onBack: () => void;
  onComplete: () => void;
}

export function SheetMapping({ config, onBack, onComplete }: SheetMappingProps) {
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [isSyncing, setIsSyncing] = useState(false);

  const columnMappings = {
    transactions: ["trade_date", "symbol", "side", "quantity", "price", "fee_tax"],
    dividends: ["pay_date", "symbol", "ex_date", "gross_amount", "withholding_tax", "net_amount"],
    cashflows: ["date", "amount", "memo"],
  };

  // Auto-map columns with same names
  useEffect(() => {
    const initialMapping: Record<string, string> = {};
    const availableCols = columnMappings[config.type];

    config.headers.forEach((header) => {
      if (availableCols.includes(header)) {
        initialMapping[header] = header;
      }
    });

    setMapping(initialMapping);
  }, [config]);

  const handleMappingChange = (csvHeader: string, dbColumn: string) => {
    setMapping((prev) => ({ ...prev, [csvHeader]: dbColumn }));
  };

  const handleSync = async () => {
    // Validate required mappings
    const requiredCols = config.type === "transactions" 
      ? ["trade_date", "symbol", "side", "quantity", "price"]
      : config.type === "dividends"
      ? ["pay_date", "symbol", "gross_amount", "net_amount"]
      : ["date", "amount"];

    const mappedValues = Object.values(mapping);
    const missing = requiredCols.filter((col) => !mappedValues.includes(col));

    if (missing.length > 0) {
      toast.error(`필수 컬럼이 매핑되지 않았습니다: ${missing.join(", ")}`);
      return;
    }

    setIsSyncing(true);

    try {
      const result = await syncSheetData(
        config.url,
        config.range,
        config.type,
        mapping
      );

      if (result.success) {
        toast.success(
          `동기화 완료! 총 ${result.total}건 중 ${result.imported}건 성공`
        );
        if (result.failed > 0) {
          toast.warning(`${result.failed}건 실패 (형식 오류 등)`);
        }
        onComplete();
      }
    } catch (error: any) {
      console.error("Sync error:", error);
      toast.error(`동기화 실패: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">매핑 확인</p>
        <p>구글 시트의 컬럼을 데이터베이스 필드와 연결해주세요.</p>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <MappingPreview
          headers={config.headers}
          previewData={config.preview}
          mapping={mapping}
          availableColumns={columnMappings[config.type]}
          onMappingChange={handleMappingChange}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onBack} disabled={isSyncing}>
          이전
        </Button>
        <Button onClick={handleSync} disabled={isSyncing}>
          {isSyncing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              동기화 중...
            </>
          ) : (
            "동기화 시작"
          )}
        </Button>
      </div>
    </div>
  );
}

