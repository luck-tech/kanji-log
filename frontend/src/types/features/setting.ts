import { ID, Gender, NotificationSettings, BaseModalProps } from '../common';

/**
 * Setting機能関連の型定義
 */

// ユーザープロフィール
export interface UserProfile {
  id: ID;
  name: string;
  email: string;
  avatar?: string;
  gender?: Gender;
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

// アプリ設定
export interface AppSettings {
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
    defaultBudgetRange?: {
      min: number;
      max: number;
    };
    defaultArea?: string;
  };
}

// アカウント設定
export interface AccountSettings {
  email: string;
  password?: string;
  twoFactorEnabled: boolean;
  linkedAccounts: {
    google?: boolean;
    facebook?: boolean;
    line?: boolean;
  };
  dataExport: {
    lastExported?: string;
    autoExport: boolean;
  };
}

// === Modal関連の型定義 ===

// プロフィール編集Modal
export interface ProfileEditModalProps extends BaseModalProps {
  onSave: (profileData: ProfileEditData) => void;
  initialData?: ProfileEditData;
}

export interface ProfileEditData {
  name: string;
  gender: string;
  prefecture: string;
  nearestStation: string;
  company: string;
  department: string;
  jobTitle: string;
  phone: string;
  notifications: NotificationSettings;
}

// アカウント削除Modal
export interface AccountDeleteModalProps extends BaseModalProps {
  onConfirm: (confirmData: AccountDeleteData) => void;
}

export interface AccountDeleteData {
  password: string;
  reason?: string;
  exportData: boolean;
}

// エリア選択Modal
export interface AreaSelectionModalProps extends BaseModalProps {
  onSelect: (area: AreaData) => void;
  selectedAreas?: string[];
  multiSelect?: boolean;
}

export interface AreaData {
  prefecture: string;
  cities: string[];
}
