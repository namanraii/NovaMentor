import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Target, ThumbsUp, ChevronRight, XCircle, Layers } from 'lucide-react'

export default function MockInterview({ mockInterview }) {
  const [selectedIdx, setSelectedIdx] = useState(0)

  // Handle the data structure: { role, questions: [{id, type, question, hints, difficulty}], total_questions }
  const questions = mockInterview?.questions || []

  if (!mockInterview || questions.length === 0) return (
    <div className="text-gray-500 p-10 text-center bg-white/5 rounded-2xl border border-white/10">
      No mock interview data generated.
    </div>
  )

  const activeQ = questions[selectedIdx] || {}

  // Score only exists once user answers — for now show question view
  const TYPE_COLOR = {
    conceptual: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    coding: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
    behavioral: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  }
  const DIFF_COLOR = {
    easy: 'text-emerald-400',
    medium: 'text-amber-400',
    hard: 'text-red-400',
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5">

      {/* Left: Question List */}
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
          {mockInterview.role} Interview
        </p>
        {questions.map((q, i) => {
          const isActive = selectedIdx === i
          return (
            <button
              key={i}
              onClick={() => setSelectedIdx(i)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                isActive
                  ? 'bg-white/[0.06] border-white/20 text-white'
                  : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/15 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-gray-600">Q{i + 1}</span>
                <span className={`text-xs font-medium capitalize ${DIFF_COLOR[q.difficulty] || 'text-gray-400'}`}>
                  {q.difficulty}
                </span>
              </div>
              <p className="text-sm line-clamp-2 leading-snug">{q.question}</p>
            </button>
          )
        })}
      </div>

      {/* Right: Question Detail Panel */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIdx}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white/[0.025] border border-white/10 rounded-2xl p-7 space-y-7"
          >
            {/* Type badge + question */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border capitalize ${TYPE_COLOR[activeQ.type] || 'text-gray-400 bg-white/5 border-white/10'}`}>
                  {activeQ.type}
                </span>
                <span className={`text-xs font-medium capitalize ${DIFF_COLOR[activeQ.difficulty] || 'text-gray-400'}`}>
                  {activeQ.difficulty} difficulty
                </span>
              </div>
              <h3 className="text-xl font-bold text-white leading-relaxed">{activeQ.question}</h3>
            </div>

            {/* Hints */}
            {activeQ.hints && activeQ.hints.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" /> Hints
                </h4>
                <div className="space-y-2">
                  {activeQ.hints.map((hint, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-gray-400">
                      <ChevronRight className="w-3.5 h-3.5 text-gray-600 shrink-0 mt-0.5" />
                      <span>{hint}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info box */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-gray-400 leading-relaxed">
              <span className="text-white font-semibold">How to use: </span>
              Read the question carefully and think through your answer. Use the hints if you get stuck. When ready, you'd submit your answer for Nova Pro to score and give detailed feedback.
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  )
}
