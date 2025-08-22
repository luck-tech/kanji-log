import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Button, Input } from '@/components/common';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface EventLogModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (logData: EventLogData) => void;
  eventTitle: string;
  venue?: {
    name: string;
    address: string;
    genre?: string;
  };
}

export interface EventLogData {
  rating: number;
  notes: string;
  totalCost: string;
  costPerPerson: string;
  isShared: boolean;
  venue: {
    name: string;
    address: string;
    genre?: string;
  };
}

export const EventLogModal: React.FC<EventLogModalProps> = ({
  isVisible,
  onClose,
  onSave,
  eventTitle,
  venue,
}) => {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState<EventLogData>({
    rating: 0,
    notes: '',
    totalCost: '',
    costPerPerson: '',
    isShared: false,
    venue: venue || { name: '', address: '' },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      rating: 0,
      notes: '',
      totalCost: '',
      costPerPerson: '',
      isShared: false,
      venue: venue || { name: '', address: '' },
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.rating === 0) {
      newErrors.rating = '評価を選択してください';
    }

    if (!formData.venue.name.trim()) {
      newErrors.venueName = '店舗名は必須です';
    }

    if (formData.totalCost && isNaN(Number(formData.totalCost))) {
      newErrors.totalCost = '正しい金額を入力してください';
    }

    if (formData.costPerPerson && isNaN(Number(formData.costPerPerson))) {
      newErrors.costPerPerson = '正しい金額を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave(formData);
    resetForm();
    onClose();
  };

  const handleRatingSelect = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRatingSelect(star)}
            style={styles.starButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={star <= formData.rating ? 'star' : 'star-outline'}
              size={32}
              color={star <= formData.rating ? '#f59e0b' : '#d1d5db'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getRatingLabel = (rating: number) => {
    const labels = {
      0: '評価を選択',
      1: '期待を下回った',
      2: 'やや不満',
      3: '普通',
      4: '良かった',
      5: '非常に良かった',
    };
    return labels[rating as keyof typeof labels] || '';
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
            <Text style={styles.headerTitle}>開催記録</Text>
            <View style={styles.headerSpacer} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* イベント情報 */}
            <View style={styles.eventInfoCard}>
              <LinearGradient
                colors={[Colors.primary[500], Colors.primary[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.eventInfoGradient}
              >
                <View style={styles.eventInfoSection}>
                  <View style={styles.eventInfoHeader}>
                    <View style={styles.eventIcon}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="white"
                      />
                    </View>
                    <Text style={styles.eventTitle}>{eventTitle}</Text>
                  </View>
                  <Text style={styles.eventDescription}>
                    お疲れさまでした！イベントの記録を残して、今後の幹事業務に活かしましょう。
                  </Text>
                </View>
              </LinearGradient>
            </View>

            {/* 店舗情報 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.venueIcon]}>
                    <Ionicons name="restaurant" size={20} color="#ef4444" />
                  </View>
                  <Text style={styles.sectionTitle}>店舗情報</Text>
                </View>

                <Input
                  label="店舗名 *"
                  placeholder="例：居酒屋花月"
                  value={formData.venue.name}
                  onChangeText={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      venue: { ...prev.venue, name: text },
                    }))
                  }
                  error={errors.venueName}
                />

                <Input
                  label="住所・エリア"
                  placeholder="例：東京都渋谷区"
                  value={formData.venue.address}
                  onChangeText={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      venue: { ...prev.venue, address: text },
                    }))
                  }
                />

                <Input
                  label="ジャンル"
                  placeholder="例：居酒屋、イタリアン"
                  value={formData.venue.genre}
                  onChangeText={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      venue: { ...prev.venue, genre: text },
                    }))
                  }
                />
              </View>
            </Card>

            {/* 評価 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.ratingIcon]}>
                    <Ionicons name="star" size={20} color="#f59e0b" />
                  </View>
                  <Text style={styles.sectionTitle}>総合評価</Text>
                  {errors.rating && (
                    <Text style={styles.requiredIndicator}>*</Text>
                  )}
                </View>

                <View style={styles.ratingSection}>
                  {renderStars()}
                  <Text
                    style={[
                      styles.ratingLabel,
                      formData.rating > 0
                        ? styles.ratingLabelActive
                        : styles.ratingLabelInactive,
                    ]}
                  >
                    {getRatingLabel(formData.rating)}
                  </Text>
                </View>

                {errors.rating && (
                  <Text style={styles.errorText}>{errors.rating}</Text>
                )}
              </View>
            </Card>

            {/* 主観メモ */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.notesIcon]}>
                    <Ionicons name="document-text" size={20} color="#0284c7" />
                  </View>
                  <Text style={styles.sectionTitle}>主観メモ</Text>
                </View>

                <Input
                  placeholder="例：個室で落ち着いて話せた。料理のボリュームも良好。次回もリピートしたい。"
                  value={formData.notes}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, notes: text }))
                  }
                  multiline
                  numberOfLines={4}
                />

                <View style={styles.memoTip}>
                  <Text style={styles.memoTipText}>
                    💡 ここに書いたメモは、将来の幹事業務で大変役立ちます。
                    店の雰囲気、スタッフの対応、注意点など、思い出したことを自由に記録してください。
                  </Text>
                </View>
              </View>
            </Card>

            {/* 会計情報 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.costIcon]}>
                    <Ionicons name="cash" size={20} color="#10b981" />
                  </View>
                  <Text style={styles.sectionTitle}>会計情報</Text>
                  <Text style={styles.optionalLabel}>（任意）</Text>
                </View>

                <View style={styles.costInputsRow}>
                  <View style={styles.costInputContainer}>
                    <Input
                      label="合計金額"
                      placeholder="25000"
                      value={formData.totalCost}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, totalCost: text }))
                      }
                      keyboardType="numeric"
                      error={errors.totalCost}
                    />
                  </View>
                  <View style={styles.costInputContainer}>
                    <Input
                      label="一人あたり"
                      placeholder="5000"
                      value={formData.costPerPerson}
                      onChangeText={(text) =>
                        setFormData((prev) => ({
                          ...prev,
                          costPerPerson: text,
                        }))
                      }
                      keyboardType="numeric"
                      error={errors.costPerPerson}
                    />
                  </View>
                </View>

                <Text style={styles.costDescription}>
                  会計情報を記録しておくと、今後の予算設定の参考になります
                </Text>
              </View>
            </Card>

            {/* 共有設定 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.shareIcon]}>
                    <Ionicons name="share-social" size={20} color="#7c3aed" />
                  </View>
                  <Text style={styles.sectionTitle}>共有設定</Text>
                </View>

                <View style={styles.shareOption}>
                  <View style={styles.shareOptionContent}>
                    <Text style={styles.shareOptionTitle}>
                      他の幹事に記録を共有する
                    </Text>
                    <Text style={styles.shareOptionDescription}>
                      店舗情報と評価のみ共有されます。メンバー名や主観メモは非公開です。
                    </Text>
                  </View>
                  <Switch
                    value={formData.isShared}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, isShared: value }))
                    }
                    trackColor={{ false: '#e5e7eb', true: '#a855f7' }}
                    thumbColor={formData.isShared ? '#ffffff' : '#f9fafb'}
                  />
                </View>

                <View style={styles.shareInfo}>
                  <View style={styles.shareInfoContent}>
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color="#f59e0b"
                    />
                    <Text style={styles.shareInfoText}>
                      共有することで、他の幹事の記録も閲覧できるようになります。
                      みんなの知見を活用して、より良いお店選びができます。
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
          <Button
            title="記録を保存"
            onPress={handleSave}
            variant="gradient"
            size="lg"
            fullWidth
            disabled={formData.rating === 0 || !formData.venue.name.trim()}
            icon={<Ionicons name="save" size={20} color="white" />}
          />
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
    paddingHorizontal: Layout.padding.lg,
    paddingVertical: Layout.padding.md,
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
    padding: Layout.spacing.sm,
    marginLeft: -Layout.spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Layout.padding.lg,
    gap: Layout.spacing.lg,
  },
  eventInfoCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  eventInfoGradient: {
    padding: Layout.padding.lg,
    borderRadius: 16,
  },
  eventInfoSection: {
    gap: Layout.spacing.sm,
  },
  eventInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  eventDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    gap: Layout.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  venueIcon: {
    backgroundColor: '#fee2e2',
  },
  ratingIcon: {
    backgroundColor: '#fef3c7',
  },
  notesIcon: {
    backgroundColor: Colors.primary[100],
  },
  costIcon: {
    backgroundColor: Colors.success[100],
  },
  shareIcon: {
    backgroundColor: '#f3e8ff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  requiredIndicator: {
    fontSize: 14,
    color: Colors.error[600],
  },
  optionalLabel: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  starsContainer: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  starButton: {
    padding: Layout.spacing.xs,
  },
  ratingSection: {
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  ratingLabelActive: {
    color: Colors.neutral[900],
  },
  ratingLabelInactive: {
    color: Colors.neutral[500],
  },
  errorText: {
    fontSize: 14,
    color: Colors.error[600],
  },
  memoTip: {
    padding: Layout.spacing.sm,
    backgroundColor: Colors.primary[50],
    borderRadius: Layout.borderRadius.md,
  },
  memoTipText: {
    fontSize: 14,
    color: Colors.primary[800],
    lineHeight: 20,
  },
  costInputsRow: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  costInputContainer: {
    flex: 1,
  },
  costDescription: {
    fontSize: 14,
    color: Colors.neutral[600],
    lineHeight: 20,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Layout.spacing.md,
    backgroundColor: '#f9f5ff',
    borderRadius: Layout.borderRadius.md,
  },
  shareOptionContent: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  shareOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#581c87',
    marginBottom: Layout.spacing.xs,
  },
  shareOptionDescription: {
    fontSize: 14,
    color: '#7c3aed',
    lineHeight: 20,
  },
  shareInfo: {
    padding: Layout.spacing.sm,
    backgroundColor: '#fffbeb',
    borderRadius: Layout.borderRadius.md,
  },
  shareInfoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Layout.spacing.sm,
  },
  shareInfoText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
    flex: 1,
  },
  footer: {
    paddingHorizontal: Layout.padding.lg,
    paddingVertical: Layout.padding.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
});
