import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogOut, User, Menu } from 'lucide-react'

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
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex flex-shrink-0 items-center">
              <span className="text-xl font-bold text-blue-600">ImpactBridge</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/problems" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-blue-500">
                Problems
              </Link>
              <Link href="/fundraisers" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-blue-500">
                Fundraisers
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {user ? (
              <>
                {profile?.role === 'NGO_ADMIN' ? (
                  <Link href="/admin" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                )}
                
                <Link href="/report-problem" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Report Problem
                </Link>

                <form action="/auth/signout" method="post">
                  <button type="submit" className="text-gray-500 hover:text-gray-700 flex items-center">
                    <LogOut className="h-5 w-5" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Log in
                </Link>
                <Link href="/signup" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
