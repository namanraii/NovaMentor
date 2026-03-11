import streamlit as st
import json
from utils.resume_parser import extract_text
from agents.orchestrator import run_careerforge
from agents.mock_interview import get_interview_questions, evaluate_answer

st.set_page_config(
    page_title='CareerForge AI',
    page_icon='🚀',
    layout='wide',
    initial_sidebar_state='expanded'
)

# ─── Custom CSS ───────────────────────────────────────────────────────────────
st.markdown("""
<style>
[data-testid="stAppViewContainer"] { background: #0d1117; }
[data-testid="stSidebar"] { background: #161b22; border-right: 1px solid #30363d; }
.main-title { font-size: 2.8rem; font-weight: 800; background: linear-gradient(135deg, #ff6b35, #f7c59f, #58a6ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.sub-title { color: #8b949e; font-size: 1.1rem; margin-top: -0.5rem; margin-bottom: 1.5rem; }
.metric-card { background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 20px; text-align: center; }
.metric-value { font-size: 2.2rem; font-weight: 800; color: #58a6ff; }
.metric-label { color: #8b949e; font-size: 0.85rem; margin-top: 4px; }
.agent-badge { display: inline-block; background: #1f3a5c; color: #58a6ff; border: 1px solid #388bfd; border-radius: 6px; padding: 2px 10px; font-size: 0.75rem; font-weight: 600; margin-bottom: 8px; }
</style>
""", unsafe_allow_html=True)

# ─── Header ───────────────────────────────────────────────────────────────────
st.markdown('<div class="main-title">🚀 CareerForge AI</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">Your free AI-powered career coach — built on Amazon Nova</div>', unsafe_allow_html=True)

# ─── Sidebar ──────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### 📋 Your Details")
    st.markdown("---")
    uploaded_file = st.file_uploader('📄 Upload Resume (PDF)', type=['pdf'])
    github_url = st.text_input('🔗 GitHub URL', placeholder='github.com/yourname')
    target_role = st.selectbox('🎯 Target Role', [
        'Software Engineer', 'ML Engineer', 'Data Scientist',
        'Backend Engineer', 'Full Stack Engineer', 'DevOps Engineer'
    ])
    companies = st.multiselect('🏢 Target Companies', [
        'Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'Netflix',
        'Uber', 'Airbnb', 'LinkedIn', 'Twitter'
    ], default=['Google', 'Amazon'])

    st.markdown("---")
    run_btn = st.button('✨ Generate My Roadmap', type='primary', use_container_width=True)

    st.markdown("---")
    st.markdown("**Powered by**")
    st.markdown("🧠 Amazon Nova Pro")
    st.markdown("⚡ Amazon Nova Lite")
    st.markdown("🎤 Amazon Nova Sonic")
    st.markdown("🔧 Strands Agents")

# ─── Session State ────────────────────────────────────────────────────────────
if 'result' not in st.session_state:
    st.session_state.result = None
if 'interview_questions' not in st.session_state:
    st.session_state.interview_questions = None
if 'current_q_idx' not in st.session_state:
    st.session_state.current_q_idx = 0
if 'answers' not in st.session_state:
    st.session_state.answers = {}
if 'feedbacks' not in st.session_state:
    st.session_state.feedbacks = {}

