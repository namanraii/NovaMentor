# api.py — CareerForge AI Backend
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from agents.orchestrator import run_careerforge
from utils.resume_parser import extract_text
from dotenv import load_dotenv
import json

load_dotenv()

app = FastAPI(title='CareerForge AI', version='1.0.0')

# Allow React dev server to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'https://*.vercel.app'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get('/')
async def root():
    return {'status': 'CareerForge AI is running'}

@app.post('/analyze')
async def analyze(
    resume: UploadFile = File(...),
    github_url: str = Form(default=''),
    target_role: str = Form(default='Software Engineer'),
    companies: str = Form(default='Google,Amazon')
):
    resume_bytes = await resume.read()
    resume_text = extract_text(resume_bytes)

    company_list = [c.strip() for c in companies.split(',')]

    result = run_careerforge(
        resume_text, github_url, company_list, target_role
    )
    return result
