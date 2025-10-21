# ConfeitApp - Sistema de Venda de Confeitaria

## Apresentação

ConfeitApp é um sistema digital integrado que moderniza como confeiteiras vendem seus produtos. Consiste em três componentes: um aplicativo mobile para a confeiteira gerenciar seu negócio, um site web como vitrine pública para clientes, e uma API que conecta tudo.

## O Problema

Confeiteiras tradicionais operam de forma desorganizada: gerenciam produtos via mensagens, não têm catálogo digital acessível 24h, perdem vendas porque clientes não sabem o que está disponível, e convivem com confusão de pedidos e datas de entrega.

## A Solução

ConfeitApp oferece uma plataforma simples onde:

**A confeiteira (via app mobile):**
- Cadastra seus produtos com foto, descrição e preço
- Ativa ou desativa produtos conforme disponibilidade
- Recebe pedidos de clientes em um único lugar
- Atualiza o status do pedido conforme produz
- Tem visão geral do que está sendo vendido

**Os clientes (via site web):**
- Veem catálogo profissional de produtos disponíveis 24 horas
- Fazem pedidos com data e hora de entrega desejadas
- Acompanham o status do pedido em tempo real
- Não precisam enviar mensagens repetitivas

**O backend:**
- Sincroniza informações entre app e site
- Autentica a confeiteira
- Gerencia persistência de dados
- Garante que site mostra apenas produtos ativos

## Funcionalidades Principais

**Gestão de Produtos:**
- Criar produto com nome, descrição, preço e imagem
- Editar informações do produto
- Ativar/desativar sem deletar
- Deletar quando não for mais necessário

**Sistema de Pedidos:**
- Cliente faz pedido no site (nome, telefone, produto, data, hora, observações)
- Confeiteira recebe no app em tempo real
- Confeiteira muda status (Pendente → Confirmado → Em Produção → Pronto → Entregue)
- Cliente acompanha status no site
- Pedido pode ser cancelado

**Autenticação:**
- Confeiteira registra conta
- Login seguro com JWT
- Dados sensíveis protegidos

## Diferencial

A sincronização instantânea entre app e site. Quando a confeiteira desativa um produto no app, desaparece do site na hora. Quando um cliente faz pedido no site, aparece no app da confeiteira imediatamente. Nada fica desatualizado.

## Benefícios

- **Para a confeiteira:** Organização profissional, visibilidade 24h, economia de tempo, controle total
- **Para o cliente:** Comodidade, transparência, autonomia, experiência visual clara

## Público-Alvo

Confeiteiras que querem profissionalizar vendas mas precisam de algo simples de usar, sem conhecimento técnico necessário.

## Escopo do MVP

Apenas o essencial que faz sentido: produtos, pedidos, autenticação. Sem kits, promoções, múltiplos usuários, notificações complexas. Foco em entregar bem o que promete.

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

- App e Site nunca se comunicam diretamente
- Tudo passa pela API
- API mantém dados em sincronização

## Fluxo Principal

1. Confeiteira cria produto no app
2. API salva em memória
3. Site consulta API e mostra produto (se ativo)
4. Cliente vê produto no site e faz pedido
5. API salva pedido
6. App notifica confeiteira (refresh manual)
7. Confeiteira atualiza status no app
8. Cliente vê status atualizado no site

---

**Status:** MVP pronto para apresentação
**Complexidade:** Baixa a média
**Tempo de desenvolvimento:** 6-8 semanas
**Risco técnico:** Baixo
