'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Inter, Noto_Sans_JP } from 'next/font/google'

const inter = Inter({ weight: ['900'], subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ weight: ['400', '700'], subsets: ['latin'] })

export function RegisterForm() {
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
  
    // 仮登録処理
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('username', formData.username)
    localStorage.setItem('token', 'dummy_token') // 🔥 ここを追加
  
    window.dispatchEvent(new Event('authChanged'))
  
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
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md mb-32 mt-20">
        <h2 className={`${inter.className} text-3xl font-bold text-center text-gray-800 mb-6`}>
          新規登録
        </h2>

        <p className="text-red-400 text-xs leading-relaxed mb-8">
        ※MVP用のダミーページです。任意の情報で「登録する」ボタンを押すと、以降のページでログイン状態になりますが、DBには登録されません。
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {['username', 'email', 'birthday', 'password'].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 text-sm mb-2">
                {field === 'username' ? 'ユーザー名' :
                 field === 'email' ? 'メールアドレス' :
                 field === 'birthday' ? '生年月日' :
                 'パスワード'}
              </label>
              <input
                type={field === 'email' ? 'email' : field === 'birthday' ? 'date' : field === 'password' ? 'password' : 'text'}
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-3 w-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />

              {/* 生年月日のみ注意書きを表示 */}
              {field === 'birthday' && (
                <p className="text-xs text-gray-500 mt-1">
                  　生年月日はあとから変更できませんので、ご注意ください
                </p>
              )}
            </div>
          ))}

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
              router.push(`/login?redirect=${redirect}`)
            }}
            className="text-gray-800 font-semibold cursor-pointer hover:underline"
          >
            ログイン
          </span>
        </p>
      </div>
      
      {/* ナビゲーションバー */}
      <div className="fixed bottom-0 w-full flex bg-white shadow-inner h-20 z-50">
        <div className="w-1/3 flex items-center justify-center border-r border-gray-300"></div>
        <div className="w-1/3 flex items-center justify-center border-r border-gray-300">
          <Link href="/">
            <Image src="/icons/home.svg" alt="ホーム" width={24} height={24} className="w-6 h-6 cursor-pointer" />
          </Link>
        </div>
        <div className="w-1/3 flex items-center justify-center"></div>
      </div>

    </motion.div>
  )
}
