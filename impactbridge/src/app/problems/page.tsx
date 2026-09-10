import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, MapPin, Users, AlertCircle, Plus, Network } from 'lucide-react'
import { getProblemImage } from '@/lib/images'
import AnimatedCounter from '@/components/AnimatedCounter'

export default async function ProblemsPage() {
  const supabase = await createClient()

  const { data: problems } = await supabase
    .from('problems')
    .select('*')
    .order('created_at', { ascending: false })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200'
      case 'FUNDRAISER_CREATED':
        return 'bg-blue-50 text-blue-800 border-blue-200'
      case 'SOLVED':
        return 'bg-teal-50 text-teal-800 border-teal-200'
      case 'UNDER_REVIEW':
        return 'bg-amber-50 text-amber-800 border-amber-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent':
        return 'text-rose-700 bg-rose-50 border-rose-200'
      case 'high':
        return 'text-amber-800 bg-amber-50 border-amber-200'
      case 'medium':
        return 'text-yellow-800 bg-yellow-50 border-yellow-200'
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-12 pb-8 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
            <Network className="w-3.5 h-3.5" /> Civic Action Nodes
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Community Problems
          </h1>
          <p className="text-slate-600 mt-2 text-base sm:text-lg max-w-2xl">
            Live decentralized problem repository. Verified on the ground and mapped to direct solutions.
          </p>
        </div>
        <Link 
          href="/report-problem" 
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition transform active:scale-98 text-sm"
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
            className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden border border-slate-200/80 transform hover:-translate-y-1"
          >
            {/* Image / Header area */}
            <div className="h-52 bg-slate-100 overflow-hidden relative">
              <img 
                src={getProblemImage(problem)} 
                alt={problem.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              
              {/* Category overlay */}
              <div className="absolute top-3 left-3">
                <span className="text-xs font-bold uppercase tracking-wide text-blue-800 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md shadow-xs border border-blue-100">
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

              <h3 className="font-bold text-xl mb-2 text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {problem.title}
              </h3>
              
              <p className="text-sm text-slate-600 mb-6 line-clamp-2 leading-relaxed">
                {problem.description}
              </p>

              {/* Meta stats */}
              <div className="text-xs text-slate-500 mb-5 space-y-1.5 mt-auto bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="flex items-center gap-1.5 text-slate-800 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{problem.location}</span>
                </p>
                <p className="flex items-center gap-1.5 text-slate-500">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    <AnimatedCounter value={problem.people_affected || 0} duration={1400} /> community members affected
                  </span>
                </p>
              </div>

              {/* Footer CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-blue-600 font-bold text-sm group-hover:text-blue-700">
                <span>View Node Dossier</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}

        {problems?.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No problem nodes have been reported yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
