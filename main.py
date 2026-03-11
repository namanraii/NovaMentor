import streamlit as st
import json
from utils.resume_parser import extract_text
from agents.mock_interview import get_interview_questions, evaluate_answer

st.set_page_config(
    page_title='CareerForge AI',
    page_icon='🚀',
    layout='wide',
    initial_sidebar_state='expanded'
)

# ─── GLOBAL CSS + ANIMATIONS ──────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Root Variables ── */
:root {
  --bg-primary:   #06080f;
  --bg-secondary: #0d1117;
  --bg-card:      rgba(255,255,255,0.04);
  --border:       rgba(255,255,255,0.08);
  --border-hover: rgba(79,148,255,0.5);
  --text-primary: #e6edf3;
  --text-muted:   #7d8590;
  --accent-blue:  #4f94ff;
  --accent-purple:#a855f7;
  --accent-orange:#ff6b35;
  --accent-green: #3fb950;
  --accent-red:   #f85149;
  --accent-yellow:#e3b341;
}

/* ── Base App ── */
html, body, [data-testid="stAppViewContainer"] {
  font-family: 'Inter', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* ── Animated particle background ── */
[data-testid="stAppViewContainer"]::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 40% at 20% 20%, rgba(79,148,255,0.07) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(168,85,247,0.07) 0%, transparent 60%),
    radial-gradient(ellipse 50% 30% at 50% 50%, rgba(255,107,53,0.04) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
  animation: bgPulse 10s ease-in-out infinite alternate;
}

@keyframes bgPulse {
  0%   { opacity: 0.6; }
  100% { opacity: 1; }
}

/* ── Sidebar ── */
[data-testid="stSidebar"] {
  background: rgba(13,17,23,0.95) !important;
  border-right: 1px solid var(--border) !important;
  backdrop-filter: blur(20px);
}
[data-testid="stSidebar"] > div { padding-top: 1.5rem; }

/* ── Main content padding ── */
.block-container { padding: 2rem 3rem; max-width: 1400px !important; }

/* ── Hide Streamlit branding ── */
#MainMenu, footer, header { visibility: hidden; }

/* ── Tabs ── */
[data-testid="stTabs"] button {
  font-family: 'Inter', sans-serif !important;
  font-weight: 600 !important;
  font-size: 0.85rem !important;
  color: var(--text-muted) !important;
  border-radius: 8px 8px 0 0 !important;
  transition: all 0.2s !important;
}
[data-testid="stTabs"] button[aria-selected="true"] {
  color: var(--accent-blue) !important;
  border-bottom: 2px solid var(--accent-blue) !important;
  background: rgba(79,148,255,0.06) !important;
}
[data-testid="stTabsContent"] {
  border: 1px solid var(--border);
  border-radius: 0 0 12px 12px;
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  padding: 1.5rem !important;
}

/* ── Buttons ── */
.stButton > button {
  font-family: 'Inter', sans-serif !important;
  font-weight: 600 !important;
  border-radius: 10px !important;
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1) !important;
  border: none !important;
}
.stButton > button[kind="primary"] {
  background: linear-gradient(135deg, #4f94ff, #a855f7) !important;
  color: white !important;
  box-shadow: 0 0 20px rgba(79,148,255,0.3) !important;
}
.stButton > button[kind="primary"]:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 0 35px rgba(79,148,255,0.5) !important;
}
.stButton > button:not([kind="primary"]) {
  background: rgba(255,255,255,0.05) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border) !important;
}
.stButton > button:not([kind="primary"]):hover {
  background: rgba(79,148,255,0.1) !important;
  border-color: var(--accent-blue) !important;
  transform: translateY(-1px) !important;
}

/* ── Inputs ── */
.stTextInput input, .stTextArea textarea, .stSelectbox select {
  background: rgba(255,255,255,0.04) !important;
  border: 1px solid var(--border) !important;
  border-radius: 8px !important;
  color: var(--text-primary) !important;
  font-family: 'Inter', sans-serif !important;
  transition: border-color 0.2s !important;
}
.stTextInput input:focus, .stTextArea textarea:focus {
  border-color: var(--accent-blue) !important;
  box-shadow: 0 0 0 3px rgba(79,148,255,0.15) !important;
}

/* ── File uploader ── */
[data-testid="stFileUploader"] {
  border: 2px dashed var(--border) !important;
  border-radius: 12px !important;
  background: rgba(255,255,255,0.02) !important;
  transition: all 0.2s !important;
}
[data-testid="stFileUploader"]:hover {
  border-color: var(--accent-blue) !important;
  background: rgba(79,148,255,0.04) !important;
}

