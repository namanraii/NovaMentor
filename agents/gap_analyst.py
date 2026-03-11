import json
from utils.bedrock_client import get_client

def analyze_gaps(profile: dict, market_requirements: dict) -> dict:
    client = get_client()
    prompt = f'''
You are a career gap analyst.

Student Profile:
{json.dumps(profile, indent=2)}

Market Requirements:
{json.dumps(market_requirements, indent=2)}

Identify the skill gaps. Return ONLY valid JSON:
{{
  "critical_gaps": ["skills student lacks but companies need most"],
  "moderate_gaps": ["skills that would help but not blockers"],
  "strengths": ["skills student already has that are valued"],
  "readiness_score": "number 0-100",
  "summary": "one paragraph explanation"
}}
'''
    response = client.converse(
        modelId="amazon.nova-lite-v1:0",
        messages=[{"role": "user", "content": [{"text": prompt}]}]
    )
    raw = response['output']['message']['content'][0]['text']
    clean = raw.strip().strip('```json').strip('```').strip()
    return json.loads(clean)
