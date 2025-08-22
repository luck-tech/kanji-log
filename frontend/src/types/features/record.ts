import {
  ID,
  Timestamp,
  EventPurpose,
  Rating,
  BaseModalProps,
  FilterOptions,
} from '../common';
import { EventLog, Venue } from './event';

/**
 * Record機能関連の型定義
 */

// 記録フィルター
export interface RecordFilter extends FilterOptions {
  dateRange?: {
    start: string;
    end: string;
  };
  rating?: Rating[];
  organizers?: ID[];
}

// 記録統計
export interface RecordStats {
  totalEvents: number;
  averageRating: number;
  totalCost: number;
  averageCostPerPerson: number;
  favoriteGenres: {
    genre: string;
    count: number;
  }[];
  popularAreas: {
    area: string;
    count: number;
  }[];
}

// 記録詳細表示用
export interface RecordDetail {
  id: ID;
  event: {
    title: string;
    purpose: EventPurpose;
    date: string;
  };
  venue: Venue;
  rating: Rating;
  notes: string;
  totalCost: number;
  costPerPerson: number;
  attendees: number;
  organizer: {
    name: string;
    avatar?: string;
  };
  isShared: boolean;
  createdAt: Timestamp;
}

// === Modal関連の型定義 ===

// 記録詳細Modal
export interface RecordDetailModalProps extends BaseModalProps {
  record: RecordDetail;
  onEdit?: (record: RecordDetail) => void;
  onShare?: (record: RecordDetail) => void;
}

// 記録共有Modal
export interface RecordShareModalProps extends BaseModalProps {
  record: EventLog;
  onShare: (shareData: RecordShareData) => void;
}

export interface RecordShareData {
  isPublic: boolean;
  shareNote?: string;
  hidePersonalInfo: boolean;
}
