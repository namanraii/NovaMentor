from agents.profile_analyst import analyze_profile
from agents.market_intel import get_market_requirements
from agents.gap_analyst import analyze_gaps
from agents.roadmap_generator import generate_roadmap
from agents.mock_interview import run_mock_interview_session

def run_careerforge(
    resume_text: str,
    github_url: str,
    target_companies: list,
    target_role: str,
    progress_callback=None
) -> dict:

    def update(msg):
        if progress_callback:
            progress_callback(msg)

    update('Analyzing your profile...')
    profile = analyze_profile(resume_text, github_url)

    update('Researching company requirements...')
    market = get_market_requirements(target_companies, target_role)

    update('Identifying skill gaps...')
    gaps = analyze_gaps(profile, market)

    update('Generating your personalized roadmap...')
    roadmap = generate_roadmap(profile, gaps, target_role)

    update('Preparing mock interview questions...')
    critical_gaps = gaps.get('critical_gaps', []) if isinstance(gaps, dict) else []
    mock_interview = run_mock_interview_session(target_role, critical_gaps)

    update('Done!')

    return {
        'profile': profile,
        'market': market,
        'gaps': gaps,
        'roadmap': roadmap,
        'mock_interview': mock_interview,
    }
