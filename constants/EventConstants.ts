import { Colors } from './Colors';
import { EventStatus, EventPurpose } from '@/types';

export const EVENT_STATUS_TABS = [
  {
    key: 'planning' as EventStatus,
    label: '調整中',
    color: Colors.warning[500],
  },
  {
    key: 'confirmed' as EventStatus,
    label: '確定済み',
    color: Colors.success[500],
  },
  {
    key: 'completed' as EventStatus,
    label: '終了済み',
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

export const EMPTY_STATE_MESSAGES = {
  planning: {
    title: '調整中のイベントはありません',
    description: '新しいイベントを作成して、メンバーとの調整を開始しましょう',
  },
  confirmed: {
    title: '確定済みのイベントはありません',
    description: '日程が確定したイベントがここに表示されます',
  },
  completed: {
    title: '終了済みのイベントはありません',
    description: '完了したイベントの記録がここに表示されます',
  },
};
