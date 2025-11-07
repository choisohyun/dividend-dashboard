"use client";

import { useQuery, useMutation, useQueryClient } from "@tantml:react-query";
import {
  getAllDividends,
  getDividendsByDateRange,
  createDividend,
  updateDividend,
  deleteDividend,
} from "@/app/actions/dividends";
import type { InsertDividend } from "@/lib/db/schema";

export function useDividends() {
  return useQuery({
    queryKey: ["dividends"],
    queryFn: getAllDividends,
  });
}

export function useDividendsByDateRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["dividends", startDate, endDate],
    queryFn: () => getDividendsByDateRange(startDate, endDate),
    enabled: Boolean(startDate && endDate),
  });
}

export function useCreateDividend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<InsertDividend, "userId">) => createDividend(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dividends"] });
      queryClient.invalidateQueries({ queryKey: ["kpi"] });
    },
  });
}

export function useUpdateDividend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertDividend> }) =>
      updateDividend(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dividends"] });
      queryClient.invalidateQueries({ queryKey: ["kpi"] });
    },
  });
}

export function useDeleteDividend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDividend(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dividends"] });
      queryClient.invalidateQueries({ queryKey: ["kpi"] });
    },
  });
}

