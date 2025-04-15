'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import { recommendItems } from '@/lib/mockData'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const inter = Inter({ weight: ['900'], subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ weight: ['400', '700'], subsets: ['latin'] })

// 🔥 ダミーデータ（3パターン）
const dummyDataWeek = [
  { date: '04/01', total: 78, skin: 8, top: 9, under: 6 },
  { date: '04/02', total: 75, skin: 8, top: 9, under: 5 },
  { date: '04/03', total: 80, skin: 9, top: 9, under: 7 },
  { date: '04/04', total: 72, skin: 8, top: 9, under: 4 },
  { date: '04/05', total: 74, skin: 8, top: 9, under: 5 },
]

const dummyDataMonth = [
  { date: '03/10', total: 65, skin: 6, top: 8, under: 5 },
  { date: '03/12', total: 70, skin: 5, top: 8, under: 5 },
  { date: '03/14', total: 64, skin: 4, top: 8, under: 4 },
  { date: '03/17', total: 74, skin: 7, top: 8, under: 6 },
  { date: '03/20', total: 68, skin: 6, top: 9, under: 5 },
  { date: '03/23', total: 73, skin: 7, top: 9, under: 5 },
  { date: '03/26', total: 78, skin: 8, top: 9, under: 6 },
  { date: '03/29', total: 75, skin: 8, top: 9, under: 5 },
  { date: '04/01', total: 78, skin: 8, top: 9, under: 6 },
  { date: '04/02', total: 75, skin: 8, top: 9, under: 5 },
  { date: '04/03', total: 80, skin: 9, top: 9, under: 7 },
  { date: '04/04', total: 72, skin: 8, top: 9, under: 5 },
  { date: '04/05', total: 74, skin: 8, top: 9, under: 4 },
]

const dummyDataYear = [...dummyDataMonth] // 今は月と同じにしてるけど、増やすならここに追加できる