/* ── Progress bar ── */
.stProgress > div > div {
  background: linear-gradient(90deg, #4f94ff, #a855f7) !important;
  border-radius: 99px !important;
}
.stProgress > div {
  background: rgba(255,255,255,0.06) !important;
  border-radius: 99px !important;
}

/* ── Info / Success / Error / Warning ── */
.stAlert {
  border-radius: 10px !important;
  border: 1px solid !important;
  backdrop-filter: blur(10px) !important;
}

/* ── Spinner ── */
.stSpinner > div { border-top-color: var(--accent-blue) !important; }

/* ── Expanders ── */
.streamlit-expanderHeader {
  background: rgba(255,255,255,0.03) !important;
  border: 1px solid var(--border) !important;
  border-radius: 10px !important;
  font-family: 'Inter', sans-serif !important;
  font-weight: 600 !important;
  transition: all 0.2s !important;
}
.streamlit-expanderHeader:hover {
  border-color: var(--border-hover) !important;
  background: rgba(79,148,255,0.05) !important;
}

/* ── CUSTOM COMPONENTS ── */
.hero-title {
  font-size: 3.2rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #4f94ff 0%, #c084fc 50%, #ff6b35 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 5s ease infinite;
  line-height: 1.1;
}
@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.hero-sub {
  color: var(--text-muted);
  font-size: 1.05rem;
  font-weight: 400;
  margin-top: 0.4rem;
  letter-spacing: 0.01em;
}
.nova-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(79,148,255,0.12);
  border: 1px solid rgba(79,148,255,0.3);
  color: #4f94ff;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  backdrop-filter: blur(4px);
  margin-right: 6px;
  animation: fadeInUp 0.6s ease both;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.metric-card {
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 24px 20px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease both;
}
.metric-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.3s;
}
.metric-card:hover {
  transform: translateY(-4px);
  border-color: rgba(79,148,255,0.4);
  box-shadow: 0 12px 40px rgba(79,148,255,0.12), 0 0 0 1px rgba(79,148,255,0.15);
}
.metric-val {
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
}
.metric-lbl {
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 6px;
}
.metric-card.blue .metric-val  { color: #4f94ff; }
.metric-card.purple .metric-val { color: #a855f7; }
.metric-card.orange .metric-val { color: #ff6b35; }
.metric-card.green .metric-val  { color: #3fb950; }

.glass-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease both;
}
.glass-card:hover {
  border-color: rgba(79,148,255,0.35);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.skill-chip {
  display: inline-block;
  background: rgba(79,148,255,0.1);
  border: 1px solid rgba(79,148,255,0.25);
  color: #7ab8ff;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.78rem;
  font-weight: 500;
  margin: 3px;
  transition: all 0.2s;
  cursor: default;
  animation: fadeInUp 0.4s ease both;
}
.skill-chip:hover {
  background: rgba(79,148,255,0.2);
  border-color: rgba(79,148,255,0.5);
  transform: scale(1.05);
}

.gap-chip {
  display: inline-block;
  background: rgba(248,81,73,0.1);
  border: 1px solid rgba(248,81,73,0.25);
  color: #f87171;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 500;
  margin: 3px;
  animation: fadeInUp 0.4s ease both;
}
.strength-chip {
  display: inline-block;
  background: rgba(63,185,80,0.1);
  border: 1px solid rgba(63,185,80,0.25);
  color: #6ee7b7;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 500;
  margin: 3px;
  animation: fadeInUp 0.4s ease both;
}
.moderate-chip {
  display: inline-block;
  background: rgba(227,179,65,0.1);
  border: 1px solid rgba(227,179,65,0.25);
  color: #fbbf24;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 500;
  margin: 3px;
  animation: fadeInUp 0.4s ease both;
}

.section-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.agent-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(168,85,247,0.12);
  border: 1px solid rgba(168,85,247,0.25);
  color: #c084fc;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 14px;
}

.timeline-item {
  position: relative;
  padding-left: 20px;
  margin-bottom: 10px;
  color: var(--text-muted);
  font-size: 0.88rem;
  line-height: 1.5;
}
.timeline-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-blue);
}

.q-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease both;
}
.q-card:hover { border-color: rgba(79,148,255,0.3); }
.q-card.answered { border-color: rgba(63,185,80,0.3); background: rgba(63,185,80,0.03); }

