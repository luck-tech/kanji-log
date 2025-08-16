# kanji-log プロジェクト

このリポジトリは、モバイルアプリとバックエンドサービスを含む統合プロジェクトです。

## プロジェクト構造

```
kanji-log/                    // プロジェクトルート
├── frontend/                 // モバイルアプリ（フロントエンド）
│   ├── app/                  // expo-router画面定義
│   ├── components/           // UIコンポーネント
│   ├── constants/            // デザイン定数
│   ├── hooks/                // カスタムフック
│   ├── types/                // 型定義
│   ├── assets/               // アセット
│   ├── package.json          // フロントエンド依存関係
│   ├── app.json              // Expo設定
│   ├── babel.config.js       // Babel設定
│   ├── metro.config.js       // Metro設定
│   ├── tailwind.config.js    // TailwindCSS設定
│   ├── tsconfig.json         // TypeScript設定
│   ├── .gitignore            // Git除外設定
│   ├── .npmrc                // npm設定
│   ├── .prettierrc           // Prettier設定
│   └── README.md             // フロントエンド詳細ドキュメント
└── README.md                 // プロジェクト全体の概要（このファイル）

// 将来追加予定:
// ├── api/                   // API実装
// ├── aws/                   // AWS管理コード
// ├── backend/               // バックエンドロジック
// └── infrastructure/        // インフラ設定
```

## 各ディレクトリの説明

### frontend/
モバイルアプリ（React Native + Expo）の実装です。
- 詳細な技術仕様は [`frontend/README.md`](./frontend/README.md) を参照
- NativeWind v4 (TailwindCSS for React Native) を使用
- expo-router によるファイルベースルーティング

### 将来追加予定のディレクトリ
- **api/**: REST API または GraphQL API の実装
- **aws/**: AWS Lambda、API Gateway、DynamoDB等の管理コード
- **backend/**: ビジネスロジック、データ処理
- **infrastructure/**: Terraform、CloudFormation等のインフラ構成

## 開発開始方法

### フロントエンド開発
```bash
cd frontend
pnpm install
pnpm dev
```

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
- **NativeWind**: 4.1（TailwindCSS for React Native）
- **expo-router**: 5.0（ファイルベースルーティング）

### バックエンド（将来予定）
- **AWS Lambda**: サーバーレス関数
- **API Gateway**: RESTful API
- **DynamoDB**: NoSQLデータベース
- **S3**: 画像・ファイルストレージ

## プロジェクト目標

1. **フロントエンド**: ユーザーフレンドリーなモバイルアプリ
2. **バックエンド**: スケーラブルなAPIとデータ管理
3. **インフラ**: 自動化されたデプロイメントと監視
4. **保守性**: 明確な責任分離と再利用可能なコード

## ライセンス

Private Project