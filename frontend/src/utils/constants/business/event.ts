import { Colors } from '../design/colors';
import { EventStatus, EventPurpose } from '@/types';

/**
 * Event機能関連のビジネス定数
 */

export const EVENT_STATUS_TABS = [
  {
    key: 'planning' as EventStatus,
    label: '調整中',
    icon: '📅',
    color: Colors.warning[500],
  },
  {
    key: 'confirmed' as EventStatus,
    label: '確定済み',
    icon: '✅',
    color: Colors.success[500],
  },
  {
    key: 'completed' as EventStatus,
    label: '開催済み',
    icon: '🎉',
    color: Colors.gray[500],
  },
];

export const EVENT_PURPOSE_LABELS: Record<EventPurpose, string> = {
  welcome: '歓迎会',
  farewell: '送別会',
  celebration: 'お祝い',
  team_building: 'チームビルディング',
  casual: '親睦会',
  other: 'その他',
};

export const EVENT_PURPOSE_OPTIONS = [
  { key: 'welcome', label: '歓迎会', icon: '🎉' },
  { key: 'farewell', label: '送別会', icon: '👋' },
  { key: 'celebration', label: 'お祝い', icon: '🎊' },
  { key: 'team_building', label: 'チームビルディング', icon: '🤝' },
  { key: 'casual', label: '親睦会', icon: '🍻' },
  { key: 'other', label: 'その他', icon: '📝' },
];

export const EMPTY_STATE_MESSAGES = {
  planning: {
    title: '調整中のイベントはありません',
    description:
      '新しいイベントを作成して、メンバーとの日程調整を開始しましょう',
  },
  confirmed: {
    title: '確定済みのイベントはありません',
    description: '日程が確定したイベントがここに表示されます',
  },
  completed: {
    title: '開催済みのイベントはありません',
    description: '完了したイベントの記録がここに表示されます',
  },
};

// 日程調整関連の定数
export const DATE_RESPONSE_LABELS = {
  available: '参加可能',
  maybe: '未定',
  unavailable: '参加不可',
};

export const DATE_RESPONSE_COLORS = {
  available: Colors.success[500],
  maybe: Colors.warning[500],
  unavailable: Colors.error[500],
};

// イベント作成時のデフォルト値
export const EVENT_DEFAULTS = {
  purpose: 'casual' as EventPurpose,
  hasScheduling: true,
  maxMembers: 50,
  minMembers: 2,
};
