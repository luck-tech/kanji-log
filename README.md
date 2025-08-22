# kanji-log プロジェクト

このリポジトリは、モバイルアプリとバックエンドサービスを含む統合プロジェクトです。

## プロジェクト構造

### 現在の構造

```
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
└── README.md                 // プロジェクト全体の概要（このファイル）

// 将来追加予定:
// ├── api/                   // API実装
// ├── aws/                   // AWS管理コード
// ├── backend/               // バックエンドロジック
// └── infrastructure/        // インフラ設定
```

### 大規模対応構造（将来の移行計画）

フロントエンドの成長に合わせて、以下の構造への段階的移行を計画：

```
kanji-log/
├── frontend/
│   ├── app/                  # expo-router（ルーティング専用）
│   ├── src/                  # メインソースコード
│   │   ├── components/       # 機能別コンポーネント管理
│   │   │   ├── common/       # 汎用UI（ui/layout/feedback）
│   │   │   ├── features/     # 機能別（event/member/restaurant/record）
│   │   │   └── pages/        # ページコンテナ
│   │   ├── hooks/            # グローバルフック（api/auth/common）
│   │   ├── services/         # API・外部サービス管理
│   │   ├── store/            # 状態管理（Zustand等）
│   │   ├── utils/            # ユーティリティ（validation/formatting/calculation）
│   │   └── types/            # 型定義統合（api/domain/common）
│   ├── assets/               # 静的リソース
│   └── package.json
├── api/                      # バックエンドAPI
├── aws/                      # AWS管理コード
├── backend/                  # ビジネスロジック
└── infrastructure/           # インフラ構成
```

#### 移行の利点

- **責任分離**: ルーティング（app/）とロジック（src/）の明確な分離
- **機能別組織化**: イベント、メンバー、レストラン等の機能別管理
- **スケーラビリティ**: 大規模チーム開発に対応
- **保守性**: 変更影響範囲の限定化
- **テスタビリティ**: ビジネスロジックと UI の分離

## 各ディレクトリの説明

### frontend/

モバイルアプリ（React Native + Expo）の実装です。

- 詳細な技術仕様は [`frontend/README.md`](./frontend/README.md) を参照
- StyleSheet ベースのスタイリング
- React Native Reanimated によるネイティブアニメーション
- expo-router によるファイルベースルーティング

### 将来追加予定のディレクトリ

- **api/**: REST API または GraphQL API の実装
- **aws/**: AWS Lambda、API Gateway、DynamoDB 等の管理コード
- **backend/**: ビジネスロジック、データ処理
- **infrastructure/**: Terraform、CloudFormation 等のインフラ構成

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
- **StyleSheet**: React Native 標準スタイリング
- **React Native Reanimated**: ネイティブアニメーション
- **expo-router**: 5.0（ファイルベースルーティング）

### バックエンド（将来予定）

- **AWS Lambda**: サーバーレス関数
- **API Gateway**: RESTful API
- **DynamoDB**: NoSQL データベース
- **S3**: 画像・ファイルストレージ

## プロジェクト目標

1. **フロントエンド**: ユーザーフレンドリーなモバイルアプリ
2. **バックエンド**: スケーラブルな API とデータ管理
3. **インフラ**: 自動化されたデプロイメントと監視
4. **保守性**: 明確な責任分離と再利用可能なコード

## ライセンス

Private Project
