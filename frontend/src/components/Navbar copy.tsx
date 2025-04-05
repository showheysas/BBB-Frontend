'use client'

import { useRouter } from 'next/navigation'
import { Inter } from 'next/font/google'

const inter = Inter({ weight: ['900'], subsets: ['latin'] })

export default function Navbar() {
  const router = useRouter()
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('username')
    router.push('/login')
  }

  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true'

  if (!isAuthenticated) return null  // 🔥 ログインしてないなら表示しない！

  return (
    <div className="fixed top-0 w-full flex items-center justify-between px-6 py-4 bg-white shadow-md z-50">
      <h1 className={`${inter.className} text-2xl font-black italic tracking-tight text-gray-800 border-b-2 border-gray-300 pb-1`}>
        FACE GAUGE
      </h1>
      <div className="flex items-center gap-4">
        {username && (
          <span className="text-gray-700 text-sm font-semibold">
            ようこそ、{username} さん
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-1.5 rounded-md shadow text-sm"
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}
