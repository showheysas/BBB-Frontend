'use client'

import { useState } from "react"
import { userInfo, reportHistory } from '@/lib/mockData'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
              {/* 生年月日以外に「変更する」ボタンを表示 */}
              {key !== 'birthDate' && (
                <button
                  onClick={() => handleChange(key as keyof typeof userInfo)}
                  className="text-blue-600 hover:underline"
                >
                  変更する
                </button>
              )}
            </div>
          )
        ))}

        {/* 生年月日（固定表示） */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-black">生年月日</p>
            <p className="font-semibold text-black">1990-04-16</p>
          </div>
          {/* 変更するボタンなし */}
        </div>
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

      <p className="text-red-400 text-sm leading-relaxed mt-8">
        ※MVP用のダミーデータです。「変更」しても反映されません。<br />　また、レポート履歴のリンクは機能していません。
      </p>

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
          {/* 空 */}
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
    </div>
  )
}