.score-ring {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: 800;
  border: 3px solid;
}
.score-high  { border-color: #3fb950; color: #3fb950; background: rgba(63,185,80,0.1); }
.score-mid   { border-color: #e3b341; color: #e3b341; background: rgba(227,179,65,0.1); }
.score-low   { border-color: #f85149; color: #f85149; background: rgba(248,81,73,0.1); }

.readiness-bar {
  height: 8px;
  border-radius: 99px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
  margin-top: 8px;
}
.readiness-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #4f94ff, #a855f7, #ff6b35);
  animation: fillBar 1.5s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes fillBar {
  from { width: 0%; }
}

.edu-block {
  background: rgba(79,148,255,0.06);
  border: 1px solid rgba(79,148,255,0.15);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}
.edu-degree { font-size: 1rem; font-weight: 700; color: var(--text-primary); }
.edu-uni    { font-size: 0.85rem; color: var(--text-muted); margin-top: 2px; }
.edu-cgpa   { font-size: 0.85rem; color: var(--accent-green); font-weight: 600; margin-top: 4px; }

.welcome-hero {
  text-align: center;
  padding: 80px 20px 60px;
  animation: fadeInUp 0.8s ease both;
}
.feature-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px 24px;
  text-align: center;
  transition: all 0.3s ease;
  height: 100%;
  animation: fadeInUp 0.6s ease both;
}
.feature-card:hover {
  transform: translateY(-6px);
  border-color: rgba(79,148,255,0.35);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.feature-icon  { font-size: 2.4rem; margin-bottom: 12px; }
.feature-title { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
.feature-desc  { font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; }

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
  margin: 24px 0;
}

/* Sidebar labels */
.sidebar-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 4px;
  margin-top: 16px;
}
.powered-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 6px;
  transition: all 0.2s;
}
.powered-item:hover { background: rgba(79,148,255,0.06); border-color: rgba(79,148,255,0.2); color: var(--accent-blue); }
</style>
""", unsafe_allow_html=True)

# ─── JavaScript for Count-up Animations ───────────────────────────────────────
st.markdown("""
<script>
function countUp(el, target, duration=1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start >= target) clearInterval(timer);
  }, 16);
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-countup]').forEach(el => {
    countUp(el, parseInt(el.dataset.countup));
  });
});
</script>
""", unsafe_allow_html=True)

# ─── Sidebar ──────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("""
    <div style="text-align:center;padding:8px 0 20px">
      <div style="font-size:2rem">🚀</div>
      <div style="font-weight:800;font-size:1.1rem;color:#e6edf3">CareerForge AI</div>
      <div style="font-size:0.72rem;color:#7d8590;margin-top:2px">Amazon Nova AI Hackathon</div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown('<div class="sidebar-label">📄 Resume</div>', unsafe_allow_html=True)
    uploaded_file = st.file_uploader('', type=['pdf'], label_visibility='collapsed')

    st.markdown('<div class="sidebar-label">🔗 GitHub URL</div>', unsafe_allow_html=True)
    github_url = st.text_input('', placeholder='github.com/yourname', label_visibility='collapsed')

    st.markdown('<div class="sidebar-label">🎯 Target Role</div>', unsafe_allow_html=True)
    target_role = st.selectbox('', [
        'Software Engineer', 'ML Engineer', 'Data Scientist',
        'Backend Engineer', 'Full Stack Engineer', 'DevOps Engineer'
    ], label_visibility='collapsed')

    st.markdown('<div class="sidebar-label">🏢 Target Companies</div>', unsafe_allow_html=True)
    companies = st.multiselect('', [
        'Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'Netflix',
        'Uber', 'Airbnb', 'LinkedIn', 'Twitter'
    ], default=['Google', 'Amazon'], label_visibility='collapsed')

    st.markdown('<div style="height:16px"></div>', unsafe_allow_html=True)
    run_btn = st.button('✨ Generate My Roadmap', type='primary', use_container_width=True)

    st.markdown('<div class="divider"></div>', unsafe_allow_html=True)
    st.markdown('<div class="sidebar-label">Powered By</div>', unsafe_allow_html=True)
    for icon, label in [("🧠","Nova Pro — Orchestration"), ("⚡","Nova Lite — Analysis"), ("🎤","Nova Pro — Interview"), ("🔧","Strands Agents")]:
        st.markdown(f'<div class="powered-item">{icon} <span>{label}</span></div>', unsafe_allow_html=True)

# ─── Session State ────────────────────────────────────────────────────────────
for key, default in [
    ('result', None), ('interview_questions', None),
    ('current_q_idx', 0), ('answers', {}), ('feedbacks', {})
]:
    if key not in st.session_state:
        st.session_state[key] = default

# ─── HEADER ───────────────────────────────────────────────────────────────────
st.markdown("""
<div style="padding:8px 0 28px">
  <div class="hero-title">CareerForge AI</div>
  <div class="hero-sub">Your free AI-powered career coach — built on Amazon Nova</div>
  <div style="margin-top:14px">
    <span class="nova-badge">🧠 Nova Pro</span>
    <span class="nova-badge">⚡ Nova Lite</span>
    <span class="nova-badge">🏆 Agentic AI</span>
    <span class="nova-badge">🎓 Free Forever</span>
  </div>
</div>
""", unsafe_allow_html=True)

