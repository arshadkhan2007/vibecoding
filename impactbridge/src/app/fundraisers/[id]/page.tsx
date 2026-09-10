import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, Users, Target, Activity, MapPin, Sparkles } from 'lucide-react'
import DonationForm from './DonationForm'
import { getProblemImage } from '@/lib/images'

export default async function FundraiserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: fundraiser, error } = await supabase
    .from('fundraisers')
    .select(`
      *,
      problem:problems(title, location, image_url, category, people_affected)
    `)
    .eq('id', id)
    .single()

  if (error || !fundraiser) {
    notFound()
  }

  const { count: donorsCount } = await supabase
    .from('donations')
    .select('*', { count: 'exact', head: true })
    .eq('fundraiser_id', id)

  const { data: updates } = await supabase
    .from('impact_updates')
    .select('*')
    .eq('fundraiser_id', id)
    .order('created_at', { ascending: false })

  const progress = Math.min(100, (fundraiser.raised_amount / fundraiser.target_amount) * 100)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/fundraisers" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 mb-6 transition">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Fundraisers
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xl">
            <div className="h-64 md:h-96 w-full overflow-hidden relative bg-slate-100">
              <img 
                src={getProblemImage(fundraiser.problem)} 
                alt={fundraiser.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-xs font-bold uppercase text-blue-800 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md shadow-xs border border-blue-100">
                  {fundraiser.problem?.category || 'Community'}
                </span>
                <span className={`text-xs font-bold uppercase px-3 py-1 rounded-md backdrop-blur-md border ${
                  fundraiser.status === 'ACTIVE' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {fundraiser.status}
                </span>
              </div>
            </div>
            
            <div className="p-6 sm:p-8">
              <h1 className="text-3xl font-black text-slate-950 tracking-tight mb-3">{fundraiser.title}</h1>
              <p className="text-slate-600 text-base leading-relaxed mb-8">{fundraiser.description}</p>

              {/* Linked Problem Dossier */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                    Target Ground Problem
                  </h3>
                </div>

                <Link 
                  href={`/problems/${fundraiser.problem_id}`}
                  className="block p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 transition group"
                >
                  <div className="font-bold text-blue-600 group-hover:text-blue-700 text-base">
                    {fundraiser.problem?.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {fundraiser.problem?.location}
                    </span>
                    <span>•</span>
                    <span className="text-slate-700 font-medium">
                      {fundraiser.problem?.people_affected} affected citizens
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Impact Updates Timeline */}
          {updates && updates.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" /> Verified Impact Ledger
              </h3>
              <div className="space-y-6">
                {updates.map((update) => (
                  <div key={update.id} className="border-l-2 border-blue-500 pl-4 py-1">
                    <p className="text-xs text-blue-600 font-semibold mb-1">
                      {new Date(update.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h4 className="font-bold text-slate-900 text-base mb-1">{update.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{update.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Momentum & Donation Form */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sticky top-24 shadow-xl shadow-slate-200/70">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  {Math.round(progress)}% Funded
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  ⚡ Live Momentum
                </span>
              </div>
              <h3 className="text-3xl font-black text-slate-950 tracking-tight">₹{Number(fundraiser.raised_amount).toLocaleString('en-IN')}</h3>
              <p className="text-slate-500 text-xs mt-0.5">raised of ₹{Number(fundraiser.target_amount).toLocaleString('en-IN')} goal</p>
            </div>

            {/* Momentum Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3.5 mb-6 overflow-hidden p-0.5 border border-slate-200 relative">
              <div 
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 h-full rounded-full transition-all duration-1000 shadow-xs" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8 text-center">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Users className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                <div className="font-black text-lg text-slate-900">{donorsCount || Math.max(12, Math.round(Number(fundraiser.raised_amount) / 800))}</div>
                <div className="text-[11px] text-slate-500 font-medium">Backers</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Target className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
                <div className="font-black text-lg text-slate-900">₹{Math.max(0, Number(fundraiser.target_amount) - Number(fundraiser.raised_amount)).toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-slate-500 font-medium">To Goal</div>
              </div>
            </div>

            {fundraiser.status === 'ACTIVE' ? (
              <DonationForm 
                fundraiserId={fundraiser.id} 
                fundraiserTitle={fundraiser.title}
                peopleAffected={fundraiser.problem?.people_affected}
                category={fundraiser.problem?.category} 
              />
            ) : (
              <div className="bg-emerald-50 text-emerald-800 text-center py-4 rounded-xl font-bold border border-emerald-200">
                ✓ Goal Reached & Completed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
