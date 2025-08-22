import { EventPurpose, BaseModalProps } from '../common';
import { EventLog, Venue, SharedRecord } from './event';
import type { FilterOptions } from '../../components/common/ui/FilterModal';

/**
 * Record機能関連の型定義
 */

// Extended SharedRecord with additional features
export interface ExtendedSharedRecord extends SharedRecord {
  likeCount: number;
  isLiked: boolean;
  participantCount: number;
  eventDate: string;
  images?: string[];
  organizer: {
    id: string;
    name: string;
    company?: string;
    isSameCompany?: boolean;
  };
}

// Record list types
export type RecordTabType = 'all' | 'liked';

// Filter options for records
export interface RecordFilterOptions {
  areas: string[];
  purposes: EventPurpose[];
  genres: string[];
  priceRange: { min: number; max: number };
}

// Benefit item type
export interface BenefitItem {
  icon: string;
  text: string;
  iconColor: string;
  backgroundColor: string;
}

// Purpose labels mapping
export interface PurposeLabels {
  [key: string]: string;
}

// 記録フィルター
export interface RecordFilter extends FilterOptions {
  dateRange?: {
    start: string;
    end: string;
  };
  rating?: number[];
  organizers?: string[];
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
  id: string;
  event: {
    title: string;
    purpose: EventPurpose;
    date: string;
  };
  venue: Venue;
  rating: number;
  notes: string;
  totalCost: number;
  costPerPerson: number;
  attendees: number;
  organizer: {
    name: string;
    avatar?: string;
  };
  isShared: boolean;
  createdAt: string;
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
