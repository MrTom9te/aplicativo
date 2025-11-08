import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import {
  ApiResult,
  ErrorResponse,
  type SucessResponse,
} from "@/types/api.types";
import type {
  CreateProductRequest,
  Product,
  ToggleProductRequest,
  UpdateProductRequest,
} from "@/types/products.types";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get<SucessResponse<Product[]>>("/products");

      if (response.data.success && response.data.data) {
        setProducts(response.data.data);
      } else {
        throw new Error("Nao foi possivel  carregar os produtos.");
      }
    } catch (e: any) {
      console.error("Falha ao buscar produtos:", e);
      setError(e.message || "Ocorreu um erro na busaca ");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleProductStatus = async (productId: string, newStatus: boolean) => {
    const originalProducts = [...products];

    setProducts((currentProducts) =>
      currentProducts.map((p) =>
        p.id === productId ? { ...p, isActive: newStatus } : p,
      ),
    );

    try {
      await api.patch(
        `/products/${productId}/toggle `,
        {} as ToggleProductRequest,
      );
    } catch (e) {
      console.error("Falha ao atualizar o status do produto:", e);
      // Se a API falhar, reverte para o estado original
      setProducts(originalProducts);
      // Opcional: mostrar um alerta/toast de erro para o usuário
      alert("Não foi possível atualizar o status. Tente novamente.");
    }
  };

  const createProduct = async (
    productData: CreateProductRequest,
  ): Promise<void> => {
    try {
      const response = await api.post<SucessResponse<Product>>(
        "/products",
        productData,
      );

      if (response.data.success && response.data.data) {
        setProducts((currentProducts) => [
          response.data.data!,
          ...currentProducts,
        ]);
      } else {
        throw new Error(
          (response.data as any).error || "Falha ao criar o produto.",
        );
      }
    } catch (error) {
      console.error("ERRO AO CRIAR PRODUTO:", error);
      throw error;
    }
  };

  const updateProduct = async (
    productId: string,
    productData: UpdateProductRequest,
  ) => {
    try {
      const response = await api.put<SucessResponse<Product>>(
        `/products/${productId}`,
        productData,
      );

      if (response.data.success && response.data.data) {
        // Atualiza o produto na lista local
        setProducts((currentProducts) =>
          currentProducts.map((p) =>
            p.id === productId ? response.data.data! : p,
          ),
        );
      } else {
        throw new Error(
          (response.data as any).error || "Falha ao atualizar o produto.",
        );
      }
    } catch (e) {
      console.error("Erro ao atualizar produto:", e);
      throw e;
    }
  };

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    toggleProductStatus,
    createProduct,
  };
};
