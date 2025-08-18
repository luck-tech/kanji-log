import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';

export interface ProfileEditData {
  name: string;
  gender: string;
  prefecture: string;
  nearestStation: string;
  company: string;
  department: string;
  jobTitle: string;
  phone: string;
  notifications: {
    eventUpdates: boolean;
    reminders: boolean;
    suggestions: boolean;
    follows: boolean;
  };
  preferences: {
    preferredBudgetRange: { min: number; max: number };
    preferredGenres: string[];
    language: string;
    theme: string;
  };
  privacy: {
    shareRecords: boolean;
    useCompanyInfo: boolean;
  };
}

interface ProfileEditModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: ProfileEditData) => void;
  initialData: ProfileEditData;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isVisible,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<ProfileEditData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(initialData);
    setErrors({});
  }, [initialData, isVisible]);

  const genderOptions = ['男性', '女性', 'その他', '回答しない'];
  const prefectureOptions = [
    '北海道',
    '青森県',
    '岩手県',
    '宮城県',
    '秋田県',
    '山形県',
    '福島県',
    '茨城県',
    '栃木県',
    '群馬県',
    '埼玉県',
    '千葉県',
    '東京都',
    '神奈川県',
    '新潟県',
    '富山県',
    '石川県',
    '福井県',
    '山梨県',
    '長野県',
    '岐阜県',
    '静岡県',
    '愛知県',
    '三重県',
    '滋賀県',
    '京都府',
    '大阪府',
    '兵庫県',
    '奈良県',
    '和歌山県',
    '鳥取県',
    '島根県',
    '岡山県',
    '広島県',
    '山口県',
    '徳島県',
    '香川県',
    '愛媛県',
    '高知県',
    '福岡県',
    '佐賀県',
    '長崎県',
    '熊本県',
    '大分県',
    '宮崎県',
    '鹿児島県',
    '沖縄県',
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        const parentValue = prev[parent as keyof ProfileEditData];
        if (typeof parentValue === 'object' && parentValue !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentValue,
              [child]: value,
            },
          };
        }
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '名前は必須です';
    }

    if (!formData.company.trim()) {
      newErrors.company = '会社名は必須です';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '電話番号は必須です';
    } else if (!/^[0-9-+()]*$/.test(formData.phone)) {
      newErrors.phone = '有効な電話番号を入力してください';
    }

    if (
      formData.preferences.preferredBudgetRange.min >=
      formData.preferences.preferredBudgetRange.max
    ) {
      newErrors.budget = '最小予算は最大予算より小さくしてください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView className="flex-1 bg-neutral-50">
        {/* Header */}
        <View className="px-6 py-4 bg-white border-b border-neutral-200">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={handleClose} className="p-2 -ml-2">
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-neutral-900">
              プロフィール編集
            </Text>
            <TouchableOpacity onPress={handleSave} className="p-2 -mr-2">
              <Text className="text-lg font-bold text-primary-600">保存</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6 gap-6">
            {/* 基本情報 */}
            <Card variant="elevated" shadow="large" animated={true}>
              <View className="gap-4">
                <View className="flex-row items-center gap-3 mb-2">
                  <View className="w-10 h-10 rounded-2xl bg-blue-100 justify-center items-center">
                    <Ionicons name="person" size={20} color="#0284c7" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    基本情報
                  </Text>
                </View>

                <Input
                  label="名前"
                  placeholder="山田太郎"
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                  error={errors.name}
                />

                <View className="gap-2">
                  <Text className="text-base font-medium text-neutral-900 mb-2">
                    性別
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {genderOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => updateFormData('gender', option)}
                        className={`px-4 py-2 rounded-xl border ${
                          formData.gender === option
                            ? 'bg-primary-100 border-primary-300'
                            : 'bg-white border-neutral-200'
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            formData.gender === option
                              ? 'text-primary-700'
                              : 'text-neutral-700'
                          }`}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View className="gap-2">
                  <Text className="text-base font-medium text-neutral-900 mb-2">
                    都道府県
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row"
                  >
                    <View className="flex-row gap-2 pr-4">
                      {prefectureOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          onPress={() => updateFormData('prefecture', option)}
                          className={`px-3 py-2 rounded-xl border ${
                            formData.prefecture === option
                              ? 'bg-primary-100 border-primary-300'
                              : 'bg-white border-neutral-200'
                          }`}
                        >
                          <Text
                            className={`text-sm font-medium ${
                              formData.prefecture === option
                                ? 'text-primary-700'
                                : 'text-neutral-700'
                            }`}
                          >
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <Input
                  label="最寄駅"
                  placeholder="新宿駅"
                  value={formData.nearestStation}
                  onChangeText={(value) =>
                    updateFormData('nearestStation', value)
                  }
                />
              </View>
            </Card>

            {/* 会社情報 */}
            <Card variant="elevated" shadow="soft">
              <View className="gap-4">
                <View className="flex-row items-center gap-3 mb-2">
                  <View className="w-10 h-10 rounded-2xl bg-purple-100 justify-center items-center">
                    <Ionicons name="business" size={20} color="#7c3aed" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    会社情報
                  </Text>
                </View>

                <Input
                  label="会社名"
                  placeholder="株式会社サンプル"
                  value={formData.company}
                  onChangeText={(value) => updateFormData('company', value)}
                  error={errors.company}
                />

                <Input
                  label="部署"
                  placeholder="営業部"
                  value={formData.department}
                  onChangeText={(value) => updateFormData('department', value)}
                />

                <Input
                  label="役職"
                  placeholder="課長"
                  value={formData.jobTitle}
                  onChangeText={(value) => updateFormData('jobTitle', value)}
                />
              </View>
            </Card>

            {/* 連絡先 */}
            <Card variant="elevated" shadow="soft">
              <View className="gap-4">
                <View className="flex-row items-center gap-3 mb-2">
                  <View className="w-10 h-10 rounded-2xl bg-green-100 justify-center items-center">
                    <Ionicons name="call" size={20} color="#10b981" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    連絡先
                  </Text>
                </View>

                <Input
                  label="電話番号"
                  placeholder="090-1234-5678"
                  value={formData.phone}
                  onChangeText={(value) => updateFormData('phone', value)}
                  error={errors.phone}
                  keyboardType="phone-pad"
                />
              </View>
            </Card>

            {/* 希望予算設定 */}
            <Card variant="elevated" shadow="soft">
              <View className="gap-4">
                <View className="flex-row items-center gap-3 mb-2">
                  <View className="w-10 h-10 rounded-2xl bg-orange-100 justify-center items-center">
                    <Ionicons name="wallet" size={20} color="#f59e0b" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    希望予算設定
                  </Text>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Input
                      label="最小予算 (円)"
                      placeholder="3000"
                      value={formData.preferences.preferredBudgetRange.min.toString()}
                      onChangeText={(value) =>
                        updateFormData('preferences.preferredBudgetRange', {
                          ...formData.preferences.preferredBudgetRange,
                          min: parseInt(value) || 0,
                        })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-1">
                    <Input
                      label="最大予算 (円)"
                      placeholder="5000"
                      value={formData.preferences.preferredBudgetRange.max.toString()}
                      onChangeText={(value) =>
                        updateFormData('preferences.preferredBudgetRange', {
                          ...formData.preferences.preferredBudgetRange,
                          max: parseInt(value) || 0,
                        })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {errors.budget && (
                  <Text className="text-sm text-error-600">
                    {errors.budget}
                  </Text>
                )}
              </View>
            </Card>

            {/* 通知設定 */}
            <Card variant="elevated" shadow="soft">
              <View className="gap-4">
                <View className="flex-row items-center gap-3 mb-2">
                  <View className="w-10 h-10 rounded-2xl bg-yellow-100 justify-center items-center">
                    <Ionicons name="notifications" size={20} color="#f59e0b" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    通知設定
                  </Text>
                </View>

                <View className="gap-3">
                  <TouchableOpacity
                    onPress={() =>
                      updateFormData(
                        'notifications.eventUpdates',
                        !formData.notifications.eventUpdates
                      )
                    }
                    className="flex-row justify-between items-center p-3 bg-neutral-50 rounded-xl"
                  >
                    <View className="flex-1">
                      <Text className="text-base font-medium text-neutral-900">
                        イベント更新通知
                      </Text>
                      <Text className="text-sm text-neutral-600">
                        参加中のイベントの変更をお知らせ
                      </Text>
                    </View>
                    <View
                      className={`w-12 h-6 rounded-full ${
                        formData.notifications.eventUpdates
                          ? 'bg-primary-600'
                          : 'bg-neutral-300'
                      }`}
                    >
                      <View
                        className={`w-5 h-5 rounded-full bg-white mt-0.5 ${
                          formData.notifications.eventUpdates
                            ? 'ml-6'
                            : 'ml-0.5'
                        }`}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      updateFormData(
                        'notifications.reminders',
                        !formData.notifications.reminders
                      )
                    }
                    className="flex-row justify-between items-center p-3 bg-neutral-50 rounded-xl"
                  >
                    <View className="flex-1">
                      <Text className="text-base font-medium text-neutral-900">
                        リマインダー通知
                      </Text>
                      <Text className="text-sm text-neutral-600">
                        イベント開催前の通知
                      </Text>
                    </View>
                    <View
                      className={`w-12 h-6 rounded-full ${
                        formData.notifications.reminders
                          ? 'bg-primary-600'
                          : 'bg-neutral-300'
                      }`}
                    >
                      <View
                        className={`w-5 h-5 rounded-full bg-white mt-0.5 ${
                          formData.notifications.reminders ? 'ml-6' : 'ml-0.5'
                        }`}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      updateFormData(
                        'notifications.suggestions',
                        !formData.notifications.suggestions
                      )
                    }
                    className="flex-row justify-between items-center p-3 bg-neutral-50 rounded-xl"
                  >
                    <View className="flex-1">
                      <Text className="text-base font-medium text-neutral-900">
                        レストラン提案通知
                      </Text>
                      <Text className="text-sm text-neutral-600">
                        新しい店舗の提案をお知らせ
                      </Text>
                    </View>
                    <View
                      className={`w-12 h-6 rounded-full ${
                        formData.notifications.suggestions
                          ? 'bg-primary-600'
                          : 'bg-neutral-300'
                      }`}
                    >
                      <View
                        className={`w-5 h-5 rounded-full bg-white mt-0.5 ${
                          formData.notifications.suggestions ? 'ml-6' : 'ml-0.5'
                        }`}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      updateFormData(
                        'notifications.follows',
                        !formData.notifications.follows
                      )
                    }
                    className="flex-row justify-between items-center p-3 bg-neutral-50 rounded-xl"
                  >
                    <View className="flex-1">
                      <Text className="text-base font-medium text-neutral-900">
                        フォロー通知
                      </Text>
                      <Text className="text-sm text-neutral-600">
                        新しいフォロワーの通知
                      </Text>
                    </View>
                    <View
                      className={`w-12 h-6 rounded-full ${
                        formData.notifications.follows
                          ? 'bg-primary-600'
                          : 'bg-neutral-300'
                      }`}
                    >
                      <View
                        className={`w-5 h-5 rounded-full bg-white mt-0.5 ${
                          formData.notifications.follows ? 'ml-6' : 'ml-0.5'
                        }`}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>

            {/* プライバシー設定 */}
            <Card variant="elevated" shadow="soft">
              <View className="gap-4">
                <View className="flex-row items-center gap-3 mb-2">
                  <View className="w-10 h-10 rounded-2xl bg-purple-100 justify-center items-center">
                    <Ionicons
                      name="shield-checkmark"
                      size={20}
                      color="#7c3aed"
                    />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    プライバシー設定
                  </Text>
                </View>

                <View className="gap-3">
                  <TouchableOpacity
                    onPress={() =>
                      updateFormData(
                        'privacy.shareRecords',
                        !formData.privacy.shareRecords
                      )
                    }
                    className="flex-row justify-between items-center p-3 bg-neutral-50 rounded-xl"
                  >
                    <View className="flex-1">
                      <Text className="text-base font-medium text-neutral-900">
                        記録の共有
                      </Text>
                      <Text className="text-sm text-neutral-600">
                        開催記録を他の幹事と共有する
                      </Text>
                    </View>
                    <View
                      className={`w-12 h-6 rounded-full ${
                        formData.privacy.shareRecords
                          ? 'bg-primary-600'
                          : 'bg-neutral-300'
                      }`}
                    >
                      <View
                        className={`w-5 h-5 rounded-full bg-white mt-0.5 ${
                          formData.privacy.shareRecords ? 'ml-6' : 'ml-0.5'
                        }`}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      updateFormData(
                        'privacy.useCompanyInfo',
                        !formData.privacy.useCompanyInfo
                      )
                    }
                    className="flex-row justify-between items-center p-3 bg-neutral-50 rounded-xl"
                  >
                    <View className="flex-1">
                      <Text className="text-base font-medium text-neutral-900">
                        会社情報を利用
                      </Text>
                      <Text className="text-sm text-neutral-600">
                        同じ会社の記録を優先表示する
                      </Text>
                    </View>
                    <View
                      className={`w-12 h-6 rounded-full ${
                        formData.privacy.useCompanyInfo
                          ? 'bg-primary-600'
                          : 'bg-neutral-300'
                      }`}
                    >
                      <View
                        className={`w-5 h-5 rounded-full bg-white mt-0.5 ${
                          formData.privacy.useCompanyInfo ? 'ml-6' : 'ml-0.5'
                        }`}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
