import json
from utils.bedrock_client import get_client

def generate_roadmap(profile: dict, gaps: dict, target_role: str) -> dict:
    client = get_client()

    name = profile.get('name', 'Unknown')
    education = profile.get('education')
    university = education.get('university', 'Unknown') if isinstance(education, dict) else 'Unknown'
    readiness_score = gaps.get('readiness_score', 0)
    critical_gaps = gaps.get('critical_gaps', [])
    if not isinstance(critical_gaps, list):
        critical_gaps = []
    critical_gaps_str = ', '.join(str(g) for g in critical_gaps)

    # Build prompt using string concatenation to avoid f-string / .format() conflicts with JSON braces
    prompt = (
        "You are a world-class career coach. Create a realistic, actionable roadmap.\n\n"
        "Student: " + name + ", " + university + "\n"
        "Target Role: " + target_role + "\n"
        "Current Readiness: " + str(readiness_score) + "/100\n"
        "Critical Gaps: " + critical_gaps_str + "\n\n"
        "Create a 30/60/90 day plan with ONLY free resources (YouTube, freeCodeCamp, "
        "Coursera free tier, LeetCode, GitHub projects).\n\n"
        'Return ONLY valid JSON:\n'
        '{\n'
        '  "day_30": {"goal": "", "daily_tasks": [], "resources": [{"name": "", "url": "", "time_hours": ""}]},\n'
        '  "day_60": {"goal": "", "daily_tasks": [], "resources": []},\n'
        '  "day_90": {"goal": "", "daily_tasks": [], "resources": []},\n'
        '  "key_projects": [{"name": "", "description": "", "tech": "", "github_idea": ""}],\n'
        '  "interview_prep_tips": ["list of strings"]\n'
        '}'
    )

    response = client.converse(
        modelId="amazon.nova-pro-v1:0",
        messages=[{"role": "user", "content": [{"text": prompt}]}]
    )
    raw = response['output']['message']['content'][0]['text']
    clean = raw.strip()
    # Strip markdown code fences if present
    if clean.startswith('```'):
        clean = clean.split('\n', 1)[1] if '\n' in clean else clean
    if clean.endswith('```'):
        clean = clean.rsplit('```', 1)[0]
    clean = clean.strip()
    return json.loads(clean)
