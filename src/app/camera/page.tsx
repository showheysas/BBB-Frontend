'use client'

import { useEffect, useState, useRef } from "react"
import { nets, detectAllFaces, TinyFaceDetectorOptions } from "face-api.js"
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
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [showShutter, setShowShutter] = useState(false)
  const [captured, setCaptured] = useState(false) // ✅ 撮影完了したかどうか
  const router = useRouter()

  useEffect(() => {
    const startCamera = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
      }
    }

    const loadModels = async () => {
      await nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector")
    }

    loadModels()
    startCamera()
    detectFace()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const detectFace = async () => {
    if (!videoRef.current) return

    const interval = setInterval(async () => {
      const detections = await detectAllFaces(
        videoRef.current!,
        new TinyFaceDetectorOptions()
      )

      if (detections.length > 0 && !captured) {  // ✅ 撮影済みだったら反応しない
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

  const capturePhoto = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (canvas && video) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0)

      // ✅ シャッターエフェクト
      setShowShutter(true)
      setTimeout(() => setShowShutter(false), 300)

      // ✅ カメラOFFにする
      if (video && video.srcObject) {
        const currentStream = video.srcObject as MediaStream
        currentStream.getTracks().forEach(track => track.stop())
      }
      

      setCaptured(true) // ✅ 撮影済みに設定

      // ✅ 本来はサーバーに送信
      // sendToBackend(canvas.toDataURL("image/jpeg"))

      // ✅ 代わりにローカルで保存 → /result に遷移する
      setTimeout(() => {
        router.push('/result')
      }, 1000)
    }
  }

  // ✅ 元のバックエンド送信コード（コメントアウトして保存）
  /*
  const sendToBackend = async (dataUrl: string) => {
    const blob = await (await fetch(dataUrl)).blob()
    const formData = new FormData()
    formData.append("file", blob, "photo.jpg")

    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    })

    if (res.ok) {
      const result = await res.json()
      const filename = result.filename
      router.push(`/result?img=${filename}`)
    } else {
      alert("送信失敗")
    }
  }
  */

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`flex flex-col items-center p-6 pt-24 pb-24 bg-gray-100 min-h-screen relative ${notoSansJP.className}`}
    >
      {/* タイトル */}
      <div className="flex flex-col items-center text-center mb-8 space-y-4 w-full max-w-md">
        <h2 className={`${inter.className} text-5xl italic tracking-tight leading-tight text-gray-800 border-b-2 border-gray-300 pb-1`}>
          FACE GAUGE
        </h2>
      </div>

      <div className="relative w-full max-w-md">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded shadow"
          style={{ objectFit: "contain" }}
        />

        {/* カウントダウンは映像の中央に */}
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

      <p className="text-xl text-gray-800 text-center mt-8">画面の中にあなたの顔を入れてください<br />カウントダウンのあと自動で撮影します</p>

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
