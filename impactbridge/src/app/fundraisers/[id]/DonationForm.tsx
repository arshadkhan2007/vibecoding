'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Sparkles, CheckCircle, Heart, ArrowRight } from 'lucide-react'

interface DonationFormProps {
  fundraiserId: string
  category?: string
}

export default function DonationForm({ fundraiserId, category = 'General' }: DonationFormProps) {
  const [amount, setAmount] = useState<number | ''>(500)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  // Contextual impact descriptions based on category
  const getImpactDescriptions = (cat: string) => {
    const c = cat.toLowerCase()
    if (c.includes('water')) {
      return {
        100: 'Provides clean drinking water for a student for 2 weeks',
        500: 'Funds water filtration cartridge replacement & maintenance',
        1000: 'Contributes directly toward installing a clean water storage tank',
      }
    } else if (c.includes('education')) {
      return {
        100: 'Provides basic notebook and writing supplies',
        500: "Supports one student's digital learning resources",
        1000: 'Funds essential computer hardware & learning licenses',
      }
    } else if (c.includes('health')) {
      return {
        100: 'Supplies basic first-aid & diagnostic kits',
        500: 'Covers doctor consultation & essential medicine for a family',
        1000: 'Funds screening equipment & specialized care supplies',
      }
    } else if (c.includes('food')) {
      return {
        100: 'Provides nutritious morning meals for 2 elderly residents',
        500: 'Provides a weekly wholesome ration kit for an elderly person',
        1000: 'Funds emergency nutrition & staple food supply for a household',
      }
    }
    return {
      100: 'Helps provide basic community ground supplies',
      500: 'Supports essential direct relief and resources for one person',
      1000: 'Contributes toward major project materials & execution',
    }
  }

  const impacts = getImpactDescriptions(category)

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || amount <= 0) return

    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
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
      }, 3500)

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred while processing the donation.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-8 text-center shadow-lg animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🎉
        </div>
        <h4 className="font-extrabold text-2xl mb-2 text-white">Impact Verified!</h4>
        <p className="text-emerald-100 text-sm mb-4">
          Your contribution of <strong className="text-white font-bold">₹{amount}</strong> has been logged to the public ledger.
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1.5 rounded-full text-emerald-100">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
          Receipt credited to your dashboard
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleDonate} className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-slate-900 text-lg">Make a Contribution</h4>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Direct Impact
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Verified civic funding. Micro-donations pooled directly into local execution.
        </p>
      </div>

      {/* Suggested Impact Tiers */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Make Your Contribution Mean Something
        </label>
        
        <div className="space-y-2.5">
          {([100, 500, 1000] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(preset)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                amount === preset
                  ? 'bg-blue-50/80 border-blue-500 shadow-xs ring-1 ring-blue-500'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div className={`px-2.5 py-1 rounded-lg font-bold text-sm shrink-0 ${
                amount === preset ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                ₹{preset}
              </div>
              <div className="flex-grow">
                <div className="text-xs text-slate-700 font-medium leading-snug">
                  {impacts[preset]}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount Field */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          Or Enter Custom Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
            ₹
          </div>
          <input
            type="number"
            min="1"
            required
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || '')}
            className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-semibold text-base shadow-xs"
            placeholder="Custom Amount"
          />
        </div>
      </div>

      {error && (
        <div className="text-rose-600 text-xs bg-rose-50 border border-rose-100 p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !amount}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-blue-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
      >
        <Heart className="w-4 h-4 text-white fill-white/20" />
        {loading ? 'Processing...' : `Donate ₹${amount ? Number(amount).toLocaleString('en-IN') : 0}`}
        <ArrowRight className="w-4 h-4 ml-1" />
      </button>

      <p className="text-[11px] text-center text-slate-400">
        🔒 100% of verified contributions go toward tracked materials.
      </p>
    </form>
  )
}
