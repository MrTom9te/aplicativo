# ConfeitApp - Especificação de Telas do App Mobile

## 1. Tela de Login (`app/(auth)/login.tsx`)

### Descrição
Primeira tela que o usuário vê. Permite autenticação com email e senha.

### Elementos da Interface
- **Logo/Nome do App** (topo, centralizado)
- **Campo de Email** (input type email)
  - Placeholder: "seu@email.com"
  - Validação em tempo real
- **Campo de Senha** (input type password)
  - Placeholder: "Sua senha"
  - Ícone para mostrar/ocultar senha
- **Botão "Entrar"** (destaque, full-width)
- **Link "Esqueci minha senha"** (pequeno, abaixo do botão)
- **Divisor visual** (linha com "ou")
- **Link "Não tem conta? Cadastre-se"** (leva para register.tsx)

### Estados
- **Loading:** Mostrar spinner no botão enquanto faz requisição
- **Erro:** Toast/Alert com mensagem de erro (ex: "Email ou senha incorretos")
- **Sucesso:** Navegar para Dashboard

### Validações
- Email deve ser válido
- Senha não pode estar vazia
- Botão desabilitado se campos inválidos

### Comportamento
1. Usuário digita email e senha
2. Clica em "Entrar"
3. App faz POST /api/auth/login
4. Se sucesso: salva token e navega para Dashboard
5. Se erro: mostra mensagem de erro

---

## 2. Tela de Registro (`app/(auth)/register.tsx`)

### Descrição
Cadastro de nova confeiteira no sistema.

### Elementos da Interface
- **Título:** "Criar Conta"
- **Campo Nome** (obrigatório)
  - Placeholder: "Seu nome completo"
- **Campo Email** (obrigatório)
  - Placeholder: "seu@email.com"
  - Validação de formato
- **Campo Telefone** (obrigatório)
  - Placeholder: "(92) 99988-7766"
  - Máscara automática
- **Campo Senha** (obrigatório)
  - Placeholder: "Mínimo 8 caracteres"
  - Ícone para mostrar/ocultar
  - Indicador de força da senha
- **Campo Confirmar Senha** (obrigatório)
  - Validação: deve ser igual à senha
- **Botão "Criar Conta"** (destaque, full-width)
- **Link "Já tem conta? Faça login"** (volta para login.tsx)

### Estados
- **Loading:** Spinner no botão durante requisição
- **Erro:** Mensagens específicas (ex: "Email já cadastrado")
- **Sucesso:** Faz login automático e vai pro Dashboard

### Validações
- Nome: mínimo 2 caracteres
- Email: formato válido
- Telefone: 10-11 dígitos
- Senha: mínimo 8 caracteres, 1 número, 1 letra
- Confirmar senha: deve ser igual

### Comportamento
1. Usuário preenche todos os campos
2. Clica em "Criar Conta"
3. App faz POST /api/auth/register
4. Se sucesso: faz login automático
5. Se erro: mostra mensagem

---

## 3. Dashboard / Home (`app/(tabs)/index.tsx`)

### Descrição
Visão geral do negócio. Primeira tela após login.

### Elementos da Interface
- **Header**
  - Logo/Nome da confeitaria
  - Botão de notificações (badge com contador)

- **Cards de Resumo** (grid 2x2)
  - **Total de Pedidos Hoje**
    - Número grande
    - Ícone de pedidos
  - **Pedidos Pendentes**
    - Número em destaque (vermelho/amarelo se > 0)
    - Botão "Ver todos" →
  - **Produtos Ativos**
    - Número de produtos disponíveis
    - Botão "Gerenciar" →
  - **Último Pedido**
    - Nome do cliente
    - Tempo ("há 15 minutos")

- **Lista "Pedidos de Hoje"** (últimos 5)
  - Card para cada pedido
    - Nome do cliente
    - Produto
    - Status (badge colorido)
    - Hora de entrega
  - Botão "Ver todos os pedidos" →

