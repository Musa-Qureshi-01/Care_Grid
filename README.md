# CareGrid — Provider Intelligence & Data Quality System

> ## [Preview](https://care-grid.vercel.app/)
## Overview

Healthcare payers and networks rely on accurate provider directories for claims processing, regulatory compliance, and member experience.
In practice, provider data frequently degrades due to outdated contact details, expired licenses, incorrect specialties, or inconsistent records across sources.

This results in:

* Claim denials and rework
* Network adequacy risks
* Poor member experience
* High manual verification costs

**CareGrid** is an **agent-driven provider intelligence system** that automates provider data validation, enrichment, risk scoring, and directory generation at scale.

---

## System Architecture

CareGrid is designed as a **modular, agent-based pipeline** where each agent is responsible for a well-defined decision or verification task. Agents operate independently and can flag uncertainty, inconsistencies, or high-risk records for downstream handling.

### Agent Responsibilities

| Agent                            | Role                                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Data Validation Agent**        | Validates phone numbers, addresses, and specialties using authoritative external sources (Google Maps, NPI Registry).    |
| **Information Enrichment Agent** | Extracts and enriches provider education, certifications, and affiliations from trusted registries and public sources.   |
| **Quality Assurance Agent**      | Assigns confidence scores, flags inconsistencies, and categorizes providers into risk tiers based on validation results. |
| **Directory Management Agent**   | Generates finalized provider directory outputs (CSV, JSON, PDF) suitable for payer systems and audits.                   |

Agents can trigger re-validation or escalate records when confidence thresholds are not met.

---

## Decision Logic & Scoring (High-Level)

* **Field-level validation** across multiple sources
* **Confidence scoring** based on source agreement, recency, and completeness
* **Risk classification** (Low / Medium / High) driven by:

  * Missing critical fields
  * Conflicting data across sources
  * Expired or unverifiable credentials

This design prioritizes **decision support**, not just data aggregation.

---

## Key Outcomes (Experimental)

In controlled test datasets and internal validation runs, CareGrid demonstrated:

* Significant reduction in manual QA steps for provider verification
* High accuracy across validated provider attributes
* Scalable batch processing for thousands of providers per run

> Note: Metrics are experimental and depend on data quality, source coverage, and configuration thresholds.

<hr>

<h2 style="font-size:30px;">Wireframe Diagram</h2>
<img width="3272" height="1906" alt="Wireframe of an agent" src="https://github.com/user-attachments/assets/185e8fe9-7f11-45aa-b798-b191795d3c98" />

<hr>

## Dashboard & Analytics

CareGrid includes an analytics dashboard designed for **QA, compliance, and provider network teams** to prioritize verification workflows.

### Dashboard Capabilities

* Confidence score distribution
* Risk-level breakdown
* Average confidence by specialty
* Provider risk heatmap
* Top high-risk / priority providers
* Automated email drafts for QA or fraud review escalation

---

## Tech Stack

### Frontend

* React 19 (Vite)
* Tailwind CSS
* Framer Motion
* Shadcn/UI patterns
* Lucide Icons

### Backend

* FastAPI (Python 3.10+)
* LangChain
* Google Gemini Pro
* Pandas, NumPy
* Uvicorn (ASGI)

---

## Compliance & Security Considerations

* Designed with **HIPAA-aligned data-handling principles**
* No PHI stored after processing completion
* Supports controlled or local execution environments
* Audit logs generated per provider record
* Encrypted API access with key-based authentication

---

## Local Development Setup

### Prerequisites

* Node.js (v18+)
* Python (v3.10+)
* Google Cloud API Key (Gemini)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file with your API key.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

**Services**

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend API: [http://localhost:8000](http://localhost:8000)

---

## Documentation

The `/docs` directory contains detailed project materials:

* Case Study — problem context, market analysis, and solution rationale
* SRS Document — functional and non-functional requirements
* Architecture & Presentation Deck

```
/docs
 ├── Case_Study.pdf
 ├── SRS_Document.pdf
 ├── EY_Presentation.pdf
 └── DOC_4_NAME
```

---

## Contribution Guidelines

Contributions that improve:

* validation accuracy
* risk scoring logic
* performance or scalability

are welcome.

```bash
git checkout -b feature/new-feature
git commit -m "Add enhanced provider validation logic"
git push origin feature/new-feature
```

Submit a pull request for review.

---

## Contact

* Email: [1st](mailto:musaqureshi788code@gmail.com) | [2nd](mailto:musaqureshi0000@gmail.com)
* LinkedIn: [Click](https://www.linkedin.com/in/musaqureshi)
  
<hr>
<div align="center">
  <h3 style="margin-top:30px;">Made with ❤️ by Musa Qureshi</h3>
</div>
