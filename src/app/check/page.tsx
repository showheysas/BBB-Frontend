'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Noto_Sans_JP } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'

const notoSansJP = Noto_Sans_JP({ weight: ['400', '700'], subsets: ['latin'] })

export default function CheckPage() {
  const router = useRouter()
  const [step, setStep] = useState<'selectCategory' | 'selectDetails' | 'selectReason'>('selectCategory')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDetails, setSelectedDetails] = useState<string[]>([])
  const [selectedReasons, setSelectedReasons] = useState<string[]>([])
  const [otherDetailText, setOtherDetailText] = useState('')
  const [otherReasonText, setOtherReasonText] = useState('')

  const categories = ['肌の状態', 'ヘアセット', 'ヒゲ']

  const detailsMap: Record<string, string[]> = {
    '肌の状態': ['乾燥している', '脂っぽい', 'できものがある', '赤みがある', '荒れている', 'その他'],
    'ヘアセット': ['セットがうまくいかない', '髪がぺたんこ', 'サイドが広がっている', 'まとまりが悪い', 'ボリュームがない', 'その他'],
    'ヒゲ': ['剃り残しがある', '青ひげが目立つ', '無精ひげが伸びている', '肌荒れしている', '清潔感がない', 'その他'],
  }

  const reasons = [
    '仕事が忙しく疲れがある',
    '人間関係のトラブルがある',
    '二日酔い',
    '寝不足',
    'ストレスがたまっている',
    '運動不足',
    '肌荒れ・乾燥を感じる',
    '生活リズムが乱れている',
    '栄養バランスが悪い',
    '気分が落ち込んでいる',
    'その他'
  ]

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category)
    setStep('selectDetails')
  }

  const toggleDetail = (detail: string) => {
    if (selectedDetails.includes(detail)) {
      setSelectedDetails(selectedDetails.filter(d => d !== detail))
    } else {
      setSelectedDetails([...selectedDetails, detail])
    }
  }

  const toggleReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter(r => r !== reason))
    } else {
      setSelectedReasons([...selectedReasons, reason])
    }
  }

  const handleNext = () => {
    if (selectedDetails.length > 0) {
      setStep('selectReason')
    }
  }

  const handleComplete = () => {
    if (selectedReasons.length > 0) {
      const report = {
        category: selectedCategory,
        details: [
          ...selectedDetails.filter(d => d !== 'その他'),
          ...(selectedDetails.includes('その他') && otherDetailText ? [`その他: ${otherDetailText}`] : []),
        ],
        reasons: [
          ...selectedReasons.filter(r => r !== 'その他'),
          ...(selectedReasons.includes('その他') && otherReasonText ? [`その他: ${otherReasonText}`] : []),
        ],
      }
      localStorage.setItem('selfCheckReport', JSON.stringify(report))
      router.push('/report')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`flex flex-col items-center p-6 pt-24 pb-40 bg-gray-100 min-h-screen ${notoSansJP.className}`}
    >
      <AnimatePresence mode="wait">
        {step === 'selectCategory' && (
          <motion.div key="category" {...fadeAnimation} className="flex flex-col items-center w-full">
            <Header label="- Self Check -" />
            <p className="text-gray-700 mb-6 text-center">気になるポイントを選んでください</p>
            <ButtonList options={categories} onClick={handleSelectCategory} />
          </motion.div>
        )}

        {step === 'selectDetails' && (
          <motion.div key="details" {...fadeAnimation} className="flex flex-col items-center w-full">
            <Header label={`- ${selectedCategory} Check -`} />
            <p className="text-gray-700 mb-6 text-center">当てはまる項目を選んでください</p>
            <CheckboxList
              options={detailsMap[selectedCategory]}
              selected={selectedDetails}
              toggle={toggleDetail}
              otherText={otherDetailText}
              setOtherText={setOtherDetailText}
            />
            <NextButton onClick={handleNext} disabled={selectedDetails.length === 0} />
          </motion.div>
        )}

        {step === 'selectReason' && (
          <motion.div key="reason" {...fadeAnimation} className="flex flex-col items-center w-full">
            <Header label="- Condition -" />
            <p className="text-gray-700 mb-6 text-center">最近のコンディションを選んでください</p>
            <CheckboxList
              options={reasons}
              selected={selectedReasons}
              toggle={toggleReason}
              otherText={otherReasonText}
              setOtherText={setOtherReasonText}
            />
            <NextButton onClick={handleComplete} disabled={selectedReasons.length === 0} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 下部ナビゲーションバー */}
      <div className="fixed bottom-0 w-full flex bg-white shadow-inner h-20 z-50">
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

const Header = ({ label }: { label: string }) => (
  <div className="text-center bg-gray-300 px-6 py-2 rounded shadow-md w-full max-w-md mb-10">
    <p className="text-2xl italic font-medium text-gray-700 tracking-tight leading-tight">{label}</p>
  </div>
)

const ButtonList = ({ options, onClick }: { options: string[], onClick: (v: string) => void }) => (
  <div className="flex flex-col gap-6 w-full max-w-md">
    {options.map((opt, idx) => (
      <button
        key={idx}
        onClick={() => onClick(opt)}
        className="bg-white hover:bg-gray-100 border border-gray-400 rounded-lg p-4 text-lg font-semibold shadow transition text-gray-800"
      >
        {opt}
      </button>
    ))}
  </div>
)

const CheckboxList = ({
  options,
  selected,
  toggle,
  otherText,
  setOtherText
}: {
  options: string[],
  selected: string[],
  toggle: (v: string) => void,
  otherText: string,
  setOtherText: (v: string) => void
}) => (
  <div className="flex flex-col gap-4 w-full max-w-md mb-8">
    {options.map((opt, idx) => (
      <div key={idx}>
        <label className="flex items-center gap-3 p-3 bg-white rounded shadow cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="w-5 h-5 text-gray-700 border-gray-300 rounded focus:ring-gray-700"
          />
          <span className="text-gray-800">{opt}</span>
        </label>
        {opt === 'その他' && selected.includes('その他') && (
          <input
            type="text"
            placeholder="具体的に入力してください"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            className="mt-2 w-full border border-gray-300 rounded p-2 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
          />
        )}
      </div>
    ))}
  </div>
)

const NextButton = ({ onClick, disabled }: { onClick: () => void, disabled: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-8 py-3 rounded text-lg font-semibold shadow transition ${
      disabled
        ? 'bg-gray-300 text-white cursor-not-allowed'
        : 'bg-gray-700 hover:bg-gray-800 text-white'
    }`}
  >
    次へ
  </button>
)

const fadeAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 },
}
