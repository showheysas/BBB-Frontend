'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import { generateRandomFaceScore } from '@/lib/mockData'
import Image from 'next/image'

const inter = Inter({ weight: ['900'], subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ weight: ['400', '700'], subsets: ['latin'] })

export default function ResultPage() {
  const router = useRouter()
  const [showResult, setShowResult] = useState(false)
  const [currentTime, setCurrentTime] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('ゲスト')
  const [faceScore, setFaceScore] = useState(generateRandomFaceScore())

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated') === 'true'
      const storedUsername = localStorage.getItem('username') || 'ゲスト'
      setIsAuthenticated(auth)
      setUsername(storedUsername)
    }

    checkAuth()
    window.addEventListener('focus', checkAuth)
    return () => window.removeEventListener('focus', checkAuth)
  }, [])

  const handleMeasureClick = () => {
    setCurrentTime(new Date().toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }))
    setFaceScore(generateRandomFaceScore())
    setShowResult(true)
  }

  const fixedInfo = [
    { key: 'skin', subject: 'スキンコンディション', fullMark: 10 },
    { key: 'top', subject: 'トップ\nフェイス', fullMark: 10 },
    { key: 'under', subject: 'アンダー\nフェイス', fullMark: 10 },
  ]

  type CustomPolarLabelProps = {
    payload: { value: string }
    x: number
    y: number
    textAnchor: string
  }

  const renderTwoLineLabel = (props: CustomPolarLabelProps) => {
    const { payload, x, y, textAnchor } = props
    const lines = payload.value.split('\n')
    return (
      <text x={x} y={y} textAnchor={textAnchor} fill="#666" fontSize="16">
        {lines.map((line, index) => (
          <tspan key={index} x={x} dy={index === 0 ? 0 : 16}>
            {line}
          </tspan>
        ))}
      </text>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`relative flex flex-col items-center p-6 pt-24 pb-24 bg-gray-100 min-h-screen ${notoSansJP.className}`}
    >
      {/* タイトル */}
      <div className="flex flex-col text-center mb-8">
        <h2 className={`${inter.className} text-5xl italic tracking-tight text-gray-800 border-b-2 border-gray-300 pb-1`}>
          FACE GAUGE
        </h2>
        <span className="text-base text-gray-500 mt-1 tracking-wide">
          フェイス ゲージ
        </span>
      </div>

      <div className="text-center bg-gray-300 px-6 py-2 rounded shadow-md w-full max-w-md mb-14">
        <p className="text-2xl italic font-medium text-gray-700 tracking-tight leading-tight">
          - FACE SCORE -
        </p>
      </div>

      {/* 撮影画像 */}
      <Image src="/kiriyama.png" alt="Captured" width={256} height={256} className="rounded shadow mb-8" />

      {/* 撮り直し・測定するボタン */}
      {!showResult && (
        <div className="flex gap-6 mb-8">
          <button
            onClick={() => router.push('/camera')}
            className="bg-gray-700 hover:bg-gray-800 font-semibold text-white px-6 py-2 rounded shadow text-lg transition"
          >
            撮り直し
          </button>
          <button
            onClick={handleMeasureClick}
            className="bg-gray-700 hover:bg-gray-800 font-semibold text-white px-6 py-2 rounded shadow text-lg transition"
          >
            測定結果
          </button>
        </div>
      )}

      {/* 測定結果 */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center w-full"
          >
            {/* 測定時間と名前 */}
            <div className="mb-6 text-center">
              <p className="text-lg text-gray-700">{currentTime}</p>
              <p className="text-xl font-bold text-gray-800">{username} さん</p>
            </div>

            {/* トータルスコア */}
            <div className="border border-gray-600 rounded p-4 mb-6 w-full max-w-md text-center bg-white">
              <p className="text-2xl font-extrabold text-gray-800">トータルスコア</p>
              <p className="italic text-4xl font-extrabold text-gray-800 mt-2">
                {faceScore.total.score}
                <span className="text-xl font-semibold ml-1">/100</span>
              </p>
            </div>

            {/* トータルコメント */}
            <p className="text-xl text-gray-800 mb-12 text-center">{faceScore.total.comment}</p>

            {/* レーダーチャート */}
            <div className="w-full max-w-md mb-8">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart
                  data={fixedInfo.map(item => ({
                    subject: item.subject,
                    score: (faceScore[item.key as 'skin' | 'top' | 'under']).score,
                    fullMark: item.fullMark
                  }))}
                  outerRadius="80%"
                >
                  <PolarGrid stroke="#ccc" />
                  <PolarAngleAxis dataKey="subject" tick={renderTwoLineLabel} />
                  <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar
                    name="スコア"
                    dataKey="score"
                    stroke="#4B5563"
                    fill="#9CA3AF"
                    fillOpacity={0.4}
                    strokeWidth={2}
                    isAnimationActive
                    animationDuration={1500}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* 🔵 未ログインだったらログイン・新規登録 */}
            {!isAuthenticated && (
              <div className="flex flex-col items-center gap-4 mt-6 mb-12">
                <p className="text-gray-700 text-center text-sm">
                  ログイン、もしくは新規登録すると、各指標の説明やアドバイスを見ることができます
                </p>
                <div className="flex gap-4">
                <button
                  onClick={() => router.push('/login?redirect=/result')} // ← ここを追加！！
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded shadow"
                >
                  ログイン
                </button>
                <button
                  onClick={() => router.push('/register?redirect=/result')} // ← ここも追加！！
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded shadow"
                >
                  新規登録
                </button>
                </div>
              </div>
            )}

            {/* 🔵 ログイン済みなら、詳細表示 */}
            {isAuthenticated && (
              <>
                {/* 指標別スコア・コメント */}
                <div className="flex flex-col items-center gap-6 w-full max-w-md mb-8">
                  {fixedInfo.map((item, index) => (
                    <div key={index} className="text-center w-full">
                      <div className="border border-gray-400 rounded p-3 mb-2 w-full text-lg font-semibold text-gray-800 bg-white">
                        {item.subject.replace('\n', '')}：
                        <span className="italic">{faceScore[item.key as 'skin' | 'top' | 'under'].score} / 10</span>
                      </div>
                      <p className="text-gray-800">{faceScore[item.key as 'skin' | 'top' | 'under'].comment}</p>
                    </div>
                  ))}
                </div>

                {/* おすすめアイテム */}
                <div className="bg-white border border-gray-400 rounded-xl p-6 mb-8 w-full max-w-md text-center shadow">
                  <h3 className="text-xl font-bold text-gray-600 mb-2">あなたにおすすめのアイテム</h3>
                  <img
                    src={faceScore.recommendItem.image}
                    alt={faceScore.recommendItem.name}
                    className="w-40 h-40 object-contain mx-auto mb-2 rounded"
                  />
                  <p className="text-lg font-semibold text-gray-800 mb-2">{faceScore.recommendItem.name}</p>
                  <p className="text-sm text-gray-600 mb-4">{faceScore.recommendItem.text}</p>
                  <a
                    href={faceScore.recommendItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-4 py-2 rounded shadow text-sm transition"
                  >
                    商品ページ
                  </a>
                </div>

                {/* ✅ 復活！ 次のアクションボタン */}
                <div className="flex flex-col gap-8 w-full max-w-md mb-12">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-700 text-center text-sm">
                      このスコアで問題ないときは...
                    </p>
                    <button
                      onClick={() => router.push('/todaysWord')}
                      className="bg-gray-700 hover:bg-gray-800 font-semibold text-white px-6 py-2 rounded shadow text-lg transition"
                    >
                      Today&apos;s WORDを見る！
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-700 text-center text-sm">
                      思ったよりスコアがイマイチだったときは...
                    </p>
                    <div className="flex gap-8">
                      <button
                        onClick={() => router.push('/camera')}
                        className="bg-gray-700 hover:bg-gray-800 font-semibold text-white px-5 py-2 rounded shadow text-lg transition"
                      >
                        撮り直し
                      </button>
                      <button
                        onClick={() => router.push('/check')}
                        className="bg-gray-700 hover:bg-gray-800 font-semibold text-white px-5 py-2 rounded shadow text-lg transition"
                      >
                        セルフチェック
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ナビゲーションバー */}
      <div className="fixed bottom-0 w-full flex bg-white shadow-inner h-20 z-50">
        <div className="w-1/3 flex items-center justify-center border-r border-gray-300">
          <Link href="/camera">
            <Image src="/icons/back.svg" alt="戻る" width={24} height={24} className="w-6 h-6 cursor-pointer" />
          </Link>
        </div>
        <div className="w-1/3 flex items-center justify-center border-r border-gray-300">
          <Link href="/">
            <Image src="/icons/home.svg" alt="ホーム" width={24} height={24} className="w-6 h-6 cursor-pointer" />
          </Link>
        </div>
        <div className="w-1/3 flex items-center justify-center">
          <Link href="/settings">
            <Image src="/icons/settings.svg" alt="設定" width={24} height={24} className="w-6 h-6 cursor-pointer" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
