'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Inter, Noto_Sans_JP } from 'next/font/google'

const inter = Inter({ weight: ['900'], subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ weight: ['400', '700'], subsets: ['latin'] })

export default function StartPage() {
  const router = useRouter()
  const [checkedAuth, setCheckedAuth] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuthenticated = localStorage.getItem('isAuthenticated')
      if (isAuthenticated !== 'true') {
        router.push('/login')
      } else {
        setCheckedAuth(true)
      }
    }
  }, [])

  if (!checkedAuth) {
    return null // ログインチェック中は何も表示しない（ちらつき防止）
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`flex flex-col items-center gap-8 p-6 pt-24 pb-24 bg-gray-100 min-h-screen ${notoSansJP.className}`}
    >
      {/* タイトル */}
      <h2 className={`${inter.className} text-5xl italic tracking-tight text-gray-800 border-b-2 border-gray-300 pb-2`}>
        FACE GAUGE
      </h2>

      {/* キャッチコピー */}
      <p className="text-center text-2xl font-bold text-gray-800">
        “かっこよく年をとる”
        <br />
        を科学する
      </p>

      {/* カメラ起動ボタン */}
      <button
        onClick={() => router.push('/camera')}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-12 py-8 rounded-lg shadow-md flex flex-col items-center gap-2 transition-all duration-300"
      >
        <img src="/icons/camera.svg" alt="カメラ" className="w-16 h-16" />
        <span className={`${inter.className} text-4xl italic font-black border-b-2 border-gray-400 tracking-tight`}>
          FACE GAUGE
        </span>
        <span className="text-base not-italic font-normal">
          - 顔撮影 -
        </span>
      </button>

    </motion.div>
  )
}
