Aqui está uma explicação detalhada de como a nova tela **"Personalizar Loja"** deve ser e se comportar no aplicativo mobile. Pense nisto como um novo requisito para a equipe que vai desenvolver o app.

---

### Nova Tela: Personalizar Loja

#### 1. Objetivo da Tela
Permitir que a confeiteira (usuária) edite todas as informações e configurações visuais da sua loja. É o painel de controle central da identidade da loja.

#### 2. Localização no App
Esta tela deve ser acessada a partir do menu principal de **"Configurações"** do aplicativo.

#### 3. Elementos da Interface
A tela deve ser um formulário longo, dividido em seções, com um botão "Salvar" fixo no final ou no cabeçalho.

**Seção 1: Informações Básicas**
*   **Nome da Loja:**
    *   **Componente:** Campo de texto (`Input`).
    *   **Label:** "Nome da Loja".
*   **URL da Loja (Slug):**
    *   **Componente:** Campo de texto (`Input`).
    *   **Label:** "URL da sua loja (`doceponto.com/loja/`)"
    *   **Comportamento:** Deve mostrar o `slug` atual. A usuária pode editar, mas o app deve impedir espaços e caracteres especiais, permitindo apenas letras, números e hífens.

**Seção 2: Endereço e Entregas**
*   **Endereço:**
    *   **Componentes:** Um conjunto de campos de texto para `Rua`, `Número`, `Bairro`, `Cidade`, `Estado`, `CEP`.
*   **Tipos de Entrega Suportados:**
    *   **Componente:** Um conjunto de dois `Checkbox` ou `Switch` (interruptores).
    *   **Opção 1:** Label "Habilitar Delivery".
    *   **Opção 2:** Label "Habilitar Retirada no Local".
    *   **Comportamento:** A confeiteira pode marcar um, ambos ou nenhum (embora marcar pelo menos um seja o ideal).

**Seção 3: Aparência da Loja**
*   **Logo da Loja:**
    *   **Componente:** Uma área de "preview" que mostra o logo atual (ou um placeholder) e um botão "Alterar Logo".
    *   **Comportamento:** Ao tocar no botão, o app deve abrir a galeria de imagens do celular para que a usuária escolha uma nova foto.
*   **Cor do Tema:**
    *   **Componente:** Um seletor de cores (`Color Picker`). Pode ser uma grade com cores pré-definidas (tons pastéis, por exemplo) para simplificar.
    *   **Comportamento:** Mostra a cor atualmente selecionada. Ao tocar, abre a paleta de cores.
*   **Fonte da Loja:**
    *   **Componente:** Um seletor (`Dropdown` / `Picker`).
    *   **Comportamento:** Apresenta uma lista de 3-5 fontes pré-selecionadas (ex: "Padrão", "Cursiva", "Moderna").
*   **Layout dos Produtos:**
    *   **Componente:** Um seletor com duas opções e um pequeno ícone de preview.
    *   **Opção 1:** "Grade" (mostra os produtos lado a lado).
    *   **Opção 2:** "Lista" (mostra os produtos um abaixo do outro).

#### 4. Comportamento e Fluxo de Dados

1.  **Carregamento Inicial:**
    *   Ao entrar na tela, o aplicativo **deve fazer uma requisição `GET` para `/api/store`**.
    *   Enquanto os dados não chegam, a tela deve exibir um indicador de carregamento (ex: `Spinner` ou `Skeleton`).

2.  **Preenchimento dos Dados:**
    *   Quando a resposta da API chegar, o app deve preencher todos os campos do formulário (Nome, Endereço, Cor, etc.) com os dados recebidos.

3.  **Edição:**
    *   A confeiteira edita os campos que desejar.

4.  **Salvando as Alterações:**
    *   Ao tocar no botão **"Salvar"**:
        *   O app monta um objeto JSON contendo **todos os campos** do formulário.
        *   Faz uma requisição **`PATCH` para `/api/store`**, enviando o objeto JSON no corpo da requisição.
        *   O botão "Salvar" deve ficar em estado de "carregando" e desabilitado para evitar múltiplos cliques.

5.  **Feedback para a Usuária:**
    *   **Sucesso:** Se a API retornar sucesso (código 200), o app deve exibir uma mensagem temporária (um "Toast") dizendo **"Loja atualizada com sucesso!"**.
    *   **Erro:** Se a API retornar um erro (ex: código 400 porque o `slug` já existe), o app deve exibir um alerta claro, como **"Erro: A URL 'doces-da-ana' já está em uso. Por favor, escolha outra."**.
