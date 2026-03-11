// Full App.jsx — Linear/Vercel-inspired premium dark design
// All 4 tabs: Overview, Gaps, Roadmap, Interview

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Github, CheckCircle, RotateCcw,
         Zap, AlertTriangle, BookOpen, Mic, ChevronRight } from "lucide-react"

const API = import.meta.env.VITE_API_URL || "http://localhost:8000"
const ROLES = ["Software Engineer","ML Engineer","Data Scientist","Backend Engineer","Full Stack Engineer"]
const COMPANIES = ["Google","Amazon","Microsoft","Apple","Meta","Netflix"]
const AGENTS = [
  { id:1, name:"Profile Analyst",   icon:"◎", model:"Nova Lite" },
  { id:2, name:"Market Intel",      icon:"◈", model:"Nova Lite" },
  { id:3, name:"Gap Analyst",       icon:"◇", model:"Nova Lite" },
  { id:4, name:"Roadmap Generator", icon:"◉", model:"Nova Pro"  },
]

/* ── BACKGROUND ─────────────────────────────────────────────────── */
function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0" style={{background:"#0c0c10"}} />

      {/* Subtle top-center spotlight */}
      <div className="absolute inset-0" style={{
        background:"radial-gradient(ellipse 70% 50% at 50% -5%, rgba(139,120,255,0.11) 0%, transparent 65%)"
      }} />

      {/* Bottom-right indigo accent */}
      <div className="absolute inset-0" style={{
        background:"radial-gradient(ellipse 55% 45% at 95% 100%, rgba(99,102,241,0.07) 0%, transparent 60%)"
      }} />

      {/* Bottom-left emerald accent */}
      <div className="absolute inset-0" style={{
        background:"radial-gradient(ellipse 40% 35% at 0% 100%, rgba(16,185,129,0.05) 0%, transparent 55%)"
      }} />

      {/* Dot grid — fades at edges */}
      <div className="absolute inset-0" style={{
        backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
        backgroundSize:"32px 32px",
        maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        WebkitMaskImage:"radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)"
      }} />

      {/* Slow drifting orb — top left */}
      <motion.div className="absolute rounded-full"
        style={{
          width:600, height:600,
          background:"radial-gradient(circle, rgba(139,120,255,0.06) 0%, transparent 70%)",
          top:"-15%", left:"20%", filter:"blur(40px)"
        }}
        animate={{x:[0,40,0], y:[0,25,0]}}
        transition={{duration:20, repeat:Infinity, ease:"easeInOut"}} />

      {/* Slow drifting orb — bottom right */}
      <motion.div className="absolute rounded-full"
        style={{
          width:500, height:500,
          background:"radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
          bottom:"-10%", right:"10%", filter:"blur(40px)"
        }}
        animate={{x:[0,-30,0], y:[0,-20,0]}}
        transition={{duration:25, repeat:Infinity, ease:"easeInOut"}} />

      {/* Top edge line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{background:"linear-gradient(90deg,transparent,rgba(139,120,255,0.3),transparent)"}} />

      {/* Vignette — darkens edges */}
      <div className="absolute inset-0" style={{
        background:"radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(6,6,10,0.7) 100%)"
      }} />
    </div>
  )
}

/* ── HEADER ─────────────────────────────────────────────────────── */
function Header() {
  return (
    <motion.header initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8}}
      className="flex items-center justify-between px-8 py-6">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
          style={{background:"linear-gradient(135deg,#a78bfa,#818cf8)",boxShadow:"0 2px 12px rgba(167,139,250,0.3)"}}>
          ⚡
        </div>
        <span className="font-semibold text-white/90 tracking-tight">CareerForge</span>
        <span className="text-white/20 font-light">AI</span>
      </div>
      <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full"
        style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
          style={{boxShadow:"0 0 6px rgba(52,211,153,0.8)"}} />
        <span className="text-white/40 font-mono">Amazon Nova</span>
      </div>
    </motion.header>
  )
}

