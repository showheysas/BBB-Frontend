'use client'

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Inter } from 'next/font/google'

const inter = Inter({ weight: ['900'], subsets: ['latin'] })

export default function Navbar() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string>('未ログイン')

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    const storedUsername = localStorage.getItem('username')

    if (token && storedUsername) {
      if (storedUsername === '9999guest') {
        setIsAuthenticated(false)
        setUsername('9999guest')
      } else {
        setIsAuthenticated(true)
        setUsername(storedUsername)
      }
    } else {
      setIsAuthenticated(false)
      setUsername('未ログイン')
    }
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
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setIsAuthenticated(false)
    setUsername('未ログイン')
    window.dispatchEvent(new Event('authChanged')) // 認証情報の変更を通知
    router.push('/login')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  // 🔥 モードリセット処理
  const handleResetMode = () => {
    localStorage.removeItem('mode')    // modeを消す
    localStorage.removeItem('token')         // 🔥 トークンも消す
    localStorage.removeItem('username')      // 🔥 ユーザー名も消す
    window.dispatchEvent(new Event('authChanged')) // 🔥 認証状態の更新イベントを飛ばす
  

    // 🔥 カメラストップも追加
    const video = document.querySelector('video');
    if (video && video.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }

    window.location.href = '/';
    //router.push('/');
    //window.location.reload()           // 🔥 ページをリロードして状態も初期化
  }

  return (
    <div className="fixed top-0 w-full flex items-center px-6 py-4 bg-white shadow-md z-50">
      {/* 左半分 */}
      <div className="flex w-1/2">
        <h1 className={`${inter.className} text-xl font-black italic tracking-tight text-gray-800 border-b-2 border-gray-300`}>
          FACE GAUGE
        </h1>
      </div>

      {/* 右半分 */}
      <div className="flex w-1/2">
        {/* モードリセット */}
        <div className="flex w-1/2 justify-center">
          <button onClick={handleResetMode} className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-1.5 rounded-md shadow transition-all duration-300 text-xs">
            モードリセット
          </button>
        </div>

        {/* （開発用） ログアウトボタンは常に表示する */}
        {/* <button
          onClick={handleLogout}
          className="bg-red-400 hover:bg-red-500 text-white px-4 py-1.5 rounded-md shadow transition-all duration-300 text-sm"
        >
          ログアウト
        </button> */}

        {/* ログイン名・ボタン */}
        <div className="flex flex-col w-1/2 items-center justify-center">
          <span className="text-xs text-red-400 mb-1">{username}</span>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-1.5 rounded-md shadow transition-all duration-300 text-xs">
              ログアウト
            </button>
          ) : (
            <button onClick={handleLogin} className="bg-white hover:bg-gray-100 text-black px-4 py-1.5 rounded-md shadow transition-all duration-300 text-xs">
              ログイン
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
