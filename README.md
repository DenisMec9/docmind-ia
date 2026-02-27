# Docmind IA

Plataforma fullstack para upload de PDF/TXT com busca semântica e chat contextual (RAG) por documento.

## Arquitetura

```text
Frontend (React + Vite)
    -> JWT Supabase
Backend (Express + TS, Clean-ish layers)
    -> Supabase Postgres (pgvector + RLS)
    -> OpenAI (embeddings + chat completion)
```

Estrutura principal:

```text
backend/src
  controllers/  services/  repositories/  middlewares/
  config/       utils/     types/         validations/

frontend/src
  pages/  components/  services/  hooks/  context/  types/  utils/
```

## Pré-requisitos

- Node.js 20+
- Docker + Docker Compose
- Projeto Supabase configurado
- Chave da OpenAI

## Variáveis de ambiente

Backend (`backend/.env`):

```env
PORT=3000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=
OPENAI_API_KEY=
CORS_ORIGIN=http://localhost:5173
CHAT_MAX_MESSAGES_PER_CONVERSATION=30
NODE_ENV=development
```

Frontend (`frontend/.env`):

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_BASE_URL=http://localhost:3000
```

## Rodando com Docker Compose

1. Copie `backend/.env.example` para `backend/.env`.
2. Copie `frontend/.env.example` para `frontend/.env`.
3. Preencha as variáveis.
4. Execute:

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:3000`

## Deploy recomendado

Para o stack atual, o caminho mais simples e estavel e:

1. Frontend na Vercel (diretorio `frontend`).
2. Backend em um provider de Node persistente (Render, Railway ou Fly.io).

Config essencial:

- `frontend/.env` em producao:
  - `VITE_API_BASE_URL=https://SEU_BACKEND`
- `backend/.env` em producao:
  - `CORS_ORIGIN=https://SEU_PROJETO.vercel.app`

Observacao: o frontend possui `frontend/vercel.json` para garantir fallback das rotas SPA (`/chat/:id`, `/history/:id`) para `index.html`.

## Banco (Supabase)

Rode o SQL em [backend/supabase/schema.sql](/c:/Users/Podcast Edição/Desktop/Docmind IA/backend/supabase/schema.sql).

Ele cria:
- extensão `vector`
- tabelas `documents`, `document_chunks`, `conversations`, `messages`
- índices (incluindo `ivfflat`)
- função `match_document_chunks` para busca vetorial
- políticas RLS por ownership

## Endpoints

Públicos:
- `POST /auth/register`
- `POST /auth/login`

Protegidos (Bearer token Supabase):
- `POST /api/documents/upload`
- `GET /api/documents`
- `DELETE /api/documents/:id`
- `POST /api/chat`
- `GET /api/conversations/:documentId`
- `GET /api/conversations/:conversationId/messages`

## Fluxo RAG

1. Usuário envia pergunta.
2. Backend gera embedding da pergunta (`text-embedding-3-small`).
3. Backend busca top 5 chunks similares no Postgres/pgvector.
4. Backend monta prompt com:
   - chunks relevantes
   - últimas 3 mensagens da conversa
5. Backend chama modelo de chat (atual: `gpt-4o-mini`, `temperature=0.3`, `max_tokens=1000`).
6. Salva mensagens `user` e `assistant`.
7. Retorna resposta em JSON.

## Coleção de API

Coleção Postman: [docs/postman_collection.json](/c:/Users/Podcast Edição/Desktop/Docmind IA/docs/postman_collection.json)

## Melhorias futuras

- Suporte DOCX e Markdown
- Streaming SSE de respostas
- Feedback like/dislike
- Compartilhamento de documentos com permissões
- Fila Bull para uploads grandes
- Observabilidade com Sentry