# ─── Main Analysis ────────────────────────────────────────────────────────────
if run_btn and uploaded_file:
    resume_bytes = uploaded_file.read()
    resume_text = extract_text(resume_bytes)

    status = st.empty()
    progress = st.progress(0)

    def update_progress(msg, pct):
        status.info(f"🤖 {msg}")
        progress.progress(pct)

    with st.spinner('CareerForge AI agents are working...'):
        try:
            update_progress("Analyzing your profile...", 20)
            from agents.profile_analyst import analyze_profile
            profile = analyze_profile(resume_text, github_url)

            update_progress("Researching company requirements...", 40)
            from agents.market_intel import get_market_requirements
            market = get_market_requirements(companies, target_role)

            update_progress("Identifying skill gaps...", 60)
            from agents.gap_analyst import analyze_gaps
            gaps = analyze_gaps(profile, market)

            update_progress("Generating your personalized roadmap...", 80)
            from agents.roadmap_generator import generate_roadmap
            roadmap = generate_roadmap(profile, gaps, target_role)

            update_progress("Done! ✅", 100)

            st.session_state.result = {
                'profile': profile,
                'market': market,
                'gaps': gaps,
                'roadmap': roadmap
            }
            st.session_state.interview_questions = None  # Reset interview on new analysis
        except Exception as e:
            st.error(f"❌ Error: {str(e)}")
            st.stop()

    status.empty()
    progress.empty()

elif run_btn and not uploaded_file:
    st.warning('⚠️ Please upload your resume PDF first!')

