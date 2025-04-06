'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ weight: ['900'], subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ weight: ['400', '700'], subsets: ['latin'] })

// ランダムに選ぶためのメッセージ一覧
const messages = [
  "清潔は最強の名刺。",
  "スーツより先に、身だしなみを整えよ。",
  "爽やかな印象は、最初の5秒で決まる。",
  "清潔感は、信頼の第一歩。",
  "身だしなみを整えることは、自分を整えること。",
  "爪の先、襟のシワ、口の匂い—細部こそが品格を決める。",
  "清潔な人は、仕事もクリーン。",
  "髪型と靴の手入れで、印象は180度変わる。",
  "清潔感は、一流のビジネスマンの最低条件。",
  "洗練された外見は、自信と余裕の証。",
  "見た目を整えることは、相手への敬意を形にすること。",
  "清潔感は、言葉より雄弁にあなたを語る。",
  "身だしなみは、心の鏡である。",
  "誰もが見るのは、あなたの\u201c第一印象\u201dから。",
  "香りは、目に見えない名刺。",
  "整った髪は、整った一日をつくる。",
  "鏡を見る時間は、自分を高める時間。",
  "外見を磨くことは、内面の誠実さを映し出す。",
  "服のシワは、心のゆるみを映す鏡。",
  "シャツの白さが、信頼の白さになる。",
  "清潔さは、誰にも負けない武器になる。",
  "きちんとした靴は、きちんとした足取りを導く。",
  "一流は、清潔感という基礎の上に築かれる。",
  "丁寧な外見は、丁寧な仕事につながる。",
  "シンプルな装いこそ、洗練の証。",
  "自分を整えることで、周囲も整い始める。",
  "無言の礼儀、それが清潔感。",
  "\u201cなんとなく好印象\u201dは、細部の努力の結晶。",
  "姿勢と身だしなみで、人は倍好かれる。",
  "\u201cちゃんとしてる感\u201dは、信頼を呼び込む。",
  "シャツを整えると、心もまっすぐになる。",
  "清潔感は、今日から始められる最高の自己投資。",
  "靴を磨けば、運もついてくる。",
  "髪型が決まると、会話も弾む。",
  "襟元がピシッとすれば、背筋もピシッとする。",
  "鏡の前で1分、印象は一日中輝く。",
  "香りを整えると、自信がそっと背中を押してくれる。",
  "整った身だしなみは、静かな自己紹介になる。",
  "手を抜かない身だしなみは、信頼の積み重ねになる。",
  "清潔感は、あなたの魅力を最大化するスタイリスト。",
  "加齢は止められないが、印象は進化できる。",
  "努力は顔に出る。",
  "見た目の変化は、内面の選択の積み重ね。",
  "自分に向き合う時間が、人生に品をもたらす。",
  "美しさは主観、清潔感は科学。",
  "清潔感は才能ではない、習慣である。",
  "見た目は運命じゃない、選択だ。",
  "年齢は数字。印象は意志。",
  "無理をしない。でも、諦めもしない。",
  "心が整えば、顔も整う。",
  "自分をいたわる時間が、周りにもやさしさを生む。"
]

export default function TodaysWordPage() {
  const [randomMessage, setRandomMessage] = useState('')

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.length)
    setRandomMessage(messages[randomIndex])
  }

  useEffect(() => {
    getRandomMessage()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`flex flex-col items-center p-6 pt-24 pb-24 bg-gray-100 min-h-screen text-center ${notoSansJP.className}`}
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
          - Daily Inspiration -
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={randomMessage} // ✅ これがアニメーション更新のポイント
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-800 mb-8"
        >
          {randomMessage}
        </motion.p>
      </AnimatePresence>

      {/* ✅ ボタン追加 */}
      <button
        onClick={getRandomMessage}
        className="fixed bottom-30 bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded shadow text-lg font-semibold transition z-40"
      >
        他のWORDを見る
      </button>

      {/* 下部ナビゲーションバー */}
      <div className="fixed bottom-0 w-full flex bg-white shadow-inner h-20 z-50">
        <div className="w-1/3 flex items-center justify-center border-r border-gray-300">
          <Link href="/result">
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