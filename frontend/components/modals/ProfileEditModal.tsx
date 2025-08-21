import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Colors } from '@/constants';

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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>プロフィール編集</Text>
            <TouchableOpacity onPress={handleSave} style={styles.closeButton}>
              <Text style={styles.saveButton}>保存</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* 基本情報 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.primaryIcon]}>
                    <Ionicons name="person" size={20} color="#0284c7" />
                  </View>
                  <Text style={styles.sectionTitle}>基本情報</Text>
                </View>

                <Input
                  label="名前"
                  placeholder="山田太郎"
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                  error={errors.name}
                />

                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>性別</Text>
                  <View style={styles.genreGrid}>
                    {genderOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => updateFormData('gender', option)}
                        style={[
                          styles.genreChip,
                          formData.gender === option
                            ? styles.genreChipSelected
                            : styles.genreChipUnselected,
                        ]}
                      >
                        <Text
                          style={
                            formData.gender === option
                              ? styles.genreChipTextSelected
                              : styles.genreChipTextUnselected
                          }
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>都道府県</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                  >
                    <View style={styles.horizontalContent}>
                      {prefectureOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          onPress={() => updateFormData('prefecture', option)}
                          style={[
                            styles.prefectureChip,
                            formData.prefecture === option
                              ? styles.genreChipSelected
                              : styles.genreChipUnselected,
                          ]}
                        >
                          <Text
                            style={
                              formData.prefecture === option
                                ? styles.genreChipTextSelected
                                : styles.genreChipTextUnselected
                            }
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
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.purpleIcon]}>
                    <Ionicons name="business" size={20} color="#7c3aed" />
                  </View>
                  <Text style={styles.sectionTitle}>会社情報</Text>
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
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.greenIcon]}>
                    <Ionicons name="call" size={20} color="#10b981" />
                  </View>
                  <Text style={styles.sectionTitle}>連絡先</Text>
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
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.orangeIcon]}>
                    <Ionicons name="wallet" size={20} color="#f59e0b" />
                  </View>
                  <Text style={styles.sectionTitle}>希望予算設定</Text>
                </View>

                <View style={styles.fieldRow}>
                  <View style={styles.fieldContainer}>
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
                  <View style={styles.fieldContainer}>
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
                  <Text style={styles.errorText}>{errors.budget}</Text>
                )}
              </View>
            </Card>

            {/* 通知設定 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.orangeIcon]}>
                    <Ionicons name="notifications" size={20} color="#f59e0b" />
                  </View>
                  <Text style={styles.sectionTitle}>通知設定</Text>
                </View>

                <View style={styles.switchContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      updateFormData(
                        'notifications.eventUpdates',
                        !formData.notifications.eventUpdates
                      )
                    }
                    style={styles.switchItem}
                  >
                    <View style={styles.switchContent}>
                      <Text style={styles.switchTitle}>イベント更新通知</Text>
                      <Text style={styles.switchDescription}>
                        参加中のイベントの変更をお知らせ
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.switch,
                        formData.notifications.eventUpdates
                          ? styles.switchActive
                          : styles.switchInactive,
                      ]}
                    >
                      <View
                        style={[
                          styles.switchThumb,
                          formData.notifications.eventUpdates
                            ? styles.switchThumbActive
                            : styles.switchThumbInactive,
                        ]}
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
                    style={styles.switchItem}
                  >
                    <View style={styles.switchContent}>
                      <Text style={styles.switchTitle}>リマインダー通知</Text>
                      <Text style={styles.switchDescription}>
                        イベント開催前の通知
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.switch,
                        formData.notifications.reminders
                          ? styles.switchActive
                          : styles.switchInactive,
                      ]}
                    >
                      <View
                        style={[
                          styles.switchThumb,
                          formData.notifications.reminders
                            ? styles.switchThumbActive
                            : styles.switchThumbInactive,
                        ]}
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
                    style={styles.switchItem}
                  >
                    <View style={styles.switchContent}>
                      <Text style={styles.switchTitle}>レストラン提案通知</Text>
                      <Text style={styles.switchDescription}>
                        新しい店舗の提案をお知らせ
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.switch,
                        formData.notifications.suggestions
                          ? styles.switchActive
                          : styles.switchInactive,
                      ]}
                    >
                      <View
                        style={[
                          styles.switchThumb,
                          formData.notifications.suggestions
                            ? styles.switchThumbActive
                            : styles.switchThumbInactive,
                        ]}
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
                    style={styles.switchItem}
                  >
                    <View style={styles.switchContent}>
                      <Text style={styles.switchTitle}>フォロー通知</Text>
                      <Text style={styles.switchDescription}>
                        新しいフォロワーの通知
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.switch,
                        formData.notifications.follows
                          ? styles.switchActive
                          : styles.switchInactive,
                      ]}
                    >
                      <View
                        style={[
                          styles.switchThumb,
                          formData.notifications.follows
                            ? styles.switchThumbActive
                            : styles.switchThumbInactive,
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>

            {/* プライバシー設定 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.purpleIcon]}>
                    <Ionicons
                      name="shield-checkmark"
                      size={20}
                      color="#7c3aed"
                    />
                  </View>
                  <Text style={styles.sectionTitle}>プライバシー設定</Text>
                </View>

                <View style={styles.switchContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      updateFormData(
                        'privacy.shareRecords',
                        !formData.privacy.shareRecords
                      )
                    }
                    style={styles.switchItem}
                  >
                    <View style={styles.switchContent}>
                      <Text style={styles.switchTitle}>記録の共有</Text>
                      <Text style={styles.switchDescription}>
                        開催記録を他の幹事と共有する
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.switch,
                        formData.privacy.shareRecords
                          ? styles.switchActive
                          : styles.switchInactive,
                      ]}
                    >
                      <View
                        style={[
                          styles.switchThumb,
                          formData.privacy.shareRecords
                            ? styles.switchThumbActive
                            : styles.switchThumbInactive,
                        ]}
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
                    style={styles.switchItem}
                  >
                    <View style={styles.switchContent}>
                      <Text style={styles.switchTitle}>会社情報を利用</Text>
                      <Text style={styles.switchDescription}>
                        同じ会社の記録を優先表示する
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.switch,
                        formData.privacy.useCompanyInfo
                          ? styles.switchActive
                          : styles.switchInactive,
                      ]}
                    >
                      <View
                        style={[
                          styles.switchThumb,
                          formData.privacy.useCompanyInfo
                            ? styles.switchThumbActive
                            : styles.switchThumbInactive,
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[600],
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  cardContent: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryIcon: {
    backgroundColor: Colors.primary[100],
  },
  orangeIcon: {
    backgroundColor: Colors.warning[100],
  },
  purpleIcon: {
    backgroundColor: Colors.secondary[100],
  },
  greenIcon: {
    backgroundColor: Colors.success[100],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 12,
    backgroundColor: 'white',
  },
  picker: {
    height: 48,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: Colors.neutral[900],
  },
  rangeContainer: {
    paddingVertical: 8,
  },
  rangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rangeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[900],
  },
  rangeValue: {
    fontSize: 14,
    color: Colors.primary[600],
    fontWeight: '600',
  },
  genreContainer: {
    gap: 12,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  genreChipSelected: {
    backgroundColor: Colors.primary[100],
    borderColor: Colors.primary[300],
  },
  genreChipUnselected: {
    backgroundColor: 'white',
    borderColor: Colors.neutral[300],
  },
  genreChipTextSelected: {
    color: Colors.primary[700],
    fontSize: 14,
    fontWeight: '500',
  },
  genreChipTextUnselected: {
    color: Colors.neutral[600],
    fontSize: 14,
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  horizontalContent: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  prefectureChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error[600],
  },
  switchContainer: {
    gap: 12,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
  },
  switchContent: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[900],
  },
  switchDescription: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
  switch: {
    width: 48,
    height: 24,
    borderRadius: 12,
  },
  switchActive: {
    backgroundColor: Colors.primary[600],
  },
  switchInactive: {
    backgroundColor: Colors.neutral[300],
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: 2,
  },
  switchThumbActive: {
    marginLeft: 24,
  },
  switchThumbInactive: {
    marginLeft: 2,
  },
});