- **Ações Rápidas** (botões inferiores)
  - "Adicionar Produto" (ícone +)
  - "Ver Pedidos" (ícone lista)

### Estados
- **Loading:** Skeleton/shimmer nos cards
- **Vazio:** Mensagem "Nenhum pedido hoje"
- **Carregado:** Dados atualizados

### Comportamento
- Pull-to-refresh para atualizar dados
- Clicar em card de pedido → vai para detalhes
- Clicar em "Pedidos Pendentes" → vai para lista filtrada

---

## 4. Lista de Produtos (`app/(tabs)/products.tsx`)

### Descrição
Lista todos os produtos cadastrados pela confeiteira com ações rápidas.

### Elementos da Interface
- **Header**
  - Título: "Meus Produtos"
  - Campo de busca (ícone lupa)
  - Botão "+" (adicionar produto)

- **Filtros Rápidos** (chips horizontais)
  - "Todos"
  - "Ativos"
  - "Inativos"

- **Lista de Produtos** (scroll vertical)
  - Para cada produto:
    - **Imagem** (thumbnail, lado esquerdo)
    - **Nome** (bold)
    - **Preço** (R$ formatado)
    - **Status** (toggle switch ativo/inativo)
    - **Botões de Ação**
      - Editar (ícone lápis)
      - Deletar (ícone lixeira)

- **Botão Flutuante "+"** (canto inferior direito)
  - Navega para criar produto

### Estados
- **Loading:** Skeleton/shimmer
- **Vazio:**
  - Ilustração
  - "Nenhum produto cadastrado"
  - Botão "Adicionar Primeiro Produto"
- **Lista Carregada:** Produtos exibidos

### Comportamento
1. Pull-to-refresh para atualizar
2. Busca filtra em tempo real
3. Toggle ativo/inativo faz PATCH imediato
4. Swipe no card mostra ações (editar/deletar)
5. Deletar pede confirmação
6. Clicar no card → detalhes/editar

---

## 5. Criar/Editar Produto (`app/products/new.tsx` e `app/products/[id].tsx`)

### Descrição
Formulário para adicionar novo produto ou editar existente. Mesma tela para ambos casos.

### Elementos da Interface
- **Header**
  - Título: "Novo Produto" ou "Editar Produto"
  - Botão voltar
  - Botão "Salvar" (no header)

- **Formulário** (scroll vertical)
  - **Upload de Imagem**
    - Área clicável (dashed border)
    - Preview da imagem se já tiver
    - Texto: "Toque para adicionar foto"
    - Botão "Alterar" se já tem foto

  - **Campo Nome** (obrigatório)
    - Label: "Nome do produto"
    - Placeholder: "Ex: Bolo de Chocolate"
    - Contador de caracteres: 0/100

  - **Campo Descrição** (obrigatório)
    - Label: "Descrição"
    - Textarea com 3-4 linhas
    - Placeholder: "Descreva seu produto..."
    - Contador: 0/500

  - **Campo Preço** (obrigatório)
    - Label: "Preço"
    - Input numérico com máscara R$
    - Placeholder: "R$ 0,00"
    - Teclado numérico

  - **Toggle "Produto Ativo"**
    - Switch on/off
    - Texto explicativo: "Desativado não aparece no site"

- **Botões** (fixos no rodapé)
  - "Cancelar" (secundário)
  - "Salvar" (primário, destaque)

### Estados
- **Modo Criação:** Campos vazios
- **Modo Edição:** Campos preenchidos com dados existentes
- **Salvando:** Loading no botão "Salvar"
- **Erro:** Toast com erro específico
- **Sucesso:** Toast "Produto salvo!" e volta pra lista

### Validações
- Nome: 2-100 caracteres
- Descrição: não vazia, max 500
- Preço: número positivo, max 2 decimais
- Imagem: URL válida (ou upload se implementar)

