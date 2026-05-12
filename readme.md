# DislexPlay App

Aplicação web inclusiva focada em ajudar jovens com **dislexia** a melhorar a leitura e compreensão através de **exercícios interativos e gamificados**.

---

## Objetivo

Este projeto foi desenvolvido no âmbito académico com o objetivo de:

* Promover a **inclusão digital**
* Ajudar utilizadores com dificuldades de leitura
* Aplicar conceitos de **gamificação**
* Desenvolver uma aplicação web com arquitetura **MVC simplificada**

---

## Funcionalidades

### Visitante

* Visualizar informações sobre dislexia
* Aceder a exemplos de exercícios
* Criar conta / fazer login (via popup)

### Utilizador autenticado

* Dashboard com progresso
* Sistema de **gamificação (níveis e pontos)**
* Exercícios interativos:

  * Texto embaralhado
  * Texto desfocado
  * Tarefas desordenadas
* Navegação dinâmica entre exercícios
* Persistência de dados

---

## Exercícios

A aplicação inclui diferentes tipos de exercícios que simulam dificuldades reais associadas à dislexia:

* **Texto embaralhado** → simula leitura com palavras trocadas
* **Texto desfocado** → simula dificuldades de foco visual
* **Tarefas desordenadas** → trabalha memória e organização

---

## Tecnologias Utilizadas

* **HTML5**
* **CSS3**
* **JavaScript (Vanilla)**
* **Bootstrap 5**
* **JSON Server** (Mock API)
* **LocalStorage** (persistência)

---

## Arquitetura

Estrutura baseada em **MVC simplificado**:

```bash
dyslexia-app
│
├── index.html
├── dashboard.html
├── exercise.html
│
├── css
│   └── style.css
│
├── js
│   ├── canvasExercises.js
│   ├── controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── exerciseController.js
│
├── db.json
```

---

## Como executar o projeto

### Clonar repositório

```bash
git clone https://github.com/teu-username/dyslexia-app.git
cd dyslexia-app
```

---

### Instalar JSON Server

```bash
npm install -g json-server
```

---

### Iniciar Mock API

```bash
json-server --watch db.json --port 3000
```

---

### Executar aplicação

Abrir o ficheiro:

```bash
index.html
```

ou usar Live Server (recomendado no VS Code)

---

## Persistência

* Dados do utilizador → `localStorage`
* Dados iniciais (exercícios/users) → `JSON Server`

---

## Gamificação

* Sistema de progresso (%)
* Pontos por exercício
* Níveis baseados no progresso
* Feedback imediato ao utilizador

---

## Autenticação

* Login e registo via **modal (popup)**
* Sessão guardada em `localStorage`
* Proteção de páginas (redirect se não autenticado)

---

## Design

* Interface responsiva (desktop + mobile)
* UI simples e acessível
* Foco em usabilidade para utilizadores com dificuldades de leitura

---

## Melhorias Futuras

* Leitura por voz (Speech API)
* Sistema de níveis avançado
* Recomendações personalizadas
* Sistema de favoritos
* Notificações

---

## Autor

Projeto desenvolvido por:

**Sérgio Alves**

---

## Nota

Este projeto foi desenvolvido para fins académicos e demonstra conceitos de:

* Inclusão digital
* Gamificação
* Desenvolvimento web frontend

---

*Aprender pode ser difícil… mas também pode ser um jogo.*
