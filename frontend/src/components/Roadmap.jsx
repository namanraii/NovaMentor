import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle, ExternalLink, Lightbulb, Code, BookOpen } from 'lucide-react'

const PHASE_CONFIG = [
  { key: 'day_30', label: 'Days 1–30', subtitle: 'Foundation Sprint', color: 'text-sky-400', borderColor: 'border-sky-500/40', dotColor: 'bg-sky-500' },
  { key: 'day_60', label: 'Days 31–60', subtitle: 'Deep Skill Building', color: 'text-violet-400', borderColor: 'border-violet-500/40', dotColor: 'bg-violet-500' },
  { key: 'day_90', label: 'Days 61–90', subtitle: 'Application & Polish', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', dotColor: 'bg-emerald-500' },
]

export default function Roadmap({ roadmap }) {
  const [openPhase, setOpenPhase] = useState(0)

  if (!roadmap) return (
    <div className="text-gray-500 p-10 text-center bg-white/5 rounded-2xl border border-white/10">
      No roadmap data available.
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-3">
      {PHASE_CONFIG.map(({ key, label, subtitle, color, borderColor, dotColor }, i) => {
        const phase = roadmap[key] || {}
        const isOpen = openPhase === i
        const tasks = phase.daily_tasks || phase.tasks || []
        const resources = phase.resources || []

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`bg-white/[0.02] border rounded-xl overflow-hidden ${isOpen ? borderColor : 'border-white/10'} transition-colors duration-300`}
          >
            {/* Header */}
            <button
              onClick={() => setOpenPhase(isOpen ? -1 : i)}
              className="w-full px-6 py-5 flex items-center justify-between focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full ${dotColor} ${isOpen ? 'shadow-[0_0_8px_3px_rgba(var(--tw-shadow-color),0.4)]' : ''}`} />
                <div className="text-left">
                  <h3 className={`text-base font-bold ${isOpen ? color : 'text-gray-200'}`}>{label}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{phase.goal || subtitle}</p>
                </div>
              </div>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </motion.div>
            </button>

            {/* Expandable Content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-2 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Action Items */}
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Action Items
                      </h4>
                      <ul className="space-y-2.5">
                        {tasks.length > 0 ? tasks.map((task, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-300">
                            <span className="text-gray-600 font-mono text-xs shrink-0 mt-0.5">{String(idx + 1).padStart(2, '0')}</span>
                            <span className="leading-relaxed">{task}</span>
                          </li>
                        )) : (
                          <li className="text-sm text-gray-600">No tasks specified.</li>
                        )}
                      </ul>
                    </div>

                    {/* Resources */}
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Free Resources
                      </h4>
                      <ul className="space-y-2">
                        {resources.length > 0 ? resources.map((res, idx) => {
                          const name = typeof res === 'string' ? res : res.name
                          const url = typeof res === 'object' ? res.url : null
                          return (
                            <li key={idx}>
                              <a
                                href={url || '#'}
                                target={url ? '_blank' : '_self'}
                                rel="noreferrer"
                                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/25 text-gray-300 text-sm transition-colors group"
                              >
                                <span className="truncate pr-3">{name}</span>
                                {url && <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-300 shrink-0" />}
                              </a>
                            </li>
                          )
                        }) : (
                          <li className="text-sm text-gray-600">No resources specified.</li>
                        )}
                      </ul>
                    </div>

                  </div>

                  {/* Key projects row */}
                  {roadmap.key_projects && roadmap.key_projects.length > 0 && i === PHASE_CONFIG.length - 1 && (
                    <div className="px-6 pb-6 border-t border-white/5 pt-4">
                      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                        <Code className="w-3.5 h-3.5 text-sky-400" /> Portfolio Projects to Build
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {roadmap.key_projects.map((proj, idx) => (
                          <div key={idx} className="p-4 rounded-lg bg-white/[0.03] border border-white/10">
                            <div className="font-semibold text-gray-200 text-sm">{proj.name}</div>
                            <div className="text-gray-500 text-xs mt-1 font-mono">{proj.tech}</div>
                            <p className="text-gray-400 text-xs mt-2 leading-relaxed">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