# ─── RUN ANALYSIS ─────────────────────────────────────────────────────────────
if run_btn and uploaded_file:
    resume_bytes = uploaded_file.read()
    resume_text = extract_text(resume_bytes)
    status_box = st.empty()
    prog = st.progress(0)

    STEPS = [
        (20, "🔍 Analyzing your profile with Nova Lite..."),
        (40, "🏢 Researching company requirements..."),
        (60, "🔎 Identifying your skill gaps..."),
        (80, "🗓️ Generating your personalized roadmap with Nova Pro..."),
        (100, "✅ All done!"),
    ]

    try:
        status_box.info(STEPS[0][1])
        prog.progress(5)
        from agents.profile_analyst import analyze_profile
        profile = analyze_profile(resume_text, github_url)
        prog.progress(STEPS[0][0]); status_box.info(STEPS[1][1])

        from agents.market_intel import get_market_requirements
        market = get_market_requirements(companies, target_role)
        prog.progress(STEPS[1][0]); status_box.info(STEPS[2][1])

        from agents.gap_analyst import analyze_gaps
        gaps = analyze_gaps(profile, market)
        prog.progress(STEPS[2][0]); status_box.info(STEPS[3][1])

        from agents.roadmap_generator import generate_roadmap
        roadmap = generate_roadmap(profile, gaps, target_role)
        prog.progress(STEPS[3][0]); status_box.success(STEPS[4][1])

        st.session_state.result = {'profile': profile, 'market': market, 'gaps': gaps, 'roadmap': roadmap}
        st.session_state.interview_questions = None
        st.session_state.answers = {}
        st.session_state.feedbacks = {}
    except Exception as e:
        status_box.error(f"❌ Error: {str(e)}")
        st.stop()

    status_box.empty(); prog.empty()

elif run_btn and not uploaded_file:
    st.warning('⚠️ Please upload your resume PDF first!')

