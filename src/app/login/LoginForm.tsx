'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [mode, setMode] = useState<'local' | 'backend' | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [currentTime, setCurrentTime] = useState<string | null>(null)

  useEffect(() => {
    const savedMode = localStorage.getItem('mode') as 'local' | 'backend' | null
    setMode(savedMode)

    if (savedMode === 'local') {
      setUsername('kiriyama')
      setPassword('ren')
    } else {
      setUsername('shosan')
      setPassword('123')
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'local') {
      // 🔥 ローカル版のログイン処理
      if (username === 'kiriyama' && password === 'ren') {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('username', username)
        localStorage.setItem('token', 'dummy-token') // ダミートークン
        window.dispatchEvent(new Event('authChanged'))
        const redirect = searchParams.get('redirect') || '/'
        router.push(redirect)
      } else {
        setError('ユーザー名またはパスワードが間違っています')
      }
    } else if (mode === 'backend') {
      // 🔥 バックエンド版のログイン処理
      try {
        const res = await fetch("https://branding-ngrok-app.jp.ngrok.io/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: username,
            password: password,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          console.log("ログイン成功:", data)

          localStorage.setItem("token", data.access_token)
          localStorage.setItem("username", username)
          window.dispatchEvent(new Event('authChanged'))

          const now = new Date().toLocaleString('ja-JP', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          })
          setCurrentTime(now)
          setShowPopup(true)  // ログイン成功ポップアップ
        } else {
          const errorData = await res.json()
          console.error("ログイン失敗:", errorData)
          setError(errorData.detail || "ログインに失敗しました")
        }
      } catch (error) {
        console.error("通信エラー:", error)
        setError("通信エラーが発生しました")
      }
    }
  }

  const handleConfirm = () => {
    const redirect = searchParams.get("redirect") || "/"
    if (redirect === "/result") {
      router.push("/result?redirected=true")
    } else {
      router.push(redirect)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-black">ログイン</h1>

      {/* 🔥 注意文もモードで切り替え */}
      <p className="text-red-400 text-sm leading-relaxed mb-8 text-center">
        {mode === 'local' ? (
          <>※このまま（ユーザー名：kiriyama、PW：ren）<br />でログインしてください。</>
        ) : (
          <>※このまま（ユーザー名：shosan、PW：123）<br />でログインしてください。</>
        )}
      </p>

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

        <p className="text-gray-700 text-center text-sm">もしくは</p>

        <button
          type="button"
          onClick={() => {
            const redirect = searchParams.get('redirect') || '/result'
            router.push(`/register?redirect=${redirect}`)
          }}
          className="bg-gray-600 font-semibold text-white px-6 py-2 rounded shadow text-lg transition"
        >
          新規登録
        </button>
      </form>

      {/* ポップアップモーダル */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
              <p className="text-lg text-gray-700 mb-4">{currentTime}</p>
              <p className="text-xl font-bold text-gray-800 mb-6">{username} さん、ログイン成功！</p>
              <button
                onClick={handleConfirm}
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded text-lg"
              >
                OK
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  )
}
