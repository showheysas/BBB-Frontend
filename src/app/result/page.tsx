'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
//import { PolarAngleAxisProps } from 'recharts/types/polar/PolarAngleAxis'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import Image from 'next/image'
import { skinComments, topComments, underComments, getRandomComment, recommendItems, generateRandomFaceScore } from '@/lib/mockData'
import { Suspense } from 'react'


const inter = Inter({ weight: ['900'], subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ weight: ['400', '700'], subsets: ['latin'] })

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActualResultPage />
    </Suspense>
  )
}

function ActualResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  //const searchTransactionId = searchParams.get('transaction_id')
  //const storedTransactionId = typeof window !== 'undefined' ? localStorage.getItem('transaction_id') : null //なければ localStorage から読む

  const [mode, setMode] = useState<'local' | 'backend' | null>(null)

  useEffect(() => {
    const savedMode = localStorage.getItem('mode') as 'local' | 'backend' | null
    setMode(savedMode)
  }, [])
  
  type FaceScoreType = {
    total: { score: number; comment: string };
    skin: { score: number; comment: string };
    top: { score: number; comment: string };
    under: { score: number; comment: string };
    recommendItem: { name: string; image: string; link: string; text: string };
  };

  const [showResult, setShowResult] = useState(() => {
    const redirected = searchParams.get('redirected');
    return redirected === 'true'; // 🔥 クエリパラメータを見て判断
  });
  const [currentTime, setCurrentTime] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('ゲスト')
  const [faceScore, setFaceScore] = useState<FaceScoreType | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [isGuestUser, setIsGuestUser] = useState(false);
  const isFullyLoggedIn = isAuthenticated && !isGuestUser; 

  useEffect(() => {
    const searchTransactionId = searchParams.get('transaction_id')
    const localTransactionId = localStorage.getItem('transaction_id')

    // URLにある → 優先してセット
    if (searchTransactionId) {
      setTransactionId(searchTransactionId)
    } else if (localTransactionId) {
      setTransactionId(localTransactionId)
    }
  }, [searchParams])

  useEffect(() => {
    const capturedFace = localStorage.getItem('capturedFace');
    if (capturedFace) {
      setImageUrl(capturedFace);
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username') || '';
    
      if (mode === 'local') {
        const isLocalAuth = localStorage.getItem('isAuthenticated') === 'true';
        const localToken = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username') || 'ゲスト';
        if (isLocalAuth && localToken) { // 🔥 isAuthenticated=true & tokenありならログイン扱い
          setIsAuthenticated(true);
          setIsGuestUser(false);
          setUsername(storedUsername);
        } else {
          setIsAuthenticated(false);
          setIsGuestUser(false);
          setUsername('ゲスト');
        }
      } else {
        if (!token) {
          // 完全未ログイン
          setIsAuthenticated(false);
          setIsGuestUser(false);
          setUsername('ゲスト');
        } else if (storedUsername === '9999guest') {
          // 9999ゲストログイン
          setIsAuthenticated(false);
          setIsGuestUser(true);
          setUsername('ゲストさん');
        } else {
          // 正式ログイン
          setIsAuthenticated(true);
          setIsGuestUser(false);
          setUsername(storedUsername);
        }
      }
    };
  
    checkAuth();
  
    const handleAuthChange = () => {
      checkAuth();
    };
  
    window.addEventListener('authChanged', handleAuthChange);
    window.addEventListener('focus', handleAuthChange);
  
    return () => {
      window.removeEventListener('authChanged', handleAuthChange);
      window.removeEventListener('focus', handleAuthChange);
    };
  }, []);

  // 🔥【修正版】Authorizationヘッダー付きでリクエストする
  const fetchFaceScore = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("トークンがありません。ログインしてください。");
        return;
      }
  
      const res = await fetch(`https://branding-ngrok-app.jp.ngrok.io/result/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 Bearerトークンを付ける
        },
      });
  
      if (!res.ok) {
        throw new Error('スコア取得失敗');
      }
  
      const data = await res.json();
      console.log("取得したスコアデータ:", JSON.stringify(data, null, 2));

      // 一番スコアが低いパーツを探す
      const skinScore = data.scores.skin_condition.score_10;
      const topScore = data.scores.hair_condition.score_10;
      const underScore = data.scores.beard_condition.score_10;
      
      let recommendType: 'skin' | 'top' | 'under' = 'skin';
      const minScore = Math.min(skinScore, topScore, underScore);
      if (minScore === topScore) recommendType = 'top';
      if (minScore === underScore) recommendType = 'under';

      // 🔥 データ変換（サーバーからの情報をフロントで表示できるように整形）
      const formattedData = {
        total: {
          score: data.scores.total_score_100,
          comment: data.scores.comment,
        },
        skin: {
          score: data.scores.skin_condition.score_10,
          comment: getRandomComment(skinComments, data.scores.skin_condition.score_10, 'skin'), // 🔥
        },
        top: {
          score: data.scores.hair_condition.score_10,
          comment: getRandomComment(topComments, data.scores.hair_condition.score_10, 'top'), // 🔥
        },
        under: {
          score: data.scores.beard_condition.score_10,
          comment: getRandomComment(underComments, data.scores.beard_condition.score_10, 'under'), // 🔥
        },
        recommendItem: recommendItems[recommendType],
      }

      setFaceScore(formattedData); // 🔥 変換後のデータをセット

      // localStrageからtransaction_idを削除
      localStorage.removeItem('transaction_id');
    } catch (error) {
      console.error(error);
      alert('スコアの取得に失敗しました');
    }
  };
  
  useEffect(() => {
    if (mode === 'backend' && transactionId) {
      fetchFaceScore(transactionId)
    }
  }, [mode, transactionId])

  const handleMeasureClick = () => {
    setCurrentTime(new Date().toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }))
    
    if (mode === 'local') {
      // 🔥 ローカル版ならダミーデータ生成
      setFaceScore(generateRandomFaceScore())
    }
  
    setShowResult(true)
  
    if (transactionId) {
      localStorage.setItem('transaction_id', transactionId)
    }
  }

  const fixedInfo: { key: keyof Pick<FaceScoreType, 'skin' | 'top' | 'under'>; subject: string; fullMark: number }[] = [
    { key: 'skin', subject: 'スキンコンディション', fullMark: 10 },
    { key: 'top', subject: 'トップ\nフェイス', fullMark: 10 },
    { key: 'under', subject: 'アンダー\nフェイス', fullMark: 10 },
  ]

  type RenderTickProps = {
    payload: {
      value: string;
    };
    x: number;
    y: number;
    textAnchor: string;
  };

  const renderTwoLineLabel = (props: RenderTickProps) => {
    const { payload, x, y, textAnchor } = props;
    const lines = payload.value.split('\n');
    return (
      <text x={x} y={y} textAnchor={textAnchor} fill="#666" fontSize="16">
        {lines.map((line, index) => (
          <tspan key={index} x={x} dy={index === 0 ? 0 : 16}>
            {line}
          </tspan>
        ))}
      </text>
    );
  };

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
        <span className="text-base text-gray-500 mt-1 tracking-wide">フェイス ゲージ</span>
      </div>

      {/* 撮影画像 */}
      {imageUrl ? (
        <img src={imageUrl} alt="Captured Face" width={256} height={256} className="rounded shadow mb-8 object-cover" />
      ) : (
        <p className="text-red-500 text-center mb-8">撮影エラー</p>
      )}

      {/* 測定ボタン */}
      {!showResult && (
        <div>
          <p className="text-base text-gray-800 text-center mb-1">
            この画像でよいでしょうか？
          </p>
          <div className="flex gap-6 mb-8">
            <button onClick={() => router.push('/camera')} className="bg-gray-700 hover:bg-gray-800 font-semibold text-white px-6 py-2 rounded shadow text-lg transition">
              撮り直し
            </button>
            <button onClick={handleMeasureClick} className="bg-gray-700 hover:bg-gray-800 font-semibold text-white px-6 py-2 rounded shadow text-lg transition">
              測定結果
            </button>
          </div>
        </div>
      )}

      {/* 測定結果 */}
      <AnimatePresence>
        {showResult && faceScore && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 1 }} className="flex flex-col items-center w-full">
            <div className="mb-6 text-center">
              <p className="text-lg text-gray-700">{currentTime}</p>
              <p className="text-xl font-bold text-gray-800">{username} さん</p>
            </div>

            {/* トータルスコア */}
            <div className="border border-gray-600 rounded p-4 mb-6 w-full max-w-md text-center bg-white">
              <p className="text-2xl font-extrabold text-gray-800">トータルスコア</p>
              <p className="italic text-4xl font-extrabold text-gray-800 mt-2">
                {faceScore.total.score}<span className="text-xl font-semibold ml-1">/100</span>
              </p>
            </div>

            <p className="text-xl text-gray-800 mb-12 text-center">{faceScore.total.comment}</p>

            {/* レーダーチャート */}
            <div className="w-full max-w-md mb-8">
              <ResponsiveContainer width="100%" height={300}>
              <RadarChart
                data={fixedInfo.map(item => ({
                  subject: item.subject,
                  score: (faceScore as FaceScoreType)[item.key].score,
                  fullMark: item.fullMark
                }))}
              >
                  <PolarGrid stroke="#ccc" />
                  <PolarAngleAxis dataKey="subject" tick={renderTwoLineLabel} />
                  <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar name="スコア" dataKey="score" stroke="#4B5563" fill="#9CA3AF" fillOpacity={0.4} strokeWidth={2} isAnimationActive animationDuration={1500} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {isFullyLoggedIn ? (
              <>
                {/* 🔥 ログイン済み・一般ユーザー向け（詳細スコア・商品・次アクション） */}

                {/* 詳細スコア表示 */}
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

                {/* おすすめアイテム表示 */}
                <div className="bg-white border border-gray-400 rounded-xl p-6 mb-8 w-full max-w-md text-center shadow">
                  <h3 className="text-xl font-bold text-gray-600 mb-2">あなたにおすすめのアイテム</h3>
                  <img
                    src={faceScore.recommendItem.image}
                    alt={faceScore.recommendItem.name}
                    className="w-40 h-40 object-contain mx-auto mb-2 rounded"
                  />
                  <p className="text-lg font-semibold text-gray-800 mb-2">{faceScore.recommendItem.name}</p>
                  <p className="text-sm text-gray-600 mb-4">{faceScore.recommendItem.text}</p>
                  <div className="flex justify-center gap-4">
                    {/* もともとのボタン */}
                    <a
                      href={faceScore.recommendItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-4 py-2 rounded shadow text-sm transition"
                    >
                      商品ページを見る
                    </a>

                    {/* 新しく追加するAmazonボタン */}
                    <a
                      href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(faceScore.recommendItem.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-3 py-2 rounded shadow text-sm transition"
                    >
                      <img src="/icons/amazon-logo.png" alt="Amazon" className="w-15 h-6 mr-2" />
                      で検索
                    </a>
                  </div>
                </div>

                {/* 次のアクション表示 */}
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
            ) : (
              <>
                {/* 🔥 未ログイン or 9999ゲスト向け（ログイン誘導） */}

                <div className="flex flex-col items-center gap-4 mt-6 mb-12">
                  <p className="text-gray-700 text-center text-sm">
                    ログイン、もしくは新規登録すると、各指標の説明やアドバイスを見ることができます
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => router.push('/login?redirect=/result')}
                      className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded shadow"
                    >
                      ログイン
                    </button>
                    <button
                      onClick={() => router.push('/register?redirect=/result')}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded shadow"
                    >
                      新規登録
                    </button>
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