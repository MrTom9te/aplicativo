# ConfeitApp - Especificação da API

## Base URL
```
http://localhost:3000/api
```

---

## 1. Autenticação

### 1.1 - Registro de Usuário
**Endpoint:** `POST /auth/register`

**Descrição:** Cria uma nova conta para uma confeiteira. Registra nome, email, senha e telefone.

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

## 2. Produtos

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
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440002",
      "name": "Bolo de Morango",
      "description": "Bolo com morangos frescos",
      "price": 50.00,
      "imageUrl": "http://localhost:3000/images/produto-2.jpg",
      "isActive": true,
      "createdAt": "2025-10-10T11:00:00Z",
      "updatedAt": "2025-10-10T11:00:00Z"
    }
  ],
  "total": 2,
  "page": 1
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Token inválido ou expirado",
  "code": "UNAUTHORIZED"
}
```

---

### 2.2 - Listar Produtos Ativos (Público)
**Endpoint:** `GET /public/products`

**Descrição:** Retorna apenas produtos ativos. Esse endpoint é público (sem autenticação). Usado pelo site web para exibir catálogo.

**Query Parameters (Opcionais):**
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
      "createdAt": "2025-10-10T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1
}
```

---

### 2.3 - Obter Detalhes de um Produto
**Endpoint:** `GET /products/:id`

**Descrição:** Retorna informações completas de um produto específico.

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**URL Parameters:**
- `id` (string): UUID do produto

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Bolo de Chocolate",
    "description": "Delicioso bolo de chocolate com cobertura cremosa",
    "price": 45.00,
    "imageUrl": "http://localhost:3000/images/produto-1.jpg",
    "isActive": true,
    "createdAt": "2025-10-10T10:00:00Z",
    "updatedAt": "2025-10-11T15:30:00Z"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Produto não encontrado",
  "code": "PRODUCT_NOT_FOUND"
}
```

---

### 2.4 - Criar Produto
**Endpoint:** `POST /products`

**Descrição:** Cria um novo produto no catálogo da confeiteira. A imagem deve ser enviada como uma string em formato Base64.

**Headers Requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Bolo de Chocolate",
  "description": "Delicioso bolo de chocolate com cobertura cremosa",
  "price": 45.00,
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Produto criado com sucesso",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Bolo de Chocolate",
    "description": "Delicioso bolo de chocolate com cobertura cremosa",
    "price": 45.00,
    "imageUrl": "http://localhost:3000/images/produto-novo-1.jpg",
    "isActive": true,
    "createdAt": "2025-10-11T15:30:00Z",
    "updatedAt": "2025-10-11T15:30:00Z"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Nome do produto é obrigatório",
  "code": "INVALID_INPUT"
}
```

**Validações:**
- Nome: obrigatório, 2-100 caracteres
- Description: obrigatório, máximo 500 caracteres
- Price: obrigatório, número positivo com máximo 2 casas decimais
- imageBase64: opcional, deve ser uma string Base64 válida

---

### 2.5 - Atualizar Produto
**Endpoint:** `PUT /products/:id`

**Descrição:** Atualiza informações de um produto existente. Para alterar a imagem, envie uma nova string `imageBase64`.

**Headers Requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**URL Parameters:**
- `id` (string): UUID do produto

**Request Body (todos opcionais):**
```json
{
  "name": "Bolo de Chocolate Premium",
  "description": "Novo bolo de chocolate com ingredientes premium",
  "price": 55.00,
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSk..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Produto atualizado com sucesso",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Bolo de Chocolate Premium",
    "description": "Novo bolo de chocolate com ingredientes premium",
    "price": 55.00,
    "imageUrl": "http://localhost:3000/images/produto-atualizado-1.jpg",
    "isActive": true,
    "createdAt": "2025-10-10T10:00:00Z",
    "updatedAt": "2025-10-11T16:00:00Z"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Produto não encontrado",
  "code": "PRODUCT_NOT_FOUND"
}
```

---

### 2.6 - Deletar Produto
**Endpoint:** `DELETE /products/:id`

