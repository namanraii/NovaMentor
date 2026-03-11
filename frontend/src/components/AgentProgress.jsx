import { motion } from 'framer-motion'
import { FileSearch, Activity, Target, Map } from 'lucide-react'

const AGENTS = [
  { id: 1, name: 'Profile Analyst', icon: <FileSearch className="w-5 h-5" />, model: 'Nova Lite' },
  { id: 2, name: 'Market Intel', icon: <Activity className="w-5 h-5" />, model: 'Nova Lite' },
  { id: 3, name: 'Gap Analyst', icon: <Target className="w-5 h-5" />, model: 'Nova Lite' },
  { id: 4, name: 'Roadmap Generator', icon: <Map className="w-5 h-5" />, model: 'Nova Pro' },
]

export default function AgentProgress({ activeAgent }) {
  return (
    <div className="space-y-3">
      {AGENTS.map((agent) => {
        const isActive = activeAgent === agent.id
        const isDone = activeAgent > agent.id

        return (
          <motion.div
            key={agent.id}
            animate={{
              borderColor: isActive ? '#00d4ff' : isDone ? '#10b981' : '#1e3a5f',
              backgroundColor: isActive ? 'rgba(0,212,255,0.05)' : 'transparent',
              scale: isActive ? 1.02 : 1
            }}
            className="border rounded-xl p-3 flex items-center gap-4 transition-colors"
          >
            <motion.div
              animate={isActive ? { scale: [1, 1.2, 1], color: '#00d4ff' } : isDone ? { color: '#10b981' } : { color: '#7d8590' }}
              transition={isActive ? { repeat: Infinity, duration: 1.5 } : {}}
              className="p-2 bg-[#020817] rounded-lg border border-[#1e3a5f]"
            >
              {agent.icon}
            </motion.div>
            
            <div className="flex-1">
              <div className={`font-semibold text-sm ${isActive ? 'text-white' : isDone ? 'text-gray-300' : 'text-gray-500'}`}>
                {agent.name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 font-mono">{agent.model}</div>
            </div>

            {isActive && (
              <motion.div className="flex gap-1.5 px-2">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ delay: i * 0.2, repeat: Infinity, duration: 0.8 }}
                  />
                ))}
              </motion.div>
            )}
            
            {isDone && (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center text-green-500"
              >
                ✓
              </motion.div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
