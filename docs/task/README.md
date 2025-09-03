# タスク管理概要

幹事ナビバックエンド開発のタスクチケット管理です。

## 📋 タスク一覧

### Phase 1: 基盤構築

- [Task-001: 最小限のインフラ基盤構築 (IaC)](./task-001.md) - 1 日
- [Task-002: Hello World Lambda 実装 (Backend)](./task-002.md) - 0.5 日
- [Task-003: イベント作成 API 実装](./task-003.md) - 1.5 日

### Phase 2: コア機能

- [Task-004: イベント取得 API 実装](./task-004.md) - 1 日
- [Task-005: 認証基盤構築 (Cognito)](./task-005.md) - 1.5 日
- [Task-006: CI/CD パイプライン構築](./task-006.md) - 1 日

### Phase 3: 高度な機能

- [Task-007: フォーム機能実装](./task-007.md) - 2 日
- [Task-008: 日程調整機能実装](./task-008.md) - 2 日
- [Task-009: 外部 API 連携実装](./task-009.md) - 2.5 日
- [Task-010: 記録管理機能実装](./task-010.md) - 2 日

### Phase 4: 本番対応

- [Task-011: 本番環境向けセキュリティ堅牢化](./task-011.md) - 0.5 日

## 📊 開発スケジュール概算

```
Week 1: Task-001 → Task-002 → Task-003
Week 2: Task-004 → Task-005 → Task-006
Week 3: Task-007 → Task-008
Week 4: Task-009 → Task-010 → Task-011
```

**Total**: 約 4.5 週間（1 人フルタイムの場合）

## 🎯 成功の指標

- [ ] 全 API エンドポイントが仕様書通りに動作
- [ ] フロントエンドとの結合テストが成功
- [ ] 本番環境でのパフォーマンステスト通過
- [ ] **セキュリティ監査通過**

## ⚠️ リスク・注意事項

1. **外部 API 制限**: Google Maps/ホットペッパー API の利用制限に注意
2. **コスト管理**: DynamoDB の使用量監視を実装
3. **セキュリティ**: Cognito 設定と IAM 権限の適切な設定
4. **パフォーマンス**: Lambda Cold Start 対策の検討

## 📚 参考資料

- [AWS Lambda Go Programming Model](https://docs.aws.amazon.com/lambda/latest/dg/lambda-golang.html)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [API Gateway + Lambda Integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started-with-lambda-integration.html)
