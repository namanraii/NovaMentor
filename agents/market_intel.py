import json
from utils.bedrock_client import get_client

def get_market_requirements(companies: list, role: str) -> dict:
    client = get_client()
    company_list = ', '.join(companies)
    prompt = f'''
You are a technical recruiter with knowledge of {company_list}.
What are the top technical skills, tools, and experiences required
for a {role} role at each of these companies in 2025?

Return ONLY valid JSON: {{company_name: [required_skills_list]}}
'''
    response = client.converse(
        modelId="amazon.nova-lite-v1:0",
        messages=[{"role": "user", "content": [{"text": prompt}]}]
    )
    raw = response['output']['message']['content'][0]['text']
    clean = raw.strip().strip('```json').strip('```').strip()
    return json.loads(clean)
