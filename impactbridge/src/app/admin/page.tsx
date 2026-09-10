import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminTabs from './AdminTabs'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // The middleware already protects this route, but double check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'NGO_ADMIN') redirect('/dashboard')

  // Fetch all data for the admin
  const { data: problems } = await supabase.from('problems').select('*').order('created_at', { ascending: false })
  const { data: fundraisers } = await supabase.from('fundraisers').select('*, problem:problems(title)').order('created_at', { ascending: false })
  const { data: donations } = await supabase.from('donations').select('amount')

  // Stats
  const totalProblems = problems?.length || 0
  const pendingProblems = problems?.filter(p => p.status === 'REPORTED' || p.status === 'UNDER_REVIEW').length || 0
  const verifiedProblems = problems?.filter(p => p.status === 'VERIFIED').length || 0
  
  const activeFundraisers = fundraisers?.filter(f => f.status === 'ACTIVE').length || 0
  const totalRaised = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0
  
  // People impacted (sum of people_affected from SOLVED problems)
  const peopleImpacted = problems?.filter(p => p.status === 'SOLVED').reduce((sum, p) => sum + Number(p.people_affected), 0) || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">NGO Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage problems, fundraisers, and community impact.</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Pending Problems</p>
          <p className="text-3xl font-bold text-orange-600">{pendingProblems}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Verified (Ready)</p>
          <p className="text-3xl font-bold text-blue-600">{verifiedProblems}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Active Fundraisers</p>
          <p className="text-3xl font-bold text-green-600">{activeFundraisers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">People Impacted</p>
          <p className="text-3xl font-bold text-purple-600">{peopleImpacted}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 font-medium">Total Funds Raised Across Platform</p>
          <p className="text-4xl font-bold text-green-600">₹{totalRaised.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <AdminTabs problems={problems || []} fundraisers={fundraisers || []} />
    </div>
  )
}
