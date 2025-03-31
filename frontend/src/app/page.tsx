'use client'

import { useRef, useState } from "react"

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageUrl, setImageUrl] = useState("")

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }

  const capturePhoto = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (canvas && video) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0)
      const dataUrl = canvas.toDataURL("image/jpeg")
      setImageUrl(dataUrl)
      sendToBackend(dataUrl)
    }
  }

  const sendToBackend = async (dataUrl: string) => {
    const blob = await (await fetch(dataUrl)).blob()
    const formData = new FormData()
    formData.append("file", blob, "photo.jpg")

    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    })

    const result = await res.json()
    alert(result.message)
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <video
        ref={videoRef}
        autoPlay
        className="w-full max-w-md rounded shadow"
        style={{ objectFit: "contain" }}  
      />
      <button onClick={startCamera} className="bg-blue-500 text-white px-4 py-2 rounded">📸 カメラ起動</button>
      <button onClick={capturePhoto} className="bg-green-500 text-white px-4 py-2 rounded">🖼 撮影して送信</button>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {imageUrl && <img src={imageUrl} className="mt-4 w-64" />}
    </div>
  )
}
