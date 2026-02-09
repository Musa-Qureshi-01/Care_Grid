# CareGrid Provider Intelligence Platform

##  Overview

Healthcare payers face high operational costs and compliance risks due to incorrect provider information like outdated addresses, invalid phone numbers, expired licenses, or inaccurate specialties.

This results in **Claim Denials**, **Poor Member Experience**, **Network Adequacy Issues**, and **Heavy Manual Verification Costs**.

<hr>
<h3>Live Preview</h3>
<a href='https://healthcare-x-multi-agent.streamlit.app/'>Click Here!</a>
<hr>
<h2 style="font-size:30px;">4-Agent Semantic AI System</h2>

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

---

<h2 style="font-size:30px;">Dashboard Capabilities</h2>

<p>Our Streamlit analytics dashboard provides a full visual understanding of provider data accuracy and risks.</p>

<ul style="font-size:18px;">
  <li>✔ Confidence Distribution</li>
  <li>✔ Risk Level Breakdown</li>
  <li>✔ Average Confidence by Specialty</li>
  <li>✔ Provider Risk Heatmap</li>
  <li>✔ Confidence Heatmap</li>
  <li>✔ Top 30 High-Risk / Priority Providers</li>
  <li>✔ Automatic Email Generator for QA / Fraud Team</li>
</ul>

<div align="center">
  <img src="assets/dashboard.png" width="750" alt="Dashboard Screenshot">
</div>

<hr>

<h2 style="font-size:30px;">Wireframe Diagram</h2>
<img width="3272" height="1906" alt="Wireframe of an agent" src="https://github.com/user-attachments/assets/185e8fe9-7f11-45aa-b798-b191795d3c98" />

<hr>

<h2 style="font-size:30px;">Compliance & Security</h2>

<p>Our system is designed to follow secure data-handling and compliance-friendly workflows:</p>

<ul style="font-size:18px;">
  <li>HIPAA-friendly execution pipeline</li>
  <li>No PHI is stored after processing is complete</li>
  <li>Local-only or controlled environment execution</li>
  <li>Audit logs generated for every processed provider</li>
  <li>Encrypted API access and key-based authentication</li>
</ul>

<hr>

<h2 style="font-size:30px;">Team — Semantic Coders</h2>

<table style="width:100%; font-size:18px;">
  <tr>
    <th>Member</th>
    <th>Role</th>
  </tr>
  <tr>
    <td>Muskan Kawadkar</td>
    <td>Team Lead & Presenter</td>
  </tr>
  <tr>
    <td>Musa Qureshi</td>
    <td>Lead Agentic AI & Backend Developer</td>
  </tr>
  <tr>
    <td>Parag Tiwari</td>
    <td>Research & Quality Assurance Lead</td>
  </tr>
  <tr>
    <td>Shruti Mehra</td>
    <td>UI/UX Designer</td>
  </tr>
</table>

<hr>

<h2 style="font-size:30px;">Project Documentation</h2>

<p style="font-size:18px;">
This project includes complete documentation covering architecture, case studies, functional requirements, 
and presentation workflow.  
All documents are stored inside the <code>/docs</code> directory for easy navigation and reference.
</p>

<h3 style="font-size:22px;">Available Documentation</h3>

<ul style="font-size:18px; line-height:1.6;">

  <li>
    <a href="docs/EY_Presentation.pdf">
      <b>EY Presentation</b>
    </a> 
    – Complete pitch deck used during EY Techathon 2025.
  </li>

  <li>
    <a href="docs/Case_Study.pdf">
      <b>Case Study</b>
    </a> 
    – In-depth analysis of the problem, market, solution approach, and justification.
  </li>

  <li>
    <a href="docs/SRS_Document.pdf">
      <b>SRS Document</b>
    </a> 
    – Software Requirements Specification, including functional & non-functional requirements.
  </li>

  <li>
    <a href="docs/DOC_4_NAME">
      <b>DOC_4_NAME</b>
    </a> 
    – Description of the fourth document.
  </li>

</ul>

<pre style="background:#111; color:#0f0; padding:15px; border-radius:8px; font-size:14px;">
/docs/
    ├── EY_Presentation.pdf
    ├── Case_Study.pdf
    ├── SRS_Document.pdf
    └── DOC_4_NAME
</pre>

<hr>

<h2 style="font-size:30px;">Contributing</h2>

<p>We welcome contributions that improve accuracy, performance, or add new capabilities to the pipeline.</p>

<pre style="background:#111; color:#0f0; padding:15px; border-radius:8px; font-size:14px;">
git checkout -b feature/new-feature
git commit -m "Added advanced provider metric."
git push origin feature/new-feature
</pre>

<p>Submit a pull request to contribute</p>

<hr>

<h2 style="font-size:30px;">⭐ Support</h2>

<p>If you find this project useful, consider giving it a <b>⭐ Star</b>.  
It helps improve visibility during the EY Techathon and motivates further development!</p>

<hr>

<h2 style="font-size:30px;">Contact</h2>

<p>For queries, suggestions, or collaboration:</p>

<ul style="font-size:18px;">
  <li><b>Email:</b> musaqureshi788code@gmail.com / musaqureshi0000@gmail.com</li>
  <li><b>LinkedIn:</b> <a href="https://linkedin.com/in/musa-qureshi">linkedin.com/in/musa-qureshi</a></li>
</ul>

<div align="center">
  <h3 style="margin-top:30px;">Made with ❤️ by Team Semantic Coders</h3>
</div>
