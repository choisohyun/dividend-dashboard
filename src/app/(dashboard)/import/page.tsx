"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CsvUploader } from "@/components/import/CsvUploader";
import { MappingPreview } from "@/components/import/MappingPreview";
import { UploadProgress } from "@/components/import/UploadProgress";
import {
  readCsvFile,
  parseCsvContent,
  extractHeaders,
  mapCsvToObjects,
  validateTransactionRow,
  validateDividendRow,
  validateCashFlowRow,
  type ColumnMapping,
  type CsvParseResult,
} from "@/lib/csv/parser";
import { importTransactions, importDividends, importCashFlows } from "@/app/actions/import";

type ImportType = "transactions" | "dividends" | "cashflows";

export default function ImportPage() {
  const [activeTab, setActiveTab] = useState<ImportType>("transactions");
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [parseResult, setParseResult] = useState<CsvParseResult<any> | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const columnMappings = {
    transactions: ["trade_date", "symbol", "side", "quantity", "price", "fee_tax"],
    dividends: ["pay_date", "symbol", "ex_date", "gross_amount", "withholding_tax", "net_amount"],
    cashflows: ["date", "amount", "memo"],
  };

  const defaultMappings = {
    transactions: {
      trade_date: "trade_date",
      symbol: "symbol",
      side: "side",
      quantity: "quantity",
      price: "price",
      fee_tax: "fee_tax",
    },
    dividends: {
      pay_date: "pay_date",
      symbol: "symbol",
      ex_date: "ex_date",
      gross_amount: "gross_amount",
      withholding_tax: "withholding_tax",
      net_amount: "net_amount",
    },
    cashflows: {
      date: "date",
      amount: "amount",
      memo: "memo",
    },
  };

  const handleFileSelect = async (selectedFile: File) => {
    try {
      setFile(selectedFile);
      const content = await readCsvFile(selectedFile);
      const rows = parseCsvContent(content);
      const csvHeaders = extractHeaders(rows);
      
      setHeaders(csvHeaders);
      setPreviewData(rows.slice(1));
      setMapping(defaultMappings[activeTab]);
      setParseResult(null);
    } catch (error) {
      console.error("File read error:", error);
      alert("파일 읽기 실패");
    }
  };

  const handleMappingChange = (csvHeader: string, dbColumn: string) => {
    setMapping((prev) => ({ ...prev, [csvHeader]: dbColumn }));
  };

  const handleUpload = async () => {
    if (!file || headers.length === 0) return;

    setIsUploading(true);

    try {
      const content = await readCsvFile(file);
      const rows = parseCsvContent(content);

      let result: CsvParseResult<any>;
      
      if (activeTab === "transactions") {
        result = mapCsvToObjects(rows, mapping, validateTransactionRow);
        if (result.data.length > 0) {
          await importTransactions(result.data);
        }
      } else if (activeTab === "dividends") {
        result = mapCsvToObjects(rows, mapping, validateDividendRow);
        if (result.data.length > 0) {
          await importDividends(result.data);
        }
      } else {
        result = mapCsvToObjects(rows, mapping, validateCashFlowRow);
        if (result.data.length > 0) {
          await importCashFlows(result.data);
        }
      }

      setParseResult(result);
    } catch (error) {
      console.error("Upload error:", error);
      alert("업로드 실패: " + (error instanceof Error ? error.message : "알 수 없는 오류"));
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = (type: ImportType) => {
    const templates = {
      transactions: "trade_date,symbol,side,quantity,price,fee_tax\n2025-01-05,KOSEF_배당,BUY,10,11250,0",
      dividends: "pay_date,symbol,ex_date,gross_amount,withholding_tax,net_amount\n2025-03-15,KOSEF_배당,2025-03-10,3400,340,3060",
      cashflows: "date,amount,memo\n2025-01-02,2000000,월 정기입금",
    };

    const blob = new Blob([templates[type]], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">데이터 임포트</h1>
        <p className="text-gray-600">CSV 파일을 업로드하여 거래/배당/입금 내역 추가</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => {
        setActiveTab(v as ImportType);
        setFile(null);
        setHeaders([]);
        setPreviewData([]);
        setParseResult(null);
      }}>
        <TabsList>
          <TabsTrigger value="transactions">거래내역</TabsTrigger>
          <TabsTrigger value="dividends">배당내역</TabsTrigger>
          <TabsTrigger value="cashflows">입금내역</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">거래내역 업로드</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadTemplate("transactions")}
              >
                <Download className="mr-2 h-4 w-4" />
                템플릿 다운로드
              </Button>
            </div>
            <CsvUploader onFileSelect={handleFileSelect} disabled={isUploading} />
          </div>

          {headers.length > 0 && (
            <div className="rounded-lg border bg-white p-6">
              <MappingPreview
                headers={headers}
                previewData={previewData}
                mapping={mapping}
                availableColumns={columnMappings.transactions}
                onMappingChange={handleMappingChange}
              />
              <Button
                className="mt-4"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? "업로드 중..." : "업로드"}
              </Button>
            </div>
          )}

          {parseResult && (
            <div className="rounded-lg border bg-white p-6">
              <UploadProgress
                totalRows={parseResult.totalRows}
                successCount={parseResult.successCount}
                failCount={parseResult.failCount}
                errors={parseResult.errors}
                isComplete={!isUploading}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="dividends" className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">배당내역 업로드</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadTemplate("dividends")}
              >
                <Download className="mr-2 h-4 w-4" />
                템플릿 다운로드
              </Button>
            </div>
            <CsvUploader onFileSelect={handleFileSelect} disabled={isUploading} />
          </div>

          {headers.length > 0 && (
            <div className="rounded-lg border bg-white p-6">
              <MappingPreview
                headers={headers}
                previewData={previewData}
                mapping={mapping}
                availableColumns={columnMappings.dividends}
                onMappingChange={handleMappingChange}
              />
              <Button
                className="mt-4"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? "업로드 중..." : "업로드"}
              </Button>
            </div>
          )}

          {parseResult && (
            <div className="rounded-lg border bg-white p-6">
              <UploadProgress
                totalRows={parseResult.totalRows}
                successCount={parseResult.successCount}
                failCount={parseResult.failCount}
                errors={parseResult.errors}
                isComplete={!isUploading}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="cashflows" className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">입금내역 업로드</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadTemplate("cashflows")}
              >
                <Download className="mr-2 h-4 w-4" />
                템플릿 다운로드
              </Button>
            </div>
            <CsvUploader onFileSelect={handleFileSelect} disabled={isUploading} />
          </div>

          {headers.length > 0 && (
            <div className="rounded-lg border bg-white p-6">
              <MappingPreview
                headers={headers}
                previewData={previewData}
                mapping={mapping}
                availableColumns={columnMappings.cashflows}
                onMappingChange={handleMappingChange}
              />
              <Button
                className="mt-4"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? "업로드 중..." : "업로드"}
              </Button>
            </div>
          )}

          {parseResult && (
            <div className="rounded-lg border bg-white p-6">
              <UploadProgress
                totalRows={parseResult.totalRows}
                successCount={parseResult.successCount}
                failCount={parseResult.failCount}
                errors={parseResult.errors}
                isComplete={!isUploading}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}



