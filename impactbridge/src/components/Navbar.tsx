import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogOut, Sparkles, AlertCircle, HeartHandshake } from 'lucide-react'

export default async function Navbar() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  return (
    <header className="border-b border-white/10 bg-[#07090e]/85 backdrop-blur-xl sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                ImpactBridge
              </span>
            </Link>

            {/* Navigation links */}
            <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/problems"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-300 rounded-lg hover:text-cyan-300 hover:bg-white/5 transition-colors"
              >
                <AlertCircle className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                Problems
              </Link>
              <Link
                href="/fundraisers"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-300 rounded-lg hover:text-cyan-300 hover:bg-white/5 transition-colors"
              >
                <HeartHandshake className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                Fundraisers
              </Link>
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {profile?.role === 'NGO_ADMIN' ? (
                  <Link
                    href="/admin"
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition"
                  >
                    NGO Admin Portal
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-slate-300 hover:text-cyan-300 px-3 py-2 rounded-lg hover:bg-white/5 transition"
                  >
                    Dashboard
                  </Link>
                )}
                
                <Link
                  href="/report-problem"
                  className="inline-flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-cyan-600/20 transition active:scale-98"
                >
                  Report Problem
                </Link>

                <form action="/auth/signout" method="post" className="flex items-center">
                  <button
                    type="submit"
                    title="Sign Out"
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition cursor-pointer"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-white px-3.5 py-2 text-sm font-semibold rounded-lg hover:bg-white/5 transition"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm font-bold px-4.5 py-2 rounded-xl shadow-lg shadow-cyan-500/25 transition active:scale-98"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
