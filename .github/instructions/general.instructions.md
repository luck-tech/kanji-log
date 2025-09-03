---
applyTo: "**"
---

# 幹事ナビ開発プロジェクトルール

## 1. プロジェクト概要

**プロジェクト名**: 幹事ナビ（Kanji Navi）  
**コンセプト**: 飲み会の企画・管理における幹事の心理的負担を軽減する専用アプリ  
**ターゲット**: 企業・団体の飲み会で調整が困難な状況を抱える幹事

### 核となる価値提案

1. **負担削減**: 複雑な調整作業をアプリで一元管理
2. **ナレッジ蓄積**: 過去のイベント記録を資産として活用
3. **集合知**: 他の幹事の経験を共有・参照可能

---

## 2. 機能要件

### 2.1. 基本モデル：幹事一元管理モデル

- アプリの利用は幹事のみ
- 参加メンバーはアプリのインストールやアカウント作成は不要
- 情報収集は Web フォームで完結
- 幹事はイベントごとに Web フォームの URL を発行し、メンバーはそこから好みやアレルギー情報を提供

### 2.2. イベントとメンバーの管理

#### イベント作成

- イベント名（必須）
- 開催日時（任意、初期値は「未定」）
- 飲み会の目的（任意）
- 補足（任意）

#### Web フォームの作成と共有

- 幹事はイベントに参加するメンバーの名前をリストアップ
- 質問項目（アレルギー、予算、好み等）をカスタマイズ
- メンバーはリストから自分の名前を選択して回答
- 生成された URL を LINE や Slack 等で共有

#### メンバーリスト機能

- Web フォーム経由で回答したことがあるメンバーは自動で「メンバーリスト」として蓄積
- 次回以降のイベントでこのリストからメンバーを選択可能

#### 日程調整

- 幹事は Web フォームで複数の候補日を提示
- メンバーは都合（◯△✕）を回答
- 回答状況は幹事のアプリに集約され、幹事が最終決定

### 2.3. レストラン提案機能

#### エリア選定

- みんなの中心エリアから探す（Google Maps Platform API 利用）
- 指定エリア周辺で探す（駅名などを直接入力）

#### 提案アルゴリズム

- ホットペッパーグルメ API で 3〜5 店舗を検索・提案
- 推薦理由を自動生成して表示
- 多数派満足型／全員配慮型／チャレンジ型の提案

### 2.4. お店の決定と予約

#### 意思決定

- 幹事は候補一覧から 1 店舗を決定
- 候補店情報をコンパクトなテキストとしてコピー・共有可能

#### 予約サポート

- 予約に必要な情報を集約した「予約サポートカード」を表示
- 予約失敗時は次点候補のサポートカードを即表示

#### 予約完了報告

- 幹事が予約完了後、アプリで報告
- メンバー用 Web ページに確定情報が反映

### 2.5. メンバーへの情報共有

- メンバーは Web フォームの URL からイベントの最新状況を確認
- 連絡は専用ページと既存チャットツール（Slack 等）で行う
- アプリ内チャット機能は実装しない

---

## 開催記録とナレッジ共有

### 3.1. 幹事の開催記録（幹事ログ）

- イベント終了後、幹事のアプリ内に非公開の開催記録を保存
- 記録には店情報、参加メンバー、主観メモ、会計情報などを含む

### 3.2. みんなの記録（ナレッジ共有機能）

- 幹事は開催記録を他の幹事向けに共有可能
- 共有時は「参加メンバー名」「主観メモ」は自動マスキング
- 他の幹事は共有記録を検索・閲覧可能
- 「みんなの記録」タブは最初は鍵がかかった状態
- 閲覧には自身の開催記録を 1 件以上共有する必要あり
- 画像アップロード時の注意喚起・同意チェック
- 通報・削除機能の実装

---

## その他

### 4.1. アカウント・プライバシー

- 幹事は設定画面からアカウント削除可能
- 削除時は関連データをサーバーから完全削除

### 4.2. 収益化モデル

- 飲食店予約サイトへの送客によるアフィリエイト収益

### 4.3. 将来的な拡張機能

- 機械学習による推薦アルゴリズムの高度化
- Google Places API 等による多角的な評価統合

### 4.4. アーキテクチャ図

```
graph TD
subgraph "ユーザー"
Member["👩‍💻 参加メンバー<br/>(ブラウザ)"]
Organizer["📱 幹事用アプリ<br/>(React Native)"]
end

    subgraph "外部サービス"
        GoogleMapsAPI["🗺️ Google Maps Platform"]
        HotPepperAPI["🍻 ホットペッパーグルメAPI"]
    end

    %% --- Main AWS Cloud Environment ---
    subgraph "AWSクラウド環境"

        %% --- Edge & Firewall ---
        WAF["🛡️ AWS WAF<br/>(SQLi/XSS対策)"]
        CloudFront["🌐 Amazon CloudFront"]
        API_Gateway["🚪 Amazon API Gateway (REST API)"]

        %% --- Central Services ---
        IAM["📜 AWS IAM<br/>(各サービスの権限管理)"]

        subgraph "認証 (幹事のみ)"
            Cognito["🔐 Amazon Cognito"]
        end

        subgraph "ビジネスロジック (Compute)"
            LogicLambda["🧠 複合ロジック用Lambda<br/>(Go言語)"]
            EventBridgeTriggeredLambda["📨 後処理Lambda<br/>(Go言語)"]
        end

        subgraph "データ層 & ストレージ"
            DynamoDB["🗄️ Amazon DynamoDB"]
            S3["🖼️ S3 (Webアセット用)"]
        end

        subgraph "メッセージング & イベント"
            EventBus["🚌 Amazon EventBridge"]
        end
    end

    %% --- Connections ---

    %% User Flow
    Member & Organizer -- "HTTPS" --> WAF
    WAF -- "Inspects Traffic" --> CloudFront
    WAF -- "Inspects Traffic" --> API_Gateway

    CloudFront --> S3

    Organizer -- "認証" --> Cognito
    API_Gateway -- "Cognitoで認可" --> LogicLambda
    API_Gateway -- "フォーム回答(POST)" --> LogicLambda

    %% Backend Business Logic Flow
    LogicLambda -- "外部API呼び出し" --> GoogleMapsAPI & HotPepperAPI
    LogicLambda -- "イベント発行" --> EventBus
    EventBus -- "トリガー" --> EventBridgeTriggeredLambda

    %% IAM Permissions (Dotted Lines)
    LogicLambda -. "IAM Role" .-> DynamoDB
    LogicLambda -. "IAM Role" .-> EventBus
    EventBridgeTriggeredLambda -. "IAM Role" .-> DynamoDB
    API_Gateway -. "IAM Role" .-> LogicLambda
```
