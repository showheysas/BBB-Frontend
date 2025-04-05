// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';  // ✅ 共通ナビバーを読み込み

// フォント読み込み
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
});

// メタデータ設定
export const metadata: Metadata = {
  title: "Face Gauge",
  description: "Face Score App",
};

// ルートレイアウト
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
      >
        <Navbar /> {/* ✅ すべてのページに共通ナビゲーションバー */}
        {children}
      </body>
    </html>
  );
}
