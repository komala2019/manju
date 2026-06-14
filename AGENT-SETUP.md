# Manju Agent Service Setup

The Manju app now includes an **integrated AI chat agent** with the complete logic from the ticket resolution demo.

## Architecture

```
┌─────────────────────────────────────────┐
│  Manju Frontend (React @ port 7821)     │
│  - Chat UI component                    │
│  - Calls /api/chat endpoint             │
└────────────┬────────────────────────────┘
             │
     ┌───────┴─────────┐
     │                 │
┌────▼──────────┐  ┌───▼───────────────────────┐
│ Backend API   │  │ Agent Service (Node.js)   │
│ (.NET @ 5200) │  │ @ port 3002               │
│               │  │ - Vector DB (RAG)         │
│ - Jobs        │  │ - LLM Integration         │
│ - Auth        │  │ - Knowledge Base Retrieval│
│ - Apps        │  │ - Trace Logging           │
└───────────────┘  └───────────────────────────┘
```

## Prerequisites

- **Node.js** (for agent service)
- **Python 3** (for frontend HTTP server)
- **.NET 8** (for backend API)

## Quick Start

### Option 1: Automated (Recommended)

```powershell
cd E:\Projects\Asgard\manju-prototype
.\START-MANJU.ps1
```

This starts all three services automatically:
1. Backend API (port 5200)
2. Agent Service (port 3002)
3. Frontend (port 7821)

### Option 2: Manual

**Terminal 1 — Backend API:**
```powershell
cd E:\Projects\Asgard\manju-prototype\ManjuApi
dotnet run
# Listening on http://localhost:5200
```

**Terminal 2 — Agent Service:**
```powershell
cd E:\Projects\Asgard\manju-prototype\agent-service
npm install  # First time only
node index.js
# Listening on http://localhost:3002
```

**Terminal 3 — Frontend:**
```powershell
cd E:\Projects\Asgard\manju-prototype
python -m http.server 7821
# Listening on http://localhost:7821
```

## Access

- **Local Desktop:** http://localhost:7821
- **Mobile (same network):** http://192.168.1.7:7821
- **Health Check:** http://localhost:3002/health

## Agent Configuration

The agent service uses:
- **Vector DB:** LanceDB (local, embedded)
- **LLM:** Google Gemini or OpenAI (configurable)
- **KB:** Loaded from `agent-service/data/`

### Environment Variables

Create `agent-service/.env`:
```env
GEMINI_API_KEY=your_key_here
# OR
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

## Chat Usage

Click the **💬** button in the Manju app to open the chat panel.

**Example prompts:**
- "How do I apply for a job?"
- "What are referral requests?"
- "Help me with my profile"
- "Show me open positions"

The agent will:
1. Retrieve relevant context from the knowledge base
2. Generate a helpful response using LLM
3. Return confidence score and source articles

## Troubleshooting

**Chat says "Unable to reach assistant"**
- Ensure agent service is running on port 3002
- Check `agent.log` for errors
- Try: `curl http://localhost:3002/health`

**Agent service fails on startup**
- Check dependencies: `npm install` in `agent-service/`
- Verify Node.js version: `node --version` (should be 16+)

**LLM errors (Gemini/OpenAI)**
- Verify API key in `agent-service/.env`
- Check rate limits and quotas
- Agent falls back to KB-only mode if LLM unavailable

## Logs

- **Backend:** `backend.log`
- **Agent:** `agent.log`
- **Frontend:** `frontend.log`
- **Chat traces:** `agent-service/traces.log`

## Files

```
manju-prototype/
├── agent-service/          ← AI Chat Agent (Node.js)
│   ├── index.js
│   ├── services/
│   │   ├── vector.service.js    (RAG retrieval)
│   │   └── llm.service.js       (LLM generation)
│   ├── data/                (Knowledge base)
│   ├── utils/
│   └── package.json
├── src/
│   ├── chat-component.jsx   ← Chat UI
│   └── proto-app.jsx        (wired to agent service)
├── ManjuApi/                ← Backend API (.NET)
├── START-MANJU.ps1          ← Startup script
└── index.html               ← Frontend
```

## Development

To customize the agent:

1. **Modify KB:** Add/edit files in `agent-service/data/`
2. **Change LLM behavior:** Edit `agent-service/services/llm.service.js`
3. **Update prompts:** See `systemInstruction` in LLM service
4. **Add routes:** Edit `agent-service/index.js`

## Next Steps

- [ ] Set up API keys (Gemini or OpenAI)
- [ ] Train knowledge base with Manju-specific articles
- [ ] Customize system prompt for Manju context
- [ ] Add monitoring/analytics
- [ ] Deploy agent service to production
