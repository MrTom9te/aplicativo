# Requisitos para Cadastro e Criação de Loja

Este documento descreve o fluxo e os requisitos para o cadastro de uma nova confeiteira no sistema Doce Ponto, que resulta na criação de uma conta de usuário e de uma loja virtual associada.

## Visão Geral

O processo de cadastro é o ponto de entrada para uma confeiteira na plataforma. O objetivo é ser simples e direto, solicitando apenas as informações essenciais. Ao final do processo, o sistema deve ter criado:

1.  Um **Usuário (User)**: A conta que dá acesso à confeiteira para gerenciar seu negócio através do aplicativo.
2.  Uma **Loja (Store)**: A entidade que representa a vitrine virtual da confeiteira, contendo seus produtos, pedidos e configurações de aparência.

## Fluxo de Cadastro (`POST /api/auth/register`)

Para se cadastrar, a confeiteira deve fornecer os seguintes dados através do aplicativo:

| Campo      | Tipo     | Validação                                                              | Descrição                                                               |
| :--------- | :------- | :--------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| `name`     | `String` | Obrigatório, mínimo 2 caracteres.                                      | Nome completo da confeiteira. Este nome também será usado como o nome padrão da sua loja. |
| `email`    | `String` | Obrigatório, formato de e-mail válido e **único** no sistema.          | E-mail para login e comunicação.                                        |
| `password` | `String` | Obrigatório, mínimo 8 caracteres, com letras e números.                | Senha de acesso ao aplicativo.                                          |
| `phone`    | `String` | Obrigatório, 10 a 11 dígitos.                                          | Telefone de contato.                                                    |

## Processo Automático no Backend

Uma vez que a API recebe os dados válidos, ela executa as seguintes ações em uma única transação para garantir a integridade dos dados:

1.  **Criação do Usuário**: Um novo registro de `User` é criado com os dados fornecidos. A senha é criptografada (hashed) antes de ser salva no banco de dados.

2.  **Criação da Loja**: Simultaneamente, um novo registro de `Store` é criado.
    - **Nome da Loja**: O `name` da loja é preenchido com o mesmo valor do `name` do usuário recém-criado.
    - **URL da Loja (Slug)**: Uma URL única e amigável (ex: `maria-silva-a1b2c3`) é gerada automaticamente a partir do nome.
    - **Vínculo**: A nova loja é permanentemente associada ao novo usuário.

## Pós-Cadastro

Após o registro bem-sucedido, a confeiteira pode:

- Fazer login no aplicativo com seu e-mail e senha.
- Configurar o endereço e os tipos de entrega (delivery/retirada) da sua loja.
- Começar a cadastrar seus produtos.
- Acessar os endpoints de gerenciamento da loja (`/api/store`) para, futuramente, alterar o nome, a URL (slug) e as configurações de aparência (cor do tema, logo, etc.).