# ─── RESULTS ──────────────────────────────────────────────────────────────────
if st.session_state.result:
    result  = st.session_state.result
    profile = result['profile']
    gaps    = result['gaps']
    roadmap = result['roadmap']
    name    = profile.get('name', 'You')
    score   = gaps.get('readiness_score', 0)
    n_gaps  = len(gaps.get('critical_gaps', []))
    n_skills= len(profile.get('skills', []))
    level   = profile.get('inferred_level', 'junior').capitalize()

    st.markdown(f"""
    <div style="background:rgba(63,185,80,0.08);border:1px solid rgba(63,185,80,0.2);
                border-radius:12px;padding:14px 20px;margin-bottom:24px;
                display:flex;align-items:center;gap:12px;animation:fadeInUp 0.5s ease both">
      <span style="font-size:1.4rem">🎉</span>
      <div>
        <div style="font-weight:700;color:#3fb950">Analysis Complete!</div>
        <div style="font-size:0.85rem;color:#7d8590">Welcome, <strong style="color:#e6edf3">{name}</strong>. Your personalized career plan is ready.</div>
      </div>
    </div>
    """, unsafe_allow_html=True)

    # ── Metric cards ──────────────────────────────────────────────────────────
    c1, c2, c3, c4 = st.columns(4)
    cards = [
        (c1, score, "Readiness Score", "/100", "blue"),
        (c2, n_gaps, "Critical Gaps", " gaps", "purple" if n_gaps > 3 else "orange"),
        (c3, n_skills, "Skills Detected", " skills", "green"),
        (c4, level, "Career Level", "", "blue"),
    ]
    for col, val, lbl, suffix, cls in cards:
        with col:
            if isinstance(val, int):
                st.markdown(f"""
                <div class="metric-card {cls}">
                  <div class="metric-val" data-countup="{val}">{val}</div>
                  <div style="font-size:0.75rem;color:#7d8590;margin-top:2px">{suffix.strip()}</div>
                  <div class="metric-lbl">{lbl}</div>
                </div>""", unsafe_allow_html=True)
            else:
                st.markdown(f"""
                <div class="metric-card {cls}">
                  <div class="metric-val" style="font-size:1.6rem">{val}</div>
                  <div class="metric-lbl">{lbl}</div>
                </div>""", unsafe_allow_html=True)

    # ── Readiness bar ─────────────────────────────────────────────────────────
    st.markdown(f"""
    <div style="margin:20px 0 8px;font-size:0.78rem;color:#7d8590;font-weight:600;text-transform:uppercase;letter-spacing:0.08em">
      Readiness to {target_role} role · {score}/100
    </div>
    <div class="readiness-bar">
      <div class="readiness-fill" style="width:{score}%"></div>
    </div>
    <div style="height:24px"></div>
    """, unsafe_allow_html=True)

    # ── Tabs ──────────────────────────────────────────────────────────────────
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        '👤  Profile', '🔎  Gap Analysis', '🗓️  Roadmap',
        '🎤  Mock Interview', '📊  Raw Data'
    ])

    # ── TAB 1: Profile ────────────────────────────────────────────────────────
    with tab1:
        st.markdown('<div class="agent-pill">⚡ Nova Lite — Profile Analyst</div>', unsafe_allow_html=True)
        c1, c2 = st.columns([1, 1.2])

        with c1:
            # Education
            edu = profile.get('education', {})
            if isinstance(edu, dict):
                st.markdown(f"""
                <div class="edu-block">
                  <div class="edu-degree">🎓 {edu.get('degree','N/A')}</div>
                  <div class="edu-uni">{edu.get('university','N/A')}</div>
                  <div class="edu-cgpa">CGPA: {edu.get('cgpa','N/A')}</div>
                </div>""", unsafe_allow_html=True)

            st.markdown('<div class="section-label">🏆 Certifications</div>', unsafe_allow_html=True)
            certs = profile.get('certifications', [])
            if certs:
                for c in certs:
                    st.markdown(f'<div class="timeline-item">{c}</div>', unsafe_allow_html=True)
            else:
                st.markdown('<div style="color:#7d8590;font-size:0.85rem">No certifications listed</div>', unsafe_allow_html=True)

            st.markdown('<div style="margin-top:14px" class="section-label">📅 Experience</div>', unsafe_allow_html=True)
            exp = profile.get('experience_years', 0)
            st.markdown(f'<div style="font-size:1.8rem;font-weight:800;color:#4f94ff">{exp}<span style="font-size:1rem;color:#7d8590"> yrs</span></div>', unsafe_allow_html=True)

        with c2:
            st.markdown('<div class="section-label">💻 Skills</div>', unsafe_allow_html=True)
            skills_html = ''.join(f'<span class="skill-chip">{s}</span>' for s in profile.get('skills', []))
            st.markdown(f'<div style="margin-bottom:20px">{skills_html}</div>', unsafe_allow_html=True)

            st.markdown('<div class="section-label">🚀 Projects</div>', unsafe_allow_html=True)
            for proj in profile.get('projects', []):
                if isinstance(proj, dict):
                    with st.expander(f"💡 {proj.get('name', 'Project')}"):
                        st.markdown(f"**Tech:** `{proj.get('tech_stack','N/A')}`")
                        st.write(proj.get('description', ''))

    # ── TAB 2: Gap Analysis ───────────────────────────────────────────────────
    with tab2:
        st.markdown('<div class="agent-pill">⚡ Nova Lite — Gap Analyst</div>', unsafe_allow_html=True)

        c1, c2 = st.columns(2)
        with c1:
            st.markdown('<div class="section-label">🔴 Critical Gaps — Must Fix</div>', unsafe_allow_html=True)
            gaps_html = ''.join(f'<span class="gap-chip">❌ {g}</span>' for g in gaps.get('critical_gaps', []))
            st.markdown(f'<div style="margin-bottom:20px">{gaps_html}</div>', unsafe_allow_html=True)

            st.markdown('<div class="section-label">🟡 Moderate Gaps — Good to Have</div>', unsafe_allow_html=True)
            mod_html = ''.join(f'<span class="moderate-chip">⚠️ {g}</span>' for g in gaps.get('moderate_gaps', []))
            st.markdown(f'<div>{mod_html}</div>', unsafe_allow_html=True)

        with c2:
            st.markdown('<div class="section-label">🟢 Your Strengths</div>', unsafe_allow_html=True)
            str_html = ''.join(f'<span class="strength-chip">✅ {s}</span>' for s in gaps.get('strengths', []))
            st.markdown(f'<div style="margin-bottom:20px">{str_html}</div>', unsafe_allow_html=True)

            st.markdown('<div class="section-label">📝 Summary</div>', unsafe_allow_html=True)
            st.markdown(f"""
            <div class="glass-card" style="font-size:0.88rem;color:#c9d1d9;line-height:1.7">
              {gaps.get('summary','')}
            </div>""", unsafe_allow_html=True)

    # ── TAB 3: Roadmap ────────────────────────────────────────────────────────
    with tab3:
        st.markdown('<div class="agent-pill">🧠 Nova Pro — Roadmap Generator</div>', unsafe_allow_html=True)
        for period, emoji, color in [('day_30','🌱','#4f94ff'), ('day_60','🚀','#a855f7'), ('day_90','🏆','#ff6b35')]:
            label = period.replace('_',' ').replace('day','Day').upper()
            data = roadmap.get(period, {})
            goal = data.get('goal', '')
            with st.expander(f"{emoji} **{label}** · {goal}", expanded=(period == 'day_30')):
                c1, c2 = st.columns(2)
                with c1:
                    st.markdown(f'<div class="section-label">📋 Daily Tasks</div>', unsafe_allow_html=True)
                    for t in data.get('daily_tasks', []):
                        st.markdown(f'<div class="timeline-item">{t}</div>', unsafe_allow_html=True)
                with c2:
                    st.markdown('<div class="section-label">📚 Free Resources</div>', unsafe_allow_html=True)
                    for r in data.get('resources', []):
                        if isinstance(r, dict):
                            name = r.get('name','')
                            url = r.get('url','#')
                            hrs = r.get('time_hours','?')
                            st.markdown(f'<div class="timeline-item"><a href="{url}" target="_blank" style="color:#4f94ff;text-decoration:none">{name}</a> · <span style="color:#7d8590">{hrs}h</span></div>', unsafe_allow_html=True)

        # Key projects
        if roadmap.get('key_projects'):
            st.markdown('<div class="divider"></div>', unsafe_allow_html=True)
            st.markdown('<div class="section-label">🔨 Key Projects to Build</div>', unsafe_allow_html=True)
            pcols = st.columns(min(len(roadmap['key_projects']), 3))
            for i, proj in enumerate(roadmap.get('key_projects', [])):
                if isinstance(proj, dict):
                    with pcols[i % len(pcols)]:
                        st.markdown(f"""
                        <div class="glass-card" style="height:100%">
                          <div style="font-weight:700;color:#4f94ff;margin-bottom:8px">💡 {proj.get('name','')}</div>
                          <div style="font-size:0.82rem;color:#7d8590;margin-bottom:8px">{proj.get('description','')}</div>
                          <div style="font-size:0.78rem"><span style="color:#a855f7">Tech:</span> <code style="color:#c9d1d9">{proj.get('tech','')}</code></div>
                        </div>""", unsafe_allow_html=True)

        # Interview tips
        tips = roadmap.get('interview_prep_tips', [])
        if tips:
            st.markdown('<div class="divider"></div>', unsafe_allow_html=True)
            st.markdown('<div class="section-label">💡 Interview Prep Tips</div>', unsafe_allow_html=True)
            for tip in tips:
                st.markdown(f"""
                <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
                  <span style="color:#4f94ff;font-size:1rem;margin-top:1px">→</span>
                  <span style="font-size:0.88rem;color:#c9d1d9;line-height:1.6">{tip}</span>
                </div>""", unsafe_allow_html=True)

    # ── TAB 4: Mock Interview ─────────────────────────────────────────────────
    with tab4:
        st.markdown('<div class="agent-pill">🧠 Nova Pro + Nova Lite — Mock Interview</div>', unsafe_allow_html=True)

        st.markdown("""
        <div class="glass-card" style="margin-bottom:20px">
          <div style="font-size:1rem;font-weight:700;color:#e6edf3;margin-bottom:6px">🎤 AI Mock Interview Simulator</div>
          <div style="font-size:0.85rem;color:#7d8590;line-height:1.6">
            Practice with 5 AI-generated questions tailored to your skill gaps. Nova Lite generates targeted questions, 
            Nova Pro evaluates your answers with detailed feedback, scoring, and improvement tips.
          </div>
        </div>
        """, unsafe_allow_html=True)

        if st.session_state.interview_questions is None:
            cc1, cc2, cc3 = st.columns([1,2,1])
            with cc2:
                if st.button("🚀 Start Mock Interview Session", type="primary", use_container_width=True):
                    with st.spinner("🤖 Nova Lite is generating your personalized questions..."):
                        st.session_state.interview_questions = get_interview_questions(target_role, gaps.get('critical_gaps', []))
                        st.session_state.current_q_idx = 0
                        st.session_state.answers = {}
                        st.session_state.feedbacks = {}
                    st.rerun()
        else:
            questions = st.session_state.interview_questions
            total = len(questions)
            answered = len(st.session_state.feedbacks)

            # Session progress bar
            pct = answered / total if total > 0 else 0
            st.markdown(f"""
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
              <div style="font-size:0.82rem;color:#7d8590;font-weight:600">Session Progress</div>
              <div style="font-size:0.82rem;color:#4f94ff;font-weight:700">{answered}/{total} answered</div>
            </div>
            <div class="readiness-bar" style="margin-bottom:20px">
              <div class="readiness-fill" style="width:{pct*100:.0f}%"></div>
            </div>
            """, unsafe_allow_html=True)

            diff_map = {"easy": ("🟢", "#3fb950"), "medium": ("🟡", "#e3b341"), "hard": ("🔴", "#f85149")}

            for i, q in enumerate(questions):
                qid       = q.get('id', i)
                q_text    = q.get('question', '')
                q_type    = q.get('type', 'technical')
                difficulty = q.get('difficulty', 'medium')
                diff_icon, diff_color = diff_map.get(difficulty, ("🟡", "#e3b341"))
                is_answered = qid in st.session_state.feedbacks

                header = f"Q{i+1} · {diff_icon} {difficulty.upper()} · `{q_type}`"
                with st.expander(header, expanded=not is_answered and i == answered):
                    st.markdown(f"""
                    <div style="font-size:1rem;font-weight:700;color:#e6edf3;line-height:1.5;margin-bottom:12px;
                                padding:14px;background:rgba(79,148,255,0.05);border-radius:10px;
                                border-left:3px solid #4f94ff">
                      {q_text}
                    </div>""", unsafe_allow_html=True)

                    hints = q.get('hints', [])
                    if hints:
                        with st.expander("💡 Show Hints"):
                            for h in hints:
                                st.markdown(f'<div class="timeline-item">{h}</div>', unsafe_allow_html=True)

                    if is_answered:
                        fb    = st.session_state.feedbacks[qid]
                        sc    = fb.get('score', 0)
                        mx    = fb.get('max_score', 10)
                        verdict = fb.get('verdict', '')
                        pct_sc  = sc / mx
                        sc_cls  = 'score-high' if pct_sc >= 0.7 else ('score-mid' if pct_sc >= 0.4 else 'score-low')
                        v_emoji = {"Excellent":"🌟","Good":"✅","Needs Improvement":"⚠️","Poor":"❌"}.get(verdict,"📊")

                        st.markdown('<div class="divider"></div>', unsafe_allow_html=True)
                        fcol1, fcol2 = st.columns([1, 3])
                        with fcol1:
                            st.markdown(f"""
                            <div style="text-align:center">
                              <div class="score-ring {sc_cls}">{sc}</div>
                              <div style="font-size:0.72rem;color:#7d8590;margin-top:6px">out of {mx}</div>
                              <div style="font-size:0.82rem;font-weight:600;margin-top:6px">{v_emoji} {verdict}</div>
                            </div>""", unsafe_allow_html=True)
                        with fcol2:
                            fa, fb_col = st.columns(2)
                            with fa:
                                st.markdown('<div class="section-label">✅ Strengths</div>', unsafe_allow_html=True)
                                for s in fb.get('strengths', []):
                                    st.markdown(f'<div class="timeline-item" style="color:#6ee7b7">{s}</div>', unsafe_allow_html=True)
                            with fb_col:
                                st.markdown('<div class="section-label">🔧 Improvements</div>', unsafe_allow_html=True)
                                for imp_item in fb.get('improvements', []):
                                    st.markdown(f'<div class="timeline-item" style="color:#fbbf24">{imp_item}</div>', unsafe_allow_html=True)

                        st.markdown(f"""
                        <div style="margin-top:14px;padding:14px;background:rgba(168,85,247,0.06);
                                    border:1px solid rgba(168,85,247,0.15);border-radius:10px">
                          <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;
                                      letter-spacing:0.08em;color:#a855f7;margin-bottom:8px">📖 Ideal Answer Outline</div>
                          <div style="font-size:0.85rem;color:#c9d1d9;line-height:1.6">{fb.get('ideal_answer_outline','')}</div>
                        </div>""", unsafe_allow_html=True)

                        if fb.get('follow_up_question'):
                            st.markdown(f"""
                            <div style="margin-top:12px;padding:12px;background:rgba(255,107,53,0.06);
                                        border:1px solid rgba(255,107,53,0.15);border-radius:10px;
                                        font-size:0.85rem;color:#fdba74">
                              🔄 <strong>Follow-up:</strong> {fb.get('follow_up_question')}
                            </div>""", unsafe_allow_html=True)
                    else:
                        user_answer = st.text_area("✍️ Your Answer", key=f"ans_{qid}", height=140,
                                                   placeholder="Type your detailed answer here...")
                        scol1, scol2 = st.columns([3, 1])
                        with scol2:
                            if st.button("📤 Submit", key=f"sub_{qid}", type="primary", use_container_width=True):
                                if user_answer.strip():
                                    with st.spinner("🧠 Nova Pro is evaluating your answer..."):
                                        fb_data = evaluate_answer(q_text, user_answer, target_role)
                                    st.session_state.answers[qid] = user_answer
                                    st.session_state.feedbacks[qid] = fb_data
                                    st.rerun()
                                else:
                                    st.warning("Write your answer first!")

            # Completion
            if answered == total and total > 0:
                st.markdown('<div class="divider"></div>', unsafe_allow_html=True)
                st.balloons()
                avg = sum(st.session_state.feedbacks[q.get('id', i)].get('score', 0) for i, q in enumerate(questions)) / total
                st.markdown(f"""
                <div style="text-align:center;padding:32px;background:rgba(63,185,80,0.06);
                            border:1px solid rgba(63,185,80,0.2);border-radius:16px;animation:fadeInUp 0.6s ease both">
                  <div style="font-size:2.5rem;margin-bottom:12px">🎉</div>
                  <div style="font-size:1.3rem;font-weight:800;color:#3fb950">Interview Complete!</div>
                  <div style="font-size:1rem;color:#7d8590;margin-top:6px">Your average score: 
                    <strong style="color:#e6edf3;font-size:1.3rem">{avg:.1f}/10</strong>
                  </div>
                </div>""", unsafe_allow_html=True)
                st.markdown('<div style="height:16px"></div>', unsafe_allow_html=True)
                cc = st.columns([1, 2, 1])
                with cc[1]:
                    if st.button("🔄 New Interview Session", use_container_width=True):
                        st.session_state.interview_questions = None
                        st.session_state.answers = {}
                        st.session_state.feedbacks = {}
                        st.rerun()

    # ── TAB 5: Raw Data ───────────────────────────────────────────────────────
    with tab5:
        st.markdown('<div class="section-label">📊 Full Analysis JSON</div>', unsafe_allow_html=True)
        st.json(result)