### Comportamento
1. **Modo Criação:**
   - Usuário clica em "+" na lista
   - Preenche formulário
   - Clica "Salvar"
   - POST /api/products
   - Volta pra lista

2. **Modo Edição:**
   - Usuário clica em produto na lista
   - Carrega dados do produto
   - Edita campos
   - Clica "Salvar"
   - PUT /api/products/:id
   - Volta pra lista

3. **Upload de Imagem:**
   - Abre galeria ou câmera
   - Mostra preview
   - Salva URL (se usar Cloudinary, faz upload antes)

---

## 6. Lista de Pedidos (`app/(tabs)/orders.tsx`)

### Descrição
Lista todos os pedidos recebidos com filtros por status.

### Elementos da Interface
- **Header**
  - Título: "Pedidos"
  - Campo de busca (por nome/telefone)

- **Filtros de Status** (tabs horizontais)
  - Todos (badge com total)
  - Pendentes (badge amarelo)
  - Em produção (badge azul)
  - Prontos (badge verde)
  - Entregues (badge cinza)

- **Lista de Pedidos** (scroll vertical)
  - Para cada pedido:
    - **Card com bordinha colorida** (cor do status)
    - **Número do Pedido** (ex: PED-001)
    - **Nome do Cliente** (bold)
    - **Telefone** (com botão WhatsApp)
    - **Produto** (nome)
    - **Quantidade** (se > 1)
    - **Data de Entrega** (formatada: "15/10 às 14h")
    - **Status** (badge colorido)
    - **Preço Total** (R$ formatado)
    - **Botão "Ver Detalhes"** →

- **Ordenação**
  - Por data de entrega (mais próximo primeiro)
  - Destaque para pedidos de hoje

### Estados
- **Loading:** Skeleton
- **Vazio:**
  - Ilustração
  - "Nenhum pedido recebido"
  - "Compartilhe seu site para receber pedidos!"
- **Lista Carregada:** Pedidos exibidos

### Comportamento
- Pull-to-refresh atualiza lista
- Clicar em tab filtra por status
- Clicar em telefone abre WhatsApp
- Clicar em card → detalhes do pedido
- Badge nos tabs mostra quantidade

---

## 7. Detalhes do Pedido (`app/orders/[id].tsx`)

### Descrição
Informações completas do pedido com opção de alterar status.

### Elementos da Interface
- **Header**
  - Título: Número do pedido (PED-001)
  - Botão voltar
  - Status atual (badge grande)

- **Seção Cliente**
  - Nome do cliente (grande)
  - Telefone (clicável - abre WhatsApp)
  - Botão "Ligar" (ícone telefone)

- **Seção Pedido**
  - **Produto** (com imagem pequena)
    - Nome
    - Quantidade
    - Preço unitário
  - **Total:** R$ valor (grande, bold)

- **Seção Entrega**
  - **Data:** 15 de Outubro de 2025
  - **Horário:** 14h
  - **Observações:** (se houver)
    - Card com fundo diferente
    - Texto das observações do cliente

- **Seção Alterar Status**
  - Título: "Status do Pedido"
  - **Dropdown/Picker**
    - Lista de status possíveis
    - Atual marcado
  - **Botão "Atualizar Status"** (destaque)

- **Timeline de Status** (opcional, nice-to-have)
  - Histórico de mudanças
  - "Pendente - 11/10 às 16:30"
  - "Confirmado - 11/10 às 17:00"

- **Rodapé**
  - Data do pedido: "Pedido feito em 11/10 às 16:30"

### Estados
- **Loading:** Skeleton enquanto carrega
- **Carregado:** Dados do pedido
- **Atualizando Status:** Loading no botão
- **Erro:** Toast com erro
- **Sucesso:** Toast "Status atualizado!" e atualiza visual

