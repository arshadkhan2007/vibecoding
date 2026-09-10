import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { 
  ArrowRight, 
  Heart, 
  Sparkles, 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  Flame, 
  Users, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Coins, 
  Eye, 
  Activity,
  Award
} from 'lucide-react'
import { getProblemImage } from '@/lib/images'

export default async function Home() {
  const supabase = await createClient()

  // Fetch actual data from database
  const { data: problems } = await supabase.from('problems').select('*').order('created_at', { ascending: false })
  const { data: fundraisers } = await supabase.from('fundraisers').select('*, problem:problems(*)').order('created_at', { ascending: false })

  const totalRaised = fundraisers?.reduce((acc, curr) => acc + (Number(curr.raised_amount) || 0), 0) || 0
  const totalAffected = problems?.reduce((acc, curr) => acc + (Number(curr.people_affected) || 0), 0) || 0
  const problemsCount = problems?.length || 0
  const fundraisersCount = fundraisers?.length || 0
  const solvedCount = problems?.filter(p => p.status === 'SOLVED').length || 0

  // 1. Most Urgent Problem
  const mostUrgentProblem = problems?.find(p => p.urgency?.toLowerCase() === 'urgent') || problems?.[0]
  
  // 2. Closest to Fully Funded
  const closestFundraiser = fundraisers?.slice().sort((a, b) => {
    const ratioA = Number(a.raised_amount) / Number(a.target_amount)
    const ratioB = Number(b.raised_amount) / Number(b.target_amount)
    return ratioB - ratioA
  })[0]

  // 3. Most People Affected
  const mostAffectedProblem = problems?.slice().sort((a, b) => Number(b.people_affected) - Number(a.people_affected))[0]

  // 4. Recently Active Campaign
  const recentlyActiveProblem = problems?.find(p => p.id === '11111111-1111-1111-1111-111111111111') || problems?.[0]
  const recentlyActiveFundraiser = fundraisers?.find(f => f.problem_id === recentlyActiveProblem?.id)

  // Problem That Needs You (Featured Hero Focus)
  const heroProblem = problems?.find(p => p.id === '11111111-1111-1111-1111-111111111111') || problems?.[0]
  const heroFundraiser = fundraisers?.find(f => f.problem_id === heroProblem?.id)
  const heroProgress = heroFundraiser ? Math.min(100, Math.round((heroFundraiser.raised_amount / heroFundraiser.target_amount) * 100)) : 0

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute top-1/2 right-10 w-[350px] h-[250px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-300 text-xs sm:text-sm font-semibold mb-8 backdrop-blur-md shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Civic Crowdfunding Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
            Real Problems. <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
              Real People. Real Impact.
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-slate-300 font-normal leading-relaxed">
            Discover verified community problems, pool direct micro-donations into transparent fundraisers, and track verified on-the-ground impact.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/problems" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-base py-3.5 px-8 rounded-xl shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5"
            >
              Explore Problems <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/fundraisers" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700/90 text-white border border-slate-700 font-bold text-base py-3.5 px-8 rounded-xl backdrop-blur-md shadow-md transition transform hover:-translate-y-0.5"
            >
              Support Fundraisers <Heart className="w-5 h-5 text-rose-400 fill-rose-400/30" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. IMPACT COUNTER (STATISTICS BAR) */}
      <section className="relative z-20 -mt-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-100 p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-2 md:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
                <Coins className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Raised</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">₹{totalRaised.toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">100% publicly verified</p>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-indigo-600 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Problems Reported</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{problemsCount}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Verified by ground NGOs</p>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-rose-600 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">People Impacted</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{totalAffected}+</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Direct community beneficiaries</p>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Fundraisers</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{fundraisersCount}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Open for micro-donations</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM OF THE DAY: "PROBLEM THAT NEEDS YOU" */}
      {heroProblem && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-3xl border border-blue-200/80 p-6 sm:p-10 shadow-lg shadow-blue-500/5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-xs">
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                Problem That Needs You
              </div>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Community Focus of the Day
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Image area */}
              <div className="lg:col-span-6 h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md relative group">
                <img 
                  src={getProblemImage(heroProblem)} 
                  alt={heroProblem.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-blue-800 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md shadow-xs border border-blue-100">
                    {heroProblem.category}
                  </span>
                </div>
              </div>

              {/* Content area */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-2 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" /> {heroProblem.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> {heroProblem.people_affected} affected
                  </span>
                  <span>•</span>
                  <span className="text-amber-700 font-semibold">
                    Urgency: {heroProblem.urgency}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
                  {heroProblem.title}
                </h2>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                  {heroProblem.description}
                </p>

                {/* Connected Fundraiser Momentum */}
                {heroFundraiser && (
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6">
                    <div className="flex justify-between items-baseline mb-1 text-xs">
                      <span className="font-bold text-slate-800">Campaign Progress</span>
                      <span className="font-extrabold text-blue-600">{heroProgress}% FUNDED</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-700" 
                        style={{ width: `${heroProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>₹{Number(heroFundraiser.raised_amount).toLocaleString('en-IN')} raised</span>
                      <span>Goal: ₹{Number(heroFundraiser.target_amount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href={heroFundraiser ? `/fundraisers/${heroFundraiser.id}` : `/problems/${heroProblem.id}`}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-blue-500/20 transition active:scale-98 text-sm"
                  >
                    <span>See How You Can Help</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link 
                    href={`/problems/${heroProblem.id}`}
                    className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold py-3.5 px-5 rounded-xl transition text-sm"
                  >
                    Read Full Dossier
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. "IMPACT PULSE" SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Live Needs Radar
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Impact Pulse
          </h2>
          <p className="text-slate-600 mt-1 text-base sm:text-lg">
            See where help is needed right now.
          </p>
        </div>

        {/* 4 Live Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Most Urgent Problem */}
          {mostUrgentProblem && (
            <div className="bg-white rounded-2xl p-5 border border-rose-200/80 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    🔥 Most Urgent
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">PRIORITY 1</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition line-clamp-2 mb-1.5">
                  {mostUrgentProblem.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {mostUrgentProblem.location}
                </p>
                <div className="bg-rose-50/50 p-2.5 rounded-xl border border-rose-100 text-xs mb-4">
                  <span className="font-bold text-rose-800">{mostUrgentProblem.people_affected} people</span> directly affected
                </div>
              </div>

              <Link 
                href={`/problems/${mostUrgentProblem.id}`} 
                className="w-full text-center text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 py-2.5 rounded-xl transition flex items-center justify-center gap-1"
              >
                <span>Help Solve It</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}

          {/* Card 2: Closest to Fully Funded */}
          {closestFundraiser && (
            <div className="bg-white rounded-2xl p-5 border border-indigo-200/80 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                    ⚡ Near Target
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600">
                    {Math.round((closestFundraiser.raised_amount / closestFundraiser.target_amount) * 100)}%
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition line-clamp-2 mb-1.5">
                  {closestFundraiser.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {closestFundraiser.problem?.location || 'India'}
                </p>
                <div className="bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100 text-xs mb-4">
                  <span className="font-bold text-indigo-900">₹{Number(closestFundraiser.raised_amount).toLocaleString('en-IN')}</span> of ₹{Number(closestFundraiser.target_amount).toLocaleString('en-IN')}
                </div>
              </div>

              <Link 
                href={`/fundraisers/${closestFundraiser.id}`} 
                className="w-full text-center text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 py-2.5 rounded-xl transition flex items-center justify-center gap-1"
              >
                <span>Fund the Gap</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}

          {/* Card 3: Most People Affected */}
          {mostAffectedProblem && (
            <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    👥 High Scale
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">BROAD IMPACT</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition line-clamp-2 mb-1.5">
                  {mostAffectedProblem.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {mostAffectedProblem.location}
                </p>
                <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 text-xs mb-4">
                  <span className="font-bold text-amber-900">{mostAffectedProblem.people_affected} citizens</span> impacted in area
                </div>
              </div>

              <Link 
                href={`/problems/${mostAffectedProblem.id}`} 
                className="w-full text-center text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 py-2.5 rounded-xl transition flex items-center justify-center gap-1"
              >
                <span>Support Problem</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}

          {/* Card 4: Recently Active Verified Problem */}
          {recentlyActiveProblem && (
            <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ✓ Verified Campaign
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">ACTIVE</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition line-clamp-2 mb-1.5">
                  {recentlyActiveProblem.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {recentlyActiveProblem.location}
                </p>
                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 text-xs mb-4">
                  <span className="font-bold text-emerald-900">{recentlyActiveFundraiser ? `₹${Number(recentlyActiveFundraiser.raised_amount).toLocaleString('en-IN')} raised` : 'NGO Verified'}</span>
                </div>
              </div>

              <Link 
                href={recentlyActiveFundraiser ? `/fundraisers/${recentlyActiveFundraiser.id}` : `/problems/${recentlyActiveProblem.id}`} 
                className="w-full text-center text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-2.5 rounded-xl transition flex items-center justify-center gap-1"
              >
                <span>Take Action</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. THE CORE USER JOURNEY (Central Product Identity) */}
      <section className="py-20 bg-slate-900 text-white my-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
            System Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            The ImpactBridge Journey
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-16 text-sm sm:text-base">
            How authentic problems transform into verified solutions with zero leakage.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-left">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 relative">
              <div className="text-blue-400 font-black text-xs mb-2">01</div>
              <h3 className="font-extrabold text-sm mb-1 text-white">DISCOVER A PROBLEM</h3>
              <p className="text-xs text-slate-400">Ground citizens submit verified issues with photos & location.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 relative">
              <div className="text-amber-400 font-black text-xs mb-2">02</div>
              <h3 className="font-extrabold text-sm mb-1 text-white">UNDERSTAND PROBLEM</h3>
              <p className="text-xs text-slate-400">NGO partners review urgency, citizen count, and real costs.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 relative">
              <div className="text-indigo-400 font-black text-xs mb-2">03</div>
              <h3 className="font-extrabold text-sm mb-1 text-white">SEE FUNDRAISER</h3>
              <p className="text-xs text-slate-400">Transparent campaign mapped 1:1 to the exact problem.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 relative">
              <div className="text-rose-400 font-black text-xs mb-2">04</div>
              <h3 className="font-extrabold text-sm mb-1 text-white">MAKE CONTRIBUTION</h3>
              <p className="text-xs text-slate-400">Donors back suggested impact tiers from ₹100 to ₹1,000.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 relative">
              <div className="text-emerald-400 font-black text-xs mb-2">05</div>
              <h3 className="font-extrabold text-sm mb-1 text-white">SEE THE IMPACT</h3>
              <p className="text-xs text-slate-400">Field photos & milestones published when solved.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RECENTLY REPORTED PROBLEMS GRID */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                Live Feed
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Recently Reported Problems
              </h2>
            </div>
            <Link 
              href="/problems" 
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 group"
            >
              View All Problems <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problems?.slice(0, 3).map((problem) => (
              <Link 
                key={problem.id} 
                href={`/problems/${problem.id}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/70 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="h-52 bg-slate-100 w-full overflow-hidden relative">
                  <img 
                    src={getProblemImage(problem)} 
                    alt={problem.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <span className="absolute top-3 left-3 text-xs font-bold uppercase text-blue-800 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md shadow-xs border border-blue-100">
                    {problem.category}
                  </span>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {problem.status.replace('_', ' ')}
                    </span>
                    {problem.urgency && (
                      <span className="text-xs font-medium text-amber-700 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> {problem.urgency}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                    {problem.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                    <span className="flex items-center gap-1 truncate max-w-[150px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {problem.location}
                    </span>
                    <span className="font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
