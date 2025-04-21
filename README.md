## BBB-Frontend

# FACE GAUGE - README

## 概要

FACE GAUGEは、カメラで顔を撮影し、顔の清潔感を3つの観点（スキンコンディション・トップフェイス・アンダーフェイス）からスコア化し、総合評価・アドバイス・おすすめ商品を提示するWebアプリです。ローカルでの簡易測定と、バックエンドサーバーと連携した精密測定の2モードに対応しています。

---

## 主な機能

- 顔検出と自動撮影（3秒カウントダウン）
- ローカルモードによる簡易スコア生成（ダミーデータ）
- バックエンドモードによる実測スコア取得（API連携）
- 各指標のレーダーチャート表示
- スコアに応じたコメントとおすすめ商品の提示
- 未ログイン・ゲストログイン・正式ログインの認証状態管理
- ナビゲーションバーでの画面移動や設定
- ログイン後のリダイレクト処理（状態保持）

---

## 認証状態と画面遷移の仕様

| 状態 | ステータス | 表示される内容 |
|------|------------|----------------|
| 未ログイン | トークンなし | レーダーチャートまで／ログイン案内 |
| ゲストログイン | `username = 9999guest` | レーダーチャートまで／ログイン案内 |
| 正式ログイン | トークン + `username ≠ 9999guest` | 全スコア表示＋コメント＋商品＋次のアクション |

---

## モード切替とリセット

- モードは`localStorage`に保存され、ページ遷移しても保持されます。
- ナビバーの「モードリセット」で`mode`、トークン、ユーザー名をすべて初期化し、トップページにリダイレクトされます。

---

## ディレクトリ構成（一部）




# FACE GAUGE

「FACE GAUGE」は、カメラで撮影した顔画像をもとにスコア化し、ユーザーにフィードバックとおすすめアイテムを提案するNext.js製のWebアプリです。
ローカルおよびバックエンド連携モードをサポートしており、モードに応じてダミーデータ表示または実データ取得が行えます。

こちらのバックエンドと接続します。
https://github.com/ShoheiKawakami196/Branding-Blends/tree/main?tab=readme-ov-file

📸 機能概要
顔を検出し自動撮影（face-api.js）

ローカル／バックエンドのモード切り替え

未ログインでも一部機能利用可能（ゲストモード）

トークン認証によるユーザー管理

測定スコアの可視化（Radarチャート）

最もスコアが低いパーツに応じたおすすめアイテムの提案

🔧 使用技術
フロントエンド: Next.js 14 (App Router), React, TypeScript, Tailwind CSS

画像認識: face-api.js（顔検出・切り出し）

認証方式: JWT（ローカルストレージに保存）

チャート描画: Recharts（RadarChart）

バックエンド連携: FastAPI（画像送信・スコア受信）

🚀 セットアップ手順
bash
コピーする
編集する
git clone https://github.com/yourname/face-gauge.git
cd face-gauge
npm install
npm run dev
📁 ディレクトリ構成（抜粋）
csharp
コピーする
編集する
src/
├── app/
│   ├── camera/         # 顔検出 → 撮影 → 保存
│   ├── result/         # スコア結果画面
│   ├── login/          # ログイン画面
│   ├── register/       # 新規登録画面
│   ├── settings/       # 開発用：モード切替など
│   └── layout.tsx      # 全体のレイアウト
├── components/
│   └── Navbar.tsx      # 共通ナビゲーションバー
├── lib/
│   └── mockData.ts     # ローカル用のダミーデータ
public/
├── models/             # face-api.js のモデル配置
🧪 ローカルモードとバックエンドモードの切り替え
/settings にてモード選択

ローカル：撮影後、ダミースコアを生成

バックエンド：撮影画像をAPIにPOST → スコアとコメントを取得

🔐 認証仕様
ローカルモードでは、ユーザー名 kiriyama / パスワード ren でログイン可能

バックエンドモードでは、実APIにログイン（例: shosan / 123）

未ログイン時にスコア測定を行うと、9999guest として自動ログインされます（バックエンドモード）

🧼 その他
Next.js推奨の <Image> を未使用の箇所があります（今後対応予定）

ESLintおよびTypeScriptのstrictルール対応中（開発ビルドは可能）

✅ 今後の改善ポイント
モバイル最適化の強化

スコア履歴の保存・比較機能

モード状態のContext化による一貫性保持

テスト実装（Jest / Playwrightなど）






This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
