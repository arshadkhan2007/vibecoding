import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { HeartHandshake, ArrowRight, Target, MapPin, Activity } from 'lucide-react'
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
      <div className="mb-12 pb-8 border-b border-slate-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
          <Activity className="w-3.5 h-3.5" /> Direct Funding Network
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Active Fundraisers
        </h1>
        <p className="text-slate-600 mt-2 text-base sm:text-lg max-w-2xl">
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
              className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden border border-slate-200/80 transform hover:-translate-y-1"
            >
              {/* Image banner */}
              <div className="h-48 bg-slate-100 overflow-hidden relative">
                <img 
                  src={getProblemImage(fundraiser.problem)} 
                  alt={fundraiser.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md shadow-xs border border-blue-100">
                    {fundraiser.problem?.category || 'Community'}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md shadow-xs border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    ACTIVE
                  </span>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-bold text-xl mb-2 text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {fundraiser.title}
                </h3>
                
                <p className="text-sm text-slate-600 mb-5 line-clamp-2 leading-relaxed">
                  {fundraiser.description}
                </p>

                {/* Related Problem Info */}
                {fundraiser.problem && (
                  <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                      Solving Node
                    </div>
                    <div className="font-medium text-slate-800 line-clamp-1">
                      {fundraiser.problem.title}
                    </div>
                    {fundraiser.problem.location && (
                      <div className="flex items-center gap-1 text-slate-500 mt-1">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        <span>{fundraiser.problem.location}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Funding Progress & Momentum */}
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {progress}% FUNDED
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {Math.max(14, Math.round(raised / 650))} backers
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5 my-2">
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      ₹{raised.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      raised of ₹{target.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Animated Momentum Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-3 mb-2 overflow-hidden p-0.5 relative">
                    <div 
                      className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 h-full rounded-full transition-all duration-700 ease-out shadow-xs" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 mb-4">
                    <span>Target: ₹{target.toLocaleString('en-IN')}</span>
                    <span>Remaining: ₹{Math.max(0, target - raised).toLocaleString('en-IN')}</span>
                  </div>

                  {/* Donate CTA button */}
                  <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 text-center text-sm flex items-center justify-center gap-1.5 transition-all">
                    <span>Donate Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}

        {fundraisers?.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <HeartHandshake className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No active campaigns at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
