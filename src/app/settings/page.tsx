'use client'

import { useState } from "react"
import { userInfo, reportHistory } from '@/lib/mockData'
import Link from "next/link"
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [user, setUser] = useState(userInfo)
  const router = useRouter()

  const handleChange = (field: keyof typeof userInfo) => {
    const newValue = prompt(`${field}を変更してください`, user[field])
    if (newValue !== null) {
      setUser(prev => ({
        ...prev,
        [field]: newValue,
      }))
    }
  }

  return (
    <div className="flex flex-col items-center p-6 pt-24 min-h-screen bg-gray-100">
      {/* タイトル */}
      <h1 className="text-2xl font-bold mb-6 text-black">設定</h1>

      {/* ユーザー情報 */}
      <div className="bg-white rounded shadow p-6 w-full max-w-md space-y-4">
        {Object.entries(user).map(([key, value]) => (
          key !== 'createdAt' && key !== 'lastLoginAt' && (
            <div key={key} className="flex justify-between items-center">
              <div>
                <p className="text-black">{key}</p>
                <p className="font-semibold text-black">{value}</p>
              </div>
              <button
                onClick={() => handleChange(key as keyof typeof userInfo)}
                className="text-blue-600 hover:underline"
              >
                変更する
              </button>
            </div>
          )
        ))}
      </div>

      {/* 登録・ログイン情報 */}
      <div className="bg-white rounded shadow p-6 w-full max-w-md mt-8 space-y-2">
        <p className="text-black"><span className="font-semibold">初回登録日:</span> {user.createdAt}</p>
        <p className="text-black"><span className="font-semibold">最終ログイン日:</span> {user.lastLoginAt}</p>
      </div>

      {/* レポート履歴 */}
      <div className="bg-white rounded shadow p-6 w-full max-w-md mt-8">
        <h2 className="text-xl font-bold mb-4 text-black">レポート履歴</h2>
        <ul className="space-y-2">
          {reportHistory.map(report => (
            <li key={report.id}>
              <Link href={`/report/${report.id}`} className="text-blue-600 hover:underline">
                {report.date} - {report.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 戻るボタン */}
      <button
        onClick={() => router.push('/')}
        className="bg-gray-700 hover:bg-gray-800 font-semibold text-white px-6 py-2 rounded shadow text-lg transition mt-8 mb-32"
      >
        ホームへ戻る
      </button>

      {/* 下部ナビゲーションバー */}
      <div className="fixed bottom-0 w-full flex bg-white shadow-inner h-20 z-50">
        <div className="w-1/3 flex items-center justify-center border-r border-gray-300">
          {/* ここ空でもOK（戻るボタンは上にあるから） */}
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
    </div>
  )
}
