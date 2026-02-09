# CareGrid Provider Intelligence Platform

## 🏥 Overview

Healthcare payers face high operational costs and compliance risks due to incorrect provider information like outdated addresses, invalid phone numbers, expired licenses, or inaccurate specialties.

This results in **Claim Denials**, **Poor Member Experience**, **Network Adequacy Issues**, and **Heavy Manual Verification Costs**.

CareGrid is a **4-Agent Semantic AI System** designed to solve this.

## 🤖 4-Agent Semantic AI System

| Agent | Role |
| :--- | :--- |
| **Agent 1 — Data Validation** | Validates phone, address, specialty using **Google Maps & NPI Registry**. |
| **Agent 2 — Information Enrichment** | Extracts education, certifications, and affiliations. |
| **Agent 3 — Quality Assurance** | Generates confidence scores, flags, and risk levels. |
| **Agent 4 — Directory Management** | Produces final directory entries + CSV/JSON/PDF exports. |

### ✨ Key Benefits
- **Reduces manual QA by 70–80%**
- **Achieves 90%+ provider accuracy**
- **Batch engine handles thousands at once**

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS, Framer Motion
- **Components**: Lucide React, Shadcn/UI patterns
- **State Management**: React Hooks

### Backend
- **Core**: FastAPI (Python 3.10+)
- **AI/ML**: LangChain, Google Gemini Pro
- **Data Processing**: Pandas, NumPy
- **Server**: Uvicorn (ASGI)

---

## 🏗️ Local Development Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Google Cloud API Key (Gemini)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```
*Note: Create a `.env` file in the root with your API Key.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be available at:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`
