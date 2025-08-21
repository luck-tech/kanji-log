import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Colors } from '@/constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MemberEditModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (memberData: MemberEditData) => void;
  initialData?: MemberEditData;
}

export interface MemberEditData {
  name: string;
  department?: string;
  notes?: string;
  preferences: {
    allergies: string[];
    favoriteGenres: string[];
    budgetRange: { min: number; max: number };
    alcoholPreference: 'yes' | 'no' | 'sometimes';
    dietaryRestrictions: string[];
  };
}

const GENRE_OPTIONS = [
  '和食',
  'イタリアン',
  'フレンチ',
  '中華',
  '韓国料理',
  '焼肉',
  '寿司',
  'ラーメン',
  'カフェ',
  'バー',
  '居酒屋',
  'その他',
];

const ALLERGY_OPTIONS = [
  '魚介類',
  '甲殻類',
  '卵',
  '乳製品',
  '小麦',
  '大豆',
  'ナッツ類',
  'そば',
  '肉類',
  'その他',
];

const DIETARY_OPTIONS = [
  'ベジタリアン対応希望',
  'ヴィーガン対応希望',
  'ハラル対応希望',
  '低塩分希望',
  '低糖質希望',
  'グルテンフリー希望',
];

export const MemberEditModal: React.FC<MemberEditModalProps> = ({
  isVisible,
  onClose,
  onSave,
  initialData,
}) => {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState<MemberEditData>(
    initialData || {
      name: '',
      department: '',
      notes: '',
      preferences: {
        allergies: [],
        favoriteGenres: [],
        budgetRange: { min: 3000, max: 5000 },
        alcoholPreference: 'yes',
        dietaryRestrictions: [],
      },
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newAllergy, setNewAllergy] = useState('');
  const [newDietary, setNewDietary] = useState('');

  const resetForm = () => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        department: '',
        notes: '',
        preferences: {
          allergies: [],
          favoriteGenres: [],
          budgetRange: { min: 3000, max: 5000 },
          alcoholPreference: 'yes',
          dietaryRestrictions: [],
        },
      });
    }
    setErrors({});
    setNewAllergy('');
    setNewDietary('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '名前は必須です';
    }

    if (
      formData.preferences.budgetRange.min >=
      formData.preferences.budgetRange.max
    ) {
      newErrors.budget = '予算の最小値は最大値より小さくしてください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave(formData);
    handleClose();
  };

  const toggleGenre = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        favoriteGenres: prev.preferences.favoriteGenres.includes(genre)
          ? prev.preferences.favoriteGenres.filter((g) => g !== genre)
          : [...prev.preferences.favoriteGenres, genre],
      },
    }));
  };

  const addCustomAllergy = () => {
    if (
      newAllergy.trim() &&
      !formData.preferences.allergies.includes(newAllergy.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          allergies: [...prev.preferences.allergies, newAllergy.trim()],
        },
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        allergies: prev.preferences.allergies.filter((a) => a !== allergy),
      },
    }));
  };

  const addCustomDietary = () => {
    if (
      newDietary.trim() &&
      !formData.preferences.dietaryRestrictions.includes(newDietary.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          dietaryRestrictions: [
            ...prev.preferences.dietaryRestrictions,
            newDietary.trim(),
          ],
        },
      }));
      setNewDietary('');
    }
  };

  const removeDietary = (dietary: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        dietaryRestrictions: prev.preferences.dietaryRestrictions.filter(
          (d) => d !== dietary
        ),
      },
    }));
  };

  const toggleDietary = (dietary: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        dietaryRestrictions: prev.preferences.dietaryRestrictions.includes(
          dietary
        )
          ? prev.preferences.dietaryRestrictions.filter((d) => d !== dietary)
          : [...prev.preferences.dietaryRestrictions, dietary],
      },
    }));
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.neutral[900]} />
            </TouchableOpacity>
            <Text style={styles.title}>
              {initialData ? 'メンバー編集' : 'メンバー追加'}
            </Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* 基本情報 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.blueIcon]}>
                    <Ionicons name="person" size={20} color="#3b82f6" />
                  </View>
                  <Text style={styles.sectionTitle}>基本情報</Text>
                </View>

                <View style={styles.formFields}>
                  <Input
                    label="名前 *"
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, name: text }))
                    }
                    placeholder="田中太郎"
                    error={errors.name}
                    leftIcon={
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color="#9ca3af"
                      />
                    }
                  />

                  <Input
                    label="部署"
                    value={formData.department || ''}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, department: text }))
                    }
                    placeholder="営業部"
                    leftIcon={
                      <Ionicons
                        name="business-outline"
                        size={20}
                        color="#9ca3af"
                      />
                    }
                  />
                </View>
              </View>
            </Card>

            {/* 好みのジャンル */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.orangeIcon]}>
                    <Ionicons name="restaurant" size={20} color="#ea580c" />
                  </View>
                  <Text style={styles.sectionTitle}>好みのジャンル</Text>
                </View>

                <View style={styles.chipsContainer}>
                  {GENRE_OPTIONS.map((genre) => {
                    const isSelected =
                      formData.preferences.favoriteGenres.includes(genre);
                    return (
                      <TouchableOpacity
                        key={genre}
                        onPress={() => toggleGenre(genre)}
                        style={[
                          styles.chip,
                          isSelected
                            ? styles.chipSelected
                            : styles.chipUnselected,
                        ]}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isSelected
                              ? styles.chipTextSelected
                              : styles.chipTextUnselected,
                          ]}
                        >
                          {genre}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Card>

            {/* 予算設定 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.greenIcon]}>
                    <Ionicons name="cash" size={20} color="#16a34a" />
                  </View>
                  <Text style={styles.sectionTitle}>予算設定</Text>
                </View>

                <View style={styles.budgetContainer}>
                  <View style={styles.budgetRow}>
                    <Input
                      label="最小金額"
                      value={formData.preferences.budgetRange.min.toString()}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 0;
                        setFormData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            budgetRange: {
                              ...prev.preferences.budgetRange,
                              min: value,
                            },
                          },
                        }));
                      }}
                      keyboardType="numeric"
                      placeholder="3000"
                      style={styles.budgetInput}
                      rightIcon={<Text style={styles.currencyText}>円</Text>}
                    />
                    <Input
                      label="最大金額"
                      value={formData.preferences.budgetRange.max.toString()}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 0;
                        setFormData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            budgetRange: {
                              ...prev.preferences.budgetRange,
                              max: value,
                            },
                          },
                        }));
                      }}
                      keyboardType="numeric"
                      placeholder="5000"
                      style={styles.budgetInput}
                      rightIcon={<Text style={styles.currencyText}>円</Text>}
                    />
                  </View>
                  {errors.budget && (
                    <Text style={styles.errorText}>{errors.budget}</Text>
                  )}
                </View>
              </View>
            </Card>

            {/* アルコール */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.purpleIcon]}>
                    <Ionicons name="wine" size={20} color="#7c3aed" />
                  </View>
                  <Text style={styles.sectionTitle}>アルコール</Text>
                </View>

                <View style={styles.alcoholOptions}>
                  {[
                    { value: 'yes', label: '飲む', icon: '🍺' },
                    { value: 'sometimes', label: 'たまに飲む', icon: '🍷' },
                    { value: 'no', label: '飲まない', icon: '🚫' },
                  ].map((option) => {
                    const isSelected =
                      formData.preferences.alcoholPreference === option.value;
                    return (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() =>
                          setFormData((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              alcoholPreference: option.value as
                                | 'yes'
                                | 'no'
                                | 'sometimes',
                            },
                          }))
                        }
                        style={[
                          styles.alcoholOption,
                          isSelected
                            ? styles.alcoholOptionSelected
                            : styles.alcoholOptionUnselected,
                        ]}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.alcoholIcon}>{option.icon}</Text>
                        <Text
                          style={[
                            styles.alcoholText,
                            isSelected
                              ? styles.alcoholTextSelected
                              : styles.alcoholTextUnselected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Card>

            {/* アレルギー */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.redIcon]}>
                    <Ionicons name="warning" size={20} color="#dc2626" />
                  </View>
                  <Text style={styles.sectionTitle}>アレルギー・苦手食材</Text>
                </View>

                <View style={styles.allergySection}>
                  {/* 現在のアレルギー */}
                  {formData.preferences.allergies.length > 0 && (
                    <View style={styles.currentAllergies}>
                      <Text style={styles.subsectionTitle}>現在の設定</Text>
                      <View style={styles.allergyList}>
                        {formData.preferences.allergies.map((allergy) => (
                          <View key={allergy} style={styles.allergyTag}>
                            <Text style={styles.allergyTagText}>{allergy}</Text>
                            <TouchableOpacity
                              onPress={() => removeAllergy(allergy)}
                              style={styles.removeButton}
                            >
                              <Ionicons
                                name="close"
                                size={16}
                                color={Colors.error[600]}
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* よくあるアレルギー */}
                  <View style={styles.commonAllergies}>
                    <Text style={styles.subsectionTitle}>
                      よくあるアレルギー
                    </Text>
                    <View style={styles.chipsContainer}>
                      {ALLERGY_OPTIONS.map((allergy) => {
                        const isSelected =
                          formData.preferences.allergies.includes(allergy);
                        return (
                          <TouchableOpacity
                            key={allergy}
                            onPress={() => {
                              if (isSelected) {
                                removeAllergy(allergy);
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  preferences: {
                                    ...prev.preferences,
                                    allergies: [
                                      ...prev.preferences.allergies,
                                      allergy,
                                    ],
                                  },
                                }));
                              }
                            }}
                            style={[
                              styles.chip,
                              isSelected
                                ? styles.chipDangerSelected
                                : styles.chipUnselected,
                            ]}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.chipText,
                                isSelected
                                  ? styles.chipTextDangerSelected
                                  : styles.chipTextUnselected,
                              ]}
                            >
                              {allergy}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* カスタムアレルギー追加 */}
                  <View style={styles.customAllergy}>
                    <Text style={styles.subsectionTitle}>
                      その他のアレルギー
                    </Text>
                    <View style={styles.inputWithButton}>
                      <Input
                        value={newAllergy}
                        onChangeText={setNewAllergy}
                        placeholder="カスタムアレルギーを入力"
                        style={styles.customInput}
                      />
                      <Button
                        title="追加"
                        onPress={addCustomAllergy}
                        variant="outline"
                        size="sm"
                        disabled={!newAllergy.trim()}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </Card>

            {/* 食事制限 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.tealIcon]}>
                    <Ionicons name="leaf" size={20} color="#0d9488" />
                  </View>
                  <Text style={styles.sectionTitle}>食事制限・配慮事項</Text>
                </View>

                <View style={styles.dietarySection}>
                  {/* 現在の制限 */}
                  {formData.preferences.dietaryRestrictions.length > 0 && (
                    <View style={styles.currentDietary}>
                      <Text style={styles.subsectionTitle}>現在の設定</Text>
                      <View style={styles.dietaryList}>
                        {formData.preferences.dietaryRestrictions.map(
                          (dietary) => (
                            <View key={dietary} style={styles.dietaryTag}>
                              <Text style={styles.dietaryTagText}>
                                {dietary}
                              </Text>
                              <TouchableOpacity
                                onPress={() => removeDietary(dietary)}
                                style={styles.removeButton}
                              >
                                <Ionicons
                                  name="close"
                                  size={16}
                                  color={Colors.secondary[600]}
                                />
                              </TouchableOpacity>
                            </View>
                          )
                        )}
                      </View>
                    </View>
                  )}

                  {/* よくある制限 */}
                  <View style={styles.commonDietary}>
                    <Text style={styles.subsectionTitle}>よくある配慮事項</Text>
                    <View style={styles.chipsContainer}>
                      {DIETARY_OPTIONS.map((dietary) => {
                        const isSelected =
                          formData.preferences.dietaryRestrictions.includes(
                            dietary
                          );
                        return (
                          <TouchableOpacity
                            key={dietary}
                            onPress={() => toggleDietary(dietary)}
                            style={[
                              styles.chip,
                              isSelected
                                ? styles.chipInfoSelected
                                : styles.chipUnselected,
                            ]}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.chipText,
                                isSelected
                                  ? styles.chipTextInfoSelected
                                  : styles.chipTextUnselected,
                              ]}
                            >
                              {dietary}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* カスタム制限追加 */}
                  <View style={styles.customDietary}>
                    <Text style={styles.subsectionTitle}>その他の配慮事項</Text>
                    <View style={styles.inputWithButton}>
                      <Input
                        value={newDietary}
                        onChangeText={setNewDietary}
                        placeholder="カスタム配慮事項を入力"
                        style={styles.customInput}
                      />
                      <Button
                        title="追加"
                        onPress={addCustomDietary}
                        variant="outline"
                        size="sm"
                        disabled={!newDietary.trim()}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </Card>

            {/* メモ */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.yellowIcon]}>
                    <Ionicons name="document-text" size={20} color="#d97706" />
                  </View>
                  <Text style={styles.sectionTitle}>メモ</Text>
                </View>

                <Input
                  label="その他メモ"
                  value={formData.notes || ''}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, notes: text }))
                  }
                  placeholder="その他の特記事項や備考があれば入力してください"
                  multiline
                  numberOfLines={3}
                  style={styles.memoInput}
                />
              </View>
            </Card>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
          <View style={styles.buttonContainer}>
            <Button
              title={initialData ? '更新' : '追加'}
              onPress={handleSave}
              variant="gradient"
              size="lg"
              fullWidth
            />
            <Button
              title="キャンセル"
              onPress={handleClose}
              variant="outline"
              size="lg"
              fullWidth
            />
          </View>
        </View>
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
    backgroundColor: Colors.white,
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  section: {
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
  blueIcon: {
    backgroundColor: Colors.primary[100],
  },
  orangeIcon: {
    backgroundColor: Colors.accent[100],
  },
  greenIcon: {
    backgroundColor: Colors.success[100],
  },
  purpleIcon: {
    backgroundColor: Colors.secondary[100],
  },
  redIcon: {
    backgroundColor: Colors.error[100],
  },
  tealIcon: {
    backgroundColor: '#e6fffa',
  },
  yellowIcon: {
    backgroundColor: Colors.warning[100],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  formFields: {
    gap: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipUnselected: {
    backgroundColor: Colors.white,
    borderColor: Colors.neutral[200],
  },
  chipSelected: {
    backgroundColor: Colors.primary[100],
    borderColor: Colors.primary[300],
  },
  chipDangerSelected: {
    backgroundColor: Colors.error[100],
    borderColor: Colors.error[300],
  },
  chipInfoSelected: {
    backgroundColor: '#e0f2fe',
    borderColor: '#7dd3fc',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chipTextUnselected: {
    color: Colors.neutral[700],
  },
  chipTextSelected: {
    color: Colors.primary[700],
  },
  chipTextDangerSelected: {
    color: Colors.error[700],
  },
  chipTextInfoSelected: {
    color: '#0369a1',
  },
  budgetContainer: {
    gap: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 12,
  },
  budgetInput: {
    flex: 1,
  },
  currencyText: {
    color: Colors.neutral[600],
    fontSize: 14,
  },
  errorText: {
    color: Colors.error[600],
    fontSize: 12,
    marginTop: 4,
  },
  alcoholOptions: {
    gap: 12,
  },
  alcoholOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  alcoholOptionUnselected: {
    backgroundColor: Colors.white,
    borderColor: Colors.neutral[200],
  },
  alcoholOptionSelected: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[300],
  },
  alcoholIcon: {
    fontSize: 24,
  },
  alcoholText: {
    fontSize: 14,
    fontWeight: '500',
  },
  alcoholTextUnselected: {
    color: Colors.neutral[700],
  },
  alcoholTextSelected: {
    color: Colors.primary[700],
  },
  allergySection: {
    gap: 16,
  },
  currentAllergies: {
    gap: 8,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
  },
  allergyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.error[100],
    borderRadius: 12,
  },
  allergyTagText: {
    fontSize: 12,
    color: Colors.error[700],
    fontWeight: '500',
  },
  removeButton: {
    padding: 2,
  },
  commonAllergies: {
    gap: 8,
  },
  customAllergy: {
    gap: 8,
  },
  inputWithButton: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  customInput: {
    flex: 1,
  },
  dietarySection: {
    gap: 16,
  },
  currentDietary: {
    gap: 8,
  },
  dietaryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dietaryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
  },
  dietaryTagText: {
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '500',
  },
  commonDietary: {
    gap: 8,
  },
  customDietary: {
    gap: 8,
  },
  memoInput: {
    minHeight: 80,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  buttonContainer: {
    gap: 12,
  },
});
