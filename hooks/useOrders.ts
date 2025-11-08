import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import type { SucessResponse } from "@/types/api.types";
import type { Order } from "@/types/orders.types";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get<SucessResponse<Order[]>>("/orders");

      if (response.data.success && response.data.data) {
        // Ordena os pedidos por data de criação, os mais novos primeiro
        const sortedOrders = response.data.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setOrders(sortedOrders);
      } else {
        throw new Error("Não foi possível carregar os pedidos.");
      }
    } catch (e: any) {
      console.error("Falha ao buscar pedidos:", e);
      setError(e.message || "Ocorreu um erro na busca de pedidos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, isLoading, error, refetch: fetchOrders };
};
