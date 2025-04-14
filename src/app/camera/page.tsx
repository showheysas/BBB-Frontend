'use client'

import { useEffect, useState, useRef } from "react"
import { nets, detectSingleFace, TinyFaceDetectorOptions } from "face-api.js"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Inter, Noto_Sans_JP } from 'next/font/google'
import Link from 'next/link'

const notoSansJP = Noto_Sans_JP({ weight: ['400', '700'], subsets: ['latin'] })
const inter = Inter({ weight: ['900'], subsets: ['latin'] })

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [showShutter, setShowShutter] = useState(false)
  const [captured, setCaptured] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const startCamera = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    }

    const loadModels = async () => {
      await nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector")
    }

    const setup = async () => {
      await loadModels()
      await startCamera()
      detectFace()
    }

    setup()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const currentStream = videoRef.current.srcObject as MediaStream
        currentStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const detectFace = async () => {
    if (!videoRef.current) return

    const interval = setInterval(async () => {
      const detection = await detectSingleFace(
        videoRef.current!,
        new TinyFaceDetectorOptions()
      )

      if (detection && !captured) {
        clearInterval(interval)
        startCountdownAndCapture()
      }
    }, 500)
  }

  const startCountdownAndCapture = () => {
    setIsCountingDown(true)
    let count = 3
    setCountdown(count)

    const interval = setInterval(() => {
      count -= 1
      setCountdown(count)

      if (count === 0) {
        clearInterval(interval)
        setIsCountingDown(false)
        capturePhoto()
      }
    }, 1000)
  }

  const capturePhoto = async () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (canvas && video) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0)

      const detection = await detectSingleFace(canvas, new TinyFaceDetectorOptions())
      if (detection) {
        // クロッピング用に追加
        const { x, y, width, height } = detection.box;

        // 🔥 クロップ＆リサイズして保存
        const marginTop = height * 0.4;
        const marginBottom = height * 0.2;
        const marginSide = width * 0.2;

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const newX = Math.max(0, x - marginSide);
        const newY = Math.max(0, y - marginTop);
        const newWidth = Math.min(imgWidth - newX, width + marginSide * 2);
        const newHeight = Math.min(imgHeight - newY, height + marginTop + marginBottom);

        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCanvas.width = 128;
        croppedCanvas.height = 128;

        croppedCtx?.drawImage(
          canvas,
          newX, newY, newWidth, newHeight,
          0, 0, 128, 128
        );

        const croppedDataUrl = croppedCanvas.toDataURL('image/jpeg');
        localStorage.setItem('capturedFace', croppedDataUrl);
      }


      // 顔検出できたらシャッター
      setShowShutter(true)
      setTimeout(() => setShowShutter(false), 300)

      // カメラストップ
      if (video.srcObject) {
        const currentStream = video.srcObject as MediaStream
        currentStream.getTracks().forEach(track => track.stop())
      }

      setCaptured(true)

      const currentMode = localStorage.getItem('mode')

      // 🔥 ここで分岐
      if (currentMode === 'local') {
        console.log("ローカルモード：ローカル結果へ遷移");
        setTimeout(() => {
          router.push('/result');
        }, 1000);
      } else if (currentMode === 'backend') {
        console.log("バックエンドモード：サーバーに送信");
        sendToBackend(canvas.toDataURL('image/jpeg'), router);
      } else {
        alert('モードが選択されていません');
      }
    }
  }

  // const sendToBackend = async (dataUrl: string) => {
  //   const blob = await (await fetch(dataUrl)).blob()
  //   const formData = new FormData()
  //   formData.append("file", blob, "photo.jpg")

  //   try {
  //     const token = localStorage.getItem("token")

  //     const res = await fetch("https://branding-ngrok-app.jp.ngrok.io/upload", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`, // ← ここはバッククオート！
  //       },
  //       body: formData,
  //     })

  //     if (!res.ok) {
  //       const clonedResponse = res.clone()
  //       const errorData = await clonedResponse.json()
  //       console.error("送信失敗:", errorData)
  //       alert(`送信失敗: ${errorData.detail || "不明なエラー"}`)
  //       return
  //     }

  //     const result = await res.json()
  //     console.log("サーバーからのレスポンス:", result)

  //     localStorage.setItem("transaction_id", result.transaction_id)
  //     router.push(`/result?transaction_id=${result.transaction_id}`)
  //   } catch (error) {
  //     console.error("通信エラー:", error)
  //     alert("通信エラーが発生しました")
  //   }
  // }

  const sendToBackend = async (dataUrl: string, router: ReturnType<typeof useRouter>) => {
    const blob = await (await fetch(dataUrl)).blob();
    const formData = new FormData();
    formData.append("file", blob, "photo.jpg");
  
    try {
      let token = localStorage.getItem("token");
  
      // 🔥 もしトークンがなかったら、9999guestでログインして取得する
      if (!token) {
        console.log("未ログインのためゲストログインを開始します");
  
        const loginRes = await fetch("https://branding-ngrok-app.jp.ngrok.io/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: "9999guest",
            password: "9999",
          }),
        });
  
        if (!loginRes.ok) {
          const errorData = await loginRes.json();
          console.error("ゲストログイン失敗:", errorData);
          alert(`ゲストログイン失敗: ${errorData.detail || "不明なエラー"}`);
          return;
        }
  
        const loginData = await loginRes.json();
        token = loginData.access_token;
        localStorage.setItem("token", token || "");// 🔥 トークン保存
        localStorage.setItem("username", "9999guest");
        window.dispatchEvent(new Event("authChanged")); // オプション: 認証更新イベント
      }
  
      // 🔥 ここから画像アップロード
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      };
  
      const res = await fetch("https://branding-ngrok-app.jp.ngrok.io/upload", {
        method: "POST",
        headers,
        body: formData,
      });
  
      if (!res.ok) {
        const clonedResponse = res.clone();
        const errorData = await clonedResponse.json();
        console.error("送信失敗:", errorData);
        alert(`送信失敗: ${errorData.detail || "不明なエラー"}`);
        return;
      }
  
      const result = await res.json();
      console.log("サーバーからのレスポンス:", result);
  
      localStorage.setItem("transaction_id", result.transaction_id);
      router.push(`/result?transaction_id=${result.transaction_id}`);
    } catch (error) {
      console.error("通信エラー:", error);
      alert("通信エラーが発生しました");
    }
  };
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`flex flex-col items-center p-6 pt-24 pb-24 bg-gray-100 min-h-screen relative ${notoSansJP.className}`}
    >
      {/* タイトル */}
      <div className="flex flex-col items-center text-center space-y-4 w-full max-w-md mb-4">
        <h2 className={`${inter.className} text-5xl italic tracking-tight leading-tight text-gray-800 border-b-2 border-gray-300 pb-1`}>
          FACE GAUGE
        </h2>
      </div>

      <p className="text-base text-gray-800 text-center mb-2">
        画面の中にあなたの顔を入れてください<br />カウントダウンのあと自動で撮影します
      </p>

      <div className="relative w-full max-w-md">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded shadow"
          style={{ objectFit: "contain" }}
        />

        {isCountingDown && countdown !== null && (
          <motion.div
            key={countdown}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl font-bold text-white z-10"
          >
            {countdown}
          </motion.div>
        )}
      </div>

      {/* シャッターエフェクト */}
      {showShutter && (
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-70 animate-fadeOut z-50"></div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* 下部ナビゲーションバー */}
      <div className="fixed bottom-0 w-full flex bg-white shadow-inner h-20 z-50">
        <div className="w-1/3 flex items-center justify-center border-r border-gray-300">
          <Link href="/">
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
