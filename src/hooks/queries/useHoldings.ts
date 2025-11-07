"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllHoldings,
  createHolding,
  updateHolding,
  deleteHolding,
} from "@/app/actions/holdings";
import type { InsertHolding } from "@/lib/db/schema";

export function useHoldings() {
  return useQuery({
    queryKey: ["holdings"],
    queryFn: getAllHoldings,
  });
}

export function useCreateHolding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<InsertHolding, "userId">) => createHolding(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holdings"] });
      queryClient.invalidateQueries({ queryKey: ["kpi"] });
    },
  });
}

export function useUpdateHolding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertHolding> }) =>
      updateHolding(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holdings"] });
      queryClient.invalidateQueries({ queryKey: ["kpi"] });
    },
  });
}

export function useDeleteHolding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteHolding(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holdings"] });
      queryClient.invalidateQueries({ queryKey: ["kpi"] });
    },
  });
}

