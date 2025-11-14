# Relato de Experiência Individual – Projeto de Extensão Doce Ponto

**Autor:** Gabriel Santarem da Fonseca
**Projeto:** Doce Ponto - Sistema de Gestão para Confeitaria Artesanal
**Período:** Segundo Semestre de 2025

## 1. Introdução

Este documento detalha minha experiência e contribuições como estudante extensionista no projeto Doce Ponto, desenvolvido em parceria com a confeitaria "Bolo dos Levis". O objetivo central do projeto foi aplicar os conhecimentos teóricos de Análise e Desenvolvimento de Sistemas na criação de uma tecnologia social para otimizar a gestão de uma microempreendedora individual, abordando problemas reais de organização, vendas e visibilidade digital. Minha atuação focou-se na arquitetura e implementação do ecossistema digital, abrangendo a API backend e a interface do cliente (SPA).

## 2. Diagnóstico e Desafios Iniciais

Ao ingressar no projeto, encontrei uma base funcional, porém com diversas oportunidades de melhoria para que a solução atingisse um nível profissional e verdadeiramente útil para a parceira e seus clientes. Os principais desafios identificados foram:

*   **Fluxo de Pagamento Incompleto:** A API gerava uma URL de pagamento externa para PIX, o que quebrava a experiência do usuário, forçando-o a sair do nosso site. A confirmação do pagamento não era automática, exigindo verificação manual pela confeiteira.
*   **Interface do Cliente (SPA) Rudimentar:** O site público era apenas uma estrutura básica, sem um design atraente ou uma experiência de usuário fluida. A navegação era limitada e a apresentação dos produtos, pouco profissional.
*   **Gestão de Arquivos Estáticos:** A forma como as imagens dos produtos eram servidas pela API era inconsistente e frágil, com URLs hardcoded e caminhos duplicados que causavam falhas na exibição das imagens.
*   **Falta de Polimento Geral:** A aplicação carecia de feedback visual para o usuário, como indicadores de carregamento, mensagens de erro claras e uma identidade visual coesa que transmitisse o carisma de uma confeitaria artesanal.

## 3. Desenvolvimento e Implementação das Soluções

Com base no diagnóstico, concentrei meus esforços em transformar o protótipo em um produto robusto e agradável de usar.

### 3.1. Modernização do Sistema de Pagamentos

A primeira grande intervenção foi no fluxo de pagamento. Substituímos a geração de URL externa pela **criação de um QR Code PIX diretamente na interface**.

*   **Ação:** Alterei a rota `POST /public/orders` na API para, em vez de chamar o endpoint de `billing`, chamar `pixQrCode.create` da SDK da Abacate Pay.
*   **Resultado:** A API passou a retornar a imagem do QR Code (em Base64) e o código "copia e cola". Isso permitiu que o frontend (SPA) exibisse os dados de pagamento na mesma tela, sem redirecionamentos, criando uma experiência de checkout fluida e profissional.

### 3.2. Construção e Estilização da Interface do Cliente (SPA)

O desafio seguinte foi construir uma vitrine digital ("um site bonitinho") que fosse convidativa para os clientes.

*   **Ação:**
    1.  **Estruturação de Páginas:** Criei as páginas essenciais: `OrderPage` (para finalizar um pedido), `OrderSummaryPage` (para exibir o PIX e o resumo) e `OrderTrackPage` (para acompanhamento).
    2.  **Componentização:** Desenvolvi componentes reutilizáveis como `ProductCard`, `Spinner` e `Alert` para padronizar a interface e limpar o código.
    3.  **Estilização e Identidade Visual:** Criei uma folha de estilos central (`App.css`) com uma paleta de cores "doce" (tons de rosa e lavanda), fontes amigáveis e um layout responsivo, substituindo todos os estilos inline por classes CSS.
    4.  **Polling de Status:** Implementei um mecanismo de polling na página de resumo do pedido, que verifica o status do pagamento a cada 5 segundos. Ao detectar a confirmação (feita pelo webhook no backend), a tela automaticamente exibe uma mensagem de "Pagamento Confirmado!", melhorando drasticamente a experiência pós-compra.

### 3.3. Correção e Otimização da API

Durante o desenvolvimento, corrigi bugs e otimizei a API para melhor servir o SPA.

*   **Ação:**
    1.  **Servidor de Arquivos Estáticos:** Configurei o servidor Express para servir a build do SPA e as imagens dos produtos de forma correta, eliminando erros de rota e inconsistências.
    2.  **Rota Catch-All:** Implementei uma rota `app.get(/^(?!\/api).*/)`, que direciona todas as requisições não-API para o `index.html` do SPA, garantindo o funcionamento correto do roteamento do lado do cliente (React Router).
    3.  **Resolução de Bugs:** Depurei e corrigi o problema de URLs de imagem duplicadas (`/static/images/images/...`), ajustando a lógica de construção de URLs no frontend para corresponder à estrutura de dados retornada pela API.

## 4. Aprendizados e Reflexões

Esta fase do projeto foi uma imersão prática de grande valor. Os principais aprendizados foram:

*   **A Experiência do Usuário (UX) é Prioridade:** Uma funcionalidade só está "pronta" quando é fácil e agradável de usar. A mudança do fluxo de pagamento e a estilização do SPA me mostraram que a forma como a solução é apresentada é tão importante quanto a lógica por trás dela.
*   **A Importância da Arquitetura Cliente-Servidor:** Entender profundamente como o frontend e o backend se comunicam foi crucial para depurar problemas de CORS, roteamento e manipulação de dados. A consistência entre o que a API entrega e o que o cliente espera é fundamental.
*   **Desenvolvimento Iterativo:** O processo de construir, testar, encontrar um bug (como o da URL da imagem), corrigir e testar novamente solidificou meu entendimento do ciclo de desenvolvimento de software.

