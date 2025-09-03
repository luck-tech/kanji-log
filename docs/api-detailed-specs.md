# API 詳細仕様書 - リクエスト・レスポンス例

このドキュメントは、主要な API エンドポイントの具体的なリクエスト・レスポンス例を示します。

## 目次

1. [イベント管理 API](#イベント管理api)
2. [フォーム機能 API](#フォーム機能api)
3. [日程調整 API](#日程調整api)
4. [レストラン提案 API](#レストラン提案api)
5. [記録管理 API](#記録管理api)

## イベント管理 API

### イベント作成

`POST /events`

**Request:**

```json
{
  "title": "新人歓迎会",
  "purpose": "welcome",
  "date": "2024-03-15",
  "time": "19:00",
  "notes": "みんなで楽しく歓迎しましょう！",
  "hasScheduling": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "evt_123456789",
    "title": "新人歓迎会",
    "purpose": "welcome",
    "status": "confirmed",
    "date": "2024-03-15",
    "time": "19:00",
    "organizerId": "user_123",
    "members": [],
    "notes": "みんなで楽しく歓迎しましょう！",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### イベント一覧取得

`GET /events?status=planning&purpose=welcome&page=1&limit=10`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "evt_123456789",
      "title": "新人歓迎会",
      "purpose": "welcome",
      "status": "planning",
      "date": "2024-03-15",
      "time": "19:00",
      "organizerId": "user_123",
      "memberCount": 5,
      "responseRate": 0.8,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### イベント詳細取得

`GET /events/{eventId}`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "evt_123456789",
    "title": "新人歓迎会",
    "purpose": "welcome",
    "status": "planning",
    "date": "2024-03-15",
    "time": "19:00",
    "organizerId": "user_123",
    "members": [
      {
        "id": "member_001",
        "userId": "user_456",
        "name": "田中太郎",
        "email": "tanaka@example.com",
        "responseStatus": "accepted",
        "joinedAt": "2024-01-15T12:00:00Z"
      }
    ],
    "dateOptions": [
      {
        "id": "date_001",
        "date": "2024-03-15",
        "time": "19:00",
        "responses": [
          {
            "userId": "user_456",
            "response": "available"
          }
        ]
      }
    ],
    "venue": {
      "name": "炭火焼鳥 鳥心",
      "address": "東京都新宿区新宿3-1-1",
      "phone": "03-1234-5678",
      "genre": "焼鳥・居酒屋"
    },
    "notes": "みんなで楽しく歓迎しましょう！",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T15:30:00Z"
  }
}
```

## フォーム機能 API

### フォーム作成

`POST /events/{eventId}/forms`

**Request:**

```json
{
  "questions": [
    {
      "id": "q_001",
      "question": "お名前",
      "type": "name",
      "required": true,
      "enabled": true
    },
    {
      "id": "q_002",
      "question": "食べ物のアレルギーはありますか？",
      "type": "allergy",
      "required": false,
      "enabled": true
    },
    {
      "id": "q_003",
      "question": "お酒は飲まれますか？",
      "type": "alcohol",
      "required": false,
      "enabled": true
    }
  ],
  "newMembers": [
    {
      "name": "新入社員A"
    },
    {
      "name": "新入社員B"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "formId": "form_123456789",
    "eventId": "evt_123456789",
    "url": "https://kanji-log.app/form/evt_123456789/form_123456789",
    "questions": [
      {
        "id": "q_001",
        "question": "お名前",
        "type": "name",
        "required": true,
        "enabled": true
      }
    ],
    "expiresAt": "2024-03-10T23:59:59Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 公開フォーム取得（認証不要）

`GET /public/forms/{formId}`

**Response:**

```json
{
  "success": true,
  "data": {
    "formId": "form_123456789",
    "eventTitle": "新人歓迎会",
    "organizerName": "山田太郎",
    "questions": [
      {
        "id": "q_001",
        "question": "お名前",
        "type": "name",
        "required": true,
        "options": []
      },
      {
        "id": "q_002",
        "question": "食べ物のアレルギーはありますか？",
        "type": "allergy",
        "required": false,
        "options": []
      }
    ],
    "membersList": ["新入社員A", "新入社員B", "田中太郎", "佐藤花子"],
    "deadline": "2024-03-10T23:59:59Z",
    "isActive": true
  }
}
```

### フォーム回答送信（認証不要）

`POST /public/forms/{formId}/responses`

**Request:**

```json
{
  "selectedMember": "新入社員A",
  "responses": [
    {
      "questionId": "q_001",
      "answer": "新入社員A"
    },
    {
      "questionId": "q_002",
      "answer": "えび、かに"
    },
    {
      "questionId": "q_003",
      "answer": "飲みます"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "responseId": "res_123456789",
    "submittedAt": "2024-01-16T14:30:00Z",
    "message": "回答ありがとうございました！"
  }
}
```

## 日程調整 API

### 日程候補設定

`POST /events/{eventId}/schedule/options`

**Request:**

```json
{
  "title": "新人歓迎会の日程調整",
  "description": "都合の良い日程を選択してください",
  "dateOptions": [
    {
      "date": "2024-03-15",
      "time": "19:00",
      "label": "第1候補"
    },
    {
      "date": "2024-03-16",
      "time": "18:30",
      "label": "第2候補"
    }
  ],
  "deadline": "2024-03-10T23:59:59Z"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "scheduleId": "schedule_123456789",
    "eventId": "evt_123456789",
    "url": "https://kanji-log.app/schedule/evt_123456789",
    "title": "新人歓迎会の日程調整",
    "dateOptions": [
      {
        "id": "date_001",
        "date": "2024-03-15",
        "time": "19:00",
        "label": "第1候補"
      }
    ],
    "deadline": "2024-03-10T23:59:59Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 日程調整結果取得

`GET /events/{eventId}/schedule/results`

**Response:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "responseRate": 0.8,
      "totalResponses": 8,
      "totalMembers": 10,
      "bestOption": {
        "id": "date_001",
        "date": "2024-03-15",
        "time": "19:00",
        "stats": {
          "available": 6,
          "maybe": 2,
          "unavailable": 0,
          "total": 8,
          "percentage": 0.75
        }
      }
    },
    "dateOptions": [
      {
        "id": "date_001",
        "date": "2024-03-15",
        "time": "19:00",
        "label": "第1候補",
        "stats": {
          "available": 6,
          "maybe": 2,
          "unavailable": 0,
          "total": 8,
          "percentage": 0.75
        }
      }
    ],
    "responses": [
      {
        "userId": "user_456",
        "userName": "田中太郎",
        "responses": [
          {
            "dateOptionId": "date_001",
            "response": "available"
          }
        ],
        "respondedAt": "2024-01-16T10:30:00Z"
      }
    ]
  }
}
```

## レストラン提案 API

### メンバー位置分析＆中心地点算出

`POST /events/{eventId}/restaurants/area-analysis`

**Request:**

```json
{
  "memberLocations": [
    {
      "memberId": "member_001",
      "station": "新宿駅",
      "address": "東京都新宿区新宿3-1-1"
    },
    {
      "memberId": "member_002",
      "station": "渋谷駅",
      "address": "東京都渋谷区渋谷1-1-1"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "centerArea": {
      "name": "新宿・渋谷エリア",
      "latitude": 35.689614,
      "longitude": 139.700556,
      "suggestedStations": ["新宿駅", "代々木駅", "渋谷駅"]
    },
    "analysis": {
      "averageDistance": 1.2,
      "maxDistance": 2.1,
      "recommendedRadius": 1.5
    }
  }
}
```

### レストラン提案取得

`GET /events/{eventId}/restaurants/suggestions`

**Response:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRestaurants": 5,
      "analysisBase": "メンバーの好み、アレルギー情報、予算",
      "memberCount": 8
    },
    "restaurants": [
      {
        "id": "rest_001",
        "name": "炭火焼鳥 鳥心",
        "genre": "焼鳥・居酒屋",
        "area": "新宿",
        "address": "東京都新宿区新宿3-1-1",
        "phone": "03-1234-5678",
        "rating": 4.2,
        "budget": "3000-4000円",
        "imageUrl": "https://example.com/image.jpg",
        "recommendationType": "majority",
        "recommendationReason": "アレルギー対応が充実しており、予算範囲内でバラエティ豊かなメニューが楽しめます",
        "features": ["アレルギー対応", "個室あり", "飲み放題"],
        "mapUrl": "https://maps.google.com/...",
        "reservationUrl": "https://hotpepper.jp/..."
      }
    ]
  }
}
```

## 記録管理 API

### 開催記録作成

`POST /records/private`

**Request:**

```json
{
  "eventId": "evt_123456789",
  "rating": 4,
  "notes": "とても盛り上がりました！次回もここを利用したいです。",
  "totalCost": 32000,
  "costPerPerson": 4000,
  "attendees": 8,
  "venue": {
    "name": "炭火焼鳥 鳥心",
    "address": "東京都新宿区新宿3-1-1",
    "genre": "焼鳥・居酒屋"
  },
  "isShared": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "record_123456789",
    "eventId": "evt_123456789",
    "organizerId": "user_123",
    "rating": 4,
    "notes": "とても盛り上がりました！次回もここを利用したいです。",
    "totalCost": 32000,
    "costPerPerson": 4000,
    "attendees": 8,
    "venue": {
      "name": "炭火焼鳥 鳥心",
      "address": "東京都新宿区新宿3-1-1",
      "genre": "焼鳥・居酒屋"
    },
    "isShared": false,
    "createdAt": "2024-01-20T21:30:00Z"
  }
}
```

### 共有記録一覧取得

`GET /records/shared?purpose=welcome&area=新宿&genre=焼鳥&page=1&limit=10`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "shared_001",
      "eventLog": {
        "id": "record_987654321",
        "rating": 4,
        "notes": "",
        "totalCost": 0,
        "costPerPerson": 4000,
        "attendees": 8,
        "venue": {
          "name": "炭火焼鳥 鳥心",
          "address": "東京都新宿区新宿3-1-1",
          "genre": "焼鳥・居酒屋"
        },
        "createdAt": "2024-01-20T21:30:00Z"
      },
      "event": {
        "title": "新人歓迎会",
        "purpose": "welcome"
      },
      "organizer": {
        "id": "user_789",
        "name": "山田花子",
        "company": "○○株式会社",
        "isSameCompany": false
      },
      "likeCount": 15,
      "isLiked": false,
      "participantCount": 8,
      "eventDate": "2024-01-20",
      "images": ["image1.jpg"]
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

### 記録共有設定

`POST /records/{recordId}/share`

**Request:**

```json
{
  "isPublic": true,
  "shareNote": "とても良いお店でした！",
  "hidePersonalInfo": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "sharedId": "shared_123456789",
    "recordId": "record_123456789",
    "isPublic": true,
    "shareNote": "とても良いお店でした！",
    "hidePersonalInfo": true,
    "sharedAt": "2024-01-21T10:00:00Z"
  }
}
```

## エラーレスポンス例

### バリデーションエラー

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_001",
    "message": "入力値に誤りがあります",
    "details": {
      "field": "title",
      "reason": "イベント名は必須です"
    }
  }
}
```

### 権限エラー

```json
{
  "success": false,
  "error": {
    "code": "AUTH_002",
    "message": "このリソースにアクセスする権限がありません"
  }
}
```

### リソース未発見エラー

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND_001",
    "message": "指定されたイベントが見つかりません"
  }
}
```

### 外部 API 呼び出しエラー

```json
{
  "success": false,
  "error": {
    "code": "EXTERNAL_001",
    "message": "外部サービスとの連携でエラーが発生しました",
    "details": {
      "service": "hotpepper",
      "reason": "API呼び出し制限に達しました"
    }
  }
}
```

## 注意事項

1. **日時形式**: ISO 8601 形式（UTC）を使用
2. **ページング**: `page`は 1 から開始、`limit`のデフォルトは 10、最大 100
3. **認証**: Bearer Token を Authorization ヘッダーに設定
4. **Content-Type**: `application/json`を指定
5. **レート制限**: 各エンドポイントで適切な制限を設定予定
