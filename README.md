# NovaMentor 🚀

> A free, multi-agent AI career coaching system powered by **Amazon Nova** on AWS Bedrock.  
> Built for the **Amazon Nova AI Hackathon 2026 — Agentic AI Category 

---

## 🔗 Live Demo
- **Frontend** (Vercel): `https://nova-mentor-phi.vercel.app`
- **Backend** (Render): `https://novamentor-api.onrender.com`

---

## ✨ Features

- **Premium React UI** — Built with Vite, Tailwind CSS, Framer Motion, and DM Sans — Linear/Vercel-inspired dark design
- **5 Specialized AI Agents** — Each powered by Amazon Nova, running in a sequential agentic pipeline
- **30/60/90 Day Roadmap** — Personalized, free-resource action plan with portfolio projects and industry tips
- **Gap Analysis** — Critical skill gaps ranked by importance with strengths highlighted
- **Mock Interview** — AI-generated role-specific questions (conceptual, coding, behavioral) with hints
- **FastAPI Backend** — Clean REST API replacing Streamlit, ready for production deployment
- **100% Free Resources** — Every roadmap recommendation uses free tools (YouTube, freeCodeCamp, LeetCode, GitHub)

---

## 🏗️ Architecture

```
[User] → uploads PDF + inputs via React Frontend
         ↓
[FastAPI /analyze endpoint]
         ↓
┌─────────────────────────────────────────┐
│  1. Profile Analyst     (Nova Lite)     │  ← Parses resume, GitHub, skills
│  2. Market Intel        (Nova Lite)     │  ← Benchmarks target companies
│  3. Gap Analyst         (Nova Lite)     │  ← Ranks skill gaps
│  4. Roadmap Generator   (Nova Pro)      │  ← 30/60/90 day plan + projects
│  5. Mock Interview      (Nova Lite)     │  ← Interview questions with hints
└─────────────────────────────────────────┘
         ↓
[React Dashboard] → Overview · Gaps · Roadmap · Interview tabs
```

**Models:** Amazon Nova Pro, Amazon Nova Lite  
**Cloud:** AWS Bedrock (us-east-1)

---

## 📁 Project Structure

```
novamentor/
├── api.py                     ← FastAPI app (main entry point)
├── main.py                    ← Legacy Streamlit UI (kept for reference)
├── requirements.txt
├── render.yaml                ← Render.com backend deploy config
├── .env                       ← AWS credentials (never commit!)
│
├── agents/
│   ├── orchestrator.py        ← Runs all 5 agents in sequence
│   ├── profile_analyst.py     ← Resume + GitHub parser (Nova Lite)
│   ├── market_intel.py        ← Company skill benchmarking (Nova Lite)
│   ├── gap_analyst.py         ← Skill gap ranker (Nova Lite)
│   ├── roadmap_generator.py   ← 90-day roadmap + projects (Nova Pro)
│   └── mock_interview.py      ← Interview Q&A generator (Nova Lite)
│
├── utils/
│   ├── bedrock_client.py      ← Shared AWS Bedrock client
│   └── resume_parser.py       ← PDF text extractor
│
└── frontend/                  ← React + Vite application
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    ├── .env.local             ← VITE_API_URL (never commit!)
    └── src/
        ├── App.jsx            ← Main app + all components
        ├── index.css          ← Global styles + DM Sans font
        └── main.jsx
```

---

## ⚡ Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- AWS account with Bedrock access (Nova Pro + Nova Lite enabled)

### 1. Clone & backend setup
```bash
git clone https://github.com/namanraii/NovaMentor.git
cd novamentor

python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. AWS credentials
Create `.env` in the project root:
```
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_DEFAULT_REGION=us-east-1
```

> ⚠️ Enable **Amazon Nova Pro** and **Nova Lite** in the [AWS Bedrock console](https://console.aws.amazon.com/bedrock/) → Model access.

### 3. Start the FastAPI backend
```bash
source venv/bin/activate
uvicorn api:app --reload --port 8000
# API docs at http://localhost:8000/docs
```

### 4. Start the React frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local  # or create manually
# Add: VITE_API_URL=http://localhost:8000
npm run dev
# App at http://localhost:5173
```

---

## 🤖 Agent Details

| Agent | Model | Output |
|---|---|---|
| Profile Analyst | Nova Lite | Skills, education, projects, experience level |
| Market Intel | Nova Lite | Required skills per target company |
| Gap Analyst | Nova Lite | Ranked skill gaps + strengths + readiness score |
| Roadmap Generator | Nova Pro | 30/60/90 day plan, key projects, interview tips |
| Mock Interview | Nova Lite | 5 role-specific questions (conceptual/coding/behavioral) |

---

## 🚀 Deployment (Free Tier)

### Backend → Render
```bash
# render.yaml is already configured
# Push to GitHub → connect repo on render.com → auto-deploys
# Set env vars: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION
```

### Frontend → Vercel
```bash
# Connect the /frontend folder to Vercel
# Set env var: VITE_API_URL=https://your-render-backend.onrender.com
```

---

## 💰 AWS Cost Estimate

| Model | Rate | Est. per analysis |
|---|---|---|
| Nova Lite | $0.0006 / 1K tokens | ~$0.002 |
| Nova Pro | $0.0080 / 1K tokens | ~$0.018 |
| **Per analysis** | | **~$0.02** |

Fits comfortably within AWS free tier for hackathon use.

---

## 🌍 Impact

Over **400 million students** in developing nations have zero access to professional career coaching. NovaMentor democratizes this — providing expert-level, personalized guidance entirely free, running on AWS infrastructure that scales globally.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| AI Models | Amazon Nova Pro, Amazon Nova Lite |
| AI Cloud | AWS Bedrock (us-east-1) |
| Backend API | FastAPI + Uvicorn |
| PDF Parsing | PyMuPDF / pdfplumber |
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Typography | DM Sans (Google Fonts) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 👤 Author

**Naman Rai**  
SRM Institute of Science and Technology | namanrai23@gmail.com  
GitHub: [github.com/namanraii](https://github.com/namanraii)

---

> *Built for the Amazon Nova AI Hackathon 2026 — Agentic AI Category*
