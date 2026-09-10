import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { HeartHandshake, ArrowRight, Target, MapPin, Sparkles, Activity } from 'lucide-react'
import { getProblemImage } from '@/lib/images'

export default async function FundraisersPage() {
  const supabase = await createClient()

  const { data: fundraisers } = await supabase
    .from('fundraisers')
    .select(`
      *,
      problem:problems(id, title, category, location, image_url)
    `)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-black uppercase tracking-wider mb-3 border border-cyan-500/20">
          <Activity className="w-3.5 h-3.5" /> Direct Funding Network
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Active Fundraisers
        </h1>
        <p className="text-slate-400 mt-2 text-base sm:text-lg max-w-2xl">
          100% transparent ground allocation. Micro-donations pooled directly into tracked solutions.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {fundraisers?.map((fundraiser) => {
          const raised = Number(fundraiser.raised_amount) || 0
          const target = Number(fundraiser.target_amount) || 1
          const progress = Math.min(100, Math.round((raised / target) * 100))

          return (
            <Link 
              href={`/fundraisers/${fundraiser.id}`} 
              key={fundraiser.id} 
              className="group flex flex-col bg-slate-900/70 rounded-2xl shadow-xl hover:shadow-2xl hover:border-cyan-500/40 transition-all duration-300 overflow-hidden border border-white/10 transform hover:-translate-y-1 backdrop-blur-md"
            >
              {/* Image banner */}
              <div className="h-48 bg-slate-950 overflow-hidden relative">
                <img 
                  src={getProblemImage(fundraiser.problem)} 
                  alt={fundraiser.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-md shadow-xs border border-cyan-500/30">
                    {fundraiser.problem?.category || 'Community'}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-md shadow-xs border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    ACTIVE
                  </span>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-bold text-xl mb-2 text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {fundraiser.title}
                </h3>
                
                <p className="text-sm text-slate-400 mb-5 line-clamp-2 leading-relaxed">
                  {fundraiser.description}
                </p>

                {/* Related Problem Info */}
                {fundraiser.problem && (
                  <div className="mb-6 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                    <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                      Solving Node
                    </div>
                    <div className="font-medium text-slate-200 line-clamp-1">
                      {fundraiser.problem.title}
                    </div>
                    {fundraiser.problem.location && (
                      <div className="flex items-center gap-1 text-slate-400 mt-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>{fundraiser.problem.location}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Funding Progress & Momentum */}
                <div className="mt-auto pt-4 border-t border-white/10">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                      {progress}% FUNDED
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {Math.max(14, Math.round(raised / 650))} backers
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5 my-2">
                    <span className="text-2xl font-black text-white tracking-tight">
                      ₹{raised.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      raised of ₹{target.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Animated Momentum Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-3 mb-2 overflow-hidden p-0.5 border border-white/10 relative">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-full rounded-full transition-all duration-700 ease-out shadow-sm shadow-cyan-500/40" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 mb-4">
                    <span>Target: ₹{target.toLocaleString('en-IN')}</span>
                    <span>Remaining: ₹{Math.max(0, target - raised).toLocaleString('en-IN')}</span>
                  </div>

                  {/* Donate CTA button */}
                  <div className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 group-hover:from-cyan-400 group-hover:to-indigo-500 text-white font-black py-2.5 px-4 rounded-xl shadow-lg shadow-cyan-500/20 text-center text-sm flex items-center justify-center gap-1.5 transition-all">
                    <span>Donate Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}

        {fundraisers?.length === 0 && (
          <div className="col-span-full py-16 text-center bg-slate-900/40 rounded-2xl border border-dashed border-white/15">
            <HeartHandshake className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No active campaigns at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