## 5. Visão de Futuro e Próximos Passos

O trabalho realizado estabeleceu uma base sólida, mas o potencial do Doce Ponto é ainda maior. As discussões sobre os próximos passos me permitiram exercitar uma visão estratégica sobre o produto.

*   **Evolução para Multi-Tenant:** A arquitetura atual pode ser estendida para permitir que múltiplas confeiteiras se cadastrem e tenham suas próprias lojas virtuais, transformando o Doce Ponto em uma plataforma SaaS.
*   **Criação de um Aplicativo Unificado:** A proposta mais poderosa é o desenvolvimento de um único aplicativo móvel (React Native) que atenda tanto às confeiteiras quanto aos clientes, usando um sistema de papéis (`BAKER`/`CLIENT`) para adaptar a interface. Isso centralizaria a manutenção e abriria portas para funcionalidades avançadas como notificações push, programas de fidelidade e uma experiência de compra ainda mais rica.

Concluo este relato com a certeza de que o projeto Doce Ponto não apenas contribuiu para a sustentabilidade de um negócio local, mas também proporcionou uma experiência de aprendizado prático inestimável, conectando a teoria da sala de aula com os desafios do mundo real.

## 6. Relato da Implementação da Tela “Personalizar Loja” (App Mobile)

### Introdução/Contexto
Na etapa mais recente, trabalhei na criação e integração da tela “Personalizar Loja” dentro do aplicativo mobile. A ideia foi dar à confeiteira um lugar simples para ajustar nome, URL (slug), endereço, opções de entrega, aparência (cor do tema, fonte) e o logo da sua vitrine. Essa entrega conecta diretamente o que a API já oferece com uma experiência prática para quem usa o app no dia a dia.

### Objetivos
- Permitir que a confeiteira edite as informações da loja com poucos toques.
- Garantir que as mudanças sejam salvas na API e reflitam no site público.
- Manter a experiência simples, sem telas complexas ou passos desnecessários.

### Metodologia (Como fiz)
1. Li a documentação da API e confirmei os campos de `GET /store` e `PATCH /store` (nome, slug, endereço, `supportedDeliveryTypes`, `themeColor`, `layoutStyle`, `fontFamily`, `logoUrl`).
2. Criei tipos simples no frontend para padronizar os dados da loja.
3. Criei um hook leve (`useStore`) para buscar e salvar as informações, seguindo o padrão dos outros hooks do projeto.
4. Refatorei a tela para consumir a API real (removendo mocks) e mapear os campos na interface.
5. Implementei um seletor de cor e de fonte bem simples (botões diretos), e o upload do logo via galeria (base64), sem complicar.
6. Tratei o erro de slug duplicado com uma mensagem clara, e deixei um botão “Tentar novamente” em caso de falha de carregamento.

### Resultados e Discussão
- A tela agora carrega os dados reais da loja e salva as alterações com feedback imediato.
- As opções de entrega viraram dois interruptores (delivery/retirada), que são convertidos para a lista `supportedDeliveryTypes` na hora de salvar.
- O layout de produtos pode ser alternado entre “Grade” e “Lista”, mapeando para `grid/list` na API.
- O envio do logo funciona por base64 quando a imagem é alterada; após salvar, a tela já exibe o `logoUrl` retornado pela API.
- O fluxo ficou direto: abrir tela → ajustar dados → salvar → ver confirmação. Simples e objetivo, como a cliente precisa.

### Reflexão/Conclusão
Foi uma entrega que parece pequena, mas que dá autonomia real para a confeiteira. Percebi que, ao evitar telas ou componentes muito complexos, a experiência melhora: menos cliques, menos dúvidas, mais resultado. O principal aprendizado aqui foi equilibrar “capricho técnico” com “simplicidade de uso”. E ver a mudança refletindo no site público logo após salvar trouxe a sensação de sistema vivo e conectado — exatamente o espírito do Doce Ponto.

## 7. Alinhamento da API com o App e a Especificação

### Contexto
Após integrar a tela de “Personalizar Loja”, precisei garantir que a API estivesse coerente com a especificação e com o que o app realmente envia/espera. O objetivo foi remover pequenos atritos e deixar o backend pronto para a experiência que desenhamos no mobile.

### O que foi ajustado
- **PATCH /store – upload de logo via Base64**
  - Adequei a rota para aceitar `imageBase64` além de `logoUrl`. Quando a imagem vem em Base64, o backend faz o upload e salva o `logoUrl` resultante. Isso espelha o fluxo que já existia em produtos e simplifica o lado do app.
- **POST /public/orders – modelo multi-loja**
  - Corrigi a criação do pedido para associar a `storeId` do produto (modelo atual) e remover dependências antigas de `userId`. Também eliminei uma resposta duplicada após o sucesso (201), que poderia causar erros intermitentes.
- **Middlewares – robustez e consistência**
  - Ajustei a verificação de `Content-Type` para aceitar `application/json` com `charset` (uso comum nos clientes) e corrigi o código de erro de autenticação (`UNAUTHORIZED`), mantendo o padrão das respostas.

### Resultado
- O app consegue enviar o logo como Base64 sem workarounds.
- O fluxo público de pedidos respeita o multi-tenant de forma correta e estável.
- As respostas da API ficaram mais previsíveis e tolerantes a variações legítimas de clientes.

### Reflexão
Esses ajustes pequenos, porém cirúrgicos, mostram como detalhes de contrato entre cliente e servidor fazem diferença. Quando o backend fala exatamente a “língua” do app, a experiência flui melhor e o time economiza tempo em suporte e retrabalho.
