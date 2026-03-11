import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronDown, CheckCircle, ExternalLink, Lightbulb } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
}

export default function Roadmap({ roadmap }) {
  const [openPhase, setOpenPhase] = useState(0)

  if (!roadmap || !roadmap.phases) return null

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-4">
      
      {roadmap.phases.map((phase, i) => {
        const isOpen = openPhase === i
        
        return (
          <motion.div key={i} variants={item} className="bg-[#0a1628] border border-[#1e3a5f] rounded-2xl overflow-hidden transition-colors hover:border-cyan-500/50">
            {/* Header / Clickable Area */}
            <button 
              onClick={() => setOpenPhase(isOpen ? -1 : i)}
              className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-transparent to-[#020817]/50 focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-200">{phase.phase || `Phase ${i+1}`}</h3>
                  <p className="text-sm text-gray-500 font-mono mt-0.5">{phase.focus || 'Core Focus'}</p>
                </div>
              </div>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </motion.div>
            </button>

            {/* Expandable Content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 border-t border-[#1e3a5f]/50">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      
                      {/* Tasks List */}
                      <div className="bg-[#020817] rounded-xl p-5 border border-[#1e3a5f]/30">
                        <h4 className="flex items-center gap-2 font-bold mb-4 text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400" /> Action Items
                        </h4>
                        <ul className="space-y-3">
                          {(phase.tasks || []).map((task, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-400">
                              <span className="text-cyan-500 font-mono text-xs mt-0.5 opacity-50">{(idx + 1).toString().padStart(2, '0')}</span>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Resources / Projects */}
                      <div className="bg-[#020817] rounded-xl p-5 border border-[#1e3a5f]/30">
                        <h4 className="flex items-center gap-2 font-bold mb-4 text-gray-300">
                          <Lightbulb className="w-4 h-4 text-amber-400" /> Free Resources
                        </h4>
                        <ul className="space-y-3">
                          {(phase.resources || ['YouTube Tutorial', 'freeCodeCamp Course', 'LeetCode Practice']).map((res, idx) => (
                            <li key={idx} className="text-sm">
                              <a href="#" className="flex items-center justify-between p-3 rounded-lg border border-[#1e3a5f] hover:border-cyan-500/50 hover:bg-cyan-500/5 text-gray-300 transition-colors group">
                                <span className="truncate pr-4">{res}</span>
                                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 shrink-0" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
