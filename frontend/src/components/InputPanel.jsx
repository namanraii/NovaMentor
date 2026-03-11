import { Upload, Github, Briefcase, Building } from 'lucide-react'
import AgentProgress from './AgentProgress'

export default function InputPanel({
  file, setFile, fileRef, github, setGithub, role, setRole,
  companies, toggleCompany, loading, activeAgent, onSubmit, error,
  ROLES, COMPANIES
}) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero  */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Your AI Career Coach</h1>
        <p className="text-gray-400 text-lg">Upload your resume and let 5 Nova AI agents craft your personalised 90-day roadmap — completely free.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left Column */}
        <div className="space-y-5">

          {/* Upload zone */}
          <div
            onClick={() => !loading && fileRef.current.click()}
            className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 flex flex-col items-center text-center transition-colors duration-200
              ${file ? 'border-white/30 bg-white/[0.04]' : 'border-white/10 hover:border-white/25 hover:bg-white/[0.02]'}`}
          >
            <Upload className={`w-8 h-8 mb-3 ${file ? 'text-white' : 'text-gray-500'}`} />
            <p className={`font-semibold ${file ? 'text-white' : 'text-gray-400'}`}>
              {file ? file.name : 'Upload Resume (PDF)'}
            </p>
            <p className="text-xs text-gray-600 mt-1">Click to browse or drag & drop</p>
            <input
              type="file" className="hidden" ref={fileRef} accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])} disabled={loading}
            />
          </div>

          {/* GitHub */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              <Github className="w-3.5 h-3.5" /> GitHub <span className="font-normal normal-case text-gray-600">(Optional)</span>
            </label>
            <input
              type="text" value={github} onChange={e => setGithub(e.target.value)} disabled={loading}
              placeholder="github.com/yourusername"
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors font-mono"
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              <Briefcase className="w-3.5 h-3.5" /> Target Role
            </label>
            <select
              value={role} onChange={e => setRole(e.target.value)} disabled={loading}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none"
            >
              {ROLES.map(r => <option key={r} value={r} className="bg-[#0d0f14]">{r}</option>)}
            </select>
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-7 space-y-7">

          {/* Companies */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              <Building className="w-3.5 h-3.5" /> Target Companies
            </label>
            <div className="flex flex-wrap gap-2">
              {COMPANIES.map(c => {
                const isActive = companies.includes(c)
                return (
                  <button
                    key={c} onClick={() => toggleCompany(c)}
                    disabled={loading || (!isActive && companies.length >= 3)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150
                      ${isActive
                        ? 'bg-white/10 border-white/30 text-white'
                        : 'bg-transparent border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'}
                      disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="border-t border-white/5 pt-7 space-y-4">
            {loading ? (
              <AgentProgress activeAgent={activeAgent} />
            ) : (
              <>
                {error && (
                  <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}
                <button
                  onClick={onSubmit} disabled={!file}
                  className="w-full py-3.5 rounded-xl bg-white text-[#0d0f14] font-bold text-sm tracking-wide
                    hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Generate My Roadmap →
                </button>
                <p className="text-center text-xs text-gray-600">Powered by Amazon Nova Pro · Nova Lite · 100% Free</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
