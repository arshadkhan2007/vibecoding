import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { HeartHandshake, ArrowRight, Target, MapPin, Sparkles } from 'lucide-react'

export default async function FundraisersPage() {
  const supabase = await createClient()

  const { data: fundraisers } = await supabase
    .from('fundraisers')
    .select(`
      *,
      problem:problems(title, category, location)
    `)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-slate-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
          Direct Crowdfunding
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Active Fundraisers
        </h1>
        <p className="text-slate-600 mt-2 text-base sm:text-lg max-w-2xl">
          100% transparent funding directly assigned to verified solutions on the ground.
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
              <div className="p-6 flex-grow flex flex-col">
                {/* Category & Status */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {fundraiser.problem?.category || 'Community'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ACTIVE
                  </span>
                </div>

                <h3 className="font-bold text-xl mb-2 text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {fundraiser.title}
                </h3>
                
                <p className="text-sm text-slate-600 mb-6 line-clamp-2 leading-relaxed">
                  {fundraiser.description}
                </p>

                {/* Related Problem Info */}
                {fundraiser.problem && (
                  <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-100/80 text-xs">
                    <div className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                      Solving Problem
                    </div>
                    <div className="font-medium text-slate-800 line-clamp-1">
                      {fundraiser.problem.title}
                    </div>
                    {fundraiser.problem.location && (
                      <div className="flex items-center gap-1 text-slate-500 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{fundraiser.problem.location}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Funding Progress */}
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-baseline mb-2">
                    <div>
                      <span className="text-xl font-extrabold text-slate-900">
                        ₹{raised.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 ml-1.5">
                        raised
                      </span>
                    </div>
                    <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {progress}%
                    </div>
                  </div>

                  {/* High Visibility Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden p-0.5 border border-slate-200/60">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500 shadow-xs" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 mb-5">
                    <span>Goal: ₹{target.toLocaleString('en-IN')}</span>
                    <span>Remaining: ₹{Math.max(0, target - raised).toLocaleString('en-IN')}</span>
                  </div>

                  {/* Donate CTA button */}
                  <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 text-center text-sm flex items-center justify-center gap-1.5 transition-all">
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
            <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No active fundraisers at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
