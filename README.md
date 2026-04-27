# Chatapp

> LINEのような1対1チャットアプリケーション。

## 🌐 Live Demo

こちらから実際にアプリを体験可能です：
**[ブラウザで開く](https://junnosukehirayama.github.io/Chat-api/)**

> **Note:** Renderの無料プランを利用しているため、最初のアクセス時にサーバーの起動（スリープ解除）に30秒〜1分ほど時間がかかる場合があります。

## Visuals

<img src="https://via.placeholder.com/600x400?text=NexChat+UI+Demo" width="600">

## Overview

本プロジェクトは**NestJS** と、双方向リアルタイム通信を実現する **Socket.io** を組み合わせたチャットシステムです。

モダンなメッセージングアプリに不可欠な **「ログインシステム」**、**「1対1のプライベートトーク」** 、**「IDによる友達追加システム」** を技術的目標として開発しました。

## Tech Stack

* **Backend:** NestJS (Node.js framework)
* **Real-time Communication:** Socket.io (WebSockets)
* **Database & BaaS:** Supabase (PostgreSQL)
* **ORM:** Prisma
* **Authentication:** JWT (JSON Web Token)
* **Frontend:** HTML5 / Tailwind CSS / Vanilla JavaScript
* **Development Tools:** Cursor (AI-integrated IDE) / Postman

## Key Features & Technical Highlights

### 1. Socket.io "Room" 機能を活用したプライベート通信
* 全ユーザーにメッセージを放送（Broadcast）するのではなく、ユーザー接続時に自身の `userId` をルーム名とした **Private Room** に自動参加させるアーキテクチャを採用。
* メッセージ送信時に `recipientId`（宛先ID）を指定することで、サーバー側で特定のルームにのみパケットを射出する形で1対1通信を実現しました。

### 2. Prismaによる柔軟なリレーション設計とデータ遷移
* `Message` モデルに `senderId` と `recipientId` の2つのリレーションを定義。
* Prismaのマイグレーション（`db push --force-reset`）を活用し、1対1チャットのためのデータベース構造を構成しました。

### 3. JWTを基盤としたエンドツーエンドの認証セキュリティ
* WebSocketの接続確立（Handshake）時や各イベント発火時に、JWTトークンによるユーザー検証を徹底。

### 4. クリーンで直感的な「LINE風」UI/UX
* **友達一覧画面:** ID入力によるユーザー検索・追加機能。`localStorage` を活用した簡易的な友達リスト管理。
* **トーク画面:** 自分の発言（右側・青）と相手の発言（左側・白）を視覚的に分離した、チャットアプリ特有の吹き出しUIを Tailwind CSS で構築。
* **履歴取得:** トークルーム入室時に、特定の2者間の会話ログのみをDBから抽出（`findMany` と `OR` 条件の組み合わせ）して表示。

### 5. Supabase (PostgreSQL) による堅牢なデータ基盤
* データベースには **Supabase** を採用し、 PostgreSQL 環境を構築。
* Prisma ORM と組み合わせることで、型の安全性（Type Safety）を担保しました。

## Installation & Usage (実行方法)

### バックエンドのセットアップ

1.  依存関係のインストール:
    ```bash
    npm install
    ```
2.  `.env` ファイルに環境変数を設定（DATABASE_URL, JWT_SECRETなど）。
3.  データベースのセットアップ:
    ```bash
    npx prisma generate
    npx prisma db push
    ```
4.  サーバーの起動:
    ```bash
    npm run start:dev
    ```

### フロントエンドの実行

1.  `index.html` 内の `API_URL` を環境に合わせて設定。
2.  ブラウザで `index.html` を開き、複数のアカウントを作成して1対1チャットをテスト。

## 未来の展望 (Roadmap)
- [ ] データベースへの「友達関係」テーブルの実装（永続化）。
- [ ] 画像・ファイルの添付機能。
- [ ] Socket.ioによるリアルタイムな「既読」・「オンライン状態」の表示機能。
