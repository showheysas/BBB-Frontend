'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import { recommendItems } from '@/lib/mockData'
import Link from 'next/link'
import Image from 'next/image'

const inter = Inter({ weight: ['900'], subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ weight: ['400', '700'], subsets: ['latin'] })

export default function ReportPage() {
  const router = useRouter()
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null)
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [currentTime, setCurrentTime] = useState<string | null>(null)
  const [username, setUsername] = useState('ゲスト')

  useEffect(() => {
    const savedData = localStorage.getItem('selfCheckReport')
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setSelectedConcern(parsedData.category || null)
      setSelectedConditions([
        ...(parsedData.details || []),
        ...(parsedData.reasons || [])
      ])
    }

    // 日時とユーザー名をセット
    const now = new Date()
    const formattedTime = now.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    setCurrentTime(formattedTime)

    const storedUsername = localStorage.getItem('username') || 'ゲスト'
    setUsername(storedUsername)
  }, [])

  const getAdvice = () => {
    if (!selectedConcern || selectedConditions.length === 0) return 'データが不足しています。'

    const baseAdvice = {
      skin: '肌のケアを見直しましょう。十分な保湿と生活習慣の改善が効果的です。',
      top: '髪のセットや手入れを見直しましょう。ヘアクリームなどの使用もおすすめです。',
      under: 'ヒゲの手入れを丁寧に行いましょう。肌荒れ対策も忘れずに。'
    }

    const conditionAdvice = selectedConditions.includes('寝不足')
      ? 'まずはしっかり睡眠をとることが最優先です。'
      : selectedConditions.includes('ストレスがたまっている')
      ? 'リラックスできる時間を意識的に作りましょう。'
      : selectedConditions.includes('栄養バランスが悪い')
      ? '食生活を見直すと体調も整いやすくなります。'
      : '生活リズムを整えることが大切です。'

    return `${baseAdvice[selectedConcern as keyof typeof baseAdvice]} ${conditionAdvice}`
  }

  const getRecommendedItem = () => {
    if (!selectedConcern) return null
  
    const concernKeyMap: Record<string, 'skin' | 'top' | 'under'> = {
      '肌の状態': 'skin',
      'ヘアセット': 'top',
      'ヒゲ': 'under',
    }
  
    const mappedKey = concernKeyMap[selectedConcern]
    if (!mappedKey) return null
  
    return recommendItems[mappedKey]
  }

  const recommendedItem = getRecommendedItem()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`flex flex-col items-center p-6 pt-24 pb-40 bg-gray-100 min-h-screen ${notoSansJP.className}`}
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

      {/* コンディションレポート */}
      <div className="text-center bg-gray-300 px-6 py-2 rounded shadow-md w-full max-w-md mb-4">
        <p className="text-2xl italic font-medium text-gray-700 tracking-tight leading-tight">
          - Condition Report -
        </p>
      </div>

      {/* 日時・ユーザー名 */}
      <div className="mb-8 text-center">
        <p className="text-gray-700">{currentTime}</p>
        <p className="text-lg font-bold text-gray-800">{username} さん</p>
      </div>

      {/* 選んだ内容まとめ */}
      <div className="w-full max-w-md text-center mb-8">
        <h3 className="text-xl font-bold text-gray-700 mb-4">あなたの選択</h3>
        <p className="text-gray-800 mb-2">気になること：{selectedConcern || 'なし'}</p>
        <p className="text-gray-800">最近のコンディション：</p>
        <ul className="text-gray-700 list-disc list-inside">
          {selectedConditions.map((cond, index) => (
            <li key={index}>{cond}</li>
          ))}
        </ul>
      </div>

      {/* アドバイス表示 */}
      <div className="bg-white border border-gray-400 rounded-xl p-6 mb-8 w-full max-w-md text-center shadow">
        <h3 className="text-xl font-bold text-gray-600 mb-4">アドバイス</h3>
        <p className="text-gray-700 leading-relaxed">
          {getAdvice()}
        </p>
      </div>

      {/* おすすめアイテム表示 */}
      {recommendedItem && (
        <div className="bg-white border border-gray-400 rounded-xl p-6 mb-8 w-full max-w-md text-center shadow">
          <h3 className="text-xl font-bold text-gray-600 mb-4">おすすめアイテム</h3>
          <img
            src={recommendedItem.image}
            alt={recommendedItem.name}
            className="w-40 h-40 object-contain mx-auto mb-4 rounded"
          />
          <p className="text-lg font-semibold text-gray-800 mb-2">{recommendedItem.name}</p>
          <p className="text-sm text-gray-600 mb-4">{recommendedItem.text}</p>
          <a
            href={recommendedItem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-4 py-2 rounded shadow text-sm transition"
          >
            商品ページを見る
          </a>
        </div>
      )}

      
      {/* Oops紹介エリア */}
      <div className="bg-white border border-gray-400 rounded-xl p-6 mb-8 w-full max-w-md text-center shadow">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          もしお悩みのことがあるなら...
        </h3>
        <p className="text-gray-700 mb-4">
          「いろんな診療、ぜんぶオンラインで」できる、<br />”Oops（ウープス）”をご紹介します
        </p>
        <Image
          src="/oops-logo.png" // ✅ ドメイン許可不要
          alt="Oops紹介"
          width={600}
          height={210}
        />
        <a
          href="https://oops-jp.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-4 py-2 rounded shadow transition"
        >
          オンライン診療サービス ”Oops（ウープス）”<br />はこちら
        </a>
      </div>

      {/* クーポンエリア */}
      <div className="text-center bg-gray-300 px-6 py-2 rounded shadow-md w-full max-w-md mt-12 mb-8">
        <p className="text-2xl italic font-medium text-gray-700 tracking-tight leading-tight">
          - Special Coupon! -
        </p>
      </div>

      <div className="bg-white border border-gray-400 rounded-xl p-6 mb-8 w-full max-w-md text-center shadow">
        <h3 className="text-xl font-bold text-gray-600 mb-4">クーポンプレゼント！</h3>
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?data=https%3A%2F%2Fwww.mandom.co.jp&size=200x200"
          alt="クーポンQRコード"
          className="w-48 h-48 object-contain mx-auto mb-4 rounded shadow"
        />
        <p className="text-gray-700 text-sm leading-relaxed">
          コンディション入力ありがとうございました！<br />
          QRコードを読み取ってクーポンを使いましょう！<br />
          スクリーンショットしておくことをおすすめします。<br /><br />
          ※QRコードは、MVP用のダミーです。
        </p>
      </div>

      {/* 戻るボタン */}
      <button
        onClick={() => router.push('/')}
        className="bg-gray-700 hover:bg-gray-800 font-semibold text-white px-6 py-2 rounded shadow text-lg transition"
      >
        ホームへ戻る
      </button>

      {/* 下部ナビゲーションバー */}
      <div className="fixed bottom-0 w-full flex bg-white shadow-inner h-20 z-60">
        <div className="w-1/3 flex items-center justify-center border-r border-gray-300">
          <Link href="/result">
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
