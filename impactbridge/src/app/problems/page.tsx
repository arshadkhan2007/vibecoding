import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, MapPin, Users, AlertCircle, Plus, Sparkles, Network } from 'lucide-react'
import { getProblemImage } from '@/lib/images'

export default async function ProblemsPage() {
  const supabase = await createClient()

  const { data: problems } = await supabase
    .from('problems')
    .select('*')
    .order('created_at', { ascending: false })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
      case 'FUNDRAISER_CREATED':
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
      case 'SOLVED':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
      case 'UNDER_REVIEW':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40'
      default:
        return 'bg-slate-800/80 text-slate-300 border-white/10'
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent':
        return 'text-rose-300 bg-rose-950/80 border-rose-500/40'
      case 'high':
        return 'text-amber-300 bg-amber-950/80 border-amber-500/40'
      case 'medium':
        return 'text-yellow-300 bg-yellow-950/80 border-yellow-500/40'
      default:
        return 'text-slate-400 bg-slate-800/80 border-white/10'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-12 pb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-black uppercase tracking-wider mb-3 border border-cyan-500/20">
            <Network className="w-3.5 h-3.5" /> Civic Action Nodes
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Community Problems
          </h1>
          <p className="text-slate-400 mt-2 text-base sm:text-lg max-w-2xl">
            Live decentralized problem repository. Verified on the ground and mapped to direct solutions.
          </p>
        </div>
        <Link 
          href="/report-problem" 
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-cyan-500/25 transition transform active:scale-98 text-sm"
        >
          <Plus className="w-4 h-4" /> Report New Problem
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {problems?.map((problem) => (
          <Link 
            href={`/problems/${problem.id}`} 
            key={problem.id} 
            className="group flex flex-col bg-slate-900/70 rounded-2xl shadow-xl hover:shadow-2xl hover:border-cyan-500/40 transition-all duration-300 overflow-hidden border border-white/10 transform hover:-translate-y-1 backdrop-blur-md"
          >
            {/* Image / Header area */}
            <div className="h-52 bg-slate-950 overflow-hidden relative">
              <img 
                src={getProblemImage(problem)} 
                alt={problem.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              
              {/* Category overlay */}
              <div className="absolute top-3 left-3">
                <span className="text-xs font-bold uppercase tracking-wide text-cyan-300 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-md shadow-xs border border-cyan-500/30">
                  {problem.category}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex-grow flex flex-col">
              {/* Badges row */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(problem.status)}`}>
                  {problem.status.replace('_', ' ')}
                </span>
                {problem.urgency && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getUrgencyBadge(problem.urgency)}`}>
                    Urgency: {problem.urgency}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-xl mb-2 text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                {problem.title}
              </h3>
              
              <p className="text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                {problem.description}
              </p>

              {/* Meta stats */}
              <div className="text-xs text-slate-400 mb-5 space-y-1.5 mt-auto bg-white/[0.03] p-3 rounded-xl border border-white/5">
                <p className="flex items-center gap-1.5 text-slate-200 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{problem.location}</span>
                </p>
                <p className="flex items-center gap-1.5 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{problem.people_affected} community members affected</span>
                </p>
              </div>

              {/* Footer CTA */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-cyan-400 font-bold text-sm group-hover:text-cyan-300">
                <span>View Node Dossier</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}

        {problems?.length === 0 && (
          <div className="col-span-full py-16 text-center bg-slate-900/40 rounded-2xl border border-dashed border-white/15">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No problem nodes have been reported yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
