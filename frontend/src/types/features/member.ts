import { ID, BudgetRange, AlcoholPreference, BaseModalProps } from '../common';

/**
 * Member機能関連の型定義
 */

// メンバー基本情報
export interface Member {
  id: ID;
  name: string;
  email?: string;
  avatar?: string;
  department?: string;
  notes?: string;
  preferences?: MemberPreferences;
  createdAt: string;
}

// メンバー嗜好設定
export interface MemberPreferences {
  allergies: string[];
  favoriteGenres: string[];
  budgetRange: BudgetRange;
  alcoholPreference: AlcoholPreference;
  dietaryRestrictions: string[];
}

// === Modal関連の型定義 ===

// メンバー追加Modal
export interface MemberAddModalProps extends BaseModalProps {
  onAddMember: (memberData: MemberData) => void;
}

export interface MemberData {
  name: string;
  department?: string;
  notes?: string;
}

// メンバー編集Modal
export interface MemberEditModalProps extends BaseModalProps {
  onSave: (memberData: MemberEditData) => void;
  initialData?: MemberEditData;
}

export interface MemberEditData {
  name: string;
  department?: string;
  notes?: string;
  preferences: MemberPreferences;
}
