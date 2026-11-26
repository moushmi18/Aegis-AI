# AEGIS AI

**Autonomous Enterprise Intelligence & Governance System**

AEGIS AI is an enterprise multi-agent platform for marketing-technology workflows. It takes a business request (for example, planning a retention campaign), retrieves grounded evidence from company documents, coordinates specialized agents, validates recommendations against policy, and pauses for human approval before any action is executed. Every decision is recorded in an audit trail.

This repository is a monorepo. Day 1 delivers the project skeleton: a FastAPI health API and a Next.js dashboard that displays live backend status. Multi-agent orchestration, RAG, approvals, and Azure deployment come in later phases.

## Technology stack (current milestone)

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Python 3.12, FastAPI, Pydantic, Uvicorn
- **Later phases:** LangGraph / LangChain, PostgreSQL + pgvector, Groq (then Azure OpenAI), Spring Boot governance service, Azure (Blob, Cosmos DB, AKS)

## Prerequisites

- Python 3.12 (3.13 works but some AI libraries may lag)
- Node.js 20 or later
- Git

## Run locally

Use two terminals. The frontend expects the backend on `http://localhost:8000`.

### Backend

```powershell
cd C:\Users\Moush\Downloads\MedAI\backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

If script activation is blocked, run without activating the venv:

```powershell
cd C:\Users\Moush\Downloads\MedAI\backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Health check: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)
API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Frontend

```powershell
cd C:\Users\Moush\Downloads\MedAI\frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page calls the backend health endpoint and shows status, version, environment, and timestamp. If the API is down, it shows an explicit offline state.

### Tests

```powershell
cd C:\Users\Moush\Downloads\MedAI\backend
.\.venv\Scripts\python.exe -m pytest -q
```

## Repository layout

```
backend/           FastAPI application
frontend/          Next.js dashboard
java-services/     Spring Boot governance service (Phase 7)
infrastructure/    Docker, Kubernetes, and Azure configuration
docs/              Architecture and ADRs
scripts/           Developer helper scripts
```

## Configuration

- Backend: copy `backend/.env.example` to `backend/.env` (already created for local development). Do not commit `.env`.
- Frontend: copy `frontend/.env.local.example` to `frontend/.env.local`. `NEXT_PUBLIC_API_URL` defaults to `http://localhost:8000`.
- `GROQ_API_KEY` is reserved for the Phase 2 LLM provider layer. Leave it empty for now.

## License

Private project — all rights reserved unless a license is added later.
