# ConfeitApp - Especificação da API

## Base URL
```
http://localhost:3000/api
```

---

## 1. Autenticação

### 1.1 - Registro de Usuário
**Endpoint:** `POST /auth/register`

**Descrição:** Cria uma nova conta para uma confeiteira e, automaticamente, cria uma loja virtual associada a ela.

**Request Body:**
```json
{
  "name": "Maria Silva",
  "email": "maria@confeitaria.com",
  "password": "Senha123!",
  "phone": "5592999887766"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Maria Silva",
    "email": "maria@confeitaria.com",
    "phone": "5592999887766",
    "createdAt": "2025-10-11T15:30:00Z"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Email já registrado",
  "code": "DUPLICATE_EMAIL"
}
```

**Validações:**
- Email deve ser válido e único
- Senha mínimo 8 caracteres, pelo menos 1 número e 1 letra
- Nome não pode estar vazio
- Telefone deve ter 10-11 dígitos

---

### 1.2 - Login
**Endpoint:** `POST /auth/login`

**Descrição:** Autentica a confeiteira e retorna um token JWT para usar em requisições subsequentes.

**Request Body:**
```json
{
  "email": "maria@confeitaria.com",
  "password": "Senha123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Maria Silva",
      "email": "maria@confeitaria.com",
      "phone": "5592999887766"
    }
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Email ou senha incorretos",
  "code": "INVALID_CREDENTIALS"
}
```

**Validações:**
- Email e senha são obrigatórios
- Email deve estar registrado
- Senha deve corresponder

**Notas:**
- Token expira em 7 dias
- Usar header `Authorization: Bearer {token}` em requisições autenticadas

---

## 2. Produtos (Gerenciamento)

### 2.1 - Listar Todos os Produtos
**Endpoint:** `GET /products`

**Descrição:** Retorna lista de todos os produtos da confeiteira autenticada (ativos e inativos).

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Query Parameters (Opcionais):**
- `active` (boolean): Filtrar por status ativo/inativo
- `page` (number): Número da página (default: 1)
- `limit` (number): Itens por página (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Bolo de Chocolate",
      "description": "Delicioso bolo de chocolate com cobertura cremosa",
      "price": 45.00,
      "imageUrl": "http://localhost:3000/images/produto-1.jpg",
      "isActive": true,
      "createdAt": "2025-10-10T10:00:00Z",
      "updatedAt": "2025-10-11T15:30:00Z"
    }
  ],
  "total": 1,
  "page": 1
}
```

---

### 2.2 - Listar Produtos Ativos (Público)
**Endpoint:** `GET /public/products`

**Descrição:** Retorna apenas produtos ativos.
**Nota:** Este endpoint será **descontinuado** em favor de uma rota específica por loja (ex: `/public/loja/:slug/products`) para suportar a arquitetura de múltiplas lojas.

---

### 2.3 - Obter Detalhes de um Produto
**Endpoint:** `GET /products/:id`

**Descrição:** Retorna informações completas de um produto específico da loja da confeiteira.

---

### 2.4 - Criar Produto
**Endpoint:** `POST /products`

**Descrição:** Cria um novo produto no catálogo da confeiteira.

---

### 2.5 - Atualizar Produto
**Endpoint:** `PUT /products/:id`

**Descrição:** Atualiza informações de um produto existente.

---

### 2.6 - Deletar Produto
**Endpoint:** `DELETE /products/:id`

**Descrição:** Remove permanentemente um produto do catálogo.

---

### 2.7 - Ativar/Desativar Produto
**Endpoint:** `PATCH /products/:id/toggle`

**Descrição:** Alterna o status de um produto entre ativo e inativo.

---

## 3. Loja (Gerenciamento)

### 3.1 - Obter Detalhes da Loja
**Endpoint:** `GET /store`

**Descrição:** Retorna os detalhes e configurações da loja da confeiteira autenticada.

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "store_123",
    "name": "Doces da Maria",
    "slug": "doces-da-maria-a1b2c3",
    "ownerId": "user_123",
    "createdAt": "2025-11-12T10:00:00Z",
    "updatedAt": "2025-11-12T10:00:00Z",
    "street": "Rua das Flores",
    "number": "123",
    "neighborhood": "Centro",
    "city": "Manaus",
    "state": "AM",
    "zipCode": "69005010",
    "complement": "Apto 4B",
    "supportedDeliveryTypes": ["DELIVERY", "PICKUP"],
    "logoUrl": null,
    "themeColor": "#8A2BE2",
    "layoutStyle": "grid",
    "fontFamily": "Inter"
  }
}
```

