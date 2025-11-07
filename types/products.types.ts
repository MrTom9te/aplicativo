// ==================== PRODUTOS ====================

import type { ApiResult } from "./api.types";
import type { ListParams, PaginationResponse } from "./pagination.types";

/**
 * Representa um produto completo, com todos os detalhes,
 * como visto pela confeiteira no app de gerenciamento.
 */
export interface Product {
  /** Identificador único do produto (UUID). */
  id: string;
  /** Nome de exibição do produto. */
  name: string;
  /** Descrição detalhada que aparece para o cliente. */
  description: string;
  /** Preço de venda do produto. Ex: 45.50 */
  price: number;
  /** URL completa e pública para a imagem do produto. */
  imageUrl: string;
  /** Se `true`, o produto aparece na vitrine pública do site. */
  isActive: boolean;
  /** Data de criação do produto no formato ISO 8601. */
  createdAt: string;
  /** Data da última atualização do produto no formato ISO 8601. */
  updatedAt: string;
}

/**
 * Representa um produto na vitrine pública (site).
 * É uma versão simplificada do `Product`.
 */
export interface ProductPublic {
  /** Identificador único do produto (UUID). */
  id: string;
  /** Nome de exibição do produto. */
  name: string;
  /** Descrição detalhada do produto. */
  description: string;
  /** Preço de venda. */
  price: number;
  /** URL completa e pública para a imagem. */
  imageUrl: string;
  /** Data de criação do produto no formato ISO 8601. */
  createdAt: string;
}

/**
 * Estrutura para a requisição de criação de um novo produto.
 */
export interface CreateProductRequest {
  /** Nome do produto. */
  name: string;
  /** Descrição do produto. */
  description: string;
  /** Preço do produto. */
  price: number;
  /** Imagem do produto codificada em Base64. */
  imageBase64: string;
}

/**
 * Estrutura para a requisição de atualização de um produto.
 * Todos os campos são opcionais.
 */
export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  imageBase64?: string;
  isActive?: boolean;
}

/**
 * Estrutura para a requisição de ativação/desativação de um produto.
 */
export interface ToggleProductRequest {
  /** O novo status de ativação do produto. */
  isActive: boolean;
}

// Tipos específicos pra produtos
export type ProductsResponse = PaginationResponse<Product>;
export type ProductResponse = ApiResult<Product>;
export type ProductsPublicResponse = PaginationResponse<ProductPublic>;

/**
 * Parâmetros de consulta para a listagem de produtos.
 */
export interface ListProductsParams extends ListParams {
  /** Se `true`, retorna apenas produtos ativos. Se `false`, apenas inativos. Se não definido, retorna todos. */
  active?: boolean;
}
