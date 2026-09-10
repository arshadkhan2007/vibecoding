'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Sparkles, CheckCircle2, Heart, ArrowRight, Share2, Copy, Check } from 'lucide-react'

interface DonationFormProps {
  fundraiserId: string
  fundraiserTitle?: string
  peopleAffected?: number
  category?: string
}

export default function DonationForm({ 
  fundraiserId, 
  fundraiserTitle = 'Community Fundraiser',
  peopleAffected = 150,
  category = 'General' 
}: DonationFormProps) {
  const [amount, setAmount] = useState<number | ''>(500)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [donatedAmount, setDonatedAmount] = useState<number>(500)
  const [copied, setCopied] = useState(false)
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
        5000: 'Funds complete reverse-osmosis purification unit for the school',
      }
    } else if (c.includes('education')) {
      return {
        100: 'Provides basic notebook and writing supplies for 3 students',
        500: "Supports one student's digital learning resources and software",
        1000: 'Funds essential computer hardware & learning licenses',
        5000: 'Equips a full computer workstation with high-speed internet',
      }
    } else if (c.includes('health')) {
      return {
        100: 'Supplies basic first-aid & diagnostic kits for community workers',
        500: 'Covers doctor consultation & essential medicine for a family',
        1000: 'Funds diagnostic screening equipment & specialized supplies',
        5000: 'Sponsors a full day of mobile doctor clinic operations',
      }
    } else if (c.includes('food')) {
      return {
        100: 'Provides nutritious morning meals for 2 elderly residents',
        500: 'Provides a weekly wholesome ration kit for an elderly resident',
        1000: 'Funds emergency nutrition & staple food supply for a household',
        5000: 'Funds a month-long community nutrition distribution drive',
      }
    }
    return {
      100: 'Helps provide basic community ground supplies',
      500: 'Supports essential direct relief and resources for one person',
      1000: 'Contributes toward major project materials & execution',
      5000: 'Provides substantial foundational backing for the campaign',
    }
  }

  const impacts = getImpactDescriptions(category)

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || amount <= 0) return

    setLoading(true)
    setError(null)
    const currentDonation = Number(amount)

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
          amount: currentDonation
        })

      if (donationError) throw donationError

      // Step 2: Update Fundraiser raised_amount
      const { data: fund, error: fetchError } = await supabase
        .from('fundraisers')
        .select('raised_amount')
        .eq('id', fundraiserId)
        .single()
      
      if (fetchError) throw fetchError

      const newAmount = Number(fund.raised_amount) + currentDonation

      const { error: updateError } = await supabase
        .from('fundraisers')
        .update({ raised_amount: newAmount })
        .eq('id', fundraiserId)
      
      if (updateError) throw updateError

      setDonatedAmount(currentDonation)
      setSuccess(true)
      router.refresh()

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred while processing the donation.')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    const shareText = `I just contributed ₹${donatedAmount.toLocaleString('en-IN')} on ImpactBridge to support "${fundraiserTitle}". Direct civic funding with 100% verified impact!`
    const shareUrl = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Supported ${fundraiserTitle} on ImpactBridge`,
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } else {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // 4. IMPACT MOMENT GLASS CARD (AFTER DONATION)
  if (success) {
    return (
      <div className="bg-gradient-to-br from-slate-900/90 via-indigo-950/80 to-slate-900/95 border border-cyan-500/50 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            ✦ IMPACT MOMENT
          </div>

          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight my-2">
            ₹{donatedAmount.toLocaleString('en-IN')}
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4">
            Contributed to the Network
          </p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-left mb-4">
            <p className="text-xs text-slate-400 uppercase font-semibold">Initiative</p>
            <p className="text-sm font-bold text-slate-100 line-clamp-1">{fundraiserTitle}</p>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {peopleAffected} people benefiting directly
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 italic mb-6 leading-relaxed">
            "Your contribution moved this project closer to its goal. You are helping turn this problem into a verified solution."
          </p>

          {/* Share Impact Button */}
          <button
            type="button"
            onClick={handleShare}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/25 transition cursor-pointer active:scale-98 text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Impact Story Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-white" />
                <span>SHARE IMPACT</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="text-xs text-slate-400 hover:text-slate-200 mt-4 underline cursor-pointer"
          >
            Make another contribution
          </button>
        </div>
      </div>
    )
  }

  // STANDARD FORM (WITH "WHAT CAN YOUR CONTRIBUTION DO?")
  return (
    <form onSubmit={handleDonate} className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-white text-lg">Make a Contribution</h4>
          <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
            Direct Node Funding
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Transparent micro-donations directly pooled into materials & equipment.
        </p>
      </div>

      {/* 5. "WHAT CAN YOUR CONTRIBUTION DO?" */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2">
          What can your contribution do?
        </label>
        
        <div className="space-y-2">
          {([100, 500, 1000, 5000] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(preset)}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 ${
                amount === preset
                  ? 'bg-cyan-950/60 border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              <div className={`px-2.5 py-1 rounded-lg font-black text-xs shrink-0 ${
                amount === preset ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'bg-white/10 text-slate-300'
              }`}>
                ₹{preset.toLocaleString('en-IN')}
              </div>
              <div className="flex-grow">
                <div className={`text-xs font-medium leading-snug ${amount === preset ? 'text-cyan-200 font-semibold' : 'text-slate-300'}`}>
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
          Custom Amount
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
            className="w-full pl-8 pr-4 py-3 bg-white/[0.04] border border-white/15 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white font-bold text-base shadow-inner placeholder-slate-500"
            placeholder="Custom Amount"
          />
        </div>
      </div>

      {error && (
        <div className="text-rose-400 text-xs bg-rose-950/50 border border-rose-800/60 p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !amount}
        className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black py-3.5 px-4 rounded-xl shadow-lg shadow-cyan-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
      >
        <Heart className="w-4 h-4 text-white fill-white/20" />
        {loading ? 'Transacting Node...' : `Contribute ₹${amount ? Number(amount).toLocaleString('en-IN') : 0}`}
        <ArrowRight className="w-4 h-4 ml-1" />
      </button>

      <p className="text-[11px] text-center text-slate-500">
        ✦ 100% transparent ground allocation.
      </p>
    </form>
  )
}
