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

---

# TODO: Evolução para Aplicativo Unificado (Cliente e Confeiteira)

Este documento descreve a proposta para criar um único aplicativo móvel que atenda tanto aos **clientes** quanto às **confeiteiras**, adaptando sua interface e funcionalidades com base no papel do usuário logado (Role-Based Access Control).

## 1. Alterações na API (Backend)

### 1.1. Modelo de Usuário Unificado
- **Ação:** Unificar os modelos `User` e `Client` em um único modelo `User` no `prisma/schema.prisma`.
- **Detalhes:**
  - Adicionar um campo `role` do tipo `UserRole` (um enum com os valores `CLIENT` e `BAKER`).
  - O `role` definirá as permissões do usuário em todo o sistema.
  - O modelo `Order` deve ser atualizado para ter um `clientId` e um `bakerId`, ambos ligados ao modelo `User`.

### 1.2. Autenticação e Autorização
- **Ação:** Adaptar o sistema de autenticação e criar middlewares de autorização.
- **Detalhes:**
  - O endpoint de login (`POST /api/auth/login`) deve retornar o `role` do usuário no payload da resposta.
  - Criar um middleware de autorização que verifique o `role` do usuário (extraído do token JWT) antes de permitir o acesso a rotas protegidas.
  - Exemplo: A rota para criar um produto (`POST /api/products`) deve exigir o `role: "BAKER"`. A rota para ver o histórico de pedidos (`GET /api/client/orders`) deve exigir o `role: "CLIENT"`.

## 2. Estrutura do Aplicativo Móvel (Frontend)

### 2.1. Navegação Baseada em Papel
- **Ação:** Criar uma estrutura de navegação que renderize diferentes conjuntos de telas com base no `role` do usuário.
- **Detalhes:**
  - Um `RootNavigator` verificará o `role` do usuário após o login.
  - Se `role === 'BAKER'`, renderiza o `BakerNavigator` (com as telas de gestão).
  - Se `role === 'CLIENT'`, renderiza o `ClientNavigator` (com as telas de compra).
  - A estrutura de pastas deve refletir essa separação (ex: `src/screens/baker` e `src/screens/client`).

## 3. Funcionalidades para o App do Cliente

### 3.1. Funcionalidades Essenciais (MVP)
- **Autenticação de Cliente:** Telas de login e registro para clientes.
- **Perfil de Usuário:** Permitir que o cliente salve e edite seus dados (nome, telefone).
- **Gestão de Endereços:** Salvar um ou mais endereços de entrega.
- **Carrinho de Compras:** Adicionar múltiplos produtos ao carrinho antes de finalizar o pedido.
- **Histórico de Pedidos:** Listar todos os pedidos feitos pelo cliente.

### 3.2. Funcionalidades Avançadas ("Bacaninhas")
- **Notificações Push:** Enviar atualizações sobre o status do pedido ("Seu pedido foi confirmado!", "Saiu para entrega!") e notificações de marketing.
- **Refazer Pedido:** Botão para adicionar rapidamente os itens de um pedido antigo ao carrinho.
- **Lista de Favoritos:** Permitir que clientes "favorite" produtos para fácil acesso.
- **Programa de Fidelidade:** Sistema de pontos ou recompensas por compras recorrentes.
- **Pagamentos Salvos:** Integrar com um gateway de pagamento para salvar os dados do cliente de forma segura (tokenização) e agilizar o checkout.

