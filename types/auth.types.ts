// ==================== AUTENTICAÇÃO ====================

import type { ApiResult } from "./api.types";

/**
 * Define a estrutura de dados para o registro de um novo usuário.
 */
export interface RegisterRequest {
  /** Nome completo do usuário. */
  name: string;
  /** Email para login, deve ser único. */
  email: string;
  /** Senha para login. */
  password: string;
  /** Telefone de contato do usuário. */
  phone: string;
}

/**
 * Define a estrutura de dados para a requisição de login.
 */
export interface LoginRequest {
  /** Email do usuário cadastrado. */
  email: string;
  /** Senha do usuário. */
  password: string;
}

/**
 * Representa os dados públicos de um usuário autenticado.
 */
export interface User {
  /** Identificador único do usuário (UUID). */
  id: string;
  /** Nome completo do usuário. */
  name: string;
  /** Email de contato e login. */
  email: string;
  /** Telefone de contato. */
  phone: string;
  /** Data de criação da conta (formato ISO 8601). */
  createdAt?: string;
}

/**
 * Representa os dados retornados no momento do login.
 */
export interface AuthData {
  /** Token JWT para autorização de requisições subsequentes. */
  token: string;
  /** Objeto com os dados do usuário autenticado. */
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

/**
 * Tipo específico para a resposta da API de autenticação.
 */
export type AuthResponse = ApiResult<AuthData>;

/**
 * (Frontend-specific) Define o contexto de autenticação para o app React.
 */
export interface AuthContext {
  /** O token JWT armazenado, ou nulo se não estiver logado. */
  token: string | null;
  /** O objeto do usuário logado, ou nulo. */
  user: User | null;
  /** `true` enquanto uma operação de autenticação está em andamento. */
  isLoading: boolean;
  /** Função para realizar o login. */
  signIn: (credentials: LoginRequest) => Promise<void>;
  /** Função para realizar o logout. */
  signOut: () => Promise<void>;
  /** Função para registrar um novo usuário. */
  signUp: (credentials: RegisterRequest) => Promise<void>;
}
