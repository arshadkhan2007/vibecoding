import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, CheckCircle, Heart, Shield, Users } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()

  // Fetch some stats
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Real Problems. Real People. Real Impact.
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-blue-100">
            Discover verified community problems and support the fundraisers that solve them. Be the bridge to a better tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/problems" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-50 transition flex items-center justify-center">
              Explore Problems <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/fundraisers" className="bg-blue-800 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center">
              Support Fundraisers <Heart className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600">{problemsCount || 0}</p>
              <p className="text-gray-500 font-medium mt-2">Problems Reported</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">0</p>
              <p className="text-gray-500 font-medium mt-2">Problems Solved</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">{fundraisersCount || 0}</p>
              <p className="text-gray-500 font-medium mt-2">Active Fundraisers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600">₹{totalRaised.toLocaleString('en-IN')}</p>
              <p className="text-gray-500 font-medium mt-2">Total Funds Raised</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How ImpactBridge Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">1. Report</h3>
              <p className="text-gray-600 text-sm">Community members report local problems that need attention.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-yellow-100 p-4 rounded-full mb-4">
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">2. Verify</h3>
              <p className="text-gray-600 text-sm">NGO admins review and verify the authenticity of the problem.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">3. Fund</h3>
              <p className="text-gray-600 text-sm">A fundraiser is created and donors contribute to the solution.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">4. Impact</h3>
              <p className="text-gray-600 text-sm">Funds are deployed, progress is updated, and the problem is solved.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Problems */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Recently Reported Problems</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProblems?.map((problem) => (
              <div key={problem.id} className="bg-white rounded-xl shadow-md overflow-hidden border">
                <div className="h-48 bg-slate-200 w-full object-cover">
                  {problem.image_url ? (
                    <img src={problem.image_url} alt={problem.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {problem.category}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      {problem.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900 line-clamp-2">{problem.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{problem.description}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>📍 {problem.location}</p>
                    <p>👥 {problem.people_affected} people affected</p>
                  </div>
                  <Link href={`/problems/${problem.id}`} className="text-blue-600 font-medium hover:underline inline-flex items-center">
                    View Details <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/problems" className="inline-flex items-center text-blue-600 font-bold hover:underline">
              View All Problems <ArrowRight className="ml-1 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
