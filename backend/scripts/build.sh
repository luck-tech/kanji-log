#!/bin/bash

# 汎用 Lambda デプロイ用 Go アプリケーションビルドスクリプト
#
# 使用方法:
#   ./scripts/build.sh <lambda-function-name>
#   例: ./scripts/build.sh hello
#       ./scripts/build.sh create-event
#
# このスクリプトの目的:
# 1. 指定されたLambda関数のGoソースコードをAWS Lambda用にクロスコンパイル
# 2. Lambda カスタムランタイム用の実行ファイル名 "bootstrap" で出力
# 3. デプロイ用 ZIP パッケージの作成
#
# AWS Lambda Go ランタイムの仕組み:
# - provided.al2 ランタイムでは "bootstrap" という名前の実行ファイルが必要
# - Linux x86_64 環境で動作するため、クロスコンパイルが必要
# - ZIP ファイルのルートディレクトリに "bootstrap" を配置

set -e  # エラー時に実行を停止

# 引数チェック
if [ $# -eq 0 ]; then
    echo "❌ エラー: Lambda関数名が指定されていません"
    echo ""
    echo "使用方法: $0 <lambda-function-name>"
    echo "例: $0 hello"
    echo "    $0 create-event"
    echo ""
    echo "📋 利用可能なLambda関数:"
    if [ -d "cmd/api" ]; then
        find cmd/api -name "main.go" -exec dirname {} \; | sed 's|cmd/api/||' | sort | sed 's/^/  - /'
    else
        echo "  (cmd/api ディレクトリが見つかりません)"
    fi
    exit 1
fi

LAMBDA_NAME=$1

# Lambda関数の存在確認
LAMBDA_PATH="cmd/api/$LAMBDA_NAME/main.go"
if [ ! -f "$LAMBDA_PATH" ]; then
    echo "❌ エラー: Lambda関数が見つかりません: $LAMBDA_PATH"
    echo ""
    echo "📋 利用可能なLambda関数:"
    if [ -d "cmd/api" ]; then
        find cmd/api -name "main.go" -exec dirname {} \; | sed 's|cmd/api/||' | sort | sed 's/^/  - /'
    else
        echo "  (cmd/api ディレクトリが見つかりません)"
    fi
    exit 1
fi

# 色付きログ出力用の定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}[INFO] Building Lambda function: $LAMBDA_NAME${NC}"

# 現在のディレクトリとGoバージョンを表示（デバッグ用）
echo -e "${YELLOW}[DEBUG] Current directory: $(pwd)${NC}"
echo -e "${YELLOW}[DEBUG] Target Lambda: $LAMBDA_PATH${NC}"
echo -e "${YELLOW}[DEBUG] Go version: $(go version)${NC}"

# ビルド先ディレクトリの準備
BUILD_DIR="build"
echo -e "${GREEN}[INFO] Preparing build directory: ${BUILD_DIR}${NC}"

# 既存のビルドディレクトリを削除（クリーンビルド）
if [ -d "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
    echo -e "${YELLOW}[DEBUG] Removed existing build directory${NC}"
fi

# ビルドディレクトリを作成
mkdir -p "$BUILD_DIR"

# Go アプリケーションのクロスコンパイル
# 重要な環境変数:
# - GOOS=linux: Linux 用にコンパイル（Lambda は Amazon Linux 2 ベース）
# - GOARCH=amd64: x86_64 アーキテクチャ用にコンパイル
# - CGO_ENABLED=0: C ライブラリへの依存を無効化（ポータビリティ向上）
echo -e "${GREEN}[INFO] Cross-compiling Go application for AWS Lambda...${NC}"

GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build \
    -ldflags="-s -w" \
    -o "$BUILD_DIR/bootstrap" \
    "./$LAMBDA_PATH"

# ビルドフラグの説明:
# -ldflags="-s -w": バイナリサイズ削減（シンボルテーブルとデバッグ情報を削除）
# -o BUILD_DIR/bootstrap: 出力ファイル名を "bootstrap" に指定

# ビルド結果の確認
if [ -f "$BUILD_DIR/bootstrap" ]; then
    FILE_SIZE=$(ls -lh "$BUILD_DIR/bootstrap" | awk '{print $5}')
    echo -e "${GREEN}[SUCCESS] Binary created: ${BUILD_DIR}/bootstrap (${FILE_SIZE})${NC}"
else
    echo -e "${RED}[ERROR] Failed to create binary${NC}"
    exit 1
fi

# Lambda デプロイ用 ZIP パッケージの作成
ZIP_FILE="${LAMBDA_NAME}-lambda.zip"
echo -e "${GREEN}[INFO] Creating deployment package: ${ZIP_FILE}${NC}"

# 既存の ZIP ファイルを削除
if [ -f "$ZIP_FILE" ]; then
    rm "$ZIP_FILE"
    echo -e "${YELLOW}[DEBUG] Removed existing ZIP file${NC}"
fi

# ZIP パッケージを作成
# bootstrap ファイルを ZIP のルートディレクトリに配置
cd "$BUILD_DIR" && zip -q "../$ZIP_FILE" bootstrap
cd ..

# ZIP ファイルの作成確認
if [ -f "$ZIP_FILE" ]; then
    ZIP_SIZE=$(ls -lh "$ZIP_FILE" | awk '{print $5}')
    echo -e "${GREEN}[SUCCESS] Deployment package created: ${ZIP_FILE} (${ZIP_SIZE})${NC}"
else
    echo -e "${RED}[ERROR] Failed to create ZIP file${NC}"
    exit 1
fi

# ビルド成果物の表示
echo -e "${GREEN}[INFO] Build completed successfully for: $LAMBDA_NAME${NC}"
echo -e "${YELLOW}[SUMMARY] Build artifacts:${NC}"
echo -e "  📦 Binary: ${BUILD_DIR}/bootstrap"
echo -e "  🗜️  ZIP package: ${ZIP_FILE}"
echo -e ""
echo -e "${GREEN}[NEXT STEPS]${NC}"
echo -e "  1. Terraform変数でファイル名を更新:"
echo -e "     source_file = \"../../../backend/${ZIP_FILE}\""
echo -e "  2. Terraformでデプロイ:"
echo -e "     cd ../iac/environments/dev && terraform apply"
