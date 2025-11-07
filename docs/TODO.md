# TODO: Evolução para Arquitetura Multi-Tenant (Múltiplas Lojas)

Este documento descreve a evolução arquitetural necessária para transformar o sistema Doce Ponto de uma aplicação de inquilino único (single-tenant) para uma plataforma multi-inquilino (multi-tenant), onde cada confeiteira pode ter sua própria loja virtual independente.

## Cenário Atual

Atualmente, a API pública (`GET /api/public/products`) exibe todos os produtos ativos de todos os usuários cadastrados, criando uma vitrine única e compartilhada. Este modelo é funcional para o caso de uso inicial com a "Bolo dos Levis", mas não é escalável para múltiplos vendedores.

## Proposta de Evolução

Para suportar múltiplas lojas, a abordagem recomendada é a seguinte:

### 1. Identificador Único da Loja (Slug)

- **Ação:** Adicionar um campo `slug` ao modelo `User` no `prisma/schema.prisma`.
- **Detalhes:**
  - O `slug` deve ser uma string única, amigável para URLs (ex: `bolo-dos-levis`, `doces-da-maria`).
  - Deve ser validado para garantir que não haja duplicatas.
  - Pode ser gerado automaticamente a partir do nome do usuário/loja no momento do cadastro.

### 2. URLs Públicas por Loja

- **Ação:** Estruturar as URLs do site para refletir a loja específica.
- **Exemplo:**
  - **Antes:** `doceponto.com.br/`
  - **Depois:** `doceponto.com.br/loja/bolo-dos-levis`

### 3. Atualização das Rotas da API Pública

- **Ação:** Modificar as rotas em `src/routes/public.routes.ts` para aceitar o `slug` da loja como parâmetro.
- **Exemplos de Rotas:**
  - **Listar produtos:** `GET /api/public/loja/:slug/products`
  - **Criar pedido:** `POST /api/public/loja/:slug/orders`
  - **Consultar pedido:** A consulta de status de pedido (`/public/orders/:id`) pode permanecer como está, pois o ID do pedido já é único globalmente.

### 4. Lógica do Backend

- **Ação:** Atualizar os controladores no backend para usar o `slug`.
- **Detalhes:**
  - Em uma requisição para `.../loja/:slug/products`, o backend deve:
    1. Encontrar o `User` que possui o `slug` informado.
    2. Buscar os produtos que são `isActive: true` **E** que pertencem ao `userId` encontrado.
  - A criação de um pedido em `.../loja/:slug/orders` deve automaticamente associar o pedido ao `userId` correto.

Esta abordagem garante que os dados de cada confeiteira (produtos, pedidos) permaneçam isolados na vitrine pública, permitindo que a plataforma cresça para atender múltiplos vendedores.
