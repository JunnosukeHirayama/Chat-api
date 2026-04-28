# Chatapp

> LINEのような1対1チャットアプリケーション。

## 🌐 Live Demo

こちらから実際にアプリを体験可能です：
**[ブラウザで開く](https://junnosukehirayama.github.io/Chat-api/)**

> **Note:** Renderの無料プランを利用しているため、最初のアクセス時にサーバーの起動（スリープ解除）に30秒〜1分ほど時間がかかる場合があります。

## Visuals

<img src="Images\214241.png" width="500">   <img src="Images\214300.png" width="500">
<img src="Images\214323.png" width="500">
<img src="Images\214337.png" width="500">

## Overview

本プロジェクトは**NestJS** と、双方向リアルタイム通信を実現する **Socket.io** を組み合わせたチャットシステムです。

モダンなメッセージングアプリに不可欠な **「ログインシステム」**、**「1対1のプライベートトーク」** 、**「IDによる友達追加システム」** を技術的目標として開発しました。

## Tech Stack

* **Backend:** NestJS (Node.js framework)
* **Real-time Communication:** Socket.io (WebSockets)
* **Database & BaaS:** Supabase (PostgreSQL)
* **ORM:** Prisma
* **Authentication:** JWT
* **Frontend:** HTML5 / Tailwind CSS / JavaScript
* **Development Tools:** Cursor

## Key Features & Technical Highlights

### 1. Socket.io "Room" 機能を活用したプライベート通信
* 全ユーザーにメッセージを放送（Broadcast）するのではなく、ユーザー接続時に自身の `userId` をルーム名とした **Private Room** に自動参加させるアーキテクチャを採用。
* メッセージ送信時に `recipientId`（宛先ID）を指定することで、サーバー側で特定のルームにのみパケットを射出する形で1対1通信を実現しました。

### 2. Prismaによる柔軟なリレーション設計とデータ遷移
* `Message` モデルに `senderId` と `recipientId` の2つのリレーションを定義。

### 3. JWTを基盤としたエンドツーエンドの認証セキュリティ
* WebSocketの接続確立（Handshake）時や各イベント発火時に、JWTトークンによるユーザー検証を徹底。
### 4. Supabase (PostgreSQL) によるデータ基盤
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
