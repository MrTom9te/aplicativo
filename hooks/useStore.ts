import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import type { ApiResult } from "@/types/api.types";
import type { Store, UpdateStoreRequest } from "@/types/store.types";

export function useStore() {
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStore = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get<ApiResult<Store>>("/store");

      if (response.data.success) {
        setStore(response.data.data || null);
      } else {
        setError(response.data.error || "Não foi possível carregar a loja.");
        setStore(null);
      }
    } catch (e: any) {
      console.error("Falha ao buscar loja:", e);
      setError(e.message || "Ocorreu um erro ao carregar a loja.");
      setStore(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  const updateStore = useCallback(async (payload: UpdateStoreRequest) => {
    try {
      const response = await api.patch<ApiResult<Store>>("/store", payload);
      if (response.data.success) {
        setStore(response.data.data || null);
        return { ok: true as const, data: response.data.data || null };
      }
      return {
        ok: false as const,
        error: response.data.error,
        code: response.data.code,
      };
    } catch (e: any) {
      console.error("Falha ao atualizar loja:", e);
      return { ok: false as const, error: e.message as string, code: "UNKNOWN" };
    }
  }, []);

  return { store, isLoading, error, refetch: fetchStore, updateStore };
}
