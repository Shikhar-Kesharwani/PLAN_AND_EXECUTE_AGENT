<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=220&section=header&text=Plan-and-Execute%20Agent&fontSize=60&fontColor=fff&animation=twinkling" width="100%"/>

![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=800&size=24&duration=2500&pause=800&color=8B5CF6&background=00000000&center=true&vCenter=true&multiline=true&repeat=true&width=800&height=100&lines=🧠+Plan-and-Execute+AI+Agent;⚡+LangGraph+%7C+React+%7C+FastAPI)

![Stars](https://img.shields.io/github/stars/AyushGU12/PLAN_AND_EXECUTE_AGENT?style=for-the-badge&logo=github&color=8b5cf6&labelColor=0d1117)
![LangGraph](https://img.shields.io/badge/LangGraph-0.1.0-8b5cf6?style=for-the-badge&logo=python&logoColor=white&labelColor=0d1117)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-06b6d4?style=for-the-badge&logo=fastapi&logoColor=white&labelColor=0d1117)
![React](https://img.shields.io/badge/React-18.0-61dafb?style=for-the-badge&logo=react&logoColor=white&labelColor=0d1117)

</div>

---

## 🎯 What Is This

A production-grade autonomous AI agent built with **LangGraph** and a stunning 3D **React** UI. 
Instead of answering in a single shot, this agent:
- 🧠 **Plans** — Breaks your complex query into ordered steps
- ⚙️ **Executes** — Runs each step iteratively
- 🔄 **Replans** — Adapts the plan mid-execution if needed

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Three.js
* **Backend:** FastAPI, Python
* **AI Core:** LangGraph, LangChain, Groq

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/AyushGU12/PLAN_AND_EXECUTE_AGENT.git
cd PLAN_AND_EXECUTE_AGENT

# Create virtual environment and install dependencies
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Start backend server
uvicorn api:app --reload
```
*(Make sure to set your GROQ_API_KEY in a `.env` file!)*

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## 🏗️ System Architecture

* **The Planner:** Breaks the user's complex query into a step-by-step directed acyclic graph of tasks. It decides the optimal path forward.
* **The Executor:** Sequentially tackles each step, dynamically selecting the best tools for the job (Search, VectorDB, Calculation, etc).
* **The Replanner:** Evaluates the results. If a step failed or new information shifts the goal, it instantly drafts a revised plan to keep the agent on track.

---
<div align="center">
Made with ❤️ by Ayush
</div>
