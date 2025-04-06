'use client'

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Inter } from 'next/font/google'

const inter = Inter({ weight: ['900'], subsets: ['latin'] })

export default function Navbar() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const checkAuth = () => {
    const auth = localStorage.getItem('isAuthenticated') === 'true'
    setIsAuthenticated(auth)
  }

  useEffect(() => {
    checkAuth()

    const handleAuthChange = () => {
      checkAuth()
    }

    window.addEventListener('authChanged', handleAuthChange)

    return () => {
      window.removeEventListener('authChanged', handleAuthChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('username')
    setIsAuthenticated(false)
    window.dispatchEvent(new Event('authChanged')) // 🔥 これも追加する！
    router.push('/login')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <div className="fixed top-0 w-full flex items-center justify-between px-6 py-4 bg-white shadow-md z-50">
      <h1 className={`${inter.className} text-2xl font-black italic tracking-tight text-gray-800 border-b-2 border-gray-300`}>
        FACE GAUGE
      </h1>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-1.5 rounded-md shadow transition-all duration-300 text-sm"
          >
            ログアウト
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-white hover:bg-gray-100 text-black px-4 py-1.5 rounded-md shadow transition-all duration-300 text-sm"
          >
            ログイン
          </button>
        )}
      </div>
    </div>
  )
}