/* ── UPLOAD ─────────────────────────────────────────────────────── */
function UploadZone({file, onFile}) {
  const ref = useRef()
  const [drag, setDrag] = useState(false)
  const handle = f => f?.type==="application/pdf" && onFile(f)
  return (
    <motion.div
      onClick={()=>ref.current.click()}
      onDragOver={e=>{e.preventDefault();setDrag(true)}}
      onDragLeave={()=>setDrag(false)}
      onDrop={e=>{e.preventDefault();setDrag(false);handle(e.dataTransfer.files[0])}}
      whileHover={{scale:1.005}}
      className="relative rounded-2xl cursor-pointer transition-all duration-500 overflow-hidden"
      style={{
        background: drag ? "rgba(167,139,250,0.06)" : "rgba(255,255,255,0.02)",
        border:`1px solid ${drag?"rgba(167,139,250,0.3)":file?"rgba(52,211,153,0.25)":"rgba(255,255,255,0.07)"}`,
        padding:"2rem",
        boxShadow: file?"0 0 0 1px rgba(52,211,153,0.1), 0 8px 32px rgba(0,0,0,0.3)":"0 8px 32px rgba(0,0,0,0.2)"
      }}>
      <input ref={ref} type="file" accept=".pdf" className="hidden" onChange={e=>handle(e.target.files[0])} />
      <AnimatePresence mode="wait">
        {file ? (
          <motion.div key="done" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
            className="flex flex-col items-center gap-3 py-2">
            <div className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)"}}>
              <CheckCircle size={20} className="text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="text-sm text-white/80 font-medium">{file.name}</p>
              <p className="text-xs text-white/25 mt-0.5 font-mono">{(file.size/1024).toFixed(1)} KB</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}}
            className="flex flex-col items-center gap-3 py-2">
            <motion.div className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}
              animate={{y:[0,-3,0]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}>
              <Upload size={18} className="text-white/30" />
            </motion.div>
            <div className="text-center">
              <p className="text-sm text-white/60">Drop your resume</p>
              <p className="text-xs text-white/20 mt-0.5">PDF · up to 10MB</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── AGENT PROGRESS ─────────────────────────────────────────────── */
function AgentProgress({active}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-mono text-white/20 uppercase tracking-widest mb-4">Agents Working</p>
      {AGENTS.map(a => {
        const isActive = active===a.id, isDone = active>a.id
        return (
          <motion.div key={a.id}
            animate={{opacity: isDone||isActive?1:0.35}}
            className="flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-300"
            style={{
              background: isActive?"rgba(167,139,250,0.06)":"transparent",
              border:`1px solid ${isActive?"rgba(167,139,250,0.2)":isDone?"rgba(52,211,153,0.15)":"transparent"}`
            }}>
            <span className="text-xs font-mono" style={{color:isDone?"#34d399":isActive?"#a78bfa":"rgba(255,255,255,0.2)"}}>
              {a.icon}
            </span>
            <div className="flex-1">
              <p className="text-sm" style={{color:isDone?"rgba(52,211,153,0.9)":isActive?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.25)"}}>
                {a.name}
              </p>
              <p className="text-xs font-mono mt-0.5" style={{color:"rgba(255,255,255,0.15)"}}>{a.model}</p>
            </div>
            {isActive && (
              <div className="flex gap-1">
                {[0,1,2].map(j=>(
                  <motion.div key={j} className="w-1 h-1 rounded-full bg-violet-400"
                    animate={{opacity:[0.2,1,0.2]}}
                    transition={{delay:j*0.25,repeat:Infinity,duration:0.9}} />
                ))}
              </div>
            )}
            {isDone && <CheckCircle size={13} className="text-emerald-400 opacity-60" />}
          </motion.div>
        )
      })}
    </div>
  )
}

/* ── GAUGE ──────────────────────────────────────────────────────── */
function Gauge({score}) {
  const r=52,cx=65,cy=65,circ=2*Math.PI*r
  const arc=circ*0.75,dash=arc*(score/100)
  const color=score>=70?"#34d399":score>=40?"#fbbf24":"#f87171"
  return (
    <svg width="130" height="105">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8"
        strokeDasharray={`${arc} ${circ}`} strokeLinecap="round" transform="rotate(135 65 65)" />
      <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round" transform="rotate(135 65 65)"
        initial={{strokeDasharray:`0 ${circ}`}}
        animate={{strokeDasharray:`${dash} ${circ}`}}
        transition={{duration:1.5,ease:"easeOut",delay:0.3}} />
      <text x={cx} y={cy-2} textAnchor="middle" fill={color} fontSize="24"
        fontWeight="600" fontFamily="ui-monospace,monospace">{score}</text>
      <text x={cx} y={cy+14} textAnchor="middle" fill="rgba(255,255,255,0.2)"
        fontSize="8" fontFamily="system-ui" letterSpacing="2">READY</text>
    </svg>
  )
}

/* ── RESULTS ────────────────────────────────────────────────────── */
const TABS = [
  {id:"overview",  label:"Overview",   icon:Zap},
  {id:"gaps",      label:"Gaps",       icon:AlertTriangle},
  {id:"roadmap",   label:"Roadmap",    icon:BookOpen},
  {id:"interview", label:"Interview",  icon:Mic},
]

function ResultsDashboard({data, onReset}) {
  const [tab,setTab] = useState("overview")
  const {profile={}, gaps={}, roadmap={}} = data
  const periodColors = {"day_30":"#818cf8","day_60":"#a78bfa","day_90":"#c4b5fd"}
  const periodLabels = {"day_30":"First 30 Days","day_60":"Days 31–60","day_90":"Days 61–90"}

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white/90">{profile.name||"Analysis Complete"}</h2>
          <p className="text-sm text-white/30 mt-0.5">{profile.education?.university} · {profile.education?.degree}</p>
        </div>
        <button onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 rounded-lg"
          style={{border:"1px solid rgba(255,255,255,0.06)"}}>
          <RotateCcw size={11}/> Start over
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {label:"Readiness", v:`${gaps.readiness_score||0}%`, c:"#34d399"},
          {label:"Gaps Found", v:gaps.critical_gaps?.length||0, c:"#f87171"},
          {label:"Strengths", v:gaps.strengths?.length||0, c:"#818cf8"},
          {label:"Level", v:gaps.readiness_score>=75?"Senior":gaps.readiness_score>=45?"Mid":"Junior", c:"#fbbf24"},
        ].map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
            className="rounded-2xl p-5 text-center"
            style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <p className="text-2xl font-semibold font-mono" style={{color:s.c}}>{s.v}</p>
            <p className="text-xs text-white/25 mt-1 tracking-wide uppercase">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl"
        style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.05)"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
            style={{
              background:tab===t.id?"rgba(167,139,250,0.15)":"transparent",
              color:tab===t.id?"rgba(167,139,250,0.95)":"rgba(255,255,255,0.25)",
              border:tab===t.id?"1px solid rgba(167,139,250,0.2)":"1px solid transparent"
            }}>
            <t.icon size={13}/>{t.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15}}>

          {/* OVERVIEW */}
          {tab==="overview" && (
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3 rounded-2xl p-6"
                style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                <p className="text-xs font-mono text-white/20 uppercase tracking-widest mb-4">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {(profile.skills||[]).map((s,i)=>(
                    <span key={i} className="text-xs px-3 py-1 rounded-full font-mono"
                      style={{background:"rgba(129,140,248,0.08)",border:"1px solid rgba(129,140,248,0.15)",color:"rgba(165,180,252,0.8)"}}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-span-2 rounded-2xl p-5 flex flex-col items-center justify-center"
                style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                <Gauge score={gaps.readiness_score||0} />
              </div>
            </div>
          )}

          {/* GAPS */}
          {tab==="gaps" && (
            <div className="space-y-2">
              {(gaps.critical_gaps||[]).length > 0 && (
                <p className="text-xs font-mono text-red-400/60 uppercase tracking-widest mb-2">Critical Gaps</p>
              )}
              {(gaps.critical_gaps||[]).map((g,i)=>(
                <motion.div key={i} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                  className="flex items-center gap-3 px-5 py-4 rounded-xl"
                  style={{background:"rgba(248,113,113,0.04)",border:"1px solid rgba(248,113,113,0.12)"}}>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400/60 shrink-0" />
                  <span className="text-sm text-white/70">{g}</span>
                </motion.div>
              ))}
              {(gaps.strengths||[]).length > 0 && (
                <p className="text-xs font-mono text-emerald-400/60 uppercase tracking-widest mt-4 mb-2">Strengths</p>
              )}
              {(gaps.strengths||[]).map((s,i)=>(
                <motion.div key={i} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                  className="flex items-center gap-3 px-5 py-4 rounded-xl"
                  style={{background:"rgba(52,211,153,0.04)",border:"1px solid rgba(52,211,153,0.12)"}}>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0" />
                  <span className="text-sm text-white/70">{s}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* ROADMAP */}
          {tab==="roadmap" && (
            <div className="space-y-4">

              {/* 30/60/90 day phases */}
              {["day_30","day_60","day_90"].map((p)=>{
                const d = roadmap[p]||{}
                return (
                  <div key={p} className="rounded-2xl overflow-hidden"
                    style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                    <div className="flex items-center gap-3 px-6 py-4"
                      style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                      <div className="w-2 h-2 rounded-full shrink-0"
                        style={{background:periodColors[p],boxShadow:`0 0 6px ${periodColors[p]}60`}} />
                      <span className="text-sm font-medium text-white/70">{periodLabels[p]}</span>
                      {d.goal && <span className="text-xs text-white/25 truncate ml-1">— {d.goal}</span>}
                    </div>
                    <div className="px-6 py-4 space-y-2">
                      {(d.daily_tasks||d.tasks||[]).map((t,j)=>(
                        <div key={j} className="flex items-start gap-2.5 text-sm text-white/50">
                          <ChevronRight size={13} className="mt-0.5 shrink-0 text-white/20" />
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Portfolio Projects */}
              {(roadmap.key_projects||[]).length > 0 && (
                <div className="rounded-2xl overflow-hidden"
                  style={{background:"rgba(129,140,248,0.04)",border:"1px solid rgba(129,140,248,0.12)"}}>
                  <div className="flex items-center gap-3 px-6 py-4"
                    style={{borderBottom:"1px solid rgba(129,140,248,0.08)"}}>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{background:"#818cf8",boxShadow:"0 0 6px #818cf860"}} />
                    <span className="text-sm font-medium text-white/70">Portfolio Projects to Build</span>
                    <span className="text-xs font-mono text-white/20 ml-auto">{roadmap.key_projects.length} projects</span>
                  </div>
                  <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roadmap.key_projects.map((proj,i)=>(
                      <div key={i} className="rounded-xl p-4"
                        style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                        <p className="text-sm font-medium text-white/80">{proj.name}</p>
                        {proj.tech && <p className="text-xs font-mono text-indigo-300/50 mt-1">{proj.tech}</p>}
                        {proj.description && <p className="text-xs text-white/35 mt-2 leading-relaxed">{proj.description}</p>}
                        {proj.github_idea && <p className="text-xs text-white/20 mt-2 italic">{proj.github_idea}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interview Prep Tips / Industry Trends */}
              {(roadmap.interview_prep_tips||[]).length > 0 && (
                <div className="rounded-2xl overflow-hidden"
                  style={{background:"rgba(52,211,153,0.03)",border:"1px solid rgba(52,211,153,0.1)"}}>
                  <div className="flex items-center gap-3 px-6 py-4"
                    style={{borderBottom:"1px solid rgba(52,211,153,0.07)"}}>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{background:"#34d399",boxShadow:"0 0 6px #34d39960"}} />
                    <span className="text-sm font-medium text-white/70">Industry Trends & Interview Tips</span>
                  </div>
                  <div className="px-6 py-4 flex flex-wrap gap-2">
                    {roadmap.interview_prep_tips.map((tip,i)=>(
                      <span key={i} className="text-xs px-3 py-1.5 rounded-full"
                        style={{background:"rgba(52,211,153,0.07)",border:"1px solid rgba(52,211,153,0.15)",color:"rgba(110,231,183,0.75)"}}>
                        {tip}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* INTERVIEW */}
          {tab==="interview" && (() => {
            const interview = data.mock_interview
            const questions = interview?.questions || []
            if (!questions.length) return (
              <div className="rounded-2xl p-12 text-center"
                style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                <p className="text-sm text-white/25 font-mono">No interview data — run a new analysis to populate this tab.</p>
              </div>
            )
            const typeColor = {coding:"#818cf8", behavioral:"#fbbf24", conceptual:"#34d399"}
            const diffColor = {hard:"#f87171", medium:"#fbbf24", easy:"#34d399"}
            return (
              <div className="space-y-3">
                <p className="text-xs font-mono text-white/20 uppercase tracking-widest">
                  {interview.role} · {questions.length} Questions
                </p>
                {questions.map((q,i)=>{
                  const tc = typeColor[q.type] || "#818cf8"
                  const dc = diffColor[q.difficulty] || "#fbbf24"
                  return (
                    <motion.div key={i}
                      initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                      className="rounded-2xl overflow-hidden"
                      style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderLeft:`3px solid ${tc}`}}>
                      <div className="px-6 py-5">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-mono px-2.5 py-1 rounded-full capitalize"
                            style={{background:`${tc}12`,border:`1px solid ${tc}30`,color:tc}}>
                            Q{i+1} · {q.type}
                          </span>
                          <span className="text-xs font-mono capitalize" style={{color:dc}}>{q.difficulty}</span>
                        </div>
                        <p className="text-sm text-white/75 leading-relaxed">{q.question}</p>
                        {q.hints && q.hints.length > 0 && (
                          <div className="mt-4 pt-4 space-y-1.5"
                            style={{borderTop:"1px solid rgba(255,255,255,0.04)"}}>
                            <p className="text-xs font-mono text-white/15 uppercase tracking-widest mb-2">Hints</p>
                            {q.hints.map((h,j)=>(
                              <p key={j} className="text-xs text-white/35 flex items-start gap-2">
                                <ChevronRight size={11} className="mt-0.5 shrink-0 text-white/15" />{h}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )
          })()}

        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

/* ── MAIN ───────────────────────────────────────────────────────── */
export default function App() {
  const [file,setFile]   = useState(null)
  const [github,setGithub] = useState("")
  const [role,setRole]   = useState(ROLES[0])
  const [companies,setCompanies] = useState(["Google","Amazon"])
  const [loading,setLoading] = useState(false)
  const [active,setActive] = useState(0)
  const [result,setResult] = useState(null)
  const [error,setError]  = useState(null)

  const toggle = c => setCompanies(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c])

  const submit = async () => {
    if(!file) return
    setLoading(true);setError(null);setResult(null);setActive(1)
    let cur=1
    const t=setInterval(()=>{ if(cur<4) setActive(++cur) },4000)
    const form=new FormData()
    form.append("resume",file);form.append("github_url",github)
    form.append("target_role",role);form.append("companies",companies.join(","))
    try {
      const res=await fetch(`${API}/analyze`,{method:"POST",body:form})
      if(!res.ok) throw new Error()
      setResult(await res.json())
    } catch { setError("Analysis failed. Is the backend running?") }
    finally { clearInterval(t);setLoading(false);setActive(0) }
  }

  const inputStyle = {
    background:"rgba(255,255,255,0.02)",
    border:"1px solid rgba(255,255,255,0.07)",
    borderRadius:"12px", padding:"10px 14px",
    color:"rgba(255,255,255,0.7)", fontSize:"14px",
    width:"100%", outline:"none", fontFamily:"inherit"
  }
  const labelStyle = {
    display:"block", fontSize:"11px", fontFamily:"ui-monospace,monospace",
    color:"rgba(255,255,255,0.2)", textTransform:"uppercase",
    letterSpacing:"0.1em", marginBottom:"10px"
  }
  const cardStyle = {
    background:"rgba(255,255,255,0.025)",
    border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:"20px", padding:"24px",
    boxShadow:"0 1px 0 rgba(139,120,255,0.15) inset"
  }

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",minHeight:"100vh"}}>
      <Background />
      <Header />
      <main style={{maxWidth:"900px",margin:"0 auto",padding:"0 24px 80px"}}>

        {/* Hero */}
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.1}}
          style={{textAlign:"center",padding:"40px 0 56px"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:"8px",
            background:"rgba(167,139,250,0.08)",border:"1px solid rgba(167,139,250,0.15)",
            borderRadius:"100px",padding:"6px 16px",marginBottom:"28px"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#a78bfa",boxShadow:"0 0 8px #a78bfa"}} />
            <span style={{fontSize:"12px",color:"rgba(167,139,250,0.8)",fontFamily:"ui-monospace,monospace"}}>
              5 Nova AI Agents · Free Forever
            </span>
          </div>
          <h1 style={{
            fontSize:"clamp(2.8rem,6vw,5.5rem)",
            fontWeight:700, color:"rgba(255,255,255,0.92)",
            lineHeight:1.08, letterSpacing:"-0.03em",
            marginBottom:"20px", fontFamily:"'DM Sans',sans-serif"
          }}>
            Your AI-powered<br/>
            <span style={{
              background:"linear-gradient(135deg,#a78bfa 0%,#818cf8 50%,#6ee7b7 100%)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
            }}>Career Coach</span>
          </h1>
          <p style={{fontSize:"16px",color:"rgba(255,255,255,0.35)",lineHeight:1.7,maxWidth:"520px",margin:"0 auto",textAlign:"center"}}>
            Upload your resume. Five specialized AI agents analyze your profile and craft a personalized 90-day roadmap — completely free.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="input" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
              style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
              {/* LEFT */}
              <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                <UploadZone file={file} onFile={setFile} />
                <div style={cardStyle}>
                  <label style={labelStyle}><span style={{marginRight:6}}>◎</span> GitHub <span style={{opacity:0.4}}>(Optional)</span></label>
                  <input value={github} onChange={e=>setGithub(e.target.value)}
                    placeholder="https://github.com/username" style={inputStyle} />
                </div>
                <div style={cardStyle}>
                  <label style={labelStyle}><span style={{marginRight:6}}>◈</span> Target Role</label>
                  <select value={role} onChange={e=>setRole(e.target.value)} style={{...inputStyle,cursor:"pointer"}}>
                    {ROLES.map(r=><option key={r} value={r} style={{background:"#1a1a2e"}}>{r}</option>)}
                  </select>
                </div>
              </div>
              {/* RIGHT */}
              <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                <div style={cardStyle}>
                  <label style={labelStyle}><span style={{marginRight:6}}>◇</span> Target Companies</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
                    {COMPANIES.map(c=>(
                      <button key={c} onClick={()=>toggle(c)} style={{
                        padding:"7px 16px",borderRadius:"100px",fontSize:"13px",
                        cursor:"pointer",transition:"all 0.2s",fontFamily:"inherit",
                        background:companies.includes(c)?"rgba(167,139,250,0.12)":"rgba(255,255,255,0.03)",
                        border:`1px solid ${companies.includes(c)?"rgba(167,139,250,0.35)":"rgba(255,255,255,0.08)"}`,
                        color:companies.includes(c)?"rgba(167,139,250,0.95)":"rgba(255,255,255,0.3)"
                      }}>{c}</button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div style={cardStyle}><AgentProgress active={active} /></div>
                ) : (
                  <div style={cardStyle}>
                    <motion.button onClick={submit} disabled={!file}
                      whileHover={file?{scale:1.01}:{}} whileTap={file?{scale:0.99}:{}}
                      style={{
                        width:"100%",padding:"14px",borderRadius:"14px",
                        fontSize:"15px",fontWeight:600,cursor:file?"pointer":"not-allowed",
                        border:"none",transition:"all 0.3s",fontFamily:"inherit",
                        background:file?"linear-gradient(135deg,rgba(167,139,250,0.9),rgba(129,140,248,0.9))":"rgba(255,255,255,0.05)",
                        color:file?"white":"rgba(255,255,255,0.2)",
                        boxShadow:file?"0 4px 24px rgba(167,139,250,0.25)":"none"
                      }}>
                      {file?"Generate My Roadmap →":"Upload resume to continue"}
                    </motion.button>
                    {error && <p style={{color:"#f87171",fontSize:"13px",textAlign:"center",marginTop:"12px"}}>{error}</p>}
                    <p style={{textAlign:"center",fontSize:"11px",color:"rgba(255,255,255,0.15)",marginTop:"14px",fontFamily:"ui-monospace,monospace"}}>
                      Nova Pro · Nova Lite · 100% Free
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{opacity:0}} animate={{opacity:1}}>
              <ResultsDashboard data={result} onReset={()=>setResult(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