export default function HistoryPage() {
  const router = useRouter()
  const [advice, setAdvice] = useState('')

  type RecommendItemType = {
    name: string
    image: string
    text: string
    link: string
  }
  
  const [recommendItem, setRecommendItem] = useState<RecommendItemType | null>(null)
  
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week')

  const getCurrentData = () => {
    if (period === 'week') return dummyDataWeek
    if (period === 'month') return dummyDataMonth
    return dummyDataYear
  }

  useEffect(() => {
    const currentData = getCurrentData()
    const avgUnder = currentData.reduce((sum, d) => sum + d.under, 0) / currentData.length
    const avgSkin = currentData.reduce((sum, d) => sum + d.skin, 0) / currentData.length
  
    if (period === 'week') {
      if (avgUnder < 6) {
        setAdvice('肌状態とヘアセットは安定していますが、ヒゲの状態が低下傾向にあります。無精ひげが目立つとトータルスコアが落ちる傾向が見られます。こまめなシェービングを意識しましょう。また、二日酔いの日や疲れている日に剃り残しが多いようです。疲れているときこそ、集中してケアしましょう！')
        setRecommendItem(recommendItems['under'])
      } else {
        setAdvice('全体的にスコアは安定しています。この調子でコンディション維持を続けましょう！')
        setRecommendItem(null)
      }
    } else {
      if (avgSkin >= 7) {
        setAdvice('肌の状態はとても安定してきています！素晴らしいですね。この調子で保湿や生活習慣を続けましょう。ただ、ヒゲの状態は不安定な傾向が続いており、最近少しスコアが下がっています。無精ひげ対策として、こまめなシェービングやスキンケアを意識しましょう！')
        setRecommendItem(recommendItems['under'])
      } else {
        setAdvice('肌とヒゲの両方にやや波があります。特にヒゲの状態は不安定なので、生活リズムを整えて丁寧なケアを心がけましょう。')
        setRecommendItem(recommendItems['under'])
      }
    }
  }, [period])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className={`flex flex-col items-center p-6 pt-24 pb-40 bg-gray-100 min-h-screen ${notoSansJP.className}`}>

      <div className="flex flex-col text-center mb-8">
        <h2 className={`${inter.className} text-5xl italic tracking-tight text-gray-800 border-b-2 border-gray-300 pb-1`}>FACE GAUGE</h2>
        <span className="text-base text-gray-500 mt-1 tracking-wide">フェイス ゲージ</span>
      </div>

      <p className="text-red-400 text-base leading-relaxed mb-4">
        ※データはダミーです。
      </p>

      {/* ヒストリー */}
      <div className="text-center bg-gray-300 px-6 py-2 rounded shadow-md w-full max-w-md mb-6">
        <p className="text-2xl italic font-medium text-gray-700 tracking-tight leading-tight">
          - Your HISTORY Report -
        </p>
      </div>

      {/* 🔥 期間選択チェックボックス */}
      <div className="flex justify-center gap-4 mb-8">
        {['week', 'month', 'year'].map((p) => (
          <label key={p} className="flex items-center gap-2 text-gray-700 text-sm">
            <input
              type="radio"
              name="period"
              value={p}
              checked={period === p}
              onChange={() => setPeriod(p as 'week' | 'month' | 'year')}
            />
            {p === 'week' ? '直近1週間' : p === 'month' ? '直近1か月' : '全期間'}
          </label>
        ))}
      </div>

      {/* トータルスコア推移グラフ */}
      <div className="w-full max-w-md mb-12">
        <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">トータルスコア推移</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getCurrentData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* パーツ別スコア推移グラフ */}
      <div className="w-full max-w-md mb-12">
        <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">パーツ別スコア推移</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getCurrentData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="skin" stroke="#82ca9d" strokeWidth={2} />
            <Line type="monotone" dataKey="top" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="under" stroke="#ffc658" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* アドバイス表示 */}
      <div className="bg-white border border-gray-400 rounded-xl p-6 mb-8 w-full max-w-md text-center shadow">
        <h3 className="text-xl font-bold text-gray-600 mb-4">アドバイス</h3>
        <p className="text-gray-700 leading-relaxed">{advice}</p>
      </div>

      {/* おすすめアイテム表示 */}
      {recommendItem && (
        <div className="bg-white border border-gray-400 rounded-xl p-6 mb-8 w-full max-w-md text-center shadow">
          <h3 className="text-xl font-bold text-gray-600 mb-4">おすすめアイテム</h3>
          <img src={recommendItem.image} alt={recommendItem.name} className="w-40 h-40 object-contain mx-auto mb-4 rounded" />
          <p className="text-lg font-semibold text-gray-800 mb-2">{recommendItem.name}</p>
          <p className="text-sm text-gray-600 mb-4">{recommendItem.text}</p>
          <div className="flex justify-center gap-4">
            {/* もともとのボタン */}
            <a
              href={recommendItem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-4 py-2 rounded shadow text-sm transition"
            >
              商品ページを見る
            </a>

            {/* 新しく追加するAmazonボタン */}
            <a
              href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(recommendItem.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-3 py-2 rounded shadow text-sm transition"
            >
              {/* <img src="/icons/amazon-logo.png" alt="Amazon" className="w-15 h-6 mr-2" /> */}
              Amazonで検索
            </a>
          </div>
        </div>
      )}

      {/* レポート評価・メモ */}
      <div className="bg-white border border-gray-400 rounded-xl p-6 mb-8 w-full max-w-md text-center shadow">
        {/* レポート評価 */}
        <h3 className="text-xl font-bold text-gray-600 mb-4">レポート評価</h3>
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.alert(`⭐️ ${star}つ星を選びました！`);
                }
              }}
              className="text-3xl hover:scale-110 transition-transform text-yellow-400" // ⭐ここで色指定
              style={{ color: '#bfae80' }} // ← グレー寄りのシックな黄色
            >
              ★
            </button>
          ))}
        </div>

        {/* メモ記録 */}
        <h3 className="text-xl font-bold text-gray-600 mb-4">メモ記録</h3>
        <p className="text-gray-700 text-sm mb-4">
          気づいたことを記録しましょう
        </p>
        <textarea
          id="memo"
          placeholder="例）最近ヒゲの状態が良くなってきた！"
          className="w-full border border-gray-300 rounded p-3 mb-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
          rows={4}
        />
        <button
          onClick={() => {
            const memo = (document.getElementById('memo') as HTMLTextAreaElement)?.value;
            if (memo.trim() !== '') {
              window.alert('メモを記録しました！');
            } else {
              window.alert('メモが空です。内容を入力してください。');
            }
          }}
          className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-6 rounded shadow text-sm transition"
        >
          記録
        </button>
      </div>

      {/* Oops紹介エリア */}
      <div className="bg-white border border-gray-400 rounded-xl p-6 mb-8 w-full max-w-md text-center shadow">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          もしお悩みのことがあるなら...
        </h3>
        <p className="text-gray-700 mb-4">
          「いろんな診療、ぜんぶオンラインで」できる、<br />”Oops（ウープス）”をご紹介します
        </p>
        <Image src='https://medimee.com/_ipx/f_webp,q_80,s_686x359/storage/clinic/141/thumbnail_20250228220028.jpg' alt="Oopsロゴ" width={300} height={105} className="mb-8 mx-auto" />
        {/* <Image
          src="/oops-logo.png" // ✅ ドメイン許可不要
          alt="Oops紹介"
          width={600}
          height={210}
        /> */}
        <a
          href="https://oops-jp.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-4 py-2 rounded shadow transition"
        >
          オンライン診療サービス ”Oops（ウープス）”<br />はこちら
        </a>
      </div>

      {/* 戻るボタン */}
      <button
        onClick={() => router.push('/')}
        className="bg-gray-700 hover:bg-gray-800 font-semibold text-white px-6 py-2 rounded shadow text-lg transition"
      >
        ホームへ戻る
      </button>

      {/* ナビゲーションバー */}
      <div className="fixed bottom-0 w-full flex bg-white shadow-inner h-20 z-50">
        <div className="w-1/3 flex items-center justify-center border-r border-gray-300">
          <button onClick={() => router.back()} className="cursor-pointer">
            <Image src="/icons/back.svg" alt="戻る" width={24} height={24} className="w-6 h-6" />
          </button>
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
