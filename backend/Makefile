# 幹事ナビ バックエンド開発用 Makefile
# プロジェクト: 幹事ナビ（Kanji Navi）
# 作成日: 2025年9月4日
# 
# 使用例:
#   make build lambda=hello
#   make deploy
#   make dev-deploy lambda=hello
#   make clean

.PHONY: help init build deploy deploy-auto test clean list-functions dev-deploy test-api update-deps

# デフォルトターゲット: ヘルプを表示
help:
	@echo "🍵 幹事ナビ バックエンド開発コマンド"
	@echo ""
	@echo "📖 使用方法:"
	@echo "  make build lambda=<function-name>  # Lambda関数をビルド"
	@echo "  make deploy                        # Terraformでデプロイ（確認あり）"
	@echo "  make deploy-auto                   # Terraformで自動デプロイ（確認なし）"
	@echo "  make dev-deploy lambda=<function>  # ビルド + 自動デプロイ"
	@echo "  make test                          # テスト実行"
	@echo "  make test-api                      # API動作確認"
	@echo "  make clean                         # ビルド成果物を削除"
	@echo "  make list-functions                # 利用可能な関数一覧"
	@echo "  make init                          # Go依存関係の初期化"
	@echo "  make update-deps                   # 依存関係の更新"
	@echo ""
	@echo "💡 例:"
	@echo "  make build lambda=hello"
	@echo "  make build lambda=create-event"
	@echo "  make dev-deploy lambda=hello"

# Go依存関係の初期化
init:
	@echo "🔧 Go依存関係を初期化中..."
	@go mod tidy
	@echo "✅ 初期化完了"

# Lambda関数のビルド
build:
ifndef lambda
	@echo "❌ エラー: lambda パラメータが必要です"
	@echo "使用例: make build lambda=hello"
	@echo ""
	@make list-functions
	@exit 1
endif
	@echo "🏗️  Lambda関数をビルド中: $(lambda)"
	@./scripts/build.sh $(lambda)
	@echo "✅ ビルド完了: $(lambda)-lambda.zip"

# Terraformデプロイ（確認あり）
deploy:
	@echo "🚀 Terraformでデプロイ中..."
	@echo "📋 変更内容を確認します..."
	@cd ../iac/environments/dev && terraform plan -out=tfplan
	@echo ""
	@echo "❓ 上記の変更内容でデプロイしますか? [y/N]: "; \
	read -r answer; \
	if [ "$$answer" = "y" ] || [ "$$answer" = "Y" ]; then \
		cd ../iac/environments/dev && terraform apply tfplan && \
		echo "✅ デプロイ完了"; \
	else \
		echo "❌ デプロイをキャンセルしました"; \
		cd ../iac/environments/dev && rm -f tfplan; \
	fi

# 自動デプロイ（確認なし）
deploy-auto:
	@echo "🚀 Terraformで自動デプロイ中..."
	@cd ../iac/environments/dev && terraform apply -auto-approve
	@echo "✅ 自動デプロイ完了"

# テスト実行
test:
	@echo "🧪 テスト実行中..."
	@go test ./... -v
	@echo "✅ テスト完了"

# ビルド成果物の削除
clean:
	@echo "🧹 ビルド成果物を削除中..."
	@rm -rf build/
	@rm -f *-lambda.zip
	@echo "✅ クリーンアップ完了"

# 利用可能な関数一覧
list-functions:
	@echo "📋 利用可能なLambda関数:"
	@if [ -d "cmd/api" ]; then \
		find cmd/api -name "main.go" -exec dirname {} \; | sed 's|cmd/api/||' | sort | sed 's/^/  - /'; \
	else \
		echo "  (cmd/api ディレクトリが見つかりません)"; \
	fi

# 開発用: ビルド + デプロイの一括実行
dev-deploy:
ifndef lambda
	@echo "❌ エラー: lambda パラメータが必要です"
	@echo "使用例: make dev-deploy lambda=hello"
	@echo ""
	@make list-functions
	@exit 1
endif
	@echo "🚀 開発デプロイ: $(lambda) をビルド + デプロイします"
	@make build lambda=$(lambda)
	@make deploy-auto

# API動作確認
test-api:
	@echo "🔍 Hello API動作確認中..."
	@if command -v jq >/dev/null 2>&1; then \
		curl -s https://sepimmk54m.execute-api.ap-northeast-1.amazonaws.com/dev/hello | jq .; \
	else \
		curl -s https://sepimmk54m.execute-api.ap-northeast-1.amazonaws.com/dev/hello; \
	fi
	@echo ""
	@echo "✅ API動作確認完了"

# 依存関係の更新
update-deps:
	@echo "📦 Go依存関係を更新中..."
	@go get -u ./...
	@go mod tidy
	@echo "✅ 依存関係更新完了"

# 開発情報表示
info:
	@echo "📊 プロジェクト情報:"
	@echo "  - Goバージョン: $$(go version)"
	@echo "  - プロジェクトパス: $$(pwd)"
	@echo "  - Git ブランチ: $$(git branch --show-current 2>/dev/null || echo 'Git未初期化')"
	@echo ""
	@make list-functions

# ログ確認（CloudWatch Logs）
logs:
ifndef lambda
	@echo "❌ エラー: lambda パラメータが必要です"
	@echo "使用例: make logs lambda=hello"
	@exit 1
endif
	@echo "📄 CloudWatch Logs を確認中: kanji-log-$(lambda)-dev"
	@aws logs tail /aws/lambda/kanji-log-$(lambda)-dev --follow