else:
    # ── WELCOME SCREEN ────────────────────────────────────────────────────────
    st.markdown("""
    <div class="welcome-hero">
      <div style="font-size:4rem;margin-bottom:16px">🚀</div>
      <div style="font-size:1.8rem;font-weight:800;color:#e6edf3;margin-bottom:8px">
        Your AI Career Coach Awaits
      </div>
      <div style="font-size:1rem;color:#7d8590;max-width:500px;margin:0 auto;line-height:1.6">
        Upload your resume in the sidebar and let 5 specialized AI agents powered by Amazon Nova 
        build your personalized career roadmap — completely free.
      </div>
    </div>
    """, unsafe_allow_html=True)

    c1, c2, c3 = st.columns(3)
    features = [
        (c1, "🤖", "5-Agent AI System", "Profile Analyst, Market Intel, Gap Analyst, Roadmap Generator & Mock Interview — each powered by Amazon Nova."),
        (c2, "🆓", "100% Free Resources", "Your roadmap uses only free learning resources — YouTube, freeCodeCamp, LeetCode, Coursera free tier."),
        (c3, "🎤", "Live Mock Interview", "Practice with tailored interview questions. Get scored and receive expert AI feedback on every answer."),
    ]
    for col, icon, title, desc in features:
        with col:
            st.markdown(f"""
            <div class="feature-card">
              <div class="feature-icon">{icon}</div>
              <div class="feature-title">{title}</div>
              <div class="feature-desc">{desc}</div>
            </div>""", unsafe_allow_html=True)

    st.markdown('<div style="height:40px"></div>', unsafe_allow_html=True)

    # Stats strip
    st.markdown("""
    <div style="display:flex;gap:0;border:1px solid rgba(255,255,255,0.07);border-radius:14px;overflow:hidden;margin-top:8px">
      <div style="flex:1;text-align:center;padding:20px;border-right:1px solid rgba(255,255,255,0.07)">
        <div style="font-size:1.8rem;font-weight:800;color:#4f94ff">5</div>
        <div style="font-size:0.78rem;color:#7d8590;margin-top:4px;text-transform:uppercase;letter-spacing:0.08em">AI Agents</div>
      </div>
      <div style="flex:1;text-align:center;padding:20px;border-right:1px solid rgba(255,255,255,0.07)">
        <div style="font-size:1.8rem;font-weight:800;color:#a855f7">3</div>
        <div style="font-size:0.78rem;color:#7d8590;margin-top:4px;text-transform:uppercase;letter-spacing:0.08em">Nova Models</div>
      </div>
      <div style="flex:1;text-align:center;padding:20px;border-right:1px solid rgba(255,255,255,0.07)">
        <div style="font-size:1.8rem;font-weight:800;color:#ff6b35">90</div>
        <div style="font-size:0.78rem;color:#7d8590;margin-top:4px;text-transform:uppercase;letter-spacing:0.08em">Day Roadmap</div>
      </div>
      <div style="flex:1;text-align:center;padding:20px">
        <div style="font-size:1.8rem;font-weight:800;color:#3fb950">$0</div>
        <div style="font-size:0.78rem;color:#7d8590;margin-top:4px;text-transform:uppercase;letter-spacing:0.08em">Cost to User</div>
      </div>
    </div>
    """, unsafe_allow_html=True)
