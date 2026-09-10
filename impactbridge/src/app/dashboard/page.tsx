import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const { data: donations } = await supabase
    .from('donations')
    .select('*, fundraiser:fundraisers(title)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: problems } = await supabase
    .from('problems')
    .select('*')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  const totalDonated = donations?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile?.name || 'User'}</h1>
        <Link href="/report-problem" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Report New Problem
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium mb-2">Total Donated</h3>
          <p className="text-4xl font-bold text-green-600">₹{totalDonated.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium mb-2">Donations Made</h3>
          <p className="text-4xl font-bold text-blue-600">{donations?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium mb-2">Problems Reported</h3>
          <p className="text-4xl font-bold text-purple-600">{problems?.length || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Recent Donations</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {donations && donations.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {donations.map(donation => (
                  <li key={donation.id} className="p-4 hover:bg-slate-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900">{donation.fundraiser?.title}</p>
                        <p className="text-sm text-gray-500">{new Date(donation.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        ₹{Number(donation.amount).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-500">
                You haven't made any donations yet. 
                <br/>
                <Link href="/fundraisers" className="text-blue-600 hover:underline mt-2 inline-block">Explore active fundraisers</Link>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Problems You Reported</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {problems && problems.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {problems.map(problem => (
                  <li key={problem.id} className="p-4 hover:bg-slate-50 block">
                    <Link href={`/problems/${problem.id}`} className="block">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900">{problem.title}</span>
                        <span className="text-xs font-bold uppercase bg-gray-100 px-2 py-1 rounded text-gray-600">
                          {problem.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">📍 {problem.location}</p>
                      <p className="text-xs text-gray-400">{new Date(problem.created_at).toLocaleDateString()}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-500">
                You haven't reported any problems yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
