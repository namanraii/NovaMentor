import json
from utils.bedrock_client import get_client

def analyze_profile(resume_text: str, github_url: str = '') -> dict:
    client = get_client()
    prompt = f'''
You are a professional career analyst. Analyze this resume.

Resume:
{resume_text}

GitHub: {github_url}

Return ONLY valid JSON with these fields:
- name (string)
- education: {{degree, university, cgpa}}
- skills: [list of strings]
- projects: [{{name, tech_stack, description}}]
- certifications: [list of strings]
- experience_years (number)
- inferred_level: junior/mid/senior
'''
    response = client.converse(
        modelId="amazon.nova-lite-v1:0",
        messages=[{"role": "user", "content": [{"text": prompt}]}]
    )
    raw = response['output']['message']['content'][0]['text']
    # Strip markdown code fences if present
    clean = raw.strip().strip('```json').strip('```').strip()
    return json.loads(clean)