**Descrição:** Remove permanentemente um produto do catálogo. O backend também deve remover o arquivo de imagem associado.

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**URL Parameters:**
- `id` (string): UUID do produto

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Produto deletado com sucesso"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Produto não encontrado",
  "code": "PRODUCT_NOT_FOUND"
}
```

---

### 2.7 - Ativar/Desativar Produto
**Endpoint:** `PATCH /products/:id/toggle`

**Descrição:** Alterna o status de um produto entre ativo e inativo sem deletá-lo. Produto inativo não aparece no site.

**Headers Requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**URL Parameters:**
- `id` (string): UUID do produto

**Request Body:**
```json
{
  "isActive": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Status do produto atualizado",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Bolo de Chocolate",
    "description": "Delicioso bolo de chocolate com cobertura cremosa",
    "price": 45.00,
    "imageUrl": "http://localhost:3000/images/produto-1.jpg",
    "isActive": false,
    "updatedAt": "2025-10-11T16:15:00Z"
  }
}
```

---

## 3. Pedidos

### 3.1 - Criar Pedido (Público)
**Endpoint:** `POST /public/orders`

**Descrição:** Cliente cria um novo pedido no site. Esse endpoint é público (sem autenticação).

**Request Body:**
```json
{
  "customerName": "João Silva",
  "customerPhone": "5592999887766",
  "customerEmail": "joao.silva@email.com",
  "customerTaxId": "12345678901",
  "productId": "660e8400-e29b-41d4-a716-446655440001",
  "quantity": 1,
  "deliveryDate": "2025-10-15",
  "deliveryTime": "14h",
  "deliveryType": "DELIVERY", // ou "PICKUP"
  "address": { // Obrigatório apenas se deliveryType for "DELIVERY"
    "street": "Rua das Flores",
    "number": "123",
    "neighborhood": "Centro",
    "city": "Manaus",
    "state": "AM",
    "zipCode": "69005010",
    "complement": "Apto 4B"
  },
  "observations": "Sem corante artificial, por favor"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Pedido criado com sucesso",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "orderNumber": "PED-001",
    "customerName": "João Silva",
    "customerPhone": "5592999887766",
    "customerEmail": "joao.silva@email.com",
    "customerTaxId": "12345678901",
    "productId": "660e8400-e29b-41d4-a716-446655440001",
    "productName": "Bolo de Chocolate",
    "quantity": 1,
    "unitPrice": 45.00,
    "totalPrice": 45.00,
    "deliveryDate": "2025-10-15",
    "deliveryTime": "14h",
    "deliveryType": "DELIVERY",
    "address": {
      "street": "Rua das Flores",
      "number": "123",
      "neighborhood": "Centro",
      "city": "Manaus",
      "state": "AM",
      "zipCode": "69005010",
      "complement": "Apto 4B"
    },
    "observations": "Sem corante artificial, por favor",
    "status": "pending",
    "createdAt": "2025-10-11T16:30:00Z",
    "updatedAt": "2025-10-11T16:30:00Z"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Endereço completo é obrigatório para o tipo de entrega 'DELIVERY'.",
  "code": "INVALID_INPUT"
}
```

**Validações:**
- `deliveryType`: Opcional. Se não enviado, o padrão é `DELIVERY`. Valores válidos: `DELIVERY`, `PICKUP`.
- `address`: Obrigatório se `deliveryType` for `DELIVERY`.
- CustomerName: obrigatório, 2-100 caracteres
- CustomerPhone: obrigatório, 10-11 dígitos
- CustomerEmail: obrigatório, formato de email válido
- CustomerTaxId: obrigatório, 11 dígitos (CPF)
- ProductId: obrigatório, deve existir e estar ativo
- Quantity: obrigatório, deve ser >= 1
- DeliveryDate: obrigatório, não pode ser data passada (formato YYYY-MM-DD)
- DeliveryTime: obrigatório, formato "14h" ou "14h30"
- Observations: opcional, máximo 500 caracteres

---

### 3.2 - Listar Pedidos da Confeiteira
**Endpoint:** `GET /orders`

**Descrição:** Retorna todos os pedidos recebidos pela confeiteira. Apenas o app usa esse endpoint.

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Query Parameters (Opcionais):**
- `status` (string): Filtrar por status (pending, confirmed, production, ready, delivered, cancelled)
- `page` (number): Número da página (default: 1)
- `limit` (number): Itens por página (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "orderNumber": "PED-001",
      "customerName": "João Silva",
      "customerPhone": "5592999887766",
      "customerEmail": "joao.silva@email.com",
      "customerTaxId": "12345678901",
      "productId": "660e8400-e29b-41d4-a716-446655440001",
      "productName": "Bolo de Chocolate",
      "quantity": 1,
      "unitPrice": 45.00,
      "totalPrice": 45.00,
      "deliveryDate": "2025-10-15",
      "deliveryTime": "14h",
      "deliveryType": "DELIVERY",
      "address": {
        "street": "Rua das Flores",
        "number": "123",
        "neighborhood": "Centro",
        "city": "Manaus",
        "state": "AM",
        "zipCode": "69005010",
        "complement": "Apto 4B"
      },
      "observations": "Sem corante artificial, por favor",
      "status": "pending",
      "createdAt": "2025-10-11T16:30:00Z",
      "updatedAt": "2025-10-11T16:30:00Z"
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "orderNumber": "PED-002",
      "customerName": "Ana Costa",
      "customerPhone": "5592988776655",
      "customerEmail": "ana.costa@email.com",
      "customerTaxId": "98765432109",
      "productId": "660e8400-e29b-41d4-a716-446655440002",
      "productName": "Bolo de Morango",
      "quantity": 1,
      "unitPrice": 50.00,
      "totalPrice": 50.00,
      "deliveryDate": "2025-10-16",
      "deliveryTime": "10h",
      "deliveryType": "PICKUP",
      "address": null,
      "observations": "",
      "status": "confirmed",
      "createdAt": "2025-10-12T11:00:00Z",
      "updatedAt": "2025-10-12T11:30:00Z"
    }
  ],
  "total": 2,
  "page": 1
}
```

