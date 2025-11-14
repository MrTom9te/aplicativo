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

      const {data} = await api.get<ApiResult<Product[]>>("/products");

      if (data.success) {
        setProducts(data.data || []);
      } else {
        setError(
          (data as ErrorResponse).error ||
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
    console.log("[toggle] called", { productId, newStatus });
    const originalProducts = [...products];

    setProducts((currentProducts) =>
      currentProducts.map((p) =>
        p.id === productId ? { ...p, isActive: newStatus } : p,
      ),
    );

    try {
      console.log("[toggle] calling api.patch", `/products/${productId}/toggle`);
     const {data} = await api.patch(
        `/products/${productId}/toggle`,
        {isActive: newStatus},
      );
      console.log("[toggle] api.patch done");
      if (data.success) {
        setProducts((currentProducts) =>
          currentProducts.map((p) =>
            p.id === productId ? { ...p, isActive: newStatus } : p,
          ),
        );
      } else {
        setError(
          (data as ErrorResponse).error ||
            "Não foi possível atualizar o status do produto.",
        );
        setProducts(originalProducts); // Reverte para o estado original em caso de erro
      }
    } catch (e: any) {
      console.log("[toggle] api.patch error", e);
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
       console.log("[create] calling api.post");
      const {data} = await api.post<ApiResult<Product>>(
        "/products",
        productData,
      );
      console.log("[create] api.post done");
      if (data.success) {
        setProducts((currentProducts) => [
        data.data! || ({} as Product),
          ...currentProducts,
        ]);
      } else {
        setError(
          (data as ErrorResponse).error || "Falha ao criar o produto.",
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
      const {data} = await api.put<ApiResult<Product>>(
        `/products/${productId}`,
        productData,
      );

      console.log("Produto atualizado com sucesso:", JSON.stringify(data));
      
      if (data.success) {
        setProducts((currentProducts) =>
          currentProducts.map((p) =>
            p.id === productId ? data.data! || ({} as Product) : p,
          ),
        );
        console.log("Produto atualizado com sucesso:", JSON.stringify(data.data));
      } else {

        console.error("Falha ao atualizar o produto:", JSON.stringify(data));
        setError(
          (data as ErrorResponse).error ||
            "Falha ao atualizar o produto.",
        );
      }
      
    } catch (e: any) {
      console.error("Erro ao atualizar produto:", e);
      setError(e.message || "Falha ao atualizar o produto.");
     
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
