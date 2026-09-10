import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, AlertTriangle, Users, CheckCircle2, ArrowRight, Sparkles, HeartHandshake } from 'lucide-react'
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

  // 5-Stage Problem -> Fundraiser -> Impact Journey
  const journeyStages = [
    { number: '01', title: 'PROBLEM REPORTED', desc: 'Identified & submitted by local residents' },
    { number: '02', title: 'VERIFIED BY NGO', desc: 'Field-checked & authenticated by partner' },
    { number: '03', title: 'FUNDRAISER CREATED', desc: 'Direct transparent budget mapped' },
    { number: '04', title: 'COMMUNITY FUNDS IT', desc: 'Direct micro-donations pooled' },
    { number: '05', title: 'IMPACT DELIVERED', desc: 'Materials executed & proof published' },
  ]

  // Map database status to stage index
  let currentStageIndex = 0
  if (problem.status === 'REPORTED') {
    currentStageIndex = 0
  } else if (problem.status === 'UNDER_REVIEW') {
    currentStageIndex = 0
  } else if (problem.status === 'VERIFIED') {
    currentStageIndex = 1
  } else if (problem.status === 'FUNDRAISER_CREATED') {
    if (fundraiser && Number(fundraiser.raised_amount) >= Number(fundraiser.target_amount)) {
      currentStageIndex = 4
    } else {
      currentStageIndex = 3 // Community Funds It
    }
  } else if (problem.status === 'SOLVED') {
    currentStageIndex = 4 // Impact Delivered
  }

  const isSolved = problem.status === 'SOLVED' || (fundraiser && Number(fundraiser.raised_amount) >= Number(fundraiser.target_amount))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/problems" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 mb-6 transition">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Problems
      </Link>

      {/* Celebratory Banner if Problem is Solved */}
      {isSolved && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-emerald-500/20 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 animate-in fade-in duration-300">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-white shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <div className="text-center sm:text-left flex-grow">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-200 mb-1 bg-white/10 px-3 py-0.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> Verified Landmark
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">✓ PROBLEM SOLVED</h2>
            <p className="text-emerald-100 text-sm mt-1.5 max-w-xl">
              This issue has reached its goal. Funding was successfully pooled and ground execution has been validated by NGO partners.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        {/* Hero image area */}
        <div className="h-64 md:h-96 w-full overflow-hidden relative">
          <img 
            src={getProblemImage(problem)} 
            alt={problem.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="text-xs font-bold uppercase text-blue-800 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md shadow-xs border border-blue-100">
              {problem.category}
            </span>
            <span className="text-xs font-bold uppercase text-slate-800 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md shadow-xs border border-slate-200">
              {problem.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">{problem.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-slate-50/80 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center text-slate-700">
              <MapPin className="w-5 h-5 mr-2 text-blue-500 shrink-0" />
              <span className="text-sm font-medium">{problem.location}</span>
            </div>
            <div className="flex items-center text-slate-700">
              <Users className="w-5 h-5 mr-2 text-slate-400 shrink-0" />
              <span className="text-sm font-medium">{problem.people_affected} affected citizens</span>
            </div>
            <div className="flex items-center text-slate-700">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-500 shrink-0" />
              <span className="text-sm font-medium">Urgency: {problem.urgency}</span>
            </div>
          </div>

          <div className="prose max-w-none mb-10 text-slate-700 leading-relaxed">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Problem Dossier</h3>
            <p className="whitespace-pre-wrap text-slate-600 text-sm sm:text-base">{problem.description}</p>
          </div>

          {/* PROBLEM → FUNDRAISER → IMPACT JOURNEY */}
          <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/80">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
                  Transparency Lifecycle
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Problem → Fundraiser → Impact Journey
                </h3>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                Stage {currentStageIndex + 1} of 5
              </span>
            </div>

            {/* Visual Step Journey */}
            <div className="space-y-4">
              {journeyStages.map((stage, index) => {
                const isPast = index < currentStageIndex
                const isCurrent = index === currentStageIndex
                const isFuture = index > currentStageIndex

                return (
                  <div 
                    key={stage.number} 
                    className={`flex items-start gap-4 p-3.5 rounded-xl transition-all duration-200 ${
                      isCurrent
                        ? 'bg-white shadow-md border-2 border-blue-500 ring-2 ring-blue-100'
                        : isPast
                        ? 'bg-white/70 border border-slate-200/60 opacity-90'
                        : 'bg-white/30 border border-transparent opacity-50'
                    }`}
                  >
                    {/* Stage number / Check */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isPast
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isPast ? '✓' : stage.number}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-bold tracking-tight ${
                          isCurrent ? 'text-blue-950' : isPast ? 'text-slate-800' : 'text-slate-500'
                        }`}>
                          {stage.title}
                        </h4>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                            In Progress
                          </span>
                        )}
                        {isPast && (
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-normal">{stage.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Fundraiser CTA Box */}
          {fundraiser ? (
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border border-blue-200/80 rounded-2xl p-6 sm:p-8 text-center shadow-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
                <HeartHandshake className="w-3.5 h-3.5" /> Campaign Connected
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{fundraiser.title}</h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                A verified crowdfunding campaign is directly funding solutions for this issue.
              </p>
              
              <div className="w-full max-w-md mx-auto mb-6">
                <div className="flex justify-between text-xs mb-1.5 font-semibold text-slate-700">
                  <span>₹{Number(fundraiser.raised_amount).toLocaleString('en-IN')} raised</span>
                  <span>Goal: ₹{Number(fundraiser.target_amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden p-0.5 border border-blue-200">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${Math.min(100, (fundraiser.raised_amount / fundraiser.target_amount) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <Link 
                href={`/fundraisers/${fundraiser.id}`}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-md shadow-blue-500/25 transition active:scale-98"
              >
                <span>View Fundraiser & Make Contribution</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-600">
              <p className="font-semibold text-slate-800">Status: {problem.status.replace('_', ' ')}</p>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Our NGO partners are currently assessing the ground requirements. Once verified, a campaign target will be posted here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
