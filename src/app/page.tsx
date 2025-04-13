'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Inter, Noto_Sans_JP } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'

const inter = Inter({ weight: ['900'], subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ weight: ['400', '700'], subsets: ['latin'] })

export default function StartPage() {
  const router = useRouter()
  const [username, setUsername] = useState<string>('ゲストさん')
  // const [scrollPercent, setScrollPercent] = useState(0)
  const [modeSelected, setModeSelected] = useState<boolean>(false) //セレクトモード

  // 初回でモードが選択済みか確認
  useEffect(() => {
    const mode = localStorage.getItem('mode')
    if (mode) {
      setModeSelected(true)
    }
  }, [])

  // モード選択ハンドラー
  const handleModeSelect = (mode: 'local' | 'backend') => {
    localStorage.setItem('mode', mode)
    setModeSelected(true)
  }

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    if (storedUsername && storedUsername !== '9999guest') {
      setUsername(`${storedUsername} さん`)
    } else {
      setUsername('ゲストさん')
    }
  }, [])

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollTop = window.scrollY
  //     const docHeight = document.body.scrollHeight - window.innerHeight
  //     const scrolled = (scrollTop / docHeight) * 100
  //     setScrollPercent(scrolled)
  //   }

  //   window.addEventListener('scroll', handleScroll)
  //   return () => window.removeEventListener('scroll', handleScroll)
  // }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`flex flex-col items-center gap-8 p-6 pt-24 pb-24 bg-gray-100 min-h-screen ${notoSansJP.className}`}
    >

      {!modeSelected ? (
      // 🔥 モード選択画面
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">モード選択</h1>
          <button
            onClick={() => handleModeSelect('local')}
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-4 rounded shadow text-lg transition w-64"
          >
            ローカル版で使う
            <p className="text-sm text-center bg-white-90 text-base mt-3">
            ・判定スコアはダミーです<br />・撮影画像は保存されません
            </p>
          </button>
          {/* <p className="text-center text-base text-gray-800 mb-4">
            ・判定スコアはダミーです<br />・撮影画像は保存されません
          </p> */}
          <button
            onClick={() => handleModeSelect('backend')}
            className="bg-red-400 hover:bg-red-500 text-white px-6 py-4 rounded shadow text-lg transition w-64"
          >
            CNN版で使う
            <p className="text-sm text-center bg-white-90 text-base mt-3">
            ＜最終発表当日（4/16）のみ＞<br />・CNNでスコア判定します<br />・撮影画像はDBに保存されます
            </p>
          </button>
        </div>
      ) : (
        <>
          {/* タイトル */}
          <div className="flex flex-col text-center"> 
            <h2 className={`${inter.className} text-5xl italic tracking-tight text-gray-800 border-b-2 border-gray-300 pb-1`}>
              FACE GAUGE
            </h2>
            <span className="text-base text-gray-500 mt-1 tracking-wide">
              フェイス ゲージ
            </span>
          </div>

          {/* キャッチコピー */}
          <p className="text-center text-2xl font-bold text-gray-800">
            “かっこよく年をとる”<br />を科学する
          </p>

          {/* ユーザー名表示 */}
          <p className="text-lg text-gray-700 font-semibold">
            {username}
          </p>

          {/* カメラ起動ボタン */}
          <p className="text-lg text-gray-700 font-semibold">
            ↓下のボタンで撮影スタート↓
          </p>
          <button
            onClick={() => router.push('/camera')}
            className="bg-gray-700 hover:bg-gray-700 text-white px-12 py-8 rounded-lg shadow-md flex flex-col items-center gap-2 transition-all duration-300"
          >
            {/* SVGアイコン */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-20 h-20"
            >
              <path d="M5 16v-6h10v6" />
              <path d="M20 12v4H2v36h60V12H20zM2 22h30m0 0h30" />
              <circle cx="32" cy="34" r="12" />
              <circle cx="32" cy="34" r="4" />
              <path d="M55 30a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2 2 2 0 0 1 2-2h2a2 2 0 0 1 2 2z" />
            </svg>

            {/* ボタン内タイトル */}
            <span className={`${inter.className} text-4xl italic font-black border-b-2 border-gray-400 tracking-tight`}>
              FACE GAUGE
            </span>
            <span className="text-lg not-italic font-semibold">
              - 顔撮影 -
            </span>
          </button>

          {/* 下部ナビゲーションバー */}
          <div className="fixed bottom-0 w-full flex bg-white shadow-inner h-20 z-50">
            <div className="w-1/3 flex items-center justify-center border-r border-gray-300">
              {/* 空 */}
            </div>
            <div className="w-1/3 flex items-center justify-center border-r border-gray-300">
              <Link href="/">
                <Image src="/icons/report.svg" alt="レポート" width={24} height={24} className="w-6 h-6 cursor-pointer" />
              </Link>
            </div>
            <div className="w-1/3 flex items-center justify-center">
              <Link href="/settings">
                <Image src="/icons/settings.svg" alt="設定" width={24} height={24} className="w-6 h-6 cursor-pointer" />
              </Link>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
