import json
import boto3
import os
from dotenv import load_dotenv

load_dotenv()


def get_interview_questions(role: str, gaps: list) -> list:
    """Generate interview questions based on role and skill gaps using Nova Lite."""
    client = boto3.client(
        "bedrock-runtime",
        region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )

    gap_str = ', '.join(str(g) for g in gaps) if gaps else 'general software engineering'

    prompt = (
        "You are a senior technical interviewer at a top tech company.\n"
        "Generate 5 realistic technical interview questions for a " + role + " role.\n"
        "Focus on these skill areas that need improvement: " + gap_str + "\n\n"
        "Mix of question types:\n"
        "- 2 conceptual/theory questions\n"
        "- 2 problem-solving/coding questions\n"
        "- 1 behavioral question\n\n"
        "Return ONLY valid JSON:\n"
        "[\n"
        "  {\"id\": 1, \"type\": \"conceptual\", \"question\": \"...\", \"hints\": [\"hint1\", \"hint2\"], \"difficulty\": \"medium\"},\n"
        "  {\"id\": 2, \"type\": \"coding\", \"question\": \"...\", \"hints\": [...], \"difficulty\": \"hard\"}\n"
        "]"
    )

    response = client.converse(
        modelId="amazon.nova-lite-v1:0",
        messages=[{"role": "user", "content": [{"text": prompt}]}]
    )
    raw = response['output']['message']['content'][0]['text']
    clean = raw.strip()
    if '```' in clean:
        parts = clean.split('```')
        for p in parts:
            stripped = p.strip()
            if stripped.startswith('json'):
                clean = stripped[4:].strip()
                break
            elif stripped.startswith('[') or stripped.startswith('{'):
                clean = stripped
                break
    return json.loads(clean)


def evaluate_answer(question: str, answer: str, role: str) -> dict:
    """Use Nova Pro to evaluate a candidate's answer and provide detailed feedback."""
    client = boto3.client(
        "bedrock-runtime",
        region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )

    prompt = (
        "You are an expert technical interviewer evaluating a " + role + " candidate.\n\n"
        "Question asked: " + question + "\n\n"
        "Candidate's answer: " + answer + "\n\n"
        "Evaluate the answer and return ONLY valid JSON:\n"
        "{\n"
        "  \"score\": 7,\n"
        "  \"max_score\": 10,\n"
        "  \"verdict\": \"Good / Needs Improvement / Excellent / Poor\",\n"
        "  \"strengths\": [\"what they got right\"],\n"
        "  \"improvements\": [\"what to add or fix\"],\n"
        "  \"ideal_answer_outline\": \"brief outline of ideal answer\",\n"
        "  \"follow_up_question\": \"one follow-up question to dig deeper\"\n"
        "}"
    )

    response = client.converse(
        modelId="amazon.nova-pro-v1:0",
        messages=[{"role": "user", "content": [{"text": prompt}]}]
    )
    raw = response['output']['message']['content'][0]['text']
    clean = raw.strip()
    if '```' in clean:
        parts = clean.split('```')
        for p in parts:
            stripped = p.strip()
            if stripped.startswith('json'):
                clean = stripped[4:].strip()
                break
            elif stripped.startswith('{'):
                clean = stripped
                break
    return json.loads(clean)


def run_mock_interview_session(role: str, gaps: list) -> dict:
    """Run a complete mock interview session — returns questions for the UI."""
    questions = get_interview_questions(role, gaps)
    return {
        "role": role,
        "questions": questions,
        "total_questions": len(questions)
    }
