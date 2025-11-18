"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { AddTransactionForm } from "./AddTransactionForm";
import { AddDividendForm } from "./AddDividendForm";
import { AddCashFlowForm } from "./AddCashFlowForm";
import { useCreateTransaction } from "@/hooks/queries/useTransactions";
import { useCreateDividend } from "@/hooks/queries/useDividends";
import { useCreateCashFlow } from "@/hooks/queries/useCashFlows";
import { toast } from "sonner";

interface AddDataDialogProps {
  defaultTab?: "transaction" | "dividend" | "cashflow";
  trigger?: React.ReactNode;
}

export function AddDataDialog({ defaultTab = "transaction", trigger }: AddDataDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);

  const createTransaction = useCreateTransaction();
  const createDividend = useCreateDividend();
  const createCashFlow = useCreateCashFlow();

  const handleTransactionSubmit = async (data: any) => {
    try {
      await createTransaction.mutateAsync(data);
      toast.success("거래 내역이 추가되었습니다");
      setOpen(false);
    } catch (error) {
      toast.error("거래 추가 실패");
      throw error;
    }
  };

  const handleDividendSubmit = async (data: any) => {
    try {
      await createDividend.mutateAsync(data);
      toast.success("배당 내역이 추가되었습니다");
      setOpen(false);
    } catch (error) {
      toast.error("배당 추가 실패");
      throw error;
    }
  };

  const handleCashFlowSubmit = async (data: any) => {
    try {
      await createCashFlow.mutateAsync(data);
      toast.success("입출금 내역이 추가되었습니다");
      setOpen(false);
    } catch (error) {
      toast.error("입출금 추가 실패");
      throw error;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            수동 추가
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>데이터 추가</DialogTitle>
          <DialogDescription>
            거래, 배당, 입출금 내역을 직접 입력하세요
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transaction">거래</TabsTrigger>
            <TabsTrigger value="dividend">배당</TabsTrigger>
            <TabsTrigger value="cashflow">입금</TabsTrigger>
          </TabsList>

          <TabsContent value="transaction" className="mt-4">
            <AddTransactionForm
              onSubmit={handleTransactionSubmit}
              onCancel={() => setOpen(false)}
            />
          </TabsContent>

          <TabsContent value="dividend" className="mt-4">
            <AddDividendForm
              onSubmit={handleDividendSubmit}
              onCancel={() => setOpen(false)}
            />
          </TabsContent>

          <TabsContent value="cashflow" className="mt-4">
            <AddCashFlowForm
              onSubmit={handleCashFlowSubmit}
              onCancel={() => setOpen(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

