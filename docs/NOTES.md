- **Passo 1: Modificar `schema.prisma`**
  - **Decisão:** Introduzir o modelo `Store` para encapsular produtos, pedidos e configurações de customização.
  - **Status:** Concluído.

- **Passo 2: Aplicar a Migração no Banco de Dados**
  - **Decisão:** Sincronizar o novo schema com o banco de dados.
  - **Status:** Concluído (presumido).

- **Passo 3: Ajustar API - Criação de Loja no Registro**
  - **Decisão:** Garantir que cada novo usuário tenha uma loja criada automaticamente.
  - **Status:** Concluído.

- **Passo 4: Ajustar API - Rotas de Produtos para Multi-Tenant**
  - **Decisão:** Refatorar todas as rotas de produtos (`/products`) para operar com base no `storeId`.
  - **Status:** Concluído.

- **Passo 5: Ajustar API - Rotas de Pedidos para Multi-Tenant**
  - **Decisão:** Refatorar as rotas de gerenciamento de pedidos (`/orders`) para que a confeiteira só possa ver e gerenciar os pedidos da sua própria loja.
  - **Status:** Concluído.

- **Passo 6: Criar API de Gerenciamento da Loja**
  - **Decisão:** Criar endpoints para que a confeiteira possa ver e atualizar as configurações de sua loja (nome, slug, cor do tema, etc.).
  - **Ação:** Criar um novo arquivo `store.routes.ts` e registrá-lo no `server.ts`.
  - **Status:** Concluído.