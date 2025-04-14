'use client'

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Inter } from 'next/font/google'

const inter = Inter({ weight: ['900'], subsets: ['latin'] })

export default function Navbar() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string>('未ログイン')
  const [mode, setMode] = useState<string | null>(null)

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    const storedUsername = localStorage.getItem('username')

    if (token && storedUsername) {
      if (storedUsername === '9999guest') {
        setIsAuthenticated(false)
        setUsername('仮ログイン中')
      } else {
        setIsAuthenticated(true)
        setUsername(storedUsername)
      }
    } else {
      setIsAuthenticated(false)
      setUsername('未ログイン')
    }
  }

  const checkMode = () => {
    const storedMode = localStorage.getItem('mode')
    setMode(storedMode)
  }

  useEffect(() => {
    checkAuth()
    checkMode()

    const handleAuthChange = () => {
      checkAuth()
      checkMode()
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
      <div className="flex items-center w-1/2 gap-1">
      {/* モードエリア */}
      <div className="flex flex-col w-1/2 items-center justify-center">
        {/* 上段：現在モード表示 */}
        {mode !== null && mode !== '' && mode !== '未選択' && (
          <p
            className={`text-xs font-bold mb-1 ${
              mode === 'backend' ? 'text-red-400' : 'text-gray-700'
            }`}
          >
            {mode === 'local' ? 'ローカル版' : mode === 'backend' ? 'CNN版' : ''}
          </p>
        )}

        {/* 下段：モードボタン */}
        <button
          onClick={handleResetMode}
          className="bg-white border border-red-400 text-red-400 px-4 py-1.5 rounded-md shadow transition-all duration-300 text-xs hover:bg-red-50"
        >
          モード
        </button>
      </div>

{/*       
      <div className="flex w-1/2">
        {/* ログイン名・ボタン */}
        {/* <div className="flex flex-col w-1/2 items-center justify-center">
          <span className="text-xs text-gray-700 mb-1">{username}</span>
          <button
            onClick={handleResetMode}
            className="bg-gray-200 border border-red-400 text-red-400 px-4 py-1.5 rounded-md shadow transition-all duration-300 text-xs hover:bg-red-50"
            >
              モード
          </button>
        </div>

        {/* モードリセット */}
        {/* <div className="flex w-1/2 justify-center">

      </div> */}

        {/* （開発用） ログアウトボタンは常に表示する */}
        {/* <button
          onClick={handleLogout}
          className="bg-red-400 hover:bg-red-500 text-white px-4 py-1.5 rounded-md shadow transition-all duration-300 text-sm"
        >
          ログアウト
        </button> */}

        {/* ログイン名・ボタン */}
        <div className="flex flex-col w-1/2 items-center justify-center">
          {/* 🔥 ここに条件をつける */}
          {username !== '未ログイン' && username !== '未選択' && (
            <span className="text-xs text-gray-700 mb-1">{username}</span>
          )}
          
          {isAuthenticated ? (
            <button onClick={handleLogout} className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-1.5 rounded-md shadow transition-all duration-300 text-xs whitespace-nowrap">
              ログアウト
            </button>
          ) : (
            <button onClick={handleLogin} className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-1.5 rounded-md shadow transition-all duration-300 text-xs whitespace-nowrap">
              ログイン
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
