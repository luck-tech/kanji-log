# TypeScript 型定義書 - API 連携用

このドキュメントは、API 連携で使用される TypeScript 型定義をまとめたものです。

## 目次

1. [共通型定義](#共通型定義)
2. [認証関連](#認証関連)
3. [イベント関連](#イベント関連)
4. [メンバー関連](#メンバー関連)
5. [フォーム関連](#フォーム関連)
6. [日程調整関連](#日程調整関連)
7. [レストラン関連](#レストラン関連)
8. [記録関連](#記録関連)
9. [設定関連](#設定関連)

## 共通型定義

### API レスポンス基底型

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

interface ApiError {
  code: string;
  message: string;
  details?: any;
}

interface ResponseMeta {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### 基本型

```typescript
type EventStatus = 'planning' | 'confirmed' | 'completed' | 'cancelled';
type EventPurpose =
  | 'welcome'
  | 'farewell'
  | 'celebration'
  | 'team_building'
  | 'casual'
  | 'other';
type ResponseStatus = 'pending' | 'accepted' | 'declined';
type DateResponseType = 'available' | 'maybe' | 'unavailable';
type AlcoholPreference = 'yes' | 'no' | 'sometimes';

interface BudgetRange {
  min: number;
  max: number;
}
```

## 認証関連

### ユーザー情報

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}
```

## イベント関連

### イベント基本型

```typescript
interface Event {
  id: string;
  title: string;
  purpose: EventPurpose;
  description?: string;
  status: EventStatus;
  date?: string;
  time?: string;
  venue?: Venue;
  organizerId: string;
  members: EventMember[];
  dateOptions?: DateOption[];
  confirmedDate?: {
    date: string;
    time: string;
  };
  restaurantSuggestions?: Restaurant[];
  eventLog?: EventLog;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface EventMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  responseStatus: ResponseStatus;
  dateResponses: DateResponse[];
  joinedAt: string;
}

interface Venue {
  name: string;
  address: string;
  phone?: string;
  mapUrl?: string;
  genre?: string;
  area?: string;
}
```

### イベント操作リクエスト型

```typescript
interface CreateEventRequest {
  title: string;
  purpose: EventPurpose | '';
  date?: string;
  time?: string;
  notes?: string;
  hasScheduling: boolean;
}

interface UpdateEventRequest {
  title?: string;
  purpose?: EventPurpose;
  date?: string;
  time?: string;
  notes?: string;
  status?: EventStatus;
}
```

## メンバー関連

### メンバー型

```typescript
interface Member {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  department?: string;
  notes?: string;
  preferences?: MemberPreferences;
  createdAt: string;
}

interface MemberPreferences {
  allergies: string[];
  favoriteGenres: string[];
  budgetRange: BudgetRange;
  alcoholPreference: AlcoholPreference;
  dietaryRestrictions: string[];
}
```

### メンバー操作リクエスト型

```typescript
interface CreateMemberRequest {
  name: string;
  department?: string;
  notes?: string;
}

interface UpdateMemberRequest {
  name?: string;
  department?: string;
  notes?: string;
  preferences?: MemberPreferences;
}
```

## フォーム関連

### フォーム型

```typescript
interface FormQuestion {
  id: string;
  question: string;
  type:
    | 'name'
    | 'email'
    | 'phone'
    | 'allergy'
    | 'alcohol'
    | 'budget'
    | 'genre'
    | 'station'
    | 'custom';
  required: boolean;
  enabled: boolean;
  canDisable: boolean;
  options?: string[];
}

interface CreateFormRequest {
  questions: FormQuestion[];
  newMembers: { name: string }[];
}

interface FormResponse {
  formId: string;
  eventId: string;
  url: string;
  questions: FormQuestion[];
  expiresAt: string;
  createdAt: string;
}
```

### フォーム回答型

```typescript
interface PublicFormData {
  formId: string;
  eventTitle: string;
  organizerName: string;
  questions: FormQuestion[];
  membersList: string[];
  deadline: string;
  isActive: boolean;
}

interface FormSubmissionRequest {
  selectedMember: string;
  responses: {
    questionId: string;
    answer: string;
  }[];
}

interface FormSubmissionResponse {
  responseId: string;
  submittedAt: string;
  message: string;
}
```

## 日程調整関連

### 日程調整型

```typescript
interface DateOption {
  id: string;
  date: string;
  time?: string;
  responses: DateResponse[];
  label?: string;
}

interface DateResponse {
  userId: string;
  response: DateResponseType;
}

interface CreateScheduleRequest {
  title: string;
  description?: string;
  dateOptions: Omit<DateOption, 'id' | 'responses'>[];
  deadline?: string;
}
```

### 日程調整結果型

```typescript
interface ScheduleResponse {
  userId: string;
  userName: string;
  responses: {
    dateOptionId: string;
    response: DateResponseType;
  }[];
  respondedAt: string;
}

interface DateOptionStats {
  available: number;
  maybe: number;
  unavailable: number;
  total: number;
  percentage: number;
}

interface DateOptionWithStats extends DateOption {
  stats: DateOptionStats;
  responses: ScheduleResponse[];
}

interface ScheduleResultsSummary {
  responseRate: number;
  totalResponses: number;
  totalMembers: number;
  bestOption: DateOptionWithStats;
}
```

## レストラン関連

### レストラン型

```typescript
interface Restaurant {
  id: string;
  name: string;
  genre: string;
  area: string;
  phone?: string;
  address: string;
  rating?: number;
  priceRange: string;
  imageUrl?: string;
  recommendationReason?: string;
  mapUrl?: string;
  reservationUrl?: string;
}

interface RestaurantSuggestion extends Restaurant {
  recommendationType: 'majority' | 'inclusive' | 'challenge';
  features: string[];
  budget: string;
}
```

### レストラン検索リクエスト型

```typescript
interface AreaAnalysisRequest {
  memberLocations: {
    memberId: string;
    station: string;
    address: string;
  }[];
}

interface AreaAnalysisResponse {
  centerArea: {
    name: string;
    latitude: number;
    longitude: number;
    suggestedStations: string[];
  };
  analysis: {
    averageDistance: number;
    maxDistance: number;
    recommendedRadius: number;
  };
}

interface RestaurantSuggestionsResponse {
  summary: {
    totalRestaurants: number;
    analysisBase: string;
    memberCount: number;
  };
  restaurants: RestaurantSuggestion[];
}
```

## 記録関連

### 記録型

```typescript
interface EventLog {
  id: string;
  eventId: string;
  organizerId: string;
  rating: number;
  notes: string;
  totalCost: number;
  costPerPerson: number;
  attendees?: number;
  venue: Venue;
  isShared: boolean;
  createdAt: string;
}

interface SharedRecord {
  id: string;
  eventLog: EventLog;
  event: {
    title: string;
    purpose: EventPurpose;
  };
  organizer: {
    id: string;
    name: string;
    company?: string;
    isSameCompany?: boolean;
  };
  likeCount: number;
  isLiked: boolean;
  participantCount: number;
  eventDate: string;
  images?: string[];
}
```

### 記録操作リクエスト型

```typescript
interface CreateEventLogRequest {
  eventId: string;
  rating: number;
  notes: string;
  totalCost: number;
  costPerPerson: number;
  attendees: number;
  venue: {
    name: string;
    address: string;
    genre?: string;
  };
  isShared: boolean;
}

interface ShareRecordRequest {
  isPublic: boolean;
  shareNote?: string;
  hidePersonalInfo: boolean;
}

interface ShareRecordResponse {
  sharedId: string;
  recordId: string;
  isPublic: boolean;
  shareNote?: string;
  hidePersonalInfo: boolean;
  sharedAt: string;
}
```

## 設定関連

### ユーザー設定型

```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  prefecture?: string;
  nearestStation?: string;
  company?: string;
  department?: string;
  jobTitle?: string;
  phone?: string;
  notifications: NotificationSettings;
  createdAt: string;
  updatedAt: string;
}

interface NotificationSettings {
  email: {
    newEvent: boolean;
    eventUpdates: boolean;
    formResponses: boolean;
    scheduleReminders: boolean;
  };
  push: {
    newEvent: boolean;
    eventUpdates: boolean;
    formResponses: boolean;
    scheduleReminders: boolean;
  };
}

interface AppSettings {
  language: 'ja' | 'en';
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  privacy: {
    shareData: boolean;
    showProfile: boolean;
    allowAnalytics: boolean;
  };
  defaultEventSettings: {
    defaultPurpose?: string;
    defaultBudgetRange?: BudgetRange;
    defaultArea?: string;
  };
}
```

## フィルター・検索関連

### フィルター型

```typescript
interface EventFilter {
  status?: EventStatus[];
  purpose?: EventPurpose[];
  dateFrom?: string;
  dateTo?: string;
}

interface MemberFilter {
  department?: string[];
  hasPreferences?: boolean;
}

interface RecordFilter {
  purposes?: EventPurpose[];
  areas?: string[];
  genres?: string[];
  priceRange?: BudgetRange;
  dateRange?: {
    start: string;
    end: string;
  };
  rating?: number[];
  organizers?: string[];
}
```

## ページング関連

### ページングリクエスト

```typescript
interface PaginationRequest {
  page?: number;
  limit?: number;
}

interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

## API 関数型定義例

### API クライアント型

```typescript
interface ApiClient {
  // Events
  getEvents(
    filter?: EventFilter & PaginationRequest
  ): Promise<ApiResponse<Event[]>>;
  createEvent(data: CreateEventRequest): Promise<ApiResponse<Event>>;
  getEvent(eventId: string): Promise<ApiResponse<Event>>;
  updateEvent(
    eventId: string,
    data: UpdateEventRequest
  ): Promise<ApiResponse<Event>>;
  deleteEvent(eventId: string): Promise<ApiResponse<void>>;

  // Members
  getMembers(
    filter?: MemberFilter & PaginationRequest
  ): Promise<ApiResponse<Member[]>>;
  createMember(data: CreateMemberRequest): Promise<ApiResponse<Member>>;
  getMember(memberId: string): Promise<ApiResponse<Member>>;
  updateMember(
    memberId: string,
    data: UpdateMemberRequest
  ): Promise<ApiResponse<Member>>;
  deleteMember(memberId: string): Promise<ApiResponse<void>>;

  // Forms
  createForm(
    eventId: string,
    data: CreateFormRequest
  ): Promise<ApiResponse<FormResponse>>;
  getPublicForm(formId: string): Promise<ApiResponse<PublicFormData>>;
  submitFormResponse(
    formId: string,
    data: FormSubmissionRequest
  ): Promise<ApiResponse<FormSubmissionResponse>>;

  // Schedule
  createSchedule(
    eventId: string,
    data: CreateScheduleRequest
  ): Promise<ApiResponse<any>>;
  getScheduleResults(eventId: string): Promise<
    ApiResponse<{
      summary: ScheduleResultsSummary;
      dateOptions: DateOptionWithStats[];
      responses: ScheduleResponse[];
    }>
  >;

  // Restaurants
  analyzeArea(
    eventId: string,
    data: AreaAnalysisRequest
  ): Promise<ApiResponse<AreaAnalysisResponse>>;
  getRestaurantSuggestions(
    eventId: string
  ): Promise<ApiResponse<RestaurantSuggestionsResponse>>;

  // Records
  createEventLog(data: CreateEventLogRequest): Promise<ApiResponse<EventLog>>;
  getPrivateRecords(
    filter?: RecordFilter & PaginationRequest
  ): Promise<ApiResponse<EventLog[]>>;
  getSharedRecords(
    filter?: RecordFilter & PaginationRequest
  ): Promise<ApiResponse<SharedRecord[]>>;
  shareRecord(
    recordId: string,
    data: ShareRecordRequest
  ): Promise<ApiResponse<ShareRecordResponse>>;

  // Settings
  getProfile(): Promise<ApiResponse<UserProfile>>;
  updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>>;
  getAppSettings(): Promise<ApiResponse<AppSettings>>;
  updateAppSettings(
    data: Partial<AppSettings>
  ): Promise<ApiResponse<AppSettings>>;
}
```

## 使用例

### API 呼び出し例

```typescript
// イベント作成
const createEventExample = async (apiClient: ApiClient) => {
  const eventData: CreateEventRequest = {
    title: '新人歓迎会',
    purpose: 'welcome',
    date: '2024-03-15',
    time: '19:00',
    notes: 'みんなで楽しく歓迎しましょう！',
    hasScheduling: false,
  };

  const response = await apiClient.createEvent(eventData);
  if (response.success && response.data) {
    console.log('イベントが作成されました:', response.data);
  } else {
    console.error('エラー:', response.error);
  }
};

// フォーム回答送信
const submitFormExample = async (apiClient: ApiClient) => {
  const formData: FormSubmissionRequest = {
    selectedMember: '新入社員A',
    responses: [
      { questionId: 'q_001', answer: '新入社員A' },
      { questionId: 'q_002', answer: 'えび、かに' },
    ],
  };

  const response = await apiClient.submitFormResponse('form_123', formData);
  if (response.success) {
    console.log('回答が送信されました');
  }
};
```

## 注意事項

1. **null vs undefined**: API レスポンスでは null を使用、フロントエンドでは undefined も許可
2. **日時形式**: ISO 8601 形式（YYYY-MM-DDTHH:mm:ssZ）を使用
3. **エラーハンドリング**: 全ての API 呼び出しでエラーレスポンスを適切に処理
4. **型安全性**: 可能な限り strict な型定義を使用し、実行時の型チェックも実装
5. **下位互換性**: API 変更時は既存の型定義との互換性を考慮
