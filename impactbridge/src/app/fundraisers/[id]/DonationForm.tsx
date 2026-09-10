'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DonationForm({ fundraiserId }: { fundraiserId: string }) {
  const [amount, setAmount] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || amount <= 0) return

    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // Simple client-side redirect to login if not authenticated
        window.location.href = `/login?redirect=/fundraisers/${fundraiserId}`
        return
      }

      // Step 1: Record Donation
      const { error: donationError } = await supabase
        .from('donations')
        .insert({
          fundraiser_id: fundraiserId,
          user_id: user.id,
          amount: Number(amount)
        })

      if (donationError) throw donationError

      // Step 2: Update Fundraiser raised_amount
      // Fetch current amount first
      const { data: fund, error: fetchError } = await supabase
        .from('fundraisers')
        .select('raised_amount')
        .eq('id', fundraiserId)
        .single()
      
      if (fetchError) throw fetchError

      const newAmount = Number(fund.raised_amount) + Number(amount)

      const { error: updateError } = await supabase
        .from('fundraisers')
        .update({ raised_amount: newAmount })
        .eq('id', fundraiserId)
      
      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setAmount('')
        router.refresh()
      }, 3000)

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred while processing the donation.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <h4 className="font-bold text-lg mb-1">Thank you!</h4>
        <p className="text-sm">Your demo contribution of ₹{amount} has been processed.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleDonate}>
      <h4 className="font-semibold text-gray-900 mb-3">Make a Contribution</h4>
      <p className="text-xs text-gray-500 mb-4">* This is a demo flow. No real money will be charged.</p>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[100, 500, 1000].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(preset)}
            className={`py-2 rounded border font-medium transition ${
              amount === preset 
                ? 'bg-blue-50 border-blue-600 text-blue-700' 
                : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
            }`}
          >
            ₹{preset}
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">₹</span>
        </div>
        <input
          type="number"
          min="1"
          required
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || '')}
          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Custom Amount"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !amount}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? 'Processing...' : `Donate ₹${amount || 0}`}
      </button>
    </form>
  )
}
