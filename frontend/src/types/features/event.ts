import {
  EventStatus,
  EventPurpose,
  ResponseStatus,
  DateResponseType,
  BaseModalProps,
} from '../common';

/**
 * Event機能関連の型定義
 */

// ユーザー基本情報
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

// 会場情報
export interface Venue {
  name: string;
  address: string;
  phone?: string;
  mapUrl?: string;
  genre?: string;
  area?: string;
}

// レストラン情報
export interface Restaurant {
  id: string;
  name: string;
  genre: string;
  area: string;
  phone: string;
  address: string;
  rating?: number;
  priceRange: string;
  imageUrl?: string;
  recommendationReason?: string;
  mapUrl?: string;
}

// 日程オプション
export interface DateOption {
  id: string;
  date: string;
  time?: string;
  responses: DateResponse[];
  label?: string;
}

// 日程回答
export interface DateResponse {
  userId: string;
  response: DateResponseType;
}

// イベントメンバー
export interface EventMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  responseStatus: ResponseStatus;
  dateResponses: DateResponse[];
  joinedAt: string;
}

// イベントログ
export interface EventLog {
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

// イベント本体
export interface Event {
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

// 共有記録
export interface SharedRecord {
  id: string;
  eventLog: EventLog;
  event: {
    title: string;
    purpose: EventPurpose;
  };
  organizer: {
    name: string;
    avatar?: string;
  };
}

// === Modal関連の型定義 ===

// イベント作成Modal
export interface EventCreateModalProps extends BaseModalProps {
  onCreate: (eventData: EventCreateData) => void;
}

export interface EventCreateData {
  title: string;
  purpose: EventPurpose | '';
  date?: string;
  time?: string;
  notes?: string;
  hasScheduling: boolean;
}

// イベントログModal
export interface EventLogModalProps extends BaseModalProps {
  onSave: (logData: EventLogData) => void;
  eventTitle: string;
  venue?: {
    name: string;
    address: string;
    genre?: string;
  };
}

export interface EventLogData {
  rating: number;
  notes: string;
  totalCost: string;
  costPerPerson: string;
  isShared: boolean;
  venue: {
    name: string;
    address: string;
    genre?: string;
  };
}

// 日程調整Modal
export interface DateScheduleModalProps extends BaseModalProps {
  onScheduleSetup: (scheduleData: ScheduleData) => void;
}

export interface ScheduleData {
  title: string;
  description?: string;
  dateOptions: DateOption[];
  deadline?: string;
}

/**
 * フォーム設定関連の型定義
 */
export interface Question {
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
}

export interface NewMember {
  id: string;
  name: string;
}

export interface FormSetupState {
  questions: Question[];
  newMembers: NewMember[];
  customQuestion: string;
  formUrl?: string;
}
