import { motion, AnimatePresence } from 'framer-motion'
import { User, Target, Map, Mic, RefreshCcw } from 'lucide-react'
import ProfileCard from './ProfileCard'
import GapAnalysis from './GapAnalysis'
import Roadmap from './Roadmap'
import MockInterview from './MockInterview'

const TABS = [
  { id: 'overview', label: 'Profile', icon: <User className="w-4 h-4" /> },
  { id: 'gaps', label: 'Gap Analysis', icon: <Target className="w-4 h-4" /> },
  { id: 'roadmap', label: 'Roadmap', icon: <Map className="w-4 h-4" /> },
  { id: 'interview', label: 'Mock Interview', icon: <Mic className="w-4 h-4" /> },
]

export default function ResultsDashboard({ data, tab, setTab, onReset }) {
  const { profile, gaps, roadmap } = data

  return (
    <div className="w-full max-w-6xl mx-auto">
      
      {/* Top action bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Analysis Complete
          </h2>
          <p className="text-gray-400 mt-1">Here is your customized career action plan.</p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-[#0a1628] border border-[#1e3a5f] hover:border-cyan-500/50 hover:bg-cyan-500/10 rounded-lg text-sm text-gray-300 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" /> New Resume
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-[#1e3a5f] pb-4">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              tab === t.id 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,212,255,0.3)]' 
                : 'bg-[#0a1628] text-gray-400 border border-[#1e3a5f] hover:border-gray-500'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="relative min-h-[500px]">
        <AnimatePresence mode='wait'>
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {tab === 'overview' && <ProfileCard profile={profile} score={gaps?.readiness_score} />}
            {tab === 'gaps' && <GapAnalysis gaps={gaps} />}
            {tab === 'roadmap' && <Roadmap roadmap={roadmap} />}
            {tab === 'interview' && <MockInterview questions={data?.mock_interview} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
