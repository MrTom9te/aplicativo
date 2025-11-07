// ==================== TIPOS GENÉRICOS ====================

/**
 * Representa uma resposta de sucesso da API.
 * @template T O tipo de dado principal retornado.
 */
export interface SucessResponse<T> {
  /** Indica que a operação foi bem-sucedida. */
  success: true;
  /** Mensagem opcional descrevendo o sucesso da operação. */
  message?: string;
  /** O payload de dados da resposta. */
  data?: T;
}
/**
 * Representa uma resposta de erro da API.
 */
export interface ErrorResponse {
  /** Indica que a operação falhou. */
  success: false;
  /** Mensagem legível descrevendo o erro. */
  error: string;
  /** Código de erro padronizado para tratamento no frontend. */
  code: string;
}

/**
 * O resultado de uma chamada de API, que pode ser um sucesso ou um erro.
 * @template T O tipo de dado esperado em caso de sucesso.
 */
export type ApiResult<T> = SucessResponse<T> | ErrorResponse;
