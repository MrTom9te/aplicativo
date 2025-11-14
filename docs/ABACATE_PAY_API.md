# Documentação da API Abacate Pay (Resumido)

Este documento resume as principais ações para integrar com a API da Abacate Pay, com base na documentação oficial.

## 1. Conceitos Gerais

A Abacate Pay oferece uma API de pagamentos com foco em simplicidade e facilidade de integração. A API é baseada em intenções, idempotente e retorna dados e erros de forma consistente.

- **Ambientes:** Existem ambientes de desenvolvimento e produção. A chave de API (`API key`) utilizada na autenticação define qual ambiente está sendo acessado.
- **SDKs:** SDKs oficiais estão disponíveis para facilitar a integração.

## 2. Autenticação

Toda requisição para a API deve ser autenticada utilizando uma chave de API.

- **Método:** Incluir a chave no cabeçalho (`header`) de cada requisição.
- **Header:** `Authorization`
- **Formato:** `Bearer {SUA_CHAVE_API}`

As chaves podem ser gerenciadas diretamente no painel da Abacate Pay.

## 3. Clientes (`Customer`)

### Criar um novo cliente

Para criar uma cobrança, primeiro você pode cadastrar um cliente.

- **Método:** `POST`
- **Endpoint:** `https://api.abacatepay.com/v1/customer/create`
- **Headers:**
  - `Authorization: Bearer {SUA_CHAVE_API}`
  - `Content-Type: application/json`

**Corpo da Requisição (JSON):**
```json
{
  "name": "Nome Completo do Cliente",
  "cellphone": "(11) 99999-8888",
  "email": "cliente@email.com",
  "taxId": "123.456.789-00"
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "cus_...",
  "metadata": {
    "name": "Nome Completo do Cliente",
    "cellphone": "(11) 99999-8888",
    "email": "cliente@email.com",
    "taxId": "123.456.789-00"
  }
}
```

## 4. Cobranças (`Billing`)

### Criar uma nova cobrança

Cria uma página de pagamento para o cliente.

- **Método:** `POST`
- **Endpoint:** `https://api.abacatepay.com/billing/create`
- **Headers:**
  - `Authorization: Bearer {SUA_CHAVE_API}`
  - `Content-Type: application/json`

**Corpo da Requisição (JSON):**
```json
{
  "amount": 1000, // Valor em centavos (ex: R$ 10,00)
  "description": "Descrição da Cobrança",
  "returnUrl": "https://seusite.com/retorno",
  "completionUrl": "https://seusite.com/sucesso",
  "customerId": "cus_...", // ID do cliente criado anteriormente
  "metadata": {
    "orderId": "PEDIDO-123"
  }
}
```

**Resposta de Sucesso (200 OK):**
A resposta incluirá um `id` para a cobrança e uma `url` que deve ser usada para redirecionar o cliente para a página de pagamento.

## 5. PIX QR Code

### Criar um QR Code PIX

Gera um QR Code estático para pagamento via PIX.

- **Método:** `POST`
- **Endpoint:** `https://api.abacatepay.com/v1/pixQrCode/create`
- **Headers:**
  - `Authorization: Bearer {SUA_CHAVE_API}`
  - `Content-Type: application/json`

**Corpo da Requisição (JSON):**
```json
{
  "amount": 1000, // Valor em centavos (ex: R$ 10,00)
  "expiresIn": 3600, // Tempo de expiração em segundos (opcional)
  "description": "Pagamento do Pedido #123", // Mensagem no PIX (opcional)
  "customer": { // Dados do cliente (opcional)
    "name": "Nome do Cliente",
    "cellphone": "(11) 99999-8888",
    "email": "cliente@email.com",
    "taxId": "123.456.789-00"
  }
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "pix_...",
  "amount": 1000,
  "status": "PENDING",
  "brCode": "00020126580014br.gov.bcb.pix...", // Código Copia e Cola
  "brCodeBase64": "data:image/png;base64,iVBORw0KGgo...", // Imagem do QR Code em Base64
  "expiresAt": "2025-11-09T18:00:00.000Z"
}
```
