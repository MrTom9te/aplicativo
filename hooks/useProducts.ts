import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { ApiResult, ErrorResponse } from "@/types/api.types";
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

      const response = await api.get<ApiResult<Product[]>>("/products");

      if (response.data.success) {
        setProducts(response.data.data || []);
      } else {
        setError(
          (response.data as ErrorResponse).error ||
            "Não foi possível carregar os produtos.",
        );
        setProducts([]); // Esvazia a lista de produtos em caso de erro
      }
    } catch (e: any) {
      console.error("Falha ao buscar produtos:", e);
      setError(e.message || "Ocorreu um erro na busaca ");
      setProducts([]); // Esvazia a lista de produtos em caso de erro
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
    } catch (e: any) {
      console.error("Falha ao atualizar o status do produto:", e);
      setError(
        e.message ||
          "Não foi possível atualizar o status do produto. Tente novamente.",
      );
      setProducts(originalProducts); // Reverte para o estado original em caso de erro
    }
  };

  const createProduct = async (
    productData: CreateProductRequest,
  ): Promise<void> => {
    try {
      const response = await api.post<ApiResult<Product>>(
        "/products",
        productData,
      );

      if (response.data.success) {
        setProducts((currentProducts) => [
          response.data.data! || ({} as Product),
          ...currentProducts,
        ]);
      } else {
        setError(
          (response.data as ErrorResponse).error || "Falha ao criar o produto.",
        );
      }
    } catch (e: any) {
      console.error("ERRO AO CRIAR PRODUTO:", e);
      setError(e.message || "Falha ao criar o produto.");
      // Não alteramos a lista de produtos, o componente chamador pode decidir como lidar com o erro.
    }
  };

  const updateProduct = async (
    productId: string,
    productData: UpdateProductRequest,
  ) => {
    try {
      const response = await api.put<ApiResult<Product>>(
        `/products/${productId}`,
        productData,
      );

      if (response.data.success) {
        setProducts((currentProducts) =>
          currentProducts.map((p) =>
            p.id === productId ? response.data.data! || ({} as Product) : p,
          ),
        );
      } else {
        setError(
          (response.data as ErrorResponse).error ||
            "Falha ao atualizar o produto.",
        );
      }
    } catch (e: any) {
      console.error("Erro ao atualizar produto:", e);
      setError(e.message || "Falha ao atualizar o produto.");
      // Não revertemos a lista de produtos, o componente chamador pode decidir como lidar com o erro.
    }
  };

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    toggleProductStatus,
    createProduct,
    updateProduct,
  };
};
