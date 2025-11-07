# Doce Ponto - Sistema de Gestão e Venda para Confeitaria Artesanal

## Apresentação

Doce Ponto é um sistema digital integrado que visa modernizar e profissionalizar a gestão de vendas para confeiteiras artesanais. Ele atua como uma tecnologia social, promovendo o empoderamento feminino no empreendedorismo ao oferecer ferramentas acessíveis e intuitivas. O sistema consiste em três componentes interligados: um aplicativo mobile para a confeiteira gerenciar seu negócio, um site web como vitrine pública para clientes, e uma API robusta que conecta e sincroniza tudo em tempo real.

## O Problema

Confeiteiras tradicionais, muitas vezes microempreendedoras individuais, frequentemente operam de forma desorganizada. Elas gerenciam pedidos e produtos via múltiplos aplicativos de mensagens, não possuem um catálogo digital acessível 24h, o que resulta na perda de vendas e na dificuldade para os clientes saberem o que está disponível. Além disso, enfrentam confusão com pedidos, datas de entrega e uma precificação empírica que afeta a lucratividade e sustentabilidade do negócio.

## A Solução

Doce Ponto oferece uma plataforma simples e completa onde:

**A confeiteira (via app mobile):**
- Cadastra seus produtos com foto, descrição e preço, garantindo uma precificação mais assertiva.
- Ativa ou desativa produtos conforme a disponibilidade.
- Recebe pedidos de clientes em um único lugar, eliminando a desorganização de múltiplos canais.
- Atualiza o status do pedido conforme o processo de produção (Pendente → Confirmado → Em Produção → Pronto → Entregue).
- Tem uma visão geral clara do que está sendo vendido e do fluxo de trabalho.

**Os clientes (via site web):**
- Visualizam um catálogo profissional de produtos disponíveis 24 horas por dia.
- Fazem pedidos com data e hora de entrega desejadas de forma intuitiva.
- Acompanham o status do pedido em tempo real, aumentando a transparência.
- Não precisam enviar mensagens repetitivas para informações sobre pedidos ou produtos.

**O backend (API):**
- Sincroniza informações instantaneamente entre o aplicativo mobile e o site web.
- Autentica a confeiteira de forma segura.
- Gerencia a persistência de dados de produtos e pedidos.
- Garante que o site exiba apenas produtos que estão ativos e disponíveis.

## Funcionalidades Principais

**Gestão de Produtos:**
- Criar produto com nome, descrição, preço e imagem.
- Editar informações existentes do produto.
- Ativar/desativar produtos conforme disponibilidade, sem a necessidade de deletar.
- Deletar produtos quando não forem mais necessários.

**Sistema de Pedidos:**
- Cliente realiza pedidos no site (informando nome, telefone, produto, data, hora e observações).
- Confeiteira recebe os pedidos no aplicativo em tempo real.
- Confeiteira gerencia o status do pedido (Pendente → Confirmado → Em Produção → Pronto → Entregue).
- Cliente acompanha o status atualizado do pedido no site.
- Pedidos podem ser cancelados, conforme as regras de negócio.

**Autenticação:**
- Confeiteira registra sua conta de forma segura.
- Login protegido com JSON Web Tokens (JWT).
- Garantia de que dados sensíveis são protegidos.

## Diferencial

O principal diferencial do Doce Ponto é a sincronização instantânea e a facilidade de uso. Quando a confeiteira desativa um produto no aplicativo, ele desaparece do site imediatamente. Da mesma forma, quando um cliente faz um pedido no site, ele aparece no aplicativo da confeiteira em tempo real. Isso garante que as informações estejam sempre atualizadas para ambas as partes.

## Benefícios

- **Para a Confeiteira:** Organização profissional, visibilidade 24h para seus produtos, economia de tempo na gestão, controle total sobre o negócio e alfabetização digital.
- **Para o Cliente:** Comodidade na compra, transparência no acompanhamento, autonomia na escolha e uma experiência visual clara e agradável.

## Público-Alvo

Confeiteiras artesanais, especialmente microempreendedoras individuais, que buscam profissionalizar suas vendas e gestão sem a necessidade de conhecimento técnico avançado, valorizando a simplicidade e a eficiência.

## Escopo do MVP

O Escopo do Produto Mínimo Viável (MVP) do Doce Ponto foca no essencial: gestão de produtos, sistema de pedidos e autenticação. Não inclui funcionalidades como kits de produtos, promoções complexas, múltiplos usuários para a confeitaria ou notificações avançadas. O objetivo é entregar bem o que promete, com foco na usabilidade e nos benefícios centrais.

## Stack Técnico

- **App Mobile:** React Native com Expo
- **Site Web:** React + TypeScript
- **Autenticação:** JWT simples

## Arquitetura Visual

```
┌─────────────────┐          ┌──────────────┐          ┌──────────────┐
│  App Mobile     │◄────────►│  Backend API │◄────────►│  Site Web    │
│ (Confeiteira)   │          │              │          │ (Clientes)   │
└─────────────────┘          └──────────────┘          └──────────────┘
```

- O aplicativo mobile e o site web nunca se comunicam diretamente.
- Toda a comunicação e sincronização de dados passam pela Backend API.
- A API é responsável por manter os dados consistentes e atualizados em todo o sistema.

## Fluxo Principal

1.  A confeiteira cria ou atualiza um produto no aplicativo Doce Ponto.
2.  A API salva essas informações e as disponibiliza.
3.  O site Doce Ponto consulta a API e exibe o produto (se estiver ativo).
4.  Um cliente vê o produto no site e realiza um pedido.
5.  A API registra o pedido e o processa.
6.  O aplicativo Doce Ponto notifica a confeiteira sobre o novo pedido (com refresh manual ou futuro sistema de push).
7.  A confeiteira atualiza o status do pedido no aplicativo.
8.  O cliente pode ver o status atualizado do seu pedido no site.

---

**Status:** MVP pronto para apresentação
**Complexidade:** Baixa a média
**Tempo de desenvolvimento:** 6-8 semanas (estimado)
**Risco técnico:** Baixo
