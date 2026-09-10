import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, AlertTriangle, Users, CheckCircle2, ArrowRight, Sparkles, HeartHandshake, Zap } from 'lucide-react'
import { getProblemImage } from '@/lib/images'

export default async function ProblemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: problem, error } = await supabase
    .from('problems')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !problem) {
    notFound()
  }

  // Check if a fundraiser exists for this problem
  const { data: fundraiser } = await supabase
    .from('fundraisers')
    .select('id, title, target_amount, raised_amount, status')
    .eq('problem_id', id)
    .maybeSingle()

  // 5-Stage Web3 Impact Chain
  const chainStages = [
    { number: '01', title: 'PROBLEM', desc: 'Identified & submitted by ground community', key: 'REPORTED' },
    { number: '02', title: 'VERIFIED', desc: 'Field-checked & authenticated by NGO partner', key: 'VERIFIED' },
    { number: '03', title: 'FUNDRAISER', desc: 'Direct transparent budget & campaign connected', key: 'FUNDRAISER' },
    { number: '04', title: 'COMMUNITY', desc: 'Civic micro-donations pooled in real-time', key: 'COMMUNITY' },
    { number: '05', title: 'IMPACT', desc: 'Execution complete & proof ledger published', key: 'IMPACT' },
  ]

  // Map database status to stage index
  let currentStageIndex = 0
  if (problem.status === 'REPORTED' || problem.status === 'UNDER_REVIEW') {
    currentStageIndex = 0
  } else if (problem.status === 'VERIFIED') {
    currentStageIndex = 1
  } else if (problem.status === 'FUNDRAISER_CREATED') {
    if (fundraiser && Number(fundraiser.raised_amount) >= Number(fundraiser.target_amount)) {
      currentStageIndex = 4
    } else {
      currentStageIndex = 3 // COMMUNITY
    }
  } else if (problem.status === 'SOLVED') {
    currentStageIndex = 4 // IMPACT
  }

  const isSolved = problem.status === 'SOLVED' || (fundraiser && Number(fundraiser.raised_amount) >= Number(fundraiser.target_amount))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/problems" className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-cyan-400 mb-6 transition">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Problems
      </Link>

      {/* Celebratory Landmark Banner if Solved */}
      {isSolved && (
        <div className="bg-gradient-to-r from-emerald-950/90 via-teal-900/90 to-emerald-950/90 border border-emerald-500/50 text-white rounded-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/20 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 animate-in fade-in duration-300 relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 text-emerald-400 shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-emerald-300" />
          </div>
          <div className="text-center sm:text-left flex-grow">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-300 mb-1 bg-emerald-950/80 px-3 py-0.5 rounded-full border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> Final Node Completed
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">✓ PROBLEM SOLVED</h2>
            <p className="text-emerald-200/90 text-sm mt-1.5 max-w-xl">
              100% of the civic funding goal was raised. Ground execution and verifiable proof have been documented.
            </p>
          </div>
        </div>
      )}

      <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Hero image area */}
        <div className="h-64 md:h-96 w-full overflow-hidden relative">
          <img 
            src={getProblemImage(problem)} 
            alt={problem.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="text-xs font-bold uppercase text-cyan-300 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-md shadow-xs border border-cyan-500/30">
              {problem.category}
            </span>
            <span className="text-xs font-bold uppercase text-slate-300 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-md shadow-xs border border-white/15">
              {problem.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">{problem.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white/[0.03] p-4 rounded-xl border border-white/10">
            <div className="flex items-center text-slate-300">
              <MapPin className="w-5 h-5 mr-2 text-cyan-400 shrink-0" />
              <span className="text-sm font-medium">{problem.location}</span>
            </div>
            <div className="flex items-center text-slate-300">
              <Users className="w-5 h-5 mr-2 text-slate-400 shrink-0" />
              <span className="text-sm font-medium">{problem.people_affected} affected citizens</span>
            </div>
            <div className="flex items-center text-slate-300">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-400 shrink-0" />
              <span className="text-sm font-medium">Urgency: {problem.urgency}</span>
            </div>
          </div>

          <div className="prose max-w-none mb-12 text-slate-300 leading-relaxed">
            <h3 className="text-lg font-bold text-white mb-2">Problem Dossier</h3>
            <p className="whitespace-pre-wrap text-slate-300 text-sm sm:text-base">{problem.description}</p>
          </div>

          {/* 2. THE IMPACT CHAIN (GLOWING NODES & PARTICLES) */}
          <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-slate-950/80 border border-cyan-500/25 relative overflow-hidden shadow-xl shadow-cyan-500/5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-1 block">
                  Transparency Protocol
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" /> The Impact Chain
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Node {currentStageIndex + 1} of 5
              </span>
            </div>

            {/* Glowing Pipeline Nodes */}
            <div className="relative space-y-4">
              {/* Connecting glowing track */}
              <div className="absolute left-4.5 top-6 bottom-6 w-0.5 bg-white/10 z-0"></div>
              
              {chainStages.map((stage, index) => {
                const isPast = index < currentStageIndex
                const isCurrent = index === currentStageIndex
                const isFuture = index > currentStageIndex

                return (
                  <div 
                    key={stage.number} 
                    className={`relative z-10 flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                      isCurrent
                        ? 'bg-slate-900/90 border border-cyan-500/60 shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-500/40'
                        : isPast
                        ? 'bg-slate-900/50 border border-emerald-500/20 opacity-90'
                        : 'bg-slate-900/20 border border-white/5 opacity-40'
                    }`}
                  >
                    {/* Glowing Stage Node Circle */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                      isCurrent
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/50 animate-pulse'
                        : isPast
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-white/5 text-slate-500 border border-white/10'
                    }`}>
                      {isPast ? '✓' : stage.number}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm font-black tracking-wide ${
                          isCurrent ? 'text-white' : isPast ? 'text-slate-200' : 'text-slate-500'
                        }`}>
                          {stage.title}
                        </h4>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                            Active Node
                          </span>
                        )}
                        {isPast && (
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-normal">{stage.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Connected Campaign Card */}
          {fundraiser ? (
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/50 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 text-center shadow-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-black uppercase tracking-wider mb-3">
                <HeartHandshake className="w-3.5 h-3.5 text-cyan-400" /> Connected Campaign
              </div>
              <h3 className="text-2xl font-black text-white mb-2">{fundraiser.title}</h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
                Direct community micro-donations are currently open for this verified node.
              </p>
              
              <div className="w-full max-w-md mx-auto mb-6">
                <div className="flex justify-between text-xs mb-1.5 font-bold text-slate-300">
                  <span>₹{Number(fundraiser.raised_amount).toLocaleString('en-IN')} raised</span>
                  <span>Goal: ₹{Number(fundraiser.target_amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden p-0.5 border border-white/10">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-700 shadow-sm shadow-cyan-500/40" 
                    style={{ width: `${Math.min(100, (fundraiser.raised_amount / fundraiser.target_amount) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <Link 
                href={`/fundraisers/${fundraiser.id}`}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black py-3.5 px-8 rounded-xl shadow-lg shadow-cyan-500/25 transition active:scale-98"
              >
                <span>View Fundraiser & Make Contribution</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 text-center text-slate-400">
              <p className="font-bold text-slate-200">Status: {problem.status.replace('_', ' ')}</p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Our NGO partners are currently field-checking this node. Once verified, a campaign target will be posted here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
