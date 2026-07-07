<div align="center">

<!-- Animated Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=220&section=header&text=Plan-and-Execute%20AI&fontSize=60&fontColor=fff&animation=twinkling&fontAlignY=38&desc=The%20AI%20That%20Plans%2C%20Executes%20%26%20Adapts&descAlignY=58&descSize=18" width="100%"/>

<!-- Typing Animation -->
![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=800&size=24&duration=2500&pause=800&color=8B5CF6&background=00000000&center=true&vCenter=true&multiline=true&repeat=true&width=800&height=100&lines=🧠+Plan-and-Execute+AI+Agent;⚡+LangGraph+%7C+Multi-Agent+%7C+React)

<!-- Badges Row -->
![Stars](https://img.shields.io/github/stars/AyushGU12/PLAN_AND_EXECUTE_AGENT?style=for-the-badge&logo=github&color=8b5cf6&labelColor=0d1117)
![Forks](https://img.shields.io/github/forks/AyushGU12/PLAN_AND_EXECUTE_AGENT?style=for-the-badge&logo=github&color=ec4899&labelColor=0d1117)
![Issues](https://img.shields.io/github/issues/AyushGU12/PLAN_AND_EXECUTE_AGENT?style=for-the-badge&logo=github&color=06b6d4&labelColor=0d1117)
![License](https://img.shields.io/github/license/AyushGU12/PLAN_AND_EXECUTE_AGENT?style=for-the-badge&color=10b981&labelColor=0d1117)
![Visitors](https://komarev.com/ghpvc/?username=AyushGU12-PLAN-AND-EXECUTE-AGENT&style=for-the-badge&color=8b5cf6&label=REPO+VIEWS&labelColor=0d1117)

<!-- Tech Stack Badges -->
![LangGraph](https://img.shields.io/badge/LangGraph-0.1.0-8b5cf6?style=for-the-badge&logo=python&logoColor=white&labelColor=0d1117)
![Groq](https://img.shields.io/badge/Groq-LLaMA3--70B-ec4899?style=for-the-badge&logo=meta&logoColor=white&labelColor=0d1117)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-06b6d4?style=for-the-badge&logo=fastapi&logoColor=white&labelColor=0d1117)
![React](https://img.shields.io/badge/React-18.0-61dafb?style=for-the-badge&logo=react&logoColor=white&labelColor=0d1117)

<br/>

[🐛 Report Bug](https://github.com/AyushGU12/PLAN_AND_EXECUTE_AGENT/issues) &nbsp;·&nbsp;
[✨ Request Feature](https://github.com/AyushGU12/PLAN_AND_EXECUTE_AGENT/issues)

</div>

---

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%"/>

## 📋 Table of Contents

<details>
<summary>Click to expand full navigation</summary>

- [🎯 What Is This](#-what-is-this)
- [🧠 How It Works](#-how-it-works)
- [🏗️ System Architecture](#️-system-architecture)
- [⚡ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [📡 API Reference](#-api-reference)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

</details>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/solar.png" width="100%"/>

## 🎯 What Is This

<div align="center">

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   Most AI tools give you a single-shot answer.              ║
║                                                              ║
║   This AI Agent creates a PLAN, executes each step,         ║
║   checks its own work, and REPLANS if needed.               ║
║                                                              ║
║   It is not a chatbot. It is an autonomous agent.           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

</div>

A production-grade autonomous AI agent built with **LangGraph** and a stunning 3D **React** UI. 
Instead of answering in a single shot, this agent:
- 🧠 **Plans** — Breaks your complex query into ordered steps
- ⚙️ **Executes** — Runs each step iteratively
- 🔄 **Replans** — Adapts the plan mid-execution if needed

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%"/>

## 🧠 How It Works

<div align="center">

```mermaid
graph TD
    A([👤 User Query]) --> C[🧠 Planner Agent]
    C --> D[📋 Create Step Plan]
    D --> E[⚙️ Executor Agent]

    E --> L{🔄 Replanner}
    L -->|More Steps| E
    L -->|Replan| D
    L -->|Done| J[📤 Final Answer]

    style A fill:#1e1b4b,color:#fff,stroke:#8b5cf6
    style C fill:#4c1d95,color:#fff,stroke:#8b5cf6
    style E fill:#1e3a5f,color:#fff,stroke:#06b6d4
    style J fill:#1e1b4b,color:#fff,stroke:#8b5cf6
```

</div>

### The Architecture Explained

<table>
  <tr>
    <th>Agent</th>
    <th>Role</th>
    <th>What It Does</th>
  </tr>
  <tr>
    <td>🧠 <b>Planner</b></td>
    <td>Strategist</td>
    <td>Breaks complex query into ordered steps in a Directed Acyclic Graph.</td>
  </tr>
  <tr>
    <td>⚙️ <b>Executor</b></td>
    <td>Worker</td>
    <td>Runs each step using specialized tools dynamically.</td>
  </tr>
  <tr>
    <td>🔄 <b>Replanner</b></td>
    <td>Evaluator</td>
    <td>Evaluates results and drafts a revised plan if a step fails or new info shifts the goal.</td>
  </tr>
</table>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## 🏗️ System Architecture

### Agent State Machine

```mermaid
stateDiagram-v2
    [*] --> Planner : User Query
    Planner --> Executor : Plan created

    Executor --> Replanner : Check progress
    Replanner --> Executor : More steps
    Replanner --> FinalAnswer : Objective met
    Replanner --> Planner : Replan needed

    FinalAnswer --> [*]
```

### Full System Overview

```mermaid
graph TB
    subgraph Client["🖥️ Client Layer"]
        WEB[🌐 React + Vite]
        UI[✨ 3D UI / Framer Motion]
    end

    subgraph Gateway["🚪 API Gateway"]
        API[⚡ FastAPI]
        CORS[🔐 CORS]
    end

    subgraph AgentCore["🤖 Agent Core — LangGraph"]
        PL[🧠 Planner]
        EX[⚙️ Executor]
        RP[🔄 Replanner]
    end

    subgraph LLM["🧠 LLM Layer"]
        GROQ[⚡ Groq API<br/>LLaMA3]
    end

    Client --> Gateway
    Gateway --> AgentCore
    AgentCore --> LLM

    style Client fill:#1e1b4b,color:#fff,stroke:#8b5cf6
    style Gateway fill:#1a1a2e,color:#fff,stroke:#ec4899
    style AgentCore fill:#0f3460,color:#fff,stroke:#06b6d4
    style LLM fill:#2d1b4e,color:#fff,stroke:#a855f7
```

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## ⚡ Features

### Core AI Features
- ✅ **Plan-and-Execute Architecture** — Breaks complex queries into ordered steps
- ✅ **LangGraph State Machine** — Real graph-based agent orchestration
- ✅ **Dynamic Tool Selection** — Capable of picking the right tool for the job
- ✅ **Mid-Execution Replanning** — Agent adapts plan based on what it learns

### UI / UX Features
- ✅ **3D Particle Sphere** — Three.js animated background
- ✅ **Matrix Rain Effect** — Canvas-based falling characters
- ✅ **Glow Orb Animations** — Ambient purple/pink/cyan orbs
- ✅ **Live Plan Visualizer** — Watch each step execute in real-time
- ✅ **Glass Morphism Cards** — Backdrop-filter UI components
- ✅ **Neon Border Effects** — CSS glow animations
- ✅ **Framer Motion Transitions** — Smooth page and element animations

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/solar.png" width="100%"/>

## 🛠️ Tech Stack

<div align="center">

### Frontend
![React](https://skillicons.dev/icons?i=react,tailwind,vite&theme=dark)

### Backend
![Backend](https://skillicons.dev/icons?i=python,fastapi&theme=dark)

</div>

<br/>

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **LLM** | Groq LLaMA3 | Core language model |
| **Agent Framework** | LangGraph | State machine agent orchestration |
| **Backend** | FastAPI | REST API server |
| **Frontend** | React + Vite | UI framework |
| **3D Graphics** | Three.js | 3D particle effects |
| **Animations** | Framer Motion | UI animations |
| **Styling** | TailwindCSS | Utility-first CSS |

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%"/>

## 📁 Project Structure

```text
📦 PLAN_AND_EXECUTE_AGENT
│
├── 📂 frontend/                 ← React Vite 3D UI
│   ├── 📂 src/
│   │   ├── 📂 components/       ← UI Components (Hero, Visualizer, etc)
│   │   ├── 📜 App.jsx           ← Main UI Routing
│   │   └── 📜 index.css         ← Tailwind styling
│   └── 📜 package.json
│
├── 📂 src/                      ← Backend LangGraph Core
│   ├── 📂 agents/               ← Planner, Executor, Replanner
│   ├── 📂 graph/                ← Workflow State and Graph Logic
│   └── 📂 tools/                ← Agent Tools
│
├── 📜 main.py                   ← Graph Compilation
├── 📜 api.py                    ← FastAPI Server
└── 📜 requirements.txt          ← Python Dependencies
```

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## 🚀 Quick Start

### Option A — Run Backend (FastAPI + LangGraph)

```bash
# 1. Clone the repository
git clone https://github.com/AyushGU12/PLAN_AND_EXECUTE_AGENT.git
cd PLAN_AND_EXECUTE_AGENT

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup environment variables
# Create a .env file and add your GROQ_API_KEY
# GROQ_API_KEY=your_key_here

# 5. Start backend
uvicorn api:app --reload
```

### Option B — Run Frontend (React 3D UI)

```bash
# 1. Navigate to frontend folder
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start Vite Dev Server
npm run dev
# The stunning 3D UI will be available at http://localhost:5173
```

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/solar.png" width="100%"/>

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat/ask` | Run Plan-Execute agent |
| `GET`  | `/api/health` | Check API health |

<details>
<summary>📋 POST /api/chat/ask — Example</summary>

**Request:**
```json
{
  "query": "Compare quicksort and mergesort"
}
```

**Response:**
```json
{
  "answer": "## Quicksort vs Mergesort\n\n...",
  "steps_taken": ["Plan created", "Step 1 done", "Step 2 done"]
}
```

</details>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%"/>

## 🤝 Contributing

Contributions are what make this project extraordinary.

```bash
# 1. Clone your fork
git clone https://github.com/AyushGU12/PLAN_AND_EXECUTE_AGENT.git

# 2. Create feature branch
git checkout -b feature/AmazingFeature

# 3. Commit with emoji convention
git commit -m "✨ Add AmazingFeature"

# 4. Push and open PR
git push origin feature/AmazingFeature
```

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## 📜 License

Distributed under the MIT License.

See [`LICENSE`](LICENSE) for full text.

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%"/>

## 📬 Connect

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/AyushGU12)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/AyushGU12)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ayush@example.com)

</div>

<div align="center">

![Built with Love](https://forthebadge.com/images/badges/built-with-love.svg)
![Made with Python](https://forthebadge.com/images/badges/made-with-python.svg)
![Powered by Coffee](https://forthebadge.com/images/badges/powered-by-coffee.svg)

<br/>

<p>Made with ❤️ by <a href="https://github.com/AyushGU12">Ayush</a></p>
<p>⭐ Star this repo if it helped you!</p>

<!-- Footer wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=140&section=footer&animation=twinkling" width="100%"/>

</div>
