import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { DeliveryType } from "@/types/orders.types";

// Tipo para a loja, baseado na especificação da API
export interface Store {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  complement?: string;
  supportedDeliveryTypes: DeliveryType[];
  logoUrl?: string | null;
  themeColor?: string;
  layoutStyle?: "grid" | "list";
  fontFamily?: string;
}

// Tipo para o payload de atualização da loja
export interface UpdateStorePayload extends Partial<Store> {
  logoBase64?: string;
}

const api = axios.create({
  baseURL: "http://192.168.1.18:3000/api",
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");

  console.log(
    "Token encontrado pelo interceptor do Axios:",
    token ? "Encontrado" : "Não encontrado",
  );
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Busca os dados da loja da confeiteira autenticada.
 */
export const getStore = async (): Promise<Store> => {
  try {
    const response = await api.get<{ data: Store }>("/store");
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar dados da loja:", error);
    throw error;
  }
};

/**
 * Atualiza os dados da loja da confeiteira autenticada.
 * @param storeData - Um objeto com os campos da loja a serem atualizados.
 */
export const updateStore = async (
  storeData: UpdateStorePayload,
): Promise<Store> => {
  try {
    const response = await api.patch<{ data: Store }>("/store", storeData);
    return response.data.data;
  } catch (error) {
    console.error("Erro ao atualizar dados da loja:", error);
    throw error;
  }
};

export default api;
