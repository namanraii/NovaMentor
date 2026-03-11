import { motion } from 'framer-motion'
import { AlertCircle, Target, TrendingUp, Cpu } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
}

export default function GapAnalysis({ gaps }) {
  if (!gaps) return null

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Critical Gaps */}
      <motion.div variants={item} className="bg-[#0a1628] border border-red-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-red-900" />
        <div className="flex items-center gap-3 text-red-400 mb-6">
          <AlertCircle className="w-6 h-6" />
          <h3 className="text-xl font-bold">Critical Gaps</h3>
        </div>
        
        <div className="space-y-3">
          {(gaps.critical_gaps || []).map((gap, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-red-200 text-sm leading-relaxed flex items-start gap-3"
            >
              <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {gap}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recommended Focus */}
      <motion.div variants={item} className="bg-[#0a1628] border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-amber-900" />
        <div className="flex items-center gap-3 text-amber-400 mb-6">
          <Target className="w-6 h-6" />
          <h3 className="text-xl font-bold">Recommended Focus Area</h3>
        </div>
        
        <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <p className="text-amber-200 text-sm leading-relaxed mb-4">
            {gaps.recommended_focus || "Focus on core fundamentals."}
          </p>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-amber-500/20 text-amber-500">
            <Cpu className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">High Priority Action Item</span>
          </div>
        </div>
      </motion.div>

      {/* Up-skilling Priority (Full Width) */}
      <motion.div variants={item} className="col-span-1 lg:col-span-2 bg-[#0a1628] border border-[#1e3a5f] rounded-2xl p-6">
        <div className="flex items-center gap-3 text-cyan-400 mb-6">
          <TrendingUp className="w-6 h-6" />
          <h3 className="text-xl font-bold">Market Demands (Missing from Profile)</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* We'll just extract some example skills from the gaps if specific data isn't structured */}
          {(gaps.critical_gaps || []).slice(0, 4).map((gap, i) => {
            // Extract first 2-3 words as a "skill tag"
            const title = gap.split(' ').slice(0, 3).join(' ').replace(/[^a-zA-Z0-9 ]/g, '')
            return (
              <div key={i} className="px-4 py-2 bg-[#020817] border border-cyan-500/30 rounded-lg flex items-center gap-3 group hover:border-cyan-500 transition-colors">
                <div className="w-2 h-2 rounded-full bg-cyan-500 group-hover:animate-ping" />
                <span className="text-sm font-semibold text-gray-200">{title}...</span>
              </div>
            )
          })}
        </div>
      </motion.div>

    </motion.div>
  )
}
