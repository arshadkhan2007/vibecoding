import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, CheckCircle2, Heart, ShieldCheck, Users2, Sparkles, MapPin, AlertTriangle, TrendingUp } from 'lucide-react'
import { getProblemImage } from '@/lib/images'

export default async function Home() {
  const supabase = await createClient()

  // Fetch stats exactly as before
  const { count: problemsCount } = await supabase.from('problems').select('*', { count: 'exact', head: true })
  const { count: fundraisersCount } = await supabase.from('fundraisers').select('*', { count: 'exact', head: true })
  const { data: fundraisers } = await supabase.from('fundraisers').select('raised_amount')
  
  const totalRaised = fundraisers?.reduce((acc, curr) => acc + (Number(curr.raised_amount) || 0), 0) || 0

  const { data: featuredProblems } = await supabase
    .from('problems')
    .select('*')
    .limit(3)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Hero Section with Modern Subtle Glow Background */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white pt-24 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Subtle glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute top-1/2 right-10 w-[300px] h-[200px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs sm:text-sm font-semibold mb-8 backdrop-blur-sm shadow-inner">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Transparent Civic Crowdfunding</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Real Problems. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
              Real People. Real Impact.
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-slate-300 font-normal leading-relaxed">
            Discover verified community problems and support transparent fundraisers that directly fund real solutions.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/problems" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-base py-3.5 px-8 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-600 hover:to-indigo-700 transition transform hover:-translate-y-0.5"
            >
              Explore Problems <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/fundraisers" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700/90 text-white border border-slate-700 font-semibold text-base py-3.5 px-8 rounded-xl backdrop-blur-md shadow-md hover:border-slate-600 transition transform hover:-translate-y-0.5"
            >
              Support Fundraisers <Heart className="w-5 h-5 text-rose-400 fill-rose-400/20" />
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="relative z-20 -mt-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-2 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">{problemsCount || 0}</p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 mt-1.5">Problems Reported</p>
            </div>
            <div className="pt-2 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-indigo-600 tracking-tight">0</p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 mt-1.5">Verified Solved</p>
            </div>
            <div className="pt-2 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">{fundraisersCount || 0}</p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 mt-1.5">Active Fundraisers</p>
            </div>
            <div className="pt-2 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">₹{totalRaised.toLocaleString('en-IN')}</p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 mt-1.5">Total Funds Raised</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            Simple Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            How ImpactBridge Works
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-16 text-base sm:text-lg">
            A transparent four-step journey transforming ground-level challenges into verified impact.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <Users2 className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-blue-600 tracking-wider mb-1 uppercase">Step 1</div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Report</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Community members document local issues that need urgent action.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-amber-600 tracking-wider mb-1 uppercase">Step 2</div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Verify</h3>
              <p className="text-slate-600 text-sm leading-relaxed">NGO partners conduct ground checks and validate genuine needs.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <Heart className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-rose-600 tracking-wider mb-1 uppercase">Step 3</div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Fund</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Donors contribute micro-donations directly mapped to real goals.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-emerald-600 tracking-wider mb-1 uppercase">Step 4</div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Impact</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Full audit logs and photographic evidence are published once solved.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Problems */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                Live Feed
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
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
            {featuredProblems?.map((problem) => (
              <Link 
                key={problem.id} 
                href={`/problems/${problem.id}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/70 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-200"
              >
                <div className="h-52 bg-slate-100 w-full overflow-hidden relative">
                  <img 
                    src={getProblemImage(problem)} 
                    alt={problem.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <span className="absolute top-3 left-3 text-xs font-bold uppercase text-blue-700 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md shadow-xs">
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