# ─── Results Display ──────────────────────────────────────────────────────────
if st.session_state.result:
    result = st.session_state.result
    profile = result['profile']
    gaps = result['gaps']
    roadmap = result['roadmap']

    st.success(f"✅ Analysis complete for **{profile.get('name', 'You')}**!")

    # Key metrics
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown(f'<div class="metric-card"><div class="metric-value">{gaps.get("readiness_score", 0)}<span style="font-size:1rem">/100</span></div><div class="metric-label">Readiness Score</div></div>', unsafe_allow_html=True)
    with col2:
        st.markdown(f'<div class="metric-card"><div class="metric-value">{len(gaps.get("critical_gaps", []))}</div><div class="metric-label">Critical Gaps</div></div>', unsafe_allow_html=True)
    with col3:
        st.markdown(f'<div class="metric-card"><div class="metric-value">{len(profile.get("skills", []))}</div><div class="metric-label">Skills Detected</div></div>', unsafe_allow_html=True)
    with col4:
        level = profile.get("inferred_level", "junior").capitalize()
        st.markdown(f'<div class="metric-card"><div class="metric-value" style="font-size:1.4rem">{level}</div><div class="metric-label">Career Level</div></div>', unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # Tabs
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        '👤 Profile', '🔎 Gap Analysis', '🗓️ Roadmap',
        '🎤 Mock Interview', '📊 Raw Data'
    ])

    # ── Tab 1: Profile ────────────────────────────────────────────────────────
    with tab1:
        st.markdown('<div class="agent-badge">Nova Lite — Profile Analyst</div>', unsafe_allow_html=True)
        col1, col2 = st.columns(2)
        with col1:
            st.markdown("#### 🎓 Education")
            edu = profile.get('education', {})
            if isinstance(edu, dict):
                st.write(f"**Degree:** {edu.get('degree', 'N/A')}")
                st.write(f"**University:** {edu.get('university', 'N/A')}")
                st.write(f"**CGPA:** {edu.get('cgpa', 'N/A')}")
            st.markdown("#### 🏆 Certifications")
            certs = profile.get('certifications', [])
            if certs:
                for c in certs:
                    st.write(f"• {c}")
            else:
                st.write("No certifications listed")
        with col2:
            st.markdown("#### 💻 Skills")
            skills = profile.get('skills', [])
            if skills:
                cols = st.columns(3)
                for i, skill in enumerate(skills):
                    cols[i % 3].markdown(f"`{skill}`")
            st.markdown("#### 🚀 Projects")
            for proj in profile.get('projects', []):
                if isinstance(proj, dict):
                    with st.expander(f"📁 {proj.get('name', 'Project')}"):
                        st.write(f"**Tech:** {proj.get('tech_stack', 'N/A')}")
                        st.write(f"**Description:** {proj.get('description', 'N/A')}")

    # ── Tab 2: Gap Analysis ───────────────────────────────────────────────────
    with tab2:
        st.markdown('<div class="agent-badge">Nova Lite — Gap Analyst</div>', unsafe_allow_html=True)
        col1, col2 = st.columns(2)
        with col1:
            st.markdown("#### 🔴 Critical Gaps")
            for g in gaps.get('critical_gaps', []):
                st.error(f"❌ {g}")
            st.markdown("#### 🟡 Moderate Gaps")
            for g in gaps.get('moderate_gaps', []):
                st.warning(f"⚠️ {g}")
        with col2:
            st.markdown("#### 🟢 Your Strengths")
            for s in gaps.get('strengths', []):
                st.success(f"✅ {s}")
            st.markdown("#### 📝 Summary")
            st.info(gaps.get('summary', ''))

    # ── Tab 3: Roadmap ────────────────────────────────────────────────────────
    with tab3:
        st.markdown('<div class="agent-badge">Nova Pro — Roadmap Generator</div>', unsafe_allow_html=True)
        for period, emoji in [('day_30', '🌱'), ('day_60', '🚀'), ('day_90', '🏆')]:
            label = period.replace('_', ' ').replace('day', 'Day').upper()
            data = roadmap.get(period, {})
            with st.expander(f"{emoji} **{label} Plan** — {data.get('goal', '')}", expanded=(period == 'day_30')):
                col1, col2 = st.columns(2)
                with col1:
                    st.markdown("**📋 Daily Tasks:**")
                    for t in data.get('daily_tasks', []):
                        st.write(f"• {t}")
                with col2:
                    st.markdown("**📚 Free Resources:**")
                    for r in data.get('resources', []):
                        if isinstance(r, dict):
                            name = r.get('name', '')
                            url = r.get('url', '#')
                            hrs = r.get('time_hours', '')
                            st.write(f"[{name}]({url}) — {hrs}h")

        if roadmap.get('key_projects'):
            st.markdown("#### 🔨 Key Projects to Build")
            for proj in roadmap.get('key_projects', []):
                if isinstance(proj, dict):
                    with st.expander(f"💡 {proj.get('name', 'Project')}"):
                        st.write(f"**Description:** {proj.get('description', '')}")
                        st.write(f"**Tech Stack:** {proj.get('tech', '')}")
                        st.write(f"**GitHub Idea:** {proj.get('github_idea', '')}")

        if roadmap.get('interview_prep_tips'):
            st.markdown("#### 💡 Interview Prep Tips")
            for tip in roadmap.get('interview_prep_tips', []):
                st.write(f"→ {tip}")

    # ── Tab 4: Mock Interview ─────────────────────────────────────────────────
    with tab4:
        st.markdown('<div class="agent-badge">Nova Pro + Nova Lite — Mock Interview Agent</div>', unsafe_allow_html=True)
        st.markdown("### 🎤 AI Mock Interview")
        st.info("Practice with AI-generated interview questions tailored to your skill gaps. Get instant feedback powered by Amazon Nova Pro.")

        if st.session_state.interview_questions is None:
            if st.button("🚀 Start Mock Interview Session", type="primary"):
                with st.spinner("Generating personalized interview questions..."):
                    critical_gaps = gaps.get('critical_gaps', [])
                    st.session_state.interview_questions = get_interview_questions(target_role, critical_gaps)
                    st.session_state.current_q_idx = 0
                    st.session_state.answers = {}
                    st.session_state.feedbacks = {}
                st.rerun()
        else:
            questions = st.session_state.interview_questions
            total = len(questions)
            answered = len(st.session_state.feedbacks)

            # Progress bar
            st.progress(answered / total if total > 0 else 0)
            st.write(f"**Progress: {answered}/{total} questions answered**")
            st.markdown("---")

            for i, q in enumerate(questions):
                q_id = q.get('id', i)
                difficulty = q.get('difficulty', 'medium')
                q_type = q.get('type', 'technical')
                diff_color = {"easy": "🟢", "medium": "🟡", "hard": "🔴"}.get(difficulty, "🟡")

                with st.expander(
                    f"Q{i+1}: {q.get('question', '')[:80]}... {diff_color} {difficulty.upper()}",
                    expanded=(q_id not in st.session_state.feedbacks)
                ):
                    st.markdown(f"**Type:** `{q_type}` | **Difficulty:** {diff_color} `{difficulty}`")
                    st.markdown(f"**❓ {q.get('question', '')}**")

                    hints = q.get('hints', [])
                    if hints:
                        with st.expander("💡 Show Hints"):
                            for h in hints:
                                st.write(f"• {h}")

                    if q_id in st.session_state.feedbacks:
                        feedback = st.session_state.feedbacks[q_id]
                        st.markdown("---")
                        st.markdown("**📝 Your Answer:**")
                        st.write(st.session_state.answers.get(q_id, ''))
                        st.markdown("---")
                        score = feedback.get('score', 0)
                        max_score = feedback.get('max_score', 10)
                        verdict = feedback.get('verdict', '')
                        verdict_emoji = {"Excellent": "🌟", "Good": "✅", "Needs Improvement": "⚠️", "Poor": "❌"}.get(verdict, "📊")
                        col1, col2 = st.columns(2)
                        col1.metric("Score", f"{score}/{max_score}")
                        col2.markdown(f"**Verdict:** {verdict_emoji} {verdict}")
                        col_a, col_b = st.columns(2)
                        with col_a:
                            st.markdown("**✅ Strengths:**")
                            for s in feedback.get('strengths', []):
                                st.success(f"• {s}")
                        with col_b:
                            st.markdown("**🔧 Improvements:**")
                            for imp in feedback.get('improvements', []):
                                st.warning(f"• {imp}")
                        st.markdown("**📖 Ideal Answer Outline:**")
                        st.info(feedback.get('ideal_answer_outline', ''))
                        if feedback.get('follow_up_question'):
                            st.markdown(f"**🔄 Follow-up:** *{feedback.get('follow_up_question')}*")
                    else:
                        answer_key = f"answer_{q_id}"
                        user_answer = st.text_area(
                            "✍️ Your Answer:",
                            key=answer_key,
                            height=150,
                            placeholder="Type your answer here..."
                        )
                        if st.button(f"📤 Submit Answer", key=f"submit_{q_id}"):
                            if user_answer.strip():
                                with st.spinner("🤖 Nova Pro is evaluating your answer..."):
                                    feedback = evaluate_answer(q.get('question', ''), user_answer, target_role)
                                st.session_state.answers[q_id] = user_answer
                                st.session_state.feedbacks[q_id] = feedback
                                st.rerun()
                            else:
                                st.warning("Please write an answer before submitting.")

            if answered == total and total > 0:
                st.markdown("---")
                st.balloons()
                avg_score = sum(st.session_state.feedbacks[q.get('id', i)].get('score', 0) for i, q in enumerate(questions)) / total
                st.success(f"🎉 Interview Complete! Your average score: **{avg_score:.1f}/10**")
                if st.button("🔄 New Interview Session"):
                    st.session_state.interview_questions = None
                    st.session_state.answers = {}
                    st.session_state.feedbacks = {}
                    st.rerun()

    # ── Tab 5: Raw Data ───────────────────────────────────────────────────────
    with tab5:
        st.markdown("#### 📊 Full Analysis Data (JSON)")
        st.json(result)

else:
    # ─── Welcome Screen ───────────────────────────────────────────────────────
    st.markdown("---")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown("### 🤖 5 Specialized Agents")
        st.write("Profile Analyst, Market Intel, Gap Analyst, Roadmap Generator, and Mock Interview — each powered by Amazon Nova.")
    with col2:
        st.markdown("### 🆓 100% Free Resources")
        st.write("Your personalized learning roadmap uses only free resources — YouTube, freeCodeCamp, LeetCode, Coursera free tier.")
    with col3:
        st.markdown("### 🎤 AI Mock Interview")
        st.write("Practice with real interview questions tailored to your skill gaps. Get instant AI feedback on every answer.")
    st.markdown("---")
    st.markdown("**👈 Upload your resume in the sidebar to get started!**")
