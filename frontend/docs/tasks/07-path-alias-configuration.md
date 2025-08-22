# タスク 07: tsconfig.json パスエイリアス設定

## 概要

新しいディレクトリ構造に対応した TypeScript パスエイリアスを設定し、インポート文の簡潔化を実現する。

## 目標

- 新しいディレクトリ構造への対応
- インポート文の簡潔化
- 開発効率の向上

## 作業内容

### 1. tsconfig.json の baseUrl と paths 設定

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/types/*": ["./src/types/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/constants/*": ["./src/utils/constants/*"]
    }
  }
}
```

### 2. Expo Metro 設定の更新（必要に応じて）

- `metro.config.js` でのパスエイリアス対応
- モジュール解決の設定

### 3. ESLint 設定の更新

- import/resolver の設定更新
- パスエイリアスの認識設定

### 4. 既存 import 文の一括更新

- 相対パスから絶対パスへの変更
- 新しいエイリアスを使用したインポート文への更新

### 5. VS Code 設定の最適化

- IntelliSense の改善
- パス補完の設定

## 成果物

- [ ] `tsconfig.json` の paths 設定更新
- [ ] `metro.config.js` の設定更新（必要に応じて）
- [ ] `eslint.config.js` の設定更新
- [ ] 全ファイルの import 文更新
- [ ] VS Code 設定の最適化

## 検証方法

- TypeScript コンパイルエラーがないことを確認
- VS Code でのパス補完が正しく動作することを確認
- `pnpm lint` が通ることを確認
- `pnpm dev` でアプリが正常に起動することを確認

## 依存関係

- 全ての移行タスク（タスク 01-06）完了後

## 見積もり時間

- 1-2 時間