### Comportamento
1. Usuário seleciona novo status no dropdown
2. Clica em "Atualizar Status"
3. PATCH /api/orders/:id/status
4. Se sucesso: atualiza badge e timeline
5. Toast de confirmação
6. Pode voltar para lista ou ficar na tela

### Ações Rápidas
- **Botão WhatsApp:** Abre conversa com cliente
- **Botão Ligar:** Disca número do cliente

---

## 8. Configurações (`app/(tabs)/settings.tsx`)

### Descrição
Dados da confeiteira e configurações do app.

### Elementos da Interface
- **Header**
  - Título: "Configurações"

- **Seção Perfil**
  - Avatar (iniciais se não tiver foto)
  - Nome da confeiteira
  - Email
  - Botão "Editar Perfil" →

- **Seção Confeitaria** (opcional)
  - Nome da confeitaria
  - Telefone comercial
  - Horário de atendimento

- **Seção Preferências**
  - **Toggle:** Receber notificações
  - **Toggle:** Modo escuro (opcional)

- **Seção Sobre**
  - Versão do app
  - Link "Termos de uso"
  - Link "Política de privacidade"
  - Link "Ajuda"

- **Rodapé**
  - **Botão "Sair"** (vermelho, destaque negativo)

### Comportamento
- Editar perfil → modal ou nova tela
- Sair → confirma e faz logout
- Logout limpa token e volta pro login

---

## Navegação entre Telas

### Bottom Tab Navigator (4 tabs)
1. **Home/Dashboard** (ícone casa)
2. **Produtos** (ícone bolo/loja)
3. **Pedidos** (ícone lista/carrinho)
4. **Configurações** (ícone engrenagem)

### Stack Navigation
```
Login → Dashboard
          ↓
      (Tab Navigator)
          ├→ Home
          ├→ Produtos → Novo Produto
          │              Editar Produto [id]
          ├→ Pedidos → Detalhes Pedido [id]
          └→ Settings
```

---

## Paleta de Cores Sugerida (Status)

- **Pendente:** Amarelo (#FFC107)
- **Confirmado:** Azul (#2196F3)
- **Em Produção:** Roxo (#9C27B0)
- **Pronto:** Verde (#4CAF50)
- **Entregue:** Cinza (#9E9E9E)
- **Cancelado:** Vermelho (#F44336)

---

## Componentes Reutilizáveis

### StatusBadge
- Input: status (string)
- Output: badge colorido com texto

### ProductCard
- Input: product (objeto)
- Output: card visual do produto

### OrderCard
- Input: order (objeto)
- Output: card visual do pedido

### Button
- Variants: primary, secondary, danger
- States: normal, loading, disabled

### Input
- Variants: text, email, password, phone, number
- Props: label, placeholder, validation

---

## Funcionalidades Extras (Opcional)

- **Pull-to-refresh** em todas as listas
- **Skeleton loading** (shimmer effect)
- **Toast notifications** para feedback
- **Confirmação antes de deletar** (Alert)
- **Swipe actions** em cards (editar/deletar)
- **Empty states** com ilustrações
- **Error boundaries** para crashes

---

## Fluxo Completo do Usuário

### Primeiro Uso
1. Abre app → Login
2. Clica "Cadastre-se"
3. Preenche dados → Criar Conta
4. Entra no Dashboard (vazio)
5. Clica "Adicionar Produto"
6. Preenche formulário → Salva
7. Produto aparece na lista
8. Ativa produto (toggle)
9. Cliente faz pedido no site
10. Pedido aparece no app (refresh)
11. Confeiteira abre pedido
12. Atualiza status → Cliente vê no site

### Uso Diário
1. Abre app → Dashboard
2. Vê "3 pedidos pendentes"
3. Clica → Lista de pedidos
4. Abre pedido → Confirma
5. Volta pra lista
6. Abre outro → Muda pra "Em produção"
7. Termina produção → "Pronto"
8. Cliente busca → "Entregue"
