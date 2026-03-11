import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Github, Zap, AlertTriangle, CheckCircle, BookOpen, ChevronRight, Map, LineChart, Code, Building, Star, Target } from 'lucide-react'
import Header from './components/Header'
import InputPanel from './components/InputPanel'
import ResultsDashboard from './components/ResultsDashboard'

const ROLES = ['Software Engineer', 'ML Engineer', 'Data Scientist', 'Backend Engineer', 'Full Stack Engineer']
const COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'Netflix']

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [file, setFile] = useState(null)
  const [github, setGithub] = useState('')
  const [role, setRole] = useState(ROLES[0])
  const [companies, setCompanies] = useState(['Google', 'Amazon'])
  const [loading, setLoading] = useState(false)
  const [activeAgent, setActive] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('overview')

  const fileRef = useRef()

  const toggleCompany = (c) => setCompanies(prev =>
    prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
  )

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true); setError(null); setResult(null); setActive(1)
    
    const form = new FormData()
    form.append('resume', file)
    form.append('github_url', github)
    form.append('target_role', role)
    form.append('companies', companies.join(','))
    
    // Simulate agent progression while waiting for the single API call to return
    const timer = setInterval(() => {
      setActive(prev => prev < 4 ? prev + 1 : prev)
    }, 4000)
    
    try {
      const res = await fetch(`${API}/analyze`, { method: 'POST', body: form })
      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      clearInterval(timer)
      setLoading(false)
      setActive(0)
    }
  }

  return (
    <div className='min-h-screen bg-[#020817] text-white font-display overflow-x-hidden'>
      {/* Animated particle background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse-cyan" />
        <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px] animate-pulse-cyan" style={{animationDelay: '1s'}} />
      </div>

      <Header />

      <main className='relative z-10 max-w-7xl mx-auto px-6 py-10'>
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <InputPanel
                file={file} setFile={setFile} fileRef={fileRef}
                github={github} setGithub={setGithub}
                role={role} setRole={setRole}
                companies={companies} toggleCompany={toggleCompany}
                loading={loading} activeAgent={activeAgent}
                onSubmit={handleSubmit} error={error}
                ROLES={ROLES} COMPANIES={COMPANIES}
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <ResultsDashboard
                data={result} tab={tab} setTab={setTab}
                onReset={() => { setResult(null); setFile(null); }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
