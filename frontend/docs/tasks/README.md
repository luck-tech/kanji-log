# ディレクトリ構造移行タスク一覧

## 概要

既存のディレクトリ構造を新しいスケーラブルな構造に移行するためのタスク一覧です。
依存関係を考慮した順序で実行してください。

## タスク実行順序

### Phase 1: 基盤整備

1. **[01-types-foundation.md](./01-types-foundation.md)** - 型定義基盤の整備

   - 見積もり: 4-6 時間（modal 関連 interface 移行含む）
   - 依存: なし

2. **[02-constants-migration.md](./02-constants-migration.md)** - 定数・ユーティリティの移行
   - 見積もり: 2-3 時間
   - 依存: タスク 01

### Phase 2: コンポーネント移行

3. **[03-common-components-migration.md](./03-common-components-migration.md)** - 共通 UI コンポーネントの移行

   - 見積もり: 3-4 時間
   - 依存: タスク 01, 02

4. **[04-hooks-migration.md](./04-hooks-migration.md)** - カスタムフックの移行・整備
   - 見積もり: 1-2 時間
   - 依存: タスク 01

### Phase 3: 機能別整備

5. **[05-feature-components-foundation.md](./05-feature-components-foundation.md)** - 機能別コンポーネント基盤の整備（総合タスク）

   #### Phase 3A: Event Domain（6 サブタスク）

   - **[05a-event-list.md](./05a-event-list.md)** - イベント一覧コンポーネント（1-1.5 時間）
   - **[05b-event-detail.md](./05b-event-detail.md)** - イベント詳細コンポーネント（1-1.5 時間）
   - **[05c-event-form-setup.md](./05c-event-form-setup.md)** - フォーム設定コンポーネント（1-1.5 時間）
   - **[05d-event-schedule-results.md](./05d-event-schedule-results.md)** - 日程調整結果コンポーネント（1-1.5 時間）
   - **[05e-event-restaurant-suggestions.md](./05e-event-restaurant-suggestions.md)** - レストラン提案コンポーネント（1-1.5 時間）
   - **[05f-event-reservation-support.md](./05f-event-reservation-support.md)** - 予約サポートコンポーネント（1-1.5 時間）

   #### Phase 3B: Other Domains（3 サブタスク）

   - **[05g-member-components.md](./05g-member-components.md)** - メンバー関連コンポーネント（1.5-2 時間）
   - **[05h-record-components.md](./05h-record-components.md)** - 記録関連コンポーネント（1-1.5 時間）
   - **[05i-settings-components.md](./05i-settings-components.md)** - 設定関連コンポーネント（1-1.5 時間）

   #### Phase 3C: 統合（1 サブタスク）

   - **[05j-features-integration.md](./05j-features-integration.md)** - バレルエクスポート統合（0.5-1 時間）

   **Phase 3 合計見積もり**: 10-15 時間

6. **[06-modal-components-integration.md](./06-modal-components-integration.md)** - モーダルコンポーネントの機能別統合
   - 見積もり: 3-4 時間
   - 依存: タスク 01, 02, 03, 05

### Phase 4: 最終調整

7. **[07-path-alias-configuration.md](./07-path-alias-configuration.md)** - tsconfig.json パスエイリアス設定

   - 見積もり: 1-2 時間
   - 依存: タスク 01-06 すべて

8. **[08-cleanup-old-directories.md](./08-cleanup-old-directories.md)** - 旧ディレクトリの削除とクリーンアップ
   - 見積もり: 1-2 時間
   - 依存: タスク 01-07 すべて

## 総見積もり時間

**合計: 23-33 時間**

- Phase 1: 6-9 時間
- Phase 2: 4-6 時間
- Phase 3: 10-15 時間（サブタスク分割により管理性向上）
- Phase 4: 2-4 時間

## サブタスク実行戦略

### Phase 3 での並行実行

- **Phase 3A（Event Domain）**: 6 つのサブタスクは独立して実行可能
- **Phase 3B（Other Domains）**: 3 つのサブタスクは独立して実行可能
- **Phase 3C（統合）**: Phase 3A・3B 完了後に実行

### 推奨実行順序

1. **順次実行**: 1 名での作業の場合、05a → 05b → ... → 05j
2. **並行実行**: 複数名での作業の場合、ドメイン単位で分担可能
   - 担当者 A: Event Domain（05a-05f）
   - 担当者 B: Other Domains（05g-05i）
   - 合流: 統合作業（05j）

## 実行前の準備

- [ ] 現在の作業をコミット
- [ ] 新しいブランチ作成（例: `feature/directory-restructure`）
- [ ] バックアップの確認

## フェーズごとの確認項目

### Phase 1 完了時

- [ ] 新しい型定義が正しく機能している
- [ ] modal 関連 interface が適切に機能別配置されている
- [ ] 定数が正しく移行されている
- [ ] TypeScript エラーがない
- [ ] Lint が通る

### Phase 2 完了時

- [ ] 共通コンポーネントが正しく動作している
- [ ] フックが正しく移行されている
- [ ] アプリが正常に起動する

### Phase 3 完了時

#### サブタスク完了時の確認

- [ ] 各サブタスクで TypeScript コンパイルエラーがない
- [ ] 該当画面での新コンポーネント使用テスト完了
- [ ] バレルエクスポートが正しく機能している

#### Phase 3 全体完了時の確認

- [ ] 全機能別コンポーネントが作成されている
- [ ] ドメイン間の依存関係が適切に管理されている
- [ ] 全画面が正常に動作する

### Phase 4 完了時

- [ ] モーダルが正しく動作している
- [ ] パスエイリアスが正しく設定されている
- [ ] 旧ディレクトリが削除されている
- [ ] ドキュメントが更新されている
- [ ] 最終テストが完了している

## 注意事項

- 各タスク・サブタスク完了後は必ずコミットする
- Phase 3 では小さな単位（サブタスク）での確認を徹底する
- エラーが発生した場合は前のタスクに戻って確認
- 大きな変更のため、段階的な確認を心がける

## トラブルシューティング

問題が発生した場合は以下を確認:

1. TypeScript コンパイルエラーの確認
2. import 文のパスが正しいか確認
3. バレルエクスポートが正しく設定されているか確認
4. 型定義が正しく適用されているか確認
5. **サブタスク間の依存関係が正しく管理されているか確認**（Phase 3）

## Phase 3 サブタスク実行チェックリスト

- [ ] 05a: イベント一覧コンポーネント
- [ ] 05b: イベント詳細コンポーネント
- [ ] 05c: フォーム設定コンポーネント
- [ ] 05d: 日程調整結果コンポーネント
- [ ] 05e: レストラン提案コンポーネント
- [ ] 05f: 予約サポートコンポーネント
- [ ] 05g: メンバー関連コンポーネント
- [ ] 05h: 記録関連コンポーネント
- [ ] 05i: 設定関連コンポーネント
- [ ] 05j: バレルエクスポート統合
