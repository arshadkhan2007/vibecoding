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
  Coins, 
  Activity,
  Zap,
  Globe2
} from 'lucide-react'
import { getProblemImage } from '@/lib/images'
import ImpactNetworkCanvas from '@/components/ImpactNetworkCanvas'

export default async function Home() {
  const supabase = await createClient()

  // Fetch actual data from database
  const { data: problems } = await supabase.from('problems').select('*').order('created_at', { ascending: false })
  const { data: fundraisers } = await supabase.from('fundraisers').select('*, problem:problems(*)').order('created_at', { ascending: false })

  const totalRaised = fundraisers?.reduce((acc, curr) => acc + (Number(curr.raised_amount) || 0), 0) || 0
  const totalAffected = problems?.reduce((acc, curr) => acc + (Number(curr.people_affected) || 0), 0) || 0
  const problemsCount = problems?.length || 0
  const fundraisersCount = fundraisers?.length || 0

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
    <div className="flex flex-col min-h-screen bg-[#07090e] bg-grid-pattern text-slate-100">
      {/* 1. HERO — IMPACT NETWORK */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Soft background ambient radial glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute top-1/3 right-10 w-[380px] h-[260px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 text-xs sm:text-sm font-bold mb-6 backdrop-blur-md shadow-lg shadow-cyan-500/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Living Social Impact Network Protocol</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-5 leading-[1.1]">
            Real Problems. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Real People. Real Impact.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 text-slate-400 font-normal leading-relaxed">
            Every problem is a node. Every fundraiser is an active connection. Every completed goal lights up verifiable on-the-ground impact.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
            <Link 
              href="/problems" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-lg shadow-cyan-500/25 transition transform hover:-translate-y-0.5"
            >
              Explore Impact Nodes <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/fundraisers" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/10 font-bold text-sm sm:text-base py-3.5 px-8 rounded-xl backdrop-blur-md transition transform hover:-translate-y-0.5"
            >
              Support Connections <Heart className="w-5 h-5 text-rose-400 fill-rose-400/30" />
            </Link>
          </div>

          {/* Interactive Hero Canvas Network Visualization */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-slate-950/70 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl p-2 relative overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold text-slate-300">Live Network Graph</span>
              </span>
              <span className="text-[11px] text-cyan-400 font-medium">Hover & Click Nodes to Interact</span>
            </div>
            <ImpactNetworkCanvas />
          </div>
        </div>
      </section>

      {/* 2. IMPACT COUNTER (METRIC NODES) */}
      <section className="relative z-20 -mt-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-cyan-500/5 border border-white/10 p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="pt-2 md:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-cyan-400 mb-1">
                <Coins className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pooled</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">₹{totalRaised.toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">100% verified allocation</p>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-indigo-400 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Problem Nodes</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">{problemsCount}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Field authenticated</p>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-rose-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Citizens Impacted</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">{totalAffected}+</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Direct ground beneficiaries</p>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Connections</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">{fundraisersCount}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Open for micro-backing</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM OF THE DAY: "PROBLEM THAT NEEDS YOU" */}
      {heroProblem && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-indigo-950/60 rounded-3xl border border-cyan-500/30 p-6 sm:p-10 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-cyan-400" />
                Problem That Needs You
              </div>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Focus Target Node
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Image area */}
              <div className="lg:col-span-6 h-64 sm:h-80 rounded-2xl overflow-hidden shadow-2xl relative group border border-white/10">
                <img 
                  src={getProblemImage(heroProblem)} 
                  alt={heroProblem.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-cyan-300 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-md shadow-xs border border-cyan-500/30">
                    {heroProblem.category}
                  </span>
                </div>
              </div>

              {/* Content area */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {heroProblem.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" /> {heroProblem.people_affected} affected
                  </span>
                  <span>•</span>
                  <span className="text-amber-400 font-semibold">
                    Urgency: {heroProblem.urgency}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
                  {heroProblem.title}
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                  {heroProblem.description}
                </p>

                {/* Connected Fundraiser Momentum */}
                {heroFundraiser && (
                  <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/10 shadow-xs mb-6">
                    <div className="flex justify-between items-baseline mb-1 text-xs">
                      <span className="font-bold text-slate-200">Connection Progress</span>
                      <span className="font-black text-cyan-400">{heroProgress}% FUNDED</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden mb-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-700 shadow-sm shadow-cyan-500/40" 
                        style={{ width: `${heroProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>₹{Number(heroFundraiser.raised_amount).toLocaleString('en-IN')} raised</span>
                      <span>Goal: ₹{Number(heroFundraiser.target_amount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href={heroFundraiser ? `/fundraisers/${heroFundraiser.id}` : `/problems/${heroProblem.id}`}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black py-3.5 px-6 rounded-xl shadow-lg shadow-cyan-500/20 transition active:scale-98 text-sm"
                  >
                    <span>See How You Can Help</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link 
                    href={`/problems/${heroProblem.id}`}
                    className="inline-flex items-center justify-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 font-bold py-3.5 px-5 rounded-xl transition text-sm"
                  >
                    Read Node Dossier
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-black uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
            Impact Pulse
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            See where help is needed right now.
          </h2>
        </div>

        {/* 4 Compact Live-Looking Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Most Urgent Problem */}
          {mostUrgentProblem && (
            <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl p-5 border border-rose-500/30 shadow-lg shadow-rose-500/5 hover:border-rose-400/50 transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-500/40">
                    🔥 Most Urgent
                  </span>
                  <span className="text-[10px] font-bold text-rose-400">HIGH PRIORITY</span>
                </div>
                <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition line-clamp-2 mb-1.5">
                  {mostUrgentProblem.title}
                </h3>
                <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" /> {mostUrgentProblem.location}
                </p>
                <div className="bg-white/[0.03] p-2.5 rounded-xl border border-white/5 text-xs mb-4">
                  <span className="font-bold text-rose-300">{mostUrgentProblem.people_affected} students/citizens</span> affected
                </div>
              </div>

              <Link 
                href={`/problems/${mostUrgentProblem.id}`} 
                className="w-full text-center text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 py-2.5 rounded-xl transition flex items-center justify-center gap-1"
              >
                <span>Help Solve It</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}

          {/* Card 2: Closest to Fully Funded */}
          {closestFundraiser && (
            <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl p-5 border border-cyan-500/30 shadow-lg shadow-cyan-500/5 hover:border-cyan-400/50 transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/40">
                    ⚡ Near Target
                  </span>
                  <span className="text-[10px] font-bold text-cyan-400">
                    {Math.round((closestFundraiser.raised_amount / closestFundraiser.target_amount) * 100)}%
                  </span>
                </div>
                <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition line-clamp-2 mb-1.5">
                  {closestFundraiser.title}
                </h3>
                <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" /> {closestFundraiser.problem?.location || 'India'}
                </p>
                <div className="bg-white/[0.03] p-2.5 rounded-xl border border-white/5 text-xs mb-4">
                  <span className="font-bold text-cyan-300">₹{Number(closestFundraiser.raised_amount).toLocaleString('en-IN')}</span> of ₹{Number(closestFundraiser.target_amount).toLocaleString('en-IN')}
                </div>
              </div>

              <Link 
                href={`/fundraisers/${closestFundraiser.id}`} 
                className="w-full text-center text-xs font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 py-2.5 rounded-xl transition flex items-center justify-center gap-1"
              >
                <span>Fund the Gap</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}

          {/* Card 3: Most People Affected */}
          {mostAffectedProblem && (
            <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl p-5 border border-amber-500/30 shadow-lg shadow-amber-500/5 hover:border-amber-400/50 transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                    👥 High Scale
                  </span>
                  <span className="text-[10px] font-bold text-amber-400">BROAD IMPACT</span>
                </div>
                <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition line-clamp-2 mb-1.5">
                  {mostAffectedProblem.title}
                </h3>
                <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" /> {mostAffectedProblem.location}
                </p>
                <div className="bg-white/[0.03] p-2.5 rounded-xl border border-white/5 text-xs mb-4">
                  <span className="font-bold text-amber-300">{mostAffectedProblem.people_affected} citizens</span> impacted in area
                </div>
              </div>

              <Link 
                href={`/problems/${mostAffectedProblem.id}`} 
                className="w-full text-center text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 py-2.5 rounded-xl transition flex items-center justify-center gap-1"
              >
                <span>Support Problem</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}

          {/* Card 4: Recently Active Verified Problem */}
          {recentlyActiveProblem && (
            <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl p-5 border border-emerald-500/30 shadow-lg shadow-emerald-500/5 hover:border-emerald-400/50 transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                    ✓ Verified Node
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">ACTIVE</span>
                </div>
                <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition line-clamp-2 mb-1.5">
                  {recentlyActiveProblem.title}
                </h3>
                <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" /> {recentlyActiveProblem.location}
                </p>
                <div className="bg-white/[0.03] p-2.5 rounded-xl border border-white/5 text-xs mb-4">
                  <span className="font-bold text-emerald-300">{recentlyActiveFundraiser ? `₹${Number(recentlyActiveFundraiser.raised_amount).toLocaleString('en-IN')} raised` : 'NGO Verified'}</span>
                </div>
              </div>

              <Link 
                href={recentlyActiveFundraiser ? `/fundraisers/${recentlyActiveFundraiser.id}` : `/problems/${recentlyActiveProblem.id}`} 
                className="w-full text-center text-xs font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 py-2.5 rounded-xl transition flex items-center justify-center gap-1"
              >
                <span>Take Action</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. THE IMPACT NETWORK PROTOCOL ARCHITECTURE */}
      <section className="py-20 bg-slate-950/80 border-y border-white/10 my-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-black uppercase tracking-wider mb-4">
            Living Network Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            The Impact Protocol Journey
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-16 text-sm sm:text-base">
            Every step is authenticated, funded, and published to the public impact ledger.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-left">
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 relative group hover:border-cyan-500/40 transition">
              <div className="text-cyan-400 font-black text-xs mb-2">01 NODE</div>
              <h3 className="font-extrabold text-sm mb-1 text-white">DISCOVER A PROBLEM</h3>
              <p className="text-xs text-slate-400">Ground citizens submit verified issues with photos & coordinates.</p>
            </div>

            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 relative group hover:border-amber-500/40 transition">
              <div className="text-amber-400 font-black text-xs mb-2">02 AUDIT</div>
              <h3 className="font-extrabold text-sm mb-1 text-white">UNDERSTAND PROBLEM</h3>
              <p className="text-xs text-slate-400">NGO partners review urgency, citizen count, and real costs.</p>
            </div>

            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 relative group hover:border-indigo-500/40 transition">
              <div className="text-indigo-400 font-black text-xs mb-2">03 CONNECTION</div>
              <h3 className="font-extrabold text-sm mb-1 text-white">SEE FUNDRAISER</h3>
              <p className="text-xs text-slate-400">Transparent campaign mapped 1:1 to the exact problem node.</p>
            </div>

            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 relative group hover:border-rose-500/40 transition">
              <div className="text-rose-400 font-black text-xs mb-2">04 BACKING</div>
              <h3 className="font-extrabold text-sm mb-1 text-white">MAKE CONTRIBUTION</h3>
              <p className="text-xs text-slate-400">Backers fund suggested impact tiers from ₹100 to ₹5,000.</p>
            </div>

            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 relative group hover:border-emerald-500/40 transition">
              <div className="text-emerald-400 font-black text-xs mb-2">05 PROOF</div>
              <h3 className="font-extrabold text-sm mb-1 text-white">SEE THE IMPACT</h3>
              <p className="text-xs text-slate-400">Milestones & field photography published when node is solved.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RECENTLY REPORTED PROBLEMS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-black uppercase tracking-wider mb-2 border border-cyan-500/20">
              Live Feed
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Active Community Nodes
            </h2>
          </div>
          <Link 
            href="/problems" 
            className="inline-flex items-center text-sm font-semibold text-cyan-400 hover:text-cyan-300 group"
          >
            Explore All Nodes <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems?.slice(0, 3).map((problem) => (
            <Link 
              key={problem.id} 
              href={`/problems/${problem.id}`}
              className="group flex flex-col bg-slate-900/70 rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/40 shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md"
            >
              <div className="h-52 bg-slate-950 w-full overflow-hidden relative">
                <img 
                  src={getProblemImage(problem)} 
                  alt={problem.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <span className="absolute top-3 left-3 text-xs font-bold uppercase text-cyan-300 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-md shadow-xs border border-cyan-500/30">
                  {problem.category}
                </span>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                    {problem.status.replace('_', ' ')}
                  </span>
                  {problem.urgency && (
                    <span className="text-xs font-medium text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> {problem.urgency}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                  {problem.title}
                </h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {problem.description}
                </p>

                <div className="mt-auto pt-4 border-t border-white/10 text-xs text-slate-400 flex justify-between items-center">
                  <span className="flex items-center gap-1 truncate max-w-[150px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {problem.location}
                  </span>
                  <span className="font-bold text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Node Dossier <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
