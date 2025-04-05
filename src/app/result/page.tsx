'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const inter = Inter({ weight: ['900'], subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ weight: ['400', '700'], subsets: ['latin'] })

// 🔵 仮のログインユーザー名
const MOCK_USERNAME = 'kiriyama'

export default function ResultPage() {
  const router = useRouter()
  const [showResult, setShowResult] = useState(false)
  const [currentTime, setCurrentTime] = useState<string | null>(null)

  const handleMeasureClick = () => {
    setCurrentTime(new Date().toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }))
    setShowResult(true)
  }

  const fixedInfo = [
    { key: 'skin', subject: 'スキンコンディション', fullMark: 10 },
    { key: 'top', subject: 'トップ\nフェイス', fullMark: 10 },
    { key: 'under', subject: 'アンダー\nフェイス', fullMark: 10 },
  ]

  const faceScore = {
    skin: { score: 8, comment: '肌のコンディションは良好です！' },
    top: { score: 9, comment: '今日の髪型も決まってますね！' },
    under: { score: 5, comment: 'あご周りのひげ剃り残しが気になるかも！' },
    total: { score: 80, comment: '全体的に爽やかな状態が維持できています！' }
  }

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
      <div className="flex flex-col items-center text-center mb-8 space-y-4 w-full max-w-md">
        <h2 className={`${inter.className} text-5xl italic tracking-tight leading-tight text-gray-800 border-b-2 border-gray-300 pb-2`}>
          FACE GAUGE
        </h2>
        <div className="bg-gray-300 px-6 py-2 rounded shadow-md w-full">
          <p className="text-2xl italic font-medium text-gray-700 tracking-tight leading-tight">
            - FACE SCORE -
          </p>
        </div>
      </div>

      {/* 撮影画像（固定画像） */}
      <img src="/kiriyama.png" alt="Captured" className="w-64 rounded shadow mb-6" />

      {/* 撮り直し・測定するボタン */}
      {!showResult && (
        <div className="flex gap-6 mb-8">
          <button
            onClick={() => router.push('/camera')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md shadow text-lg font-medium transition-all duration-300"
          >
            撮り直し
          </button>
          <button
            onClick={handleMeasureClick}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md shadow text-lg font-medium transition-all duration-300"
          >
            測定する
          </button>
        </div>
      )}

      {/* 測定結果（アニメーション付き） */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center w-full"
          >
            {/* 🆕 日付＋ユーザー名 */}
            {currentTime && (
              <div className="mb-6 text-center">
                <p className="text-lg text-gray-700">{currentTime}</p>
                <p className="text-xl font-bold text-gray-800">{MOCK_USERNAME} さん</p>
              </div>
            )}

            {/* トータルスコア */}
            <div className="border border-gray-600 rounded p-4 mb-2 w-full max-w-md text-center bg-white">
              <p className="text-2xl font-extrabold text-gray-800">トータルスコア</p>
              <p className="italic text-4xl font-extrabold text-gray-800 mt-2">
                {faceScore.total.score}
                <span className="text-xl font-semibold ml-1">/100</span>
              </p>
            </div>
            <p className="text-xl text-gray-800 mb-8 text-center">{faceScore.total.comment}</p>

            {/* レーダーチャート */}
            <div className="w-full max-w-md mb-8">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart
                  data={fixedInfo.map(item => ({
                    subject: item.subject,
                    score: faceScore[item.key as keyof typeof faceScore].score,
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

            {/* 各スコア */}
            <div className="flex flex-col items-center gap-6 w-full max-w-md mb-8">
              {fixedInfo.map((item, index) => (
                <div key={index} className="text-center w-full">
                  <div className="border border-gray-400 rounded p-3 mb-2 w-full text-lg font-semibold text-gray-800 bg-white">
                    {item.subject.replace('\n', '')}：
                    <span className="italic">
                      {faceScore[item.key as keyof typeof faceScore].score} / 10
                    </span>
                  </div>
                  <p className="text-gray-800">{faceScore[item.key as keyof typeof faceScore].comment}</p>
                </div>
              ))}
            </div>

            {/* OKパターン／イマイチパターン */}
            <div className="flex flex-col gap-8 w-full max-w-md mt-8">
              <div className="flex flex-col items-center gap-2">
                <p className="text-gray-700 text-center text-sm">
                  このスコアで問題ないときは...
                </p>
                <button
                  onClick={() => router.push('/todaysWord')}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded shadow text-lg font-semibold transition"
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
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded shadow text-lg font-medium transition"
                  >
                    撮り直し
                  </button>
                  <button
                    onClick={() => router.push('/reason')}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded shadow text-lg font-medium transition"
                  >
                    セルフチェック
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 下部ナビゲーションバー */}
      <div className="fixed bottom-0 w-full flex bg-white shadow-inner h-20 z-50">
        <div className="w-1/3 flex items-center justify-center border-r border-gray-300">
          <Link href="/camera">
            <img src="/icons/back.svg" alt="戻る" className="w-6 h-6 cursor-pointer" />
          </Link>
        </div>
        <div className="w-1/3 flex items-center justify-center border-r border-gray-300">
          <Link href="/">
            <img src="/icons/home.svg" alt="ホーム" className="w-6 h-6 cursor-pointer" />
          </Link>
        </div>
        <div className="w-1/3 flex items-center justify-center">
          <Link href="/settings">
            <img src="/icons/settings.svg" alt="設定" className="w-6 h-6 cursor-pointer" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
