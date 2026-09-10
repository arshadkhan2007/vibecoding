import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, AlertTriangle, Users } from 'lucide-react'

export default async function ProblemDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Need await params because of Next 15 changes (though we are likely using 14, just safe)
  const id = params.id

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
    .select('id, target_amount, raised_amount, status')
    .eq('problem_id', id)
    .maybeSingle()

  const lifecycle = ['REPORTED', 'UNDER_REVIEW', 'VERIFIED', 'FUNDRAISER_CREATED', 'SOLVED']
  const currentIndex = lifecycle.indexOf(problem.status)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/problems" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Problems
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {problem.image_url && (
          <div className="h-64 md:h-96 w-full">
            <img src={problem.image_url} alt={problem.title} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-bold uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {problem.category}
            </span>
            <span className="text-xs font-bold uppercase text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {problem.status.replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{problem.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center text-gray-700">
              <MapPin className="w-5 h-5 mr-2 text-gray-400" />
              <span>{problem.location}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Users className="w-5 h-5 mr-2 text-gray-400" />
              <span>{problem.people_affected} affected</span>
            </div>
            <div className="flex items-center text-gray-700">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
              <span>Urgency: {problem.urgency}</span>
            </div>
          </div>

          <div className="prose max-w-none mb-10">
            <h3 className="text-xl font-semibold mb-3">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{problem.description}</p>
          </div>

          {/* Lifecycle Tracking */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4">Problem Status</h3>
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 transition-all"
                style={{ width: `${(currentIndex / (lifecycle.length - 1)) * 100}%` }}
              ></div>
              
              {lifecycle.map((step, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    index <= currentIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${index <= currentIndex ? 'text-blue-900' : 'text-gray-400'} hidden sm:block`}>
                    {step.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fundraiser CTA */}
          {fundraiser ? (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Help solve this problem</h3>
              <p className="text-blue-700 mb-4">A fundraiser has been created to address this issue.</p>
              
              <div className="w-full max-w-md mx-auto mb-4">
                <div className="flex justify-between text-sm mb-1 text-blue-800">
                  <span className="font-bold">₹{Number(fundraiser.raised_amount).toLocaleString('en-IN')} raised</span>
                  <span>of ₹{Number(fundraiser.target_amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (fundraiser.raised_amount / fundraiser.target_amount) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <Link 
                href={`/fundraisers/${fundraiser.id}`}
                className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded hover:bg-blue-700 transition"
              >
                View Fundraiser & Donate
              </Link>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center text-gray-600">
              <p>This problem is currently in the <strong>{problem.status.replace('_', ' ')}</strong> stage.</p>
              {problem.status === 'REPORTED' || problem.status === 'UNDER_REVIEW' ? (
                <p className="text-sm mt-2">Our NGO team is reviewing this issue. Check back soon for updates.</p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
