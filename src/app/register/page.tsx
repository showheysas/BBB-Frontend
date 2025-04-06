'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Inter, Noto_Sans_JP } from 'next/font/google'

const inter = Inter({ weight: ['900'], subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ weight: ['400', '700'], subsets: ['latin'] })

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    birthday: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.username.trim().toLowerCase() === 'kiriyama') {
      setError('このユーザー名はすでに使われています')
      return
    }

    console.log('登録データ:', formData)

    // 仮登録
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('username', formData.username)
    window.dispatchEvent(new Event('authChanged'))  // ✅ 追加！

    const redirect = searchParams.get('redirect') || '/'
    router.push(redirect)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 ${notoSansJP.className}`}
    >
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className={`${inter.className} text-3xl font-bold text-center text-gray-800 mb-6`}>
          新規登録
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-gray-700 text-sm mb-2">ユーザー名</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md p-3 w-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">メールアドレス</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md p-3 w-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">生年月日</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md p-3 w-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">パスワード</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md p-3 w-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition"
          >
            登録する
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          すでにアカウントをお持ちですか？{' '}
          <span
            onClick={() => {
              const redirect = searchParams.get('redirect') || '/'
              router.push(`/login?redirect=${redirect}`);
            }}
            className="text-gray-800 font-semibold cursor-pointer hover:underline"
          >
            ログイン
          </span>
        </p>
      </div>
    </motion.div>
  )
}