---

### 3.3 - Obter Detalhes de um Pedido
**Endpoint:** `GET /orders/:id`

**Descrição:** Retorna informações completas de um pedido específico.

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**URL Parameters:**
- `id` (string): UUID do pedido

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "orderNumber": "PED-001",
    "customerName": "João Silva",
    "customerPhone": "5592999887766",
    "customerEmail": "joao.silva@email.com",
    "customerTaxId": "12345678901",
    "productId": "660e8400-e29b-41d4-a716-446655440001",
    "productName": "Bolo de Chocolate",
    "quantity": 1,
    "unitPrice": 45.00,
    "totalPrice": 45.00,
    "deliveryDate": "2025-10-15",
    "deliveryTime": "14h",
    "deliveryType": "DELIVERY",
    "address": {
      "street": "Rua das Flores",
      "number": "123",
      "neighborhood": "Centro",
      "city": "Manaus",
      "state": "AM",
      "zipCode": "69005010",
      "complement": "Apto 4B"
    },
    "observations": "Sem corante artificial, por favor",
    "status": "pending",
    "createdAt": "2025-10-11T16:30:00Z",
    "updatedAt": "2025-10-11T16:30:00Z"
  }
}
```

---

### 3.4 - Atualizar Status do Pedido
**Endpoint:** `PATCH /orders/:id/status`

**Descrição:** Confeiteira atualiza o status do pedido conforme a produção avança.

**Headers Requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**URL Parameters:**
- `id` (string): UUID do pedido

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Status Válidos:**
- `pending`: Aguardando confirmação
- `confirmed`: Confirmado pela confeiteira
- `production`: Em produção
- `ready`: Pronto
- `delivered`: Entregue
- `cancelled`: Cancelado

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Status do pedido atualizado com sucesso",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "orderNumber": "PED-001",
    "status": "confirmed",
    "updatedAt": "2025-10-11T16:45:00Z"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Status inválido",
  "code": "INVALID_STATUS"
}
```

---

### 3.5 - Obter Status de um Pedido (Público)
**Endpoint:** `GET /public/orders/:id`

**Descrição:** Cliente consulta o status do seu pedido via número de pedido ou ID. Endpoint público (sem autenticação).

**URL Parameters:**
- `id` (string): UUID ou número do pedido

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "orderNumber": "PED-001",
    "customerName": "João Silva",
    "status": "production",
    "deliveryDate": "2025-10-15",
    "deliveryTime": "14h",
    "updatedAt": "2025-10-11T16:45:00Z"
  }
}
```

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
| INVALID_INPUT | 400 | Dados de entrada inválidos |
| DUPLICATE_EMAIL | 400 | Email já registrado |
| INVALID_CREDENTIALS | 401 | Email ou senha incorretos |
| PRODUCT_NOT_FOUND | 404 | Produto não encontrado |
| PRODUCT_NOT_AVAILABLE | 400 | Produto não está disponível |
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

1. **Sincronização:** Quando um pedido é criado no site, a API o armazena. O app consulta `/orders` para trazer novos pedidos.

2. **Produtos Inativos:** O site só mostra produtos onde `isActive: true`. Ao desativar um produto no app, ele desaparece do site.

3. **Token JWT:** Válido por 7 dias. Após expiração, usuário precisa fazer login novamente.

4. **Datas:** Formato ISO 8601 em timestamps, mas `deliveryDate` vem como string "YYYY-MM-DD".

5. **Quantidade Padrão:** Se não informada na criação de pedido, assume quantidade = 1.

6. **Upload de Imagens:** O aplicativo envia a imagem como uma string Base64 (`imageBase64`). O backend é responsável por decodificar essa string, salvar a imagem em seu sistema de arquivos e gerar uma URL pública (`imageUrl`) para servi-la. O app e o site então consomem essa `imageUrl`.