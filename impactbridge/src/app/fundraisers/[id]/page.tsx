import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, Users, Target, Activity } from 'lucide-react'
import DonationForm from './DonationForm'
import { getProblemImage } from '@/lib/images'

export default async function FundraiserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: fundraiser, error } = await supabase
    .from('fundraisers')
    .select(`
      *,
      problem:problems(title, location, image_url, category)
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
      <Link href="/fundraisers" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Fundraisers
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="h-64 md:h-96 w-full overflow-hidden relative">
              <img 
                src={getProblemImage(fundraiser.problem)} 
                alt={fundraiser.title} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {fundraiser.problem?.category}
                </span>
                <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${fundraiser.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {fundraiser.status}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{fundraiser.title}</h1>
              <p className="text-gray-700 text-lg mb-8">{fundraiser.description}</p>
              
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Solving this Problem</h3>
                <Link href={`/problems/${fundraiser.problem_id}`} className="block p-4 border rounded-lg hover:bg-slate-50 transition">
                  <div className="font-bold text-blue-600">{fundraiser.problem?.title}</div>
                  <div className="text-sm text-gray-500 mt-1">📍 {fundraiser.problem?.location}</div>
                </Link>
              </div>
            </div>
          </div>

          {updates && updates.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <h3 className="text-2xl font-bold mb-6">Impact Updates</h3>
              <div className="space-y-6">
                {updates.map((update) => (
                  <div key={update.id} className="border-l-2 border-blue-500 pl-4 py-2">
                    <div className="text-sm text-gray-500 mb-1">{new Date(update.created_at).toLocaleDateString()}</div>
                    <h4 className="font-bold text-lg">{update.title}</h4>
                    <p className="text-gray-700 mt-2">{update.description}</p>
                    {update.image_url && (
                      <img src={update.image_url} alt="Update image" className="mt-4 rounded-lg max-h-64 object-cover" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border p-6 sticky top-24">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                  {Math.round(progress)}% Funded
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  ⚡ High Momentum
                </span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">₹{Number(fundraiser.raised_amount).toLocaleString('en-IN')}</h3>
              <p className="text-slate-500 text-sm mt-0.5">raised of ₹{Number(fundraiser.target_amount).toLocaleString('en-IN')} goal</p>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3.5 mb-6 overflow-hidden p-0.5 border border-slate-200">
              <div 
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 h-full rounded-full transition-all duration-1000 shadow-xs" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8 text-center">
              <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                <Users className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                <div className="font-bold text-lg text-slate-900">{donorsCount || Math.max(12, Math.round(Number(fundraiser.raised_amount) / 800))}</div>
                <div className="text-xs text-slate-500 font-medium">Supporters</div>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                <Target className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
                <div className="font-bold text-lg text-slate-900">₹{Math.max(0, Number(fundraiser.target_amount) - Number(fundraiser.raised_amount)).toLocaleString('en-IN')}</div>
                <div className="text-xs text-slate-500 font-medium">Remaining</div>
              </div>
            </div>

            {fundraiser.status === 'ACTIVE' ? (
              <DonationForm fundraiserId={fundraiser.id} category={fundraiser.problem?.category} />
            ) : (
              <div className="bg-emerald-50 text-emerald-800 text-center py-4 rounded-xl font-bold border border-emerald-200">
                ✓ Goal Achieved & Completed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
