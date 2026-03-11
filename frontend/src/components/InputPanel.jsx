import { Upload, Github, Briefcase, Building } from 'lucide-react'
import AgentProgress from './AgentProgress'

export default function InputPanel({ 
  file, setFile, fileRef, github, setGithub, role, setRole, 
  companies, toggleCompany, loading, activeAgent, onSubmit, error,
  ROLES, COMPANIES 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full max-w-5xl mx-auto items-start">
      
      {/* Left Column: Form Inputs */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-extrabold mb-2">Build Your Future</h2>
          <p className="text-gray-400">Upload your resume and let 5 specialized AI agents build your career roadmap.</p>
        </div>

        {/* File Uploader */}
        <div 
          className="relative group cursor-pointer"
          onClick={() => !loading && fileRef.current.click()}
        >
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500 ${loading ? 'hidden' : ''}`} />
          <div className="relative bg-[#0a1628] border-2 border-dashed border-[#1e3a5f] rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors group-hover:border-cyan-500/50">
            <Upload className={`w-10 h-10 mb-4 ${file ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-400 transition-colors'}`} />
            <p className="font-semibold text-lg">{file ? file.name : 'Upload Resume PDF'}</p>
            <p className="text-sm text-gray-500 mt-1">Drag & drop or click to browse</p>
            <input 
              type="file" className="hidden" ref={fileRef} accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])} disabled={loading}
            />
          </div>
        </div>

        {/* GitHub URL */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <Github className="w-4 h-4" /> GitHub Profile <span className="text-gray-600 font-normal">(Optional)</span>
          </label>
          <input 
            type="text" value={github} onChange={e => setGithub(e.target.value)} disabled={loading}
            placeholder="github.com/yourname"
            className="w-full bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors font-mono text-sm"
          />
        </div>

        {/* Target Role */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <Briefcase className="w-4 h-4" /> Target Role
          </label>
          <select 
            value={role} onChange={e => setRole(e.target.value)} disabled={loading}
            className="w-full bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors appearance-none"
          >
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Right Column: Companies & Execution */}
      <div className="space-y-8 bg-[#0a1628]/50 p-6 sm:p-8 rounded-2xl border border-[#1e3a5f]/50 backdrop-blur-sm">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <Building className="w-4 h-4" /> Target Companies (Select up to 3)
          </label>
          <div className="flex flex-wrap gap-2">
            {COMPANIES.map(c => {
              const isActive = companies.includes(c)
              return (
                <button
                  key={c} onClick={() => toggleCompany(c)} disabled={loading || (!isActive && companies.length >= 3)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    isActive 
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
                      : 'bg-transparent border-[#1e3a5f] text-gray-400 hover:border-gray-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>

        {loading ? (
          <div className="pt-4 border-t border-[#1e3a5f]">
            <h3 className="text-sm font-semibold text-cyan-400 mb-4 tracking-wider uppercase">Agents Orchestrating...</h3>
            <AgentProgress activeAgent={activeAgent} />
          </div>
        ) : (
          <div className="pt-4 border-t border-[#1e3a5f]">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                ❌ {error}
              </div>
            )}
            <button
              onClick={onSubmit} disabled={!file}
              className="w-full relative group overflow-hidden rounded-xl font-bold text-lg p-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 block group-hover:scale-105 transition-transform duration-300" />
              <span className="relative block px-8 py-4 bg-[#020817] rounded-xl transition-all duration-300 group-hover:bg-opacity-0 group-hover:text-white text-gray-200">
                Generate My Roadmap
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
