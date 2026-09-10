import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function FundraisersPage() {
  const supabase = await createClient()

  const { data: fundraisers } = await supabase
    .from('fundraisers')
    .select(`
      *,
      problem:problems(title, category, location)
    `)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Active Fundraisers</h1>
        <p className="text-gray-600 mt-2">Support verified community solutions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {fundraisers?.map((fundraiser) => {
          const progress = Math.min(100, Math.round((fundraiser.raised_amount / fundraiser.target_amount) * 100))
          return (
            <Link href={`/fundraisers/${fundraiser.id}`} key={fundraiser.id} className="group">
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col h-full">
                <div className="p-6 flex-grow flex flex-col">
                  <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block w-fit mb-3">
                    {fundraiser.problem?.category || 'Community'}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-blue-600 transition">{fundraiser.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{fundraiser.description}</p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">₹{Number(fundraiser.raised_amount).toLocaleString('en-IN')} raised</span>
                      <span className="text-gray-500">of ₹{Number(fundraiser.target_amount).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <button className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition">
                      Donate Now
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
        {fundraisers?.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No active fundraisers at the moment.
          </div>
        )}
      </div>
    </div>
  )
}
