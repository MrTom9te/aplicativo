// ==================== PEDIDOS ====================

import type { ApiResult } from "./api.types";
import type { ListParams, PaginationResponse } from "./pagination.types";

/**
 * Representa um endereço de entrega.
 */
export interface Address {
  /** Nome da rua, avenida, etc. */
  street: string;
  /** Número do estabelecimento. */
  number: string;
  /** Bairro. */
  neighborhood: string;
  /** Cidade. */
  city: string;
  /** Sigla do estado (ex: "AM"). */
  state: string;
  /** Código de Endereçamento Postal (CEP). */
  zipCode: string;
  /** Complemento opcional (ex: "Apto 123", "Bloco B"). */
  complement?: string;
}

/**
 * Representa os possíveis estágios de um pedido.
 */
export type OrderStatus =
  | "pending" // Aguardando confirmação da confeiteira
  | "confirmed" // Pedido foi confirmado
  | "production" // Pedido está sendo preparado
  | "ready" // Pedido pronto para retirada/entrega
  | "delivered" // Pedido foi entregue
  | "cancelled"; // Pedido foi cancelado

/**
 * Define se o pedido será entregue ou retirado no local.
 */
export type DeliveryType = "DELIVERY" | "PICKUP";

/**
 * Representa um pedido completo, com todos os detalhes.
 * Usado principalmente no aplicativo da confeiteira.
 */
export interface Order {
  /** Identificador único do pedido (UUID). */
  id: string;
  /** Número do pedido amigável para o cliente (ex: "PED-A1B-2511061430"). */
  orderNumber: string;
  /** Nome do cliente que fez o pedido. */
  customerName: string;
  /** Telefone do cliente. */
  customerPhone: string;
  /** Email do cliente. */
  customerEmail: string;
  /** CPF do cliente (11 dígitos, sem formatação). */
  customerTaxId: string; // CPF
  /** ID do produto comprado. */
  productId: string;
  /** Nome do produto (redundante para facilitar a exibição). */
  productName: string;
  /** Quantidade de produtos comprados. */
  quantity: number;
  /** Preço unitário do produto no momento da compra. */
  unitPrice: number;
  /** Preço total do pedido (unitPrice * quantity). */
  totalPrice: number;
  /** Data de entrega combinada (formato "YYYY-MM-DD"). */
  deliveryDate: string;
  /** Horário de entrega combinado (formato "14h" ou "14h30"). */
  deliveryTime: string;
  /** Define se é para entrega ou retirada. */
  deliveryType: DeliveryType; // Novo campo
  /** Objeto de endereço ou `null` se o `deliveryType` for `PICKUP`. */
  address?: Address | null; // Endereço agora é opcional e pode ser nulo
  /** Observações adicionais feitas pelo cliente. */
  observations?: string;
  /** O status atual do ciclo de vida do pedido. */
  status: OrderStatus;
  /** Data de criação do pedido no formato ISO 8601. */
  createdAt: string;
  /** Data da última atualização do pedido no formato ISO 8601. */
  updatedAt: string;
}

/**
 * Representa a visão simplificada que o cliente final vê na página pública de status do pedido.
 */
export interface OrderPublic {
  /** Identificador único do pedido (UUID). */
  id: string;
  /** Número do pedido amigável para o cliente. */
  orderNumber: string;
  /** Nome do cliente. */
  customerName: string;
  /** O status atual do pedido. */
  status: OrderStatus;
  /** Data de entrega combinada. */
  deliveryDate: string;
  /** Horário de entrega combinado. */
  deliveryTime: string;
  /** Data da última atualização de status. */
  updatedAt: string;
}

/**
 * Estrutura de dados que o site público deve enviar para a API para criar um novo pedido.
 */
export interface CreateOrderRequest {
  /** Nome do cliente. */
  customerName: string;
  /** Telefone do cliente. */
  customerPhone: string;
  /** Email do cliente. */
  customerEmail: string;
  /** CPF do cliente (11 dígitos, sem formatação). */
  customerTaxId: string;
  /** ID do produto sendo comprado. */
  productId: string;
  /** Quantidade de itens. */
  quantity: number;
  /** Data de entrega desejada (formato "YYYY-MM-DD"). */
  deliveryDate: string;
  /** Hora de entrega desejada (formato "14h" ou "14h30"). */
  deliveryTime: string;
  /** Opcional. Se não enviado, o padrão é "DELIVERY". */
  deliveryType?: DeliveryType; // Opcional, pois vamos usar 'DELIVERY' como padrão
  /** Opcional. Obrigatório se deliveryType for "DELIVERY". */
  address?: Address; // Opcional
  /** Observações do cliente (opcional). */
  observations?: string;
}

/**
 * Estrutura para a requisição de atualização de status de um pedido.
 */
export interface UpdateOrderStatusRequest {
  /** O novo status a ser aplicado ao pedido. */
  status: OrderStatus;
}

// Tipos específicos pra pedidos
export type OrdersResponse = PaginationResponse<Order>;
export type OrderResponse = ApiResult<Order>;
export type OrderPublicResponse = ApiResult<OrderPublic>;

/**
 * Parâmetros de consulta para a listagem de pedidos.
 */
export interface ListOrdersParams extends ListParams {
  /** Filtra os pedidos por um status específico. */
  status?: OrderStatus;
}

// ==================== ENUMS ====================

export enum OrderStatusEnum {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PRODUCTION = "production",
  READY = "ready",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export const OrderStatusLabel: Record<OrderStatus, string> = {
  pending: "Aguardando confirmação",
  confirmed: "Confirmado",
  production: "Em produção",
  ready: "Pronto",
  delivered: "Entregue",
  cancelled: "Cancelado",
};