---

### 3.2 - Atualizar Detalhes da Loja
**Endpoint:** `PATCH /store`

**Descrição:** Atualiza as configurações da loja da confeiteira (nome, slug, endereço, customizações).

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Request Body (enviar apenas os campos a serem alterados):**
```json
{
  "name": "Confeitaria da Maria",
  "themeColor": "#FFC0CB",
  "street": "Rua das Rosas",
  "number": "456",
  "supportedDeliveryTypes": ["PICKUP"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Loja atualizada com sucesso.",
  "data": {
    "id": "store_123",
    "name": "Confeitaria da Maria",
    "slug": "confeitaria-da-maria",
    "ownerId": "user_123",
    "themeColor": "#FFC0CB",
    "street": "Rua das Rosas"
  }
}
```

## 4. Pedidos

### 4.1 - Criar Pedido (Público)
**Endpoint:** `POST /public/orders`

**Descrição:** Cliente cria um novo pedido no site.
**Nota:** Este endpoint será **descontinuado** em favor de uma rota específica por loja (ex: `/public/loja/:slug/orders`) para suportar a arquitetura de múltiplas lojas.

---

### 4.2 - Listar Pedidos da Confeiteira
**Endpoint:** `GET /orders`

**Descrição:** Retorna todos os pedidos recebidos pela confeiteira.

---

### 4.3 - Obter Detalhes de um Pedido
**Endpoint:** `GET /orders/:id`

**Descrição:** Retorna informações completas de um pedido específico.

---

### 4.4 - Atualizar Status do Pedido
**Endpoint:** `PATCH /orders/:id/status`

**Descrição:** Confeiteira atualiza o status do pedido conforme a produção avança.

---

### 4.5 - Obter Status de um Pedido (Público)
**Endpoint:** `GET /public/orders/:id`

**Descrição:** Cliente consulta o status do seu pedido via número de pedido ou ID.
**Nota:** Este endpoint será reavaliado. A consulta de status provavelmente será feita através de uma rota específica da loja para manter a consistência.

---

## Estrutura de Resposta Padrão

### Sucesso
```json
{
  "success": true,
  "message": "Descrição do que aconteceu (opcional)",
  "data": {}
}
```

### Erro
```json
{
  "success": false,
  "error": "Descrição legível do erro",
  "code": "CODIGO_ERRO"
}
```

---

## Códigos de Erro Comuns

| Código | HTTP | Descrição |
|--------|------|-----------|
| UNAUTHORIZED | 401 | Token inválido ou expirado |
| FORBIDDEN | 403 | Não tem permissão para acessar |
| NOT_FOUND | 404 | Recurso não encontrado |
| STORE_NOT_FOUND | 404 | Loja não encontrada para o usuário |
| INVALID_INPUT | 400 | Dados de entrada inválidos |
| DUPLICATE_EMAIL | 400 | Email já registrado |
| DUPLICATE_SLUG | 400 | URL da loja já está em uso |
| INVALID_CREDENTIALS | 401 | Email ou senha incorretos |
| PRODUCT_NOT_FOUND | 404 | Produto não encontrado |
| ORDER_NOT_FOUND | 404 | Pedido não encontrado |
| INVALID_STATUS | 400 | Status de pedido inválido |

---

## Headers Padrão

**Em todas as requisições:**
```
Content-Type: application/json
```

**Em requisições autenticadas:**
```
Authorization: Bearer {token}
```

---

## Notas Importantes

1. **Arquitetura Multi-Loja:** A API foi refatorada para um modelo onde cada confeiteira possui sua própria loja. Todas as operações autenticadas (produtos, pedidos, etc.) são automaticamente filtradas para a loja do usuário logado.

2. **Endpoints Públicos:** Os endpoints públicos antigos (`/public/...`) serão substituídos por novas rotas que incluem um identificador da loja (`slug`), como `/public/loja/:slug/products`.

3. **Token JWT:** Válido por 7 dias. Após expiração, usuário precisa fazer login novamente.

4. **Upload de Imagens:** O aplicativo envia a imagem como uma string Base64 (`imageBase64`). O backend é responsável por decodificar essa string, salvar a imagem em seu sistema de arquivos e gerar uma URL pública (`imageUrl`) para servi-la.