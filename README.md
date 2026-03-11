# CareerForge AI 🚀

> A free, multi-agent AI career coaching system powered by **Amazon Nova** on AWS Bedrock.  
> Built for the **Amazon Nova AI Hackathon** — Agentic AI Category.

---

## 🎯 What it does
## Live Demo 🚀
- **Frontend** (Vercel): `[To be deployed]`
- **Backend** (Render): `[To be deployed]`

## Features
- **Modern Web Application**: Blazing fast front-end built with React, Vite, Tailwind CSS, and Framer Motion.
- **RESTful API**: Fast and asynchronous backend powered by FastAPI.
- **Agentic Workflow**: A pipeline of 5 specialized agents that analyze profiles, extract market trends, identify skill gaps, and generate customized roadmaps.
- **Mock Interviews**: Interactive mock interview simulator powered by Nova Lite (questions) and Nova Pro (evaluation).

## Architecture
```
[User Resume PDF & GitHub] 
        ↓ (Upload via React Frontend)
[FastAPI Backend /orchestrator]
        ↓ 
1. Profile Analyst (Nova Lite)
        ↓
2. Market Intel Analyst (Nova Lite)
        ↓
3. Gap Analyst (Nova Lite)
        ↓
4. Roadmap Generator (Nova Pro)
        ↓
[ JSON Multi-Agent Output ]
        ↓
[React UI Dashboard (Gaps, Roadmap, Intervew)]
```

**Framework:** Strands Agents (Amazon's official agents framework)  
**Models Used:** Amazon Nova Pro, Nova Lite  
**Cloud:** AWS Bedrock (us-east-1)

---

## 📁 Folder Structure

```
careerforge-ai/
├── main.py                    ← Streamlit UI entry point
├── requirements.txt           ← Python dependencies
├── .env                       ← AWS credentials (never commit!)
├── .gitignore
│
├── agents/
│   ├── orchestrator.py        ← Coordinates all agents
│   ├── profile_analyst.py     ← Parses resume (Nova Lite)
│   ├── market_intel.py        ← Company benchmarking (Nova Lite)
│   ├── gap_analyst.py         ← Skill gap analysis (Nova Lite)
│   ├── roadmap_generator.py   ← 30/60/90 day plan (Nova Pro)
│   └── mock_interview.py      ← Interview Q&A + feedback (Nova Pro)
│
└── utils/
    ├── bedrock_client.py      ← Shared AWS Bedrock client
    └── resume_parser.py       ← PDF text extractor
```

---

## ⚡ Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/namanraii/careerforge-ai.git
cd careerforge-ai
```

### 2. Create a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Add AWS credentials
Create a `.env` file in the project root:
```
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_DEFAULT_REGION=us-east-1
```

> ⚠️ You need AWS Bedrock access. Enable **Amazon Nova Pro** and **Amazon Nova Lite** models in the [AWS Bedrock console](https://console.aws.amazon.com/bedrock/).

### Running the Application Locally

The project is split into a backend API and a frontend React app. You'll need two terminal windows.

**Terminal 1: Start the FastAPI Backend**
```bash
# Ensure virtual environment is active
source venv/bin/activate
# Start Uvicorn server
uvicorn api:app --reload --port 8000
```
Backend API will be running at `http://localhost:8000/docs`.

**Terminal 2: Start the React Frontend**
```bash
cd frontend
# Install node packages if you haven't yet
npm install
# Start Vite development server
npm run dev
```
Frontend will be running at `http://localhost:5173`. Open this URL in your browser to use the app!

---

## 🤖 Agent Details

| Agent | Model | Input | Output |
|---|---|---|---|
| Profile Analyst | Nova Lite | Resume PDF text | JSON: skills, education, experience |
| Market Intel | Nova Lite | Target companies + role | Required skills per company |
| Gap Analyst | Nova Lite | Profile + Market data | Skill gaps ranked by importance |
| Roadmap Generator | Nova Pro | Gaps + profile | 30/60/90 day free-resource plan |
| Mock Interview | Nova Pro + Lite | Role + gaps | Interview Q&A with AI feedback |

---

## 💰 AWS Cost Estimate

| Model | Price | Est. Usage | Est. Cost |
|---|---|---|---|
| Nova Lite | $0.0006 / 1K tokens | ~500K tokens | ~$0.30 |
| Nova Pro | $0.0080 / 1K tokens | ~100K tokens | ~$0.80 |
| **TOTAL** | | | **~$1.10** |

---

## 🌍 Impact

Over **400 million students** in developing nations have no access to professional career coaching. CareerForge AI democratizes this by providing **expert-level, personalized career guidance entirely free**, running on AWS infrastructure that scales globally.

---

## 🛠️ Tech Stack

- **AI Models:** Amazon Nova Pro, Amazon Nova Lite
- **Framework:** Strands Agents (Amazon)
- **Backend:** Python + boto3
- **Frontend:** Streamlit
- **Cloud:** AWS Bedrock (us-east-1)

---

## 👤 Author

**Naman Rai**  
SRM University | namanrai23@gmail.com  
GitHub: [github.com/namanraii](https://github.com/namanraii)

---

> *Built for the Amazon Nova AI Hackathon 2026 — Agentic AI Category | Prize Pool: $40,000 USD*
