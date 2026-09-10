import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, AlertTriangle, Users, CheckCircle2, ArrowRight, Sparkles, HeartHandshake, Zap } from 'lucide-react'
import { getProblemImage } from '@/lib/images'
import AnimatedCounter from '@/components/AnimatedCounter'

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
      <Link href="/problems" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 mb-6 transition">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Problems
      </Link>

      {/* Celebratory Landmark Banner if Solved */}
      {isSolved && (
        <div className="bg-emerald-50 border border-emerald-200 text-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 animate-in fade-in duration-300 relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 text-emerald-700 shadow-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="text-center sm:text-left flex-grow">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-800 mb-1 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Final Node Completed
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">✓ PROBLEM SOLVED</h2>
            <p className="text-slate-600 text-sm mt-1.5 max-w-xl">
              100% of the civic funding goal was raised. Ground execution and verifiable proof have been documented.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xl">
        {/* Hero image area */}
        <div className="h-64 md:h-96 w-full overflow-hidden relative bg-slate-100">
          <img 
            src={getProblemImage(problem)} 
            alt={problem.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="text-xs font-bold uppercase text-blue-800 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md shadow-xs border border-blue-100">
              {problem.category}
            </span>
            <span className="text-xs font-bold uppercase text-slate-700 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md shadow-xs border border-slate-200">
              {problem.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mb-4">{problem.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            <div className="flex items-center text-slate-700">
              <MapPin className="w-5 h-5 mr-2 text-blue-600 shrink-0" />
              <span className="text-sm font-medium">{problem.location}</span>
            </div>
            <div className="flex items-center text-slate-700">
              <Users className="w-5 h-5 mr-2 text-slate-400 shrink-0" />
              <span className="text-sm font-medium">
                <AnimatedCounter value={problem.people_affected || 0} duration={1400} /> affected citizens
              </span>
            </div>
            <div className="flex items-center text-slate-700">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-500 shrink-0" />
              <span className="text-sm font-medium">Urgency: {problem.urgency}</span>
            </div>
          </div>

          <div className="prose max-w-none mb-12 text-slate-700 leading-relaxed">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Problem Dossier</h3>
            <p className="whitespace-pre-wrap text-slate-600 text-sm sm:text-base">{problem.description}</p>
          </div>

          {/* 2. THE IMPACT CHAIN (TRANSPARENCY PROTOCOL) */}
          <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-slate-50/80 border border-slate-200 relative overflow-hidden shadow-xs">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
                  Transparency Protocol
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" /> The Impact Chain
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Node {currentStageIndex + 1} of 5
              </span>
            </div>

            {/* Pipeline Nodes */}
            <div className="relative space-y-4">
              {/* Connecting track */}
              <div className="absolute left-4.5 top-6 bottom-6 w-0.5 bg-slate-200 z-0"></div>
              
              {chainStages.map((stage, index) => {
                const isPast = index < currentStageIndex
                const isCurrent = index === currentStageIndex

                return (
                  <div 
                    key={stage.number} 
                    className={`relative z-10 flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                      isCurrent
                        ? 'bg-white border-2 border-blue-600 shadow-md ring-2 ring-blue-100'
                        : isPast
                        ? 'bg-emerald-50/50 border border-emerald-200'
                        : 'bg-white/60 border border-slate-200 opacity-60'
                    }`}
                  >
                    {/* Stage Node Circle */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 animate-pulse'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isPast ? '✓' : stage.number}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm font-black tracking-wide ${
                          isCurrent ? 'text-slate-900' : isPast ? 'text-emerald-950' : 'text-slate-500'
                        }`}>
                          {stage.title}
                        </h4>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                            Active Node
                          </span>
                        )}
                        {isPast && (
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-normal">{stage.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Connected Campaign Card */}
          {fundraiser ? (
            <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white border border-blue-200 rounded-2xl p-6 sm:p-8 text-center shadow-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
                <HeartHandshake className="w-3.5 h-3.5 text-blue-600" /> Connected Campaign
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{fundraiser.title}</h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                Direct community micro-donations are currently open for this verified node.
              </p>
              
              <div className="w-full max-w-md mx-auto mb-6">
                <div className="flex justify-between text-xs mb-1.5 font-bold text-slate-700">
                  <span>
                    <AnimatedCounter value={Number(fundraiser.raised_amount)} prefix="₹" duration={1600} /> raised
                  </span>
                  <span>
                    Goal: <AnimatedCounter value={Number(fundraiser.target_amount)} prefix="₹" duration={1600} />
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-700 shadow-xs" 
                    style={{ width: `${Math.min(100, (fundraiser.raised_amount / fundraiser.target_amount) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <Link 
                href={`/fundraisers/${fundraiser.id}`}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black py-3.5 px-8 rounded-xl shadow-lg shadow-blue-500/25 transition active:scale-98"
              >
                <span>View Fundraiser & Make Contribution</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-600">
              <p className="font-bold text-slate-800">Status: {problem.status.replace('_', ' ')}</p>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Our NGO partners are currently field-checking this node. Once verified, a campaign target will be posted here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
