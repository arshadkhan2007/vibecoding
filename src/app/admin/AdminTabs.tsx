'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminTabs({ problems, fundraisers }: { problems: any[], fundraisers: any[] }) {
  const [activeTab, setActiveTab] = useState('problems')
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const verifyProblem = async (id: string) => {
    setLoading(id)
    await supabase.from('problems').update({ status: 'VERIFIED' }).eq('id', id)
    setLoading(null)
    router.refresh()
  }

  const createFundraiser = async (problemId: string, title: string, category: string) => {
    setLoading(problemId)
    // Quick demo creation
    await supabase.from('fundraisers').insert({
      problem_id: problemId,
      title: `Fundraiser for ${title}`,
      description: `Help support the verified community problem related to ${category}.`,
      target_amount: 50000,
      status: 'ACTIVE'
    })
    await supabase.from('problems').update({ status: 'FUNDRAISER_CREATED' }).eq('id', problemId)
    setLoading(null)
    router.refresh()
  }

  const completeFundraiser = async (fundraiserId: string, problemId: string) => {
    setLoading(fundraiserId)
    await supabase.from('fundraisers').update({ status: 'COMPLETED' }).eq('id', fundraiserId)
    await supabase.from('problems').update({ status: 'SOLVED' }).eq('id', problemId)
    setLoading(null)
    router.refresh()
  }

  return (
    <div>
      <div className="flex border-b mb-6">
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'problems' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('problems')}
        >
          Problems
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'fundraisers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('fundraisers')}
        >
          Fundraisers
        </button>
      </div>

      {activeTab === 'problems' && (
        <div className="space-y-4">
          {problems.map(problem => (
            <div key={problem.id} className="bg-white p-6 rounded-xl border flex justify-between items-center">
              <div>
                <h3 className="font-bold">{problem.title}</h3>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{problem.category}</span>
                  <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded uppercase">
                    {problem.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {problem.status === 'REPORTED' && (
                  <button 
                    disabled={loading === problem.id}
                    onClick={() => verifyProblem(problem.id)}
                    className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded text-sm font-bold hover:bg-yellow-200"
                  >
                    {loading === problem.id ? '...' : 'Verify Problem'}
                  </button>
                )}
                {problem.status === 'VERIFIED' && (
                  <button 
                    disabled={loading === problem.id}
                    onClick={() => createFundraiser(problem.id, problem.title, problem.category)}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700"
                  >
                    {loading === problem.id ? '...' : 'Create Fundraiser'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'fundraisers' && (
        <div className="space-y-4">
          {fundraisers.map(fundraiser => (
            <div key={fundraiser.id} className="bg-white p-6 rounded-xl border flex justify-between items-center">
              <div>
                <h3 className="font-bold">{fundraiser.title}</h3>
                <p className="text-sm text-gray-500">Problem: {fundraiser.problem?.title}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-green-50 text-green-700 font-bold px-2 py-1 rounded">
                    ₹{fundraiser.raised_amount} / ₹{fundraiser.target_amount}
                  </span>
                  <span className="text-xs bg-gray-100 font-bold px-2 py-1 rounded uppercase">
                    {fundraiser.status}
                  </span>
                </div>
              </div>
              <div>
                {fundraiser.status === 'ACTIVE' && (
                  <button 
                    disabled={loading === fundraiser.id}
                    onClick={() => completeFundraiser(fundraiser.id, fundraiser.problem_id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700"
                  >
                    {loading === fundraiser.id ? '...' : 'Mark Completed'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
