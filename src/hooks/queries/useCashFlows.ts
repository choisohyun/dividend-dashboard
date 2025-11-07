"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCashFlows,
  getCashFlowsByDateRange,
  createCashFlow,
  updateCashFlow,
  deleteCashFlow,
} from "@/app/actions/cashflows";
import type { InsertCashFlow } from "@/lib/db/schema";

export function useCashFlows() {
  return useQuery({
    queryKey: ["cashflows"],
    queryFn: getAllCashFlows,
  });
}

export function useCashFlowsByDateRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["cashflows", startDate, endDate],
    queryFn: () => getCashFlowsByDateRange(startDate, endDate),
    enabled: Boolean(startDate && endDate),
  });
}

export function useCreateCashFlow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<InsertCashFlow, "userId">) => createCashFlow(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashflows"] });
      queryClient.invalidateQueries({ queryKey: ["kpi"] });
    },
  });
}

export function useUpdateCashFlow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertCashFlow> }) =>
      updateCashFlow(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashflows"] });
      queryClient.invalidateQueries({ queryKey: ["kpi"] });
    },
  });
}

export function useDeleteCashFlow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCashFlow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashflows"] });
      queryClient.invalidateQueries({ queryKey: ["kpi"] });
    },
  });
}

