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
  Zap
} from 'lucide-react'
import { getProblemImage } from '@/lib/images'
import ImpactNetworkCanvas from '@/components/ImpactNetworkCanvas'
import AnimatedCounter from '@/components/AnimatedCounter'
import AnimatedTextTicker from '@/components/AnimatedTextTicker'
import LiveActivityTicker from '@/components/LiveActivityTicker'

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
    <div className="flex flex-col min-h-screen bg-slate-50/60 text-slate-900">
      {/* 1. HERO — IMPACT NETWORK */}
      <section className="relative overflow-hidden pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/50 via-white to-slate-50/80">
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-bold mb-6 shadow-xs animate-float">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            <span>Live Civic Crowdfunding Protocol</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-5 leading-[1.1] text-slate-950">
            Real Problems. <br />
            <span className="text-slate-900">Real People. </span>
            <AnimatedTextTicker />
          </h1>

          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 text-slate-600 font-normal leading-relaxed">
            Every problem is a verified node. Every fundraiser is a direct connection. Every completed goal lights up verified on-the-ground impact.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
            <Link 
              href="/problems" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-lg shadow-blue-500/25 transition transform hover:-translate-y-0.5"
            >
              Explore Impact Nodes <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/fundraisers" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-sm transition transform hover:-translate-y-0.5"
            >
              Support Connections <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
            </Link>
          </div>

          {/* Interactive Hero Canvas Network Visualization */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/60 p-3 relative overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="font-bold text-slate-800">Live Network Graph</span>
              </span>
              <span className="text-[11px] text-blue-600 font-semibold">Hover & Click Nodes to Interact</span>
            </div>
            <ImpactNetworkCanvas />
          </div>
        </div>
      </section>

      {/* Live Stream Activity Marquee Ticker */}
      <LiveActivityTicker />

      {/* 2. IMPACT COUNTER (ANIMATED METRIC NODES) */}
      <section className="relative z-20 -mt-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-200/80 p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-2 md:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
                <Coins className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Pooled</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight number-glow">
                <AnimatedCounter value={totalRaised} prefix="₹" duration={2200} />
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">100% verified allocation</p>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-indigo-600 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Problem Nodes</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                <AnimatedCounter value={problemsCount} duration={1500} />
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Field authenticated</p>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-rose-600 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Citizens Impacted</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                <AnimatedCounter value={totalAffected} suffix="+" duration={2000} />
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Direct ground beneficiaries</p>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Connections</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                <AnimatedCounter value={fundraisersCount} duration={1400} />
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Open for micro-backing</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM OF THE DAY: "PROBLEM THAT NEEDS YOU" */}
      {heroProblem && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg shadow-slate-200/50 relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-xs animate-pulse">
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                Problem That Needs You
              </div>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Focus Target Node
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Image area */}
              <div className="lg:col-span-6 h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md relative group border border-slate-100">
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
                    <MapPin className="w-3.5 h-3.5 text-blue-600" /> {heroProblem.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> 
                    <AnimatedCounter value={heroProblem.people_affected} duration={1400} /> affected
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
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6">
                    <div className="flex justify-between items-baseline mb-1 text-xs">
                      <span className="font-bold text-slate-800">Connection Progress</span>
                      <span className="font-black text-blue-600">
                        <AnimatedCounter value={heroProgress} suffix="% FUNDED" duration={1800} />
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden mb-2">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-700 shadow-xs" 
                        style={{ width: `${heroProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>
                        <AnimatedCounter value={Number(heroFundraiser.raised_amount)} prefix="₹" duration={1600} /> raised
                      </span>
                      <span>Goal: ₹{Number(heroFundraiser.target_amount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href={heroFundraiser ? `/fundraisers/${heroFundraiser.id}` : `/problems/${heroProblem.id}`}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-3.5 px-6 rounded-xl shadow-md shadow-blue-500/20 transition active:scale-98 text-sm"
                  >
                    <span>See How You Can Help</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link 
                    href={`/problems/${heroProblem.id}`} 
                    className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-3.5 px-5 rounded-xl transition text-sm"
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
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Impact Pulse
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            See where help is needed right now.
          </h2>
        </div>

        {/* 4 Compact Live-Looking Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Most Urgent Problem */}
          {mostUrgentProblem && (
            <div className="bg-white rounded-2xl p-5 border border-rose-200/80 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    🔥 Most Urgent
                  </span>
                  <span className="text-[10px] font-bold text-rose-600">HIGH PRIORITY</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition line-clamp-2 mb-1.5">
                  {mostUrgentProblem.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {mostUrgentProblem.location}
                </p>
                <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-100 text-xs mb-4">
                  <span className="font-bold text-rose-800">
                    <AnimatedCounter value={mostUrgentProblem.people_affected} duration={1500} /> students/citizens
                  </span> affected
                </div>
              </div>

              <Link 
                href={`/problems/${mostUrgentProblem.id}`} 
                className="w-full text-center text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 py-2.5 rounded-xl transition flex items-center justify-center gap-1"
              >
                <span>Help Solve It</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}

          {/* Card 2: Closest to Fully Funded */}
          {closestFundraiser && (
            <div className="bg-white rounded-2xl p-5 border border-blue-200/80 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    ⚡ Near Target
                  </span>
                  <span className="text-[10px] font-bold text-blue-600">
                    <AnimatedCounter 
                      value={Math.round((closestFundraiser.raised_amount / closestFundraiser.target_amount) * 100)} 
                      suffix="%" 
                      duration={1400} 
                    />
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition line-clamp-2 mb-1.5">
                  {closestFundraiser.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {closestFundraiser.problem?.location || 'India'}
                </p>
                <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100 text-xs mb-4">
                  <span className="font-bold text-blue-800">
                    <AnimatedCounter value={Number(closestFundraiser.raised_amount)} prefix="₹" duration={1600} />
                  </span> of ₹{Number(closestFundraiser.target_amount).toLocaleString('en-IN')}
                </div>
              </div>

              <Link 
                href={`/fundraisers/${closestFundraiser.id}`} 
                className="w-full text-center text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 py-2.5 rounded-xl transition flex items-center justify-center gap-1"
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
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    👥 High Scale
                  </span>
                  <span className="text-[10px] font-bold text-amber-700">BROAD IMPACT</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition line-clamp-2 mb-1.5">
                  {mostAffectedProblem.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {mostAffectedProblem.location}
                </p>
                <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 text-xs mb-4">
                  <span className="font-bold text-amber-900">
                    <AnimatedCounter value={mostAffectedProblem.people_affected} duration={1500} /> citizens
                  </span> impacted in area
                </div>
              </div>

              <Link 
                href={`/problems/${mostAffectedProblem.id}`} 
                className="w-full text-center text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 py-2.5 rounded-xl transition flex items-center justify-center gap-1"
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
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ✓ Verified Node
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700">ACTIVE</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition line-clamp-2 mb-1.5">
                  {recentlyActiveProblem.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {recentlyActiveProblem.location}
                </p>
                <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 text-xs mb-4">
                  <span className="font-bold text-emerald-900">
                    {recentlyActiveFundraiser ? (
                      <>
                        <AnimatedCounter value={Number(recentlyActiveFundraiser.raised_amount)} prefix="₹" duration={1600} /> raised
                      </>
                    ) : (
                      'NGO Verified'
                    )}
                  </span>
                </div>
              </div>

              <Link 
                href={recentlyActiveFundraiser ? `/fundraisers/${recentlyActiveFundraiser.id}` : `/problems/${recentlyActiveProblem.id}`} 
                className="w-full text-center text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 py-2.5 rounded-xl transition flex items-center justify-center gap-1"
              >
                <span>Take Action</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. THE IMPACT NETWORK PROTOCOL ARCHITECTURE */}
      <section className="py-16 bg-white border-y border-slate-200/80 my-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            Living Network Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mb-3">
            The Impact Protocol Journey
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-16 text-sm sm:text-base">
            Every step is authenticated, funded, and published to the public impact ledger.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-left">
            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 relative group hover:border-blue-300 transition">
              <div className="text-blue-600 font-black text-xs mb-2">01 NODE</div>
              <h3 className="font-extrabold text-sm mb-1 text-slate-900">DISCOVER A PROBLEM</h3>
              <p className="text-xs text-slate-600">Ground citizens submit verified issues with photos & coordinates.</p>
            </div>

            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 relative group hover:border-amber-300 transition">
              <div className="text-amber-600 font-black text-xs mb-2">02 AUDIT</div>
              <h3 className="font-extrabold text-sm mb-1 text-slate-900">UNDERSTAND PROBLEM</h3>
              <p className="text-xs text-slate-600">NGO partners review urgency, citizen count, and real costs.</p>
            </div>

            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 relative group hover:border-indigo-300 transition">
              <div className="text-indigo-600 font-black text-xs mb-2">03 CONNECTION</div>
              <h3 className="font-extrabold text-sm mb-1 text-slate-900">SEE FUNDRAISER</h3>
              <p className="text-xs text-slate-600">Transparent campaign mapped 1:1 to the exact problem node.</p>
            </div>

            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 relative group hover:border-rose-300 transition">
              <div className="text-rose-600 font-black text-xs mb-2">04 BACKING</div>
              <h3 className="font-extrabold text-sm mb-1 text-slate-900">MAKE CONTRIBUTION</h3>
              <p className="text-xs text-slate-600">Backers fund suggested impact tiers from ₹100 to ₹5,000.</p>
            </div>

            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 relative group hover:border-emerald-300 transition">
              <div className="text-emerald-600 font-black text-xs mb-2">05 PROOF</div>
              <h3 className="font-extrabold text-sm mb-1 text-slate-900">SEE THE IMPACT</h3>
              <p className="text-xs text-slate-600">Milestones & field photography published when node is solved.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RECENTLY REPORTED PROBLEMS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-100">
              Live Feed
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Active Community Nodes
            </h2>
          </div>
          <Link 
            href="/problems" 
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 group"
          >
            Explore All Nodes <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems?.slice(0, 3).map((problem) => (
            <Link 
              key={problem.id} 
              href={`/problems/${problem.id}`}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
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
                <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {problem.description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                  <span className="flex items-center gap-1 truncate max-w-[150px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {problem.location}
                  </span>
                  <span className="font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
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
