'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Suspense } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // 仮ログイン認証
    if (username === 'kiriyama' && password === 'ren') {
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('username', username)
      window.dispatchEvent(new Event('authChanged'))  // ✅ 追加！
      const redirect = searchParams.get('redirect') || '/result'
      router.push(redirect)
    } else {
      setError('ユーザー名またはパスワードが間違っています')
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-6 text-black">ログイン</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
          <input
            type="text"
            placeholder="ユーザー名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded text-black placeholder-gray-400"
            required
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded text-black placeholder-gray-400"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded mb-8">
            ログイン
          </button>

          <p className="text-gray-700 text-center text-sm">
            もしくは
          </p>

          <button
            onClick={() => {
              const redirect = searchParams.get('redirect') || '/result'
              router.push(`/register?redirect=${redirect}`);
            }}
            className="bg-gray-600 font-semibold text-white px-6 py-2 rounded shadow text-lg transition"
          >
            新規登録
          </button>
        </form>

        {/* 下部ナビゲーションバー */}
        <div className="fixed bottom-0 w-full flex bg-white shadow-inner h-20 z-50">
          <div className="w-1/3 flex items-center justify-center border-r border-gray-300"></div>
          <div className="w-1/3 flex items-center justify-center border-r border-gray-300">
            <Link href="/">
              <img src="/icons/home.svg" alt="ホーム" className="w-6 h-6 cursor-pointer" />
            </Link>
          </div>
          <div className="w-1/3 flex items-center justify-center"></div>
        </div>
      </div>
    </Suspense>
  )
}
