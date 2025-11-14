# Projeto 2: Agenda Eletrônica (Aplicação Web)

Este é o repositório do *Projeto 2* da disciplina de *Programação Web Back-End (EC48B-C71)*, da Universidade Tecnológica Federal do Paraná (UTFPR), Campus Cornélio Procópio.

O objetivo é evoluir o Projeto 1, transformando a biblioteca de classes (models) em uma *aplicação web completa* utilizando o framework *Express.js. O sistema implementa uma agenda eletrônica com autenticação de usuários, gerenciamento de sessões e uma interface baseada em templates (EJS), seguindo o padrão de arquitetura **MVC (Model-View-Controller)*.

---

## 👥 Autores

| Nome | RA |
| :--- | :--- |
| Éler Yudi Mitani Sotoma | 2312034 |
| Guilherme Renato Terra de Macedo | 2313030 |

---

## ✨ Funcionalidades

A aplicação é um site web que permite o gerenciamento completo de uma agenda pessoal, com as seguintes funcionalidades:

* *Autenticação e Segurança:*
    * Rotina completa de *Login* e *Logout* com uso de *Sessões* (express-session).
    * *Proteção de Rotas* (middleware) para garantir que apenas usuários autenticados possam acessar as páginas da agenda.
* *Modelo Multi-Usuário:*
    * *Segregação total de dados*: Cada usuário só pode criar, visualizar, atualizar ou deletar suas próprias categorias e eventos.
* *Gerenciamento de Usuários:*
    * Página de cadastro de novos usuários.
* *Gerenciamento de Categorias:*
    * *CRUD* (Criar, Ler, Atualizar, Deletar) completo para as categorias (ex: Trabalho, Pessoal).
* *Gerenciamento de Eventos:*
    * *CRUD* (Criar, Ler, Atualizar, Deletar) completo para os eventos.
    * Formulários de criação e edição que listam apenas as categorias do usuário logado.
    * *Filtro de eventos* por categoria na página de listagem.
* *Requisitos da Disciplina Atendidos:*
    * Reutilização das classes do Projeto 1 (Models).
    * Implementação de rotas com Express.js.
    * Recebimento de parâmetros via GET (filtros) e POST (formulários).
    * Uso de *sessões* para garantir a autenticidade.
    * Renderização da interface com *templates (EJS)*.
    * Apresentação de mensagens de erro nos formulários.

---

## 🛠️ Tecnologias Utilizadas

* *Node.js:* Ambiente de execução para o JavaScript no lado do servidor.
* *Express.js:* Framework web para gerenciamento de rotas, middleware e requisições.
* *EJS (Embedded JavaScript):* Template engine para renderizar o HTML dinamicamente.
* *MongoDB:* Banco de dados NoSQL orientado a documentos.
* *MongoDB Driver (Node.js):* Biblioteca oficial para a comunicação com o banco de dados.
* *Express-session:* Middleware para gerenciamento de sessões de usuário.

---

## ⚙️ Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
* [Node.js](https://nodejs.org/en/) (v18 ou superior)
* [MongoDB Community Server](https://www.mongodb.com/try/download/community)
* [Git](https://git-scm.com/)

Opcionalmente, instale o [MongoDB Compass](https://www.mongodb.com/products/compass) para visualizar e gerenciar o banco de dados de forma gráfica.

---

## 🚀 Instalação e Execução

1.  *Clone o repositório:*
    bash
    git clone [https://github.com/ElerYudi/agenda-web.git](https://github.com/ElerYudi/agenda-web.git)
    
    (Nota: Substitua pelo link correto do seu repositório do Projeto 2, se for diferente.)

2.  *Acesse a pasta do projeto:*
    bash
    cd agenda-web
    

3.  *Instale as dependências:*
    bash
    npm install
    

4.  *Inicie o servidor do MongoDB:*
    * Certifique-se de que o serviço do MongoDB está rodando na sua máquina. A aplicação tentará se conectar em mongodb://localhost:27017.

5.  *Execute a aplicação:*
    bash
    npm start
    

6.  *Acesse a aplicação:*
    * Abra seu navegador e acesse http://localhost:3000. Você será redirecionado para a página de login.

---

## 📂 Estrutura de Arquivos


/
├── database/             # Conexão com MongoDB (do P1)
│   └── connection.js
├── logs/                 # Arquivo de log de erros (do P1)
│   └── exceptions.log
├── middleware/           # Middleware de autenticação
│   └── auth.js
├── models/               # Models do banco (do P1)
│   ├── Usuario.js
│   ├── Categoria.js
│   └── Evento.js
├── node_modules/
├── public/               # Arquivos estáticos (CSS, imagens)
│   └── stylesheets/
│       └── style.css
├── routes/               # Controllers (Rotas do Express)
│   ├── index.js          # Rotas de login/logout/dashboard
│   ├── usuarios.js       # Rota de cadastro
│   ├── categorias.js     # Rotas CRUD de categorias
│   └── eventos.js        # Rotas CRUD de eventos
├── utils/                # Utilitários (logger.js do P1)
│   └── logger.js
├── views/                # Templates EJS (As telas)
│   ├── categorias/       # Telas de categoria (index, form, editar)
│   ├── eventos/          # Telas de evento (index, form, editar)
│   ├── error.ejs
│   ├── cadastro.ejs
│   ├── dashboard.ejs
│   └── login.ejs
├── .gitignore
├── app.js                # Configuração principal do Express (app, middleware)
├── bin/
│   └── www               # Script que inicia o servidor Node
├── package.json
└── README.md
