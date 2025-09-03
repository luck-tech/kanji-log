# kanji-log プロジェクト

「kanji-log」は、イベントの幹事が参加者管理や店舗選定を簡単に行うためのモバイルアプリと、参加者が Web フォーム経由で手軽に出欠回答できるサービスを提供する統合プロジェクトです。

## ✨ 技術スタック

| カテゴリ              | 主要技術                                                |
| :-------------------- | :------------------------------------------------------ |
| 📱 **フロントエンド** | React Native, Expo, TypeScript, expo-router             |
| 🧠 **バックエンド**   | Go (Golang), AWS Lambda, API Gateway, DynamoDB, Cognito |
| 🏛️ **インフラ (IaC)** | Terraform, AWS IAM, AWS WAF                             |
| 🚀 **CI/CD**          | GitHub Actions                                          |

---

## 📂 プロジェクト構造

```
kanji-log/
├── .github/                  // CI/CDワークフロー (GitHub Actions)
│   └── workflows/
├── backend/                  // 🧠 サーバーサイド（Go）
│   ├── cmd/                  // Lambda関数ごとのエントリーポイント(main.go)
│   ├── internal/             // プロジェクト固有のビジネスロジック
│   ├── go.mod                // Goモジュール定義
│   └── go.sum
├── frontend/                 // 📱 モバイルアプリ（React Native）
│   ├── app/                  // expo-router画面定義
│   └── (他、フロントエンド関連ファイル)
├── iac/                      // 🏛️ インフラ管理 (Terraform)
│   ├── environments/         // 環境ごとの設定 (dev, prd)
│   ├── modules/              // 再利用可能なインフラ定義
│   └── main.tf
└── README.md                 // プロジェクト全体の概要（このファイル）
```

---

## 🗺️ 各ディレクトリの説明

### 📱 `frontend/`

幹事用のモバイルアプリ（React Native + Expo）の実装です。ファイルベースルーティングによる画面管理と、クリーンな UI コンポーネントの設計を特徴とします。

- **詳細:** [`frontend/README.md`](https://www.google.com/search?q=./frontend/README.md) を参照してください。

### 🧠 `backend/`

Go 言語で実装されたサーバーレスバックエンドです。各 Lambda 関数は独立したエントリーポイント（`cmd/api/*`）を持ち、ビジネスロジックは`internal/`に集約されています。

- **責務:** API ロジック、DynamoDB とのデータ連携、外部 API（Google Maps 等）の呼び出し。

### 🏛️ `iac/`

Terraform で記述されたインフラストラクチャのコードです。AWS リソース（API Gateway, Lambda, DynamoDB, Cognito 等）のプロビジョニングを自動化します。

- **特徴:** 環境（dev/prd）ごとの設定を分離し、再利用可能なモジュールで構成されています。

### 🚀 `.github/`

CI/CD パイプラインの定義ファイルです。GitHub Actions を利用し、`backend`と`iac`のテストとデプロイを自動化します。

---

## 🚀 開発開始方法

### 必要ツール

- Node.js (pnpm)
- Go
- Terraform
- AWS CLI

### セットアップと実行

1.  **📱 フロントエンド**

    ```bash
    cd frontend
    pnpm install
    pnpm dev
    ```

2.  **🧠 バックエンド**

    ```bash
    cd backend
    go mod tidy # 依存関係をインストール

    # 例: create-event関数をローカルで実行する場合
    cd cmd/api/create-event
    go run .
    ```

3.  **🏛️ インフラ (IaC)**

    ```bash
    cd iac
    terraform init
    terraform plan  # 変更内容を確認
    terraform apply # 変更を適用
    ```

---

## 🎯 プロジェクト目標

1.  **幹事の体験向上:** イベント管理の手間を削減する、直感的で使いやすいモバイルアプリを提供する。
2.  **参加者の手軽さ:** アカウント登録不要で、数タップで完了するシンプルな回答フローを実現する。
3.  **スケーラブルなバックエンド:** サーバーレスアーキテクチャにより、イベントの規模に応じて柔軟にスケールする API を構築する。
4.  **自動化されたインフラ:** IaC と CI/CD を導入し、信頼性が高く、再現性のあるデプロイプロセスを確立する。
