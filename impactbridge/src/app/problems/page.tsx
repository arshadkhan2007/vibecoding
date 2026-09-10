import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight } from 'lucide-react'

export default async function ProblemsPage() {
  const supabase = await createClient()

  const { data: problems } = await supabase
    .from('problems')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Problems</h1>
          <p className="text-gray-600 mt-2">Discover verified issues that need your attention and support.</p>
        </div>
        <Link href="/report-problem" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Report a Problem
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {problems?.map((problem) => (
          <Link href={`/problems/${problem.id}`} key={problem.id} className="group">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col h-full">
              <div className="h-48 bg-slate-100">
                {problem.image_url ? (
                  <img src={problem.image_url} alt={problem.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">No Image provided</div>
                )}
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {problem.category}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    problem.status === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                    problem.status === 'REPORTED' ? 'bg-gray-100 text-gray-700' :
                    problem.status === 'FUNDRAISER_CREATED' ? 'bg-purple-100 text-purple-700' :
                    problem.status === 'SOLVED' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {problem.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-blue-600 transition line-clamp-2">{problem.title}</h3>
                <div className="text-sm text-gray-500 mb-4 mt-auto">
                  <p className="mb-1">📍 {problem.location}</p>
                  <p className="mb-1">👥 {problem.people_affected} affected</p>
                  <p>⚠️ Urgency: {problem.urgency}</p>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center text-blue-600 font-medium text-sm">
                  View full details <ArrowRight className="ml-1 w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        ))}
        {problems?.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No problems have been reported yet.
          </div>
        )}
      </div>
    </div>
  )
}
