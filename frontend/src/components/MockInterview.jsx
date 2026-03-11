import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MessageSquare, Target, ThumbsUp, ChevronRight, XCircle } from 'lucide-react'

export default function MockInterview({ questions = [] }) {
  const [selectedIdx, setSelectedIdx] = useState(0)

  if (!questions || questions.length === 0) return (
    <div className="text-gray-400 p-8 text-center bg-[#0a1628] rounded-2xl border border-[#1e3a5f]">
      No mock interview data generated.
    </div>
  )

  const activeQ = questions[selectedIdx] || {}
  const score = activeQ?.feedback?.score || 0

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[600px] max-h-[80vh]">
      
      {/* Left Sidebar: Question List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
        {questions.map((q, i) => {
          const isActive = selectedIdx === i
          const qScore = q?.feedback?.score || 0
          
          return (
            <button
              key={i} onClick={() => setSelectedIdx(i)}
              className={`text-left p-4 rounded-xl border transition-all ${
                isActive 
                  ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_10px_rgba(0,212,255,0.2)]' 
                  : 'bg-[#0a1628] border-[#1e3a5f] hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-mono text-gray-400">Q {i+1} / 5</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  qScore >= 8 ? 'bg-green-500/20 text-green-400' : qScore >= 5 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {qScore}/10
                </span>
              </div>
              <p className={`text-sm line-clamp-2 ${isActive ? 'text-white font-medium' : 'text-gray-400'}`}>
                {q.question}
              </p>
            </button>
          )
        })}
      </div>

      {/* Right Content: Analysis Panel */}
      <div className="w-full lg:w-2/3 bg-[#0a1628] border border-[#1e3a5f] rounded-2xl overflow-hidden flex flex-col relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Mic className="w-32 h-32" />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIdx}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-8 z-10"
          >
            {/* The Question */}
            <div>
              <div className="flex items-center gap-3 text-cyan-400 mb-3">
                <MessageSquare className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-widest text-xs">Interview Question</h3>
              </div>
              <p className="text-xl md:text-2xl font-bold leading-relaxed">{activeQ.question}</p>
            </div>

            {/* Feedback Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Score & Category */}
              <div className="bg-[#020817] border border-[#1e3a5f] rounded-xl p-5 flex flex-col justify-center items-center text-center">
                <div className="relative w-24 h-24 flex items-center justify-center mb-3">
                  <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#1e3a5f" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke={score >= 8 ? '#10b981' : score >= 5 ? '#f59e0b' : '#ef4444'} strokeWidth="8" strokeDasharray={`${(score/10)*251} 251`} className="transition-all duration-1000" />
                  </svg>
                  <span className="text-3xl font-black font-display">{score}</span>
                </div>
                <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
                   Amazon Nova Score
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="space-y-4">
                <div className="bg-[#020817] border border-green-500/20 rounded-xl p-4">
                  <h4 className="flex items-center gap-2 text-green-400 font-bold mb-2 text-sm"><ThumbsUp className="w-4 h-4"/> Strengths</h4>
                  <p className="text-sm text-gray-300">{activeQ?.feedback?.strengths || 'Good response.'}</p>
                </div>
                <div className="bg-[#020817] border border-red-500/20 rounded-xl p-4">
                  <h4 className="flex items-center gap-2 text-red-400 font-bold mb-2 text-sm"><XCircle className="w-4 h-4"/> Needs Improvement</h4>
                  <p className="text-sm text-gray-300">{activeQ?.feedback?.improvements || 'Could be more detailed.'}</p>
                </div>
              </div>
            </div>

            {/* Ideal Answer & Followup */}
            <div className="space-y-6 pt-6 border-t border-[#1e3a5f]/50">
              <div>
                <h4 className="flex items-center gap-2 text-cyan-400 font-bold mb-3"><Target className="w-4 h-4"/> Ideal Answer Structure</h4>
                <div className="p-5 bg-[#020817] border border-[#1e3a5f] rounded-xl">
                  <ul className="space-y-3">
                    {Array.isArray(activeQ?.feedback?.ideal_answer_outline) ? 
                      activeQ.feedback.ideal_answer_outline.map((item, id) => (
                        <li key={id} className="text-sm text-gray-300 flex items-start gap-3">
                          <ChevronRight className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      )) : 
                      <li className="text-sm text-gray-400">{activeQ?.feedback?.ideal_answer_outline || 'Structure not provided.'}</li>
                    }
                  </ul>
                </div>
              </div>

              {activeQ?.feedback?.follow_up_questions && activeQ.feedback.follow_up_questions.length > 0 && (
                <div>
                   <h4 className="text-gray-400 font-bold mb-3 text-sm">Potential Follow-Up Questions:</h4>
                   <div className="flex flex-col gap-2">
                     {activeQ.feedback.follow_up_questions.map((fq, i) => (
                       <div key={i} className="px-4 py-3 bg-cyan-500/5 text-cyan-300 text-sm rounded-lg border border-cyan-500/10 border-l-2 border-l-cyan-500">
                         "{fq}"
                       </div>
                     ))}
                   </div>
                </div>
              )}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
