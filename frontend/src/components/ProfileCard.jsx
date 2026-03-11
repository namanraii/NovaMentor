import { motion } from 'framer-motion'
import { GraduationCap, Award, Briefcase, Code } from 'lucide-react'
import ReadinessGauge from './ReadinessGauge'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function ProfileCard({ profile, score }) {
  const edu = profile?.education || {}
  
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Left Column: Gauge & Basic Info */}
      <motion.div variants={item} className="col-span-1 flex flex-col gap-6">
        <div className="bg-[#0a1628] border border-[#1e3a5f] rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3">
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-full border border-cyan-500/30">
              {profile.inferred_level || 'Junior'}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-6">{profile.name || 'Candidate Profile'}</h3>
          
          <ReadinessGauge score={score || 0} />
          
          <p className="text-sm font-semibold text-gray-400 mt-6 uppercase tracking-widest">Readiness Score</p>
        </div>

        <div className="bg-[#0a1628] border border-[#1e3a5f] rounded-2xl p-6">
          <div className="flex items-center gap-3 text-cyan-400 mb-4">
            <GraduationCap className="w-5 h-5" />
            <h4 className="font-bold">Education</h4>
          </div>
          <div>
            <div className="text-white font-semibold">{edu.degree || 'Degree Unknown'}</div>
            <div className="text-gray-400 text-sm mt-1">{edu.university || 'University Unknown'}</div>
            {edu.cgpa && <div className="text-cyan-500 text-sm mt-2 font-mono bg-cyan-500/10 inline-block px-2 py-1 rounded">CGPA: {edu.cgpa}</div>}
          </div>
        </div>
      </motion.div>

      {/* Right Column: Skills & Projects */}
      <motion.div variants={item} className="col-span-1 md:col-span-2 flex flex-col gap-6">
        
        {/* Skills */}
        <div className="bg-[#0a1628] border border-[#1e3a5f] rounded-2xl p-6">
          <div className="flex items-center gap-3 text-purple-400 mb-6">
            <Code className="w-5 h-5" />
            <h4 className="font-bold">Detected Skills</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {(profile.skills || []).map((skill, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg text-sm text-purple-300 font-mono hover:bg-purple-500/20 transition-colors"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="bg-[#0a1628] border border-[#1e3a5f] rounded-2xl p-6 flex-1">
          <div className="flex items-center gap-3 text-orange-400 mb-6">
            <Award className="w-5 h-5" />
            <h4 className="font-bold">Key Projects Extracted</h4>
          </div>
          <div className="space-y-4">
            {profile.projects && profile.projects.length > 0 ? (
              profile.projects.map((proj, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#020817] border border-[#1e3a5f]">
                  <div className="font-bold text-gray-200">{proj.name || 'Project'}</div>
                  <div className="text-orange-400/80 text-xs font-mono mt-1 mb-2">[{proj.tech_stack || 'Tech Stack'}]</div>
                  <p className="text-sm text-gray-400 leading-relaxed">{proj.description}</p>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm py-4">No major projects detected in resume.</div>
            )}
          </div>
        </div>

      </motion.div>
    </motion.div>
  )
}
