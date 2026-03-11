import { motion, AnimatePresence } from 'framer-motion'
import { User, Target, Map, Mic, RefreshCcw } from 'lucide-react'
import ProfileCard from './ProfileCard'
import GapAnalysis from './GapAnalysis'
import Roadmap from './Roadmap'
import MockInterview from './MockInterview'

const TABS = [
  { id: 'overview', label: 'Profile', icon: <User className="w-3.5 h-3.5" /> },
  { id: 'gaps', label: 'Gap Analysis', icon: <Target className="w-3.5 h-3.5" /> },
  { id: 'roadmap', label: 'Roadmap', icon: <Map className="w-3.5 h-3.5" /> },
  { id: 'interview', label: 'Mock Interview', icon: <Mic className="w-3.5 h-3.5" /> },
]

export default function ResultsDashboard({ data, tab, setTab, onReset }) {
  const { profile, gaps, roadmap } = data

  return (
    <div className="w-full max-w-6xl mx-auto">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold">Analysis Complete</h2>
          <p className="text-gray-500 mt-1 text-sm">Your personalised career action plan is ready.</p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] text-gray-400 text-sm transition-colors"
        >
          <RefreshCcw className="w-3.5 h-3.5" /> New Resume
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-8 p-1 bg-white/[0.03] border border-white/10 rounded-xl w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
              ${tab === t.id
                ? 'bg-white text-[#0d0f14]'
                : 'text-gray-500 hover:text-gray-300'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'overview' && <ProfileCard profile={profile} score={gaps?.readiness_score} />}
            {tab === 'gaps' && <GapAnalysis gaps={gaps} />}
            {tab === 'roadmap' && <Roadmap roadmap={roadmap} />}
            {tab === 'interview' && <MockInterview mockInterview={data?.mock_interview} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
