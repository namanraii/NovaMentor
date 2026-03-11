# CareerForge AI 🚀

> A free, multi-agent AI career coaching system powered by **Amazon Nova** on AWS Bedrock.  
> Built for the **Amazon Nova AI Hackathon** — Agentic AI Category.

---

## 🎯 What it does

CareerForge AI acts as a free, 24/7 career coach for students in tier-2/3 cities and developing nations who cannot afford human career counselors.

**Upload your resume + GitHub URL, select target companies, and five specialized AI agents:**

1. 📄 **Profile Analyst** (Nova Lite) — Parses your resume into a structured profile
2. 🏢 **Market Intel** (Nova Lite) — Benchmarks top tech company skill requirements
3. 🔎 **Gap Analyst** (Nova Lite) — Identifies your critical skill gaps
4. 🗓️ **Roadmap Generator** (Nova Pro) — Creates a personalized 30/60/90 day learning plan
5. 🎤 **Mock Interview** (Nova Pro + Nova Lite) — AI-powered interview Q&A with feedback

---

## 🏗️ Architecture

```
User (Resume PDF + GitHub URL + Target Companies)
        ↓
  Orchestrator Agent  (Nova Pro — decides sequencing)
   ↓       ↓        ↓          ↓           ↓
Profile  Market   Gap      Roadmap    Mock Interview
Analyst  Intel    Analyst  Generator  Agent
   ↓       ↓        ↓          ↓           ↓
         Final Career Report + Voice Practice
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

### 5. Run the app
```bash
streamlit run main.py
```

Open [http://localhost:8501](http://localhost:8501) in your browser.

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
