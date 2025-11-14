import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import type { ApiResult } from "@/types/api.types";
import type { Order } from "@/types/orders.types";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get<ApiResult<Order[]>>("/orders");

      if (response.data.success) {
        // Ordena os pedidos por data de criação, os mais novos primeiro
        const sortedOrders = (response.data.data || []).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setOrders(sortedOrders);
      } else {
        // Se a resposta da API for um erro
        setError(
          response.data.error || "Não foi possível carregar os pedidos.",
        );
        setOrders([]); // Garante que a lista de pedidos esteja vazia em caso de erro
      }
    } catch (e: any) {
      console.error("Falha ao buscar pedidos:", e);
      setError(e.message || "Ocorreu um erro na busca de pedidos.");
      setOrders([]); // Garante que a lista de pedidos esteja vazia em caso de erro
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, isLoading, error, refetch: fetchOrders };
};

// Assumindo que seu serviço de API está aqui
export function useOrderDetails(orderId: string | string[] | undefined) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) {
      setIsLoading(false);
      setError("ID do pedido não fornecido.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<ApiResult<Order>>(`/orders/${orderId}`);
      if (response.data.success) {
        setOrder(response.data.data || null);
      } else {
        setError(
          response.data.error ||
            "Não foi possível carregar os detalhes do pedido.",
        );
        setOrder(null); // Garante que o pedido seja null em caso de erro
      }
    } catch (err: any) {
      setError(
        err.message ||
          "Falha ao buscar os detalhes do pedido. Tente novamente.",
      );
      console.error(err);
      setOrder(null); // Garante que o pedido seja null em caso de erro
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const updateOrderStatus = async (status: Order["status"]) => {
    if (!orderId) return;

    try {
      const response = await api.patch<ApiResult<Order>>(
        `/orders/${orderId}/status`,
        { status },
      );
      if (response.data.success) {
        setOrder(response.data.data || null); // Atualiza o pedido com a resposta da API
      } else {
        setError(
          response.data.error ||
            "Não foi possível atualizar o status do pedido.",
        );
      }
    } catch (err: any) {
      setError(err.message || "Falha ao atualizar o status do pedido.");
      console.error(err);
    }
  };

  return {
    order,
    isLoading,
    error,
    refetch: fetchOrderDetails,
    updateOrderStatus,
  };
}
