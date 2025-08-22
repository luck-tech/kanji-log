import {
  ID,
  Timestamp,
  EventStatus,
  EventPurpose,
  ResponseStatus,
  DateResponseType,
  Rating,
  BaseModalProps,
} from '../common';

/**
 * Event機能関連の型定義
 */

// ユーザー基本情報
export interface User {
  id: ID;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Timestamp;
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
  id: ID;
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
  id: ID;
  date: string;
  time?: string;
  responses: DateResponse[];
  label?: string;
}

// 日程回答
export interface DateResponse {
  userId: ID;
  response: DateResponseType;
}

// イベントメンバー
export interface EventMember {
  id: ID;
  userId: ID;
  name: string;
  email: string;
  avatar?: string;
  responseStatus: ResponseStatus;
  dateResponses: DateResponse[];
  joinedAt: Timestamp;
}

// イベントログ
export interface EventLog {
  id: ID;
  eventId: ID;
  organizerId: ID;
  rating: Rating;
  notes: string;
  totalCost: number;
  costPerPerson: number;
  attendees?: number;
  venue: Venue;
  isShared: boolean;
  createdAt: Timestamp;
}

// イベント本体
export interface Event {
  id: ID;
  title: string;
  purpose: EventPurpose;
  description?: string;
  status: EventStatus;
  date?: string;
  time?: string;
  venue?: Venue;
  organizerId: ID;
  members: EventMember[];
  dateOptions?: DateOption[];
  confirmedDate?: {
    date: string;
    time: string;
  };
  restaurantSuggestions?: Restaurant[];
  eventLog?: EventLog;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 共有記録
export interface SharedRecord {
  id: ID;
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
  rating: Rating;
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
