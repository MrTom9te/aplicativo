// ==================== TIPOS GENÉRICOS ====================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

// Helper pra verificar se é sucesso
export function isSuccess<T>(result: ApiResult<T>): result is ApiResponse<T> {
  return result.success === true;
}

// Helper pra verificar se é erro
export function isError<T>(result: ApiResult<T>): result is ApiErrorResponse {
  return result.success === false;
}

// ==================== PAGINAÇÃO ====================

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
}

export interface ListParams {
  page?: number;
  limit?: number;
}

// ==================== AUTENTICAÇÃO ====================

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
}

export interface AuthData {
  token: string;
  user: User;
}

// Sobrescreve ApiResponse pra auth
export type AuthResponse = ApiResponse<AuthData>;

export interface AuthContext {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: LoginRequest) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (credentials: RegisterRequest) => Promise<void>;
}

// ==================== PRODUTOS ====================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPublic {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
}

export interface ToggleProductRequest {
  isActive: boolean;
}

// Tipos específicos pra produtos
export type ProductsResponse = PaginatedResponse<Product>;
export type ProductResponse = ApiResponse<Product>;
export type ProductsPublicResponse = PaginatedResponse<ProductPublic>;

export interface ListProductsParams extends ListParams {
  active?: boolean;
}

// ==================== PEDIDOS ====================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "production"
  | "ready"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryDate: string;
  deliveryTime: string;
  observations?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderPublic {
  id: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  deliveryDate: string;
  deliveryTime: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  productId: string;
  quantity: number;
  deliveryDate: string;
  deliveryTime: string;
  observations?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// Tipos específicos pra pedidos
export type OrdersResponse = PaginatedResponse<Order>;
export type OrderResponse = ApiResponse<Order>;
export type OrderPublicResponse = ApiResponse<OrderPublic>;

export interface ListOrdersParams extends ListParams {
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
