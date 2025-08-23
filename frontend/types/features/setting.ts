import { Gender, NotificationSettings, BaseModalProps } from '../common';
import { BaseComponentProps } from '../common/ui';

/**
 * Setting機能関連の型定義
 */

// ユーザープロフィール
export interface UserProfile {
  id: string;
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

// === Settings UI コンポーネント関連の型定義 ===

// User data for profile
export interface UserData {
  name: string;
  gender: string;
  prefecture: string;
  followCount: number;
  followerCount: number;
  joinDate: string;
}

// Profile details
export interface ProfileDetailData {
  icon: string;
  text: string;
}

// Follow statistics
export interface FollowStatData {
  count: number;
  label: string;
}

// Statistics data
export interface StatData {
  value: number;
  label: string;
  variant: 'primary' | 'success' | 'accent';
}

// Settings item interface
export interface SettingsItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  onPress: () => void;
  showArrow?: boolean;
  textColor?: string;
}

// Settings group interface
export interface SettingsGroup {
  title?: string;
  items: SettingsItem[];
}

// App info interface
export interface AppInfo {
  name: string;
  version: string;
  description: string;
}

// Profile component props
export interface ProfileCardProps extends BaseComponentProps {
  userData: UserData;
  isOwnProfile: boolean;
  isFollowing?: boolean;
  onEditProfile?: () => void;
  onFollowToggle?: () => void;
}

export interface ProfileHeaderProps extends BaseComponentProps {
  userData: UserData;
  isOwnProfile: boolean;
  isFollowing?: boolean;
  onEditProfile?: () => void;
  onFollowToggle?: () => void;
}

export interface ProfileDetailsProps extends BaseComponentProps {
  userData: UserData;
}

export interface ProfileDetailItemProps extends BaseComponentProps {
  icon: string;
  text: string;
  iconColor?: string;
}

export interface FollowStatsProps extends BaseComponentProps {
  followCount: number;
  followerCount: number;
}

export interface FollowStatItemProps extends BaseComponentProps {
  count: number;
  label: string;
}

// Stats component props
export interface StatsCardProps extends BaseComponentProps {
  stats: StatData[];
}

export interface StatItemProps extends BaseComponentProps {
  value: number;
  label: string;
  variant: 'primary' | 'success' | 'accent';
}

// Settings component props
export interface SettingsGroupProps extends BaseComponentProps {
  title?: string;
  items: SettingsItem[];
}

export interface SettingItemProps extends BaseComponentProps {
  item: SettingsItem;
}

export interface SettingItemIconProps extends BaseComponentProps {
  icon: React.ReactNode;
}

export interface SettingItemContentProps extends BaseComponentProps {
  title: string;
  description?: string;
  textColor?: string;
  showArrow?: boolean;
}

// App info component props
export interface AppInfoCardProps extends BaseComponentProps {
  appInfo: AppInfo;
}

export interface AppIconProps extends BaseComponentProps {
  size?: number;
}

export interface AppDetailsProps extends BaseComponentProps {
  appInfo: AppInfo;
}

// Button props
export interface EditProfileButtonProps extends BaseComponentProps {
  onPress: () => void;
}

export interface FollowButtonProps extends BaseComponentProps {
  isFollowing: boolean;
  onPress: () => void;
}
