'use client'

import { Sparkles, CheckCircle2, Heart } from 'lucide-react'

const activities = [
  { icon: Heart, color: 'text-rose-500', text: 'Someone contributed ₹1,000 to Safe Drinking Water at Local School', time: '2m ago' },
  { icon: CheckCircle2, color: 'text-emerald-600', text: '180 Students Verified by Ground Partner NGO', time: '11m ago' },
  { icon: Sparkles, color: 'text-blue-600', text: 'Digital Literacy Center reached 72% funding momentum', time: '24m ago' },
  { icon: Heart, color: 'text-rose-500', text: 'Community pooled ₹5,000 for Mobile Health Clinic', time: '40m ago' },
  { icon: CheckCircle2, color: 'text-teal-600', text: 'Proof ledger uploaded for Clean Sanitation Node', time: '1h ago' },
]

export default function LiveActivityTicker() {
  return (
    <div className="w-full overflow-hidden py-2 bg-white/80 border-y border-slate-200/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 text-xs">
        <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold uppercase tracking-wider text-[10px] border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
          Live Stream
        </div>

        <div className="overflow-hidden relative flex-grow mask-radial">
          <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
            {activities.concat(activities).map((act, i) => {
              const Icon = act.icon
              return (
                <div key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                  <Icon className={`w-3.5 h-3.5 ${act.color}`} />
                  <span>{act.text}</span>
                  <span className="text-slate-400 text-[10px] font-normal">• {act.time}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
