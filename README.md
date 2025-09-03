# kanji-log プロジェクト

このリポジトリは、モバイルアプリとバックエンドサービスを含む統合プロジェクトです。

## プロジェクト構造

````
kanji-log/                    // プロジェクトルート
├── frontend/                 // モバイルアプリ（フロントエンド）
│   ├── app/                  // expo-router画面定義（ルーティング専用）
│   ├── components/           // UIコンポーネント
│   │   ├── common/          // 汎用UIコンポーネント
│   │   └── modals/          # モーダルコンポーネント
│   ├── constants/            // デザイン定数・設定
│   ├── hooks/                // カスタムフック
│   ├── types/                // 型定義
│   ├── assets/               // アセット
│   ├── package.json          // フロントエンド依存関係
│   ├── app.json              // Expo設定
│   ├── tsconfig.json         // TypeScript設定
│   └── README.md             // フロントエンド詳細ドキュメント
├── backend/                  // 🧠 サーバーサイド（Go）
│   ├── cmd/                  // 実行可能なアプリケーションのエントリーポイント
│   │   ├── api/              // Lambda関数ごとのmain.goを格納
│   │   │   ├── create-event/
│   │   │   └── get-event/
│   │   └── batch/            // バッチ処理用のmain.go
│   ├── internal/             // 内部パッケージ（プロジェクト固有のロジック）
│   │   ├── domain/           // ドメインモデル（Event, Userなど）
│   │   ├── handler/          // Lambdaのハンドラーロジック
│   │   ├── repository/       // データストア（DynamoDB）とのやり取り
│   │   └── config/           // 設定管理
│   ├── pkg/                  // 外部公開可能な汎用ライブラリ（今回は基本使わない）
│   ├── go.mod                // Goモジュール定義
│   ├── go.sum                // 依存関係のチェックサム
├── iac/                      // 🏛️ インフラ管理 (IaC)
│   ├── environments/         // 環境ごとの設定
│   │   ├── dev/
│   │   └── prd/
│   ├── modules/              // 再利用可能なインフラコンポーネント
│   │   ├── api_gateway/
│   │   ├── cognito/
│   │   └── lambda/
│   ├── main.tf               // (例: Terraformの場合のルート定義)
├── .github/                  // CI/CDワークフロー (GitHub Actions)
│   └── workflows/
│       ├── deploy-backend.yml
│       ├── deploy-iac.yml
├── README.md
```

## 各ディレクトリの説明

### frontend/

モバイルアプリ（React Native + Expo）の実装です。

- 詳細な技術仕様は [`frontend/README.md`](./frontend/README.md) を参照
- StyleSheet ベースのスタイリング
- React Native Reanimated によるネイティブアニメーション
- expo-router によるファイルベースルーティング

## 開発開始方法

### フロントエンド開発

```bash
cd frontend
pnpm install
pnpm dev
````

### 全体のセットアップ（将来）

```bash
# フロントエンド
cd frontend && pnpm install

# バックエンド（将来）
cd api && npm install

# インフラ（将来）
cd infrastructure && terraform init
```

## 技術スタック

### フロントエンド

- **React Native**: 0.79
- **Expo**: 53
- **TypeScript**: 5.8
- **StyleSheet**: React Native 標準スタイリング
- **React Native Reanimated**: ネイティブアニメーション
- **expo-router**: 5.0（ファイルベースルーティング）

### バックエンド

- **AWS Lambda**: サーバーレス関数
- **API Gateway**: RESTful API
- **DynamoDB**: NoSQL データベース
- **S3**: 画像・ファイルストレージ

## プロジェクト目標

1. **フロントエンド**: ユーザーフレンドリーなモバイルアプリ
2. **バックエンド**: スケーラブルな API とデータ管理
3. **インフラ**: 自動化されたデプロイメントと監視
4. **保守性**: 明確な責任分離と再利用可能なコード
