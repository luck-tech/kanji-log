import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

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
      <View className="flex-row gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRatingSelect(star)}
            className="p-1"
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
      <SafeAreaView className="flex-1 bg-neutral-50">
        {/* Header */}
        <View className="px-6 py-4 bg-white border-b border-neutral-200">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={handleClose} className="p-2 -ml-2">
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-neutral-900">開催記録</Text>
            <View className="w-10" />
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6 gap-6">
            {/* イベント情報 */}
            <Card variant="gradient" shadow="none" animated={false}>
              <View className="gap-3">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-white/20 justify-center items-center">
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                  </View>
                  <Text className="text-lg font-bold text-white">
                    {eventTitle}
                  </Text>
                </View>
                <Text className="text-white/90">
                  お疲れさまでした！イベントの記録を残して、今後の幹事業務に活かしましょう。
                </Text>
              </View>
            </Card>

            {/* 店舗情報 */}
            <Card variant="elevated" shadow="none">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-red-100 justify-center items-center">
                    <Ionicons name="restaurant" size={20} color="#ef4444" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    店舗情報
                  </Text>
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
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-yellow-100 justify-center items-center">
                    <Ionicons name="star" size={20} color="#f59e0b" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    総合評価
                  </Text>
                  {errors.rating && (
                    <Text className="text-sm text-error-600">*</Text>
                  )}
                </View>

                <View className="items-center gap-3">
                  {renderStars()}
                  <Text
                    className={`text-base font-medium ${
                      formData.rating > 0
                        ? 'text-neutral-900'
                        : 'text-neutral-500'
                    }`}
                  >
                    {getRatingLabel(formData.rating)}
                  </Text>
                </View>

                {errors.rating && (
                  <Text className="text-sm text-error-600">
                    {errors.rating}
                  </Text>
                )}
              </View>
            </Card>

            {/* 主観メモ */}
            <Card variant="elevated" shadow="none">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-blue-100 justify-center items-center">
                    <Ionicons name="document-text" size={20} color="#0284c7" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    主観メモ
                  </Text>
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

                <View className="p-3 bg-blue-50 rounded-xl">
                  <Text className="text-sm text-blue-800 leading-5">
                    💡 ここに書いたメモは、将来の幹事業務で大変役立ちます。
                    店の雰囲気、スタッフの対応、注意点など、思い出したことを自由に記録してください。
                  </Text>
                </View>
              </View>
            </Card>

            {/* 会計情報 */}
            <Card variant="elevated" shadow="none">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-green-100 justify-center items-center">
                    <Ionicons name="cash" size={20} color="#10b981" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    会計情報
                  </Text>
                  <Text className="text-sm text-neutral-500">（任意）</Text>
                </View>

                <View className="flex-row gap-3">
                  <Input
                    label="合計金額"
                    placeholder="25000"
                    value={formData.totalCost}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, totalCost: text }))
                    }
                    keyboardType="numeric"
                    className="flex-1"
                    error={errors.totalCost}
                  />
                  <Input
                    label="一人あたり"
                    placeholder="5000"
                    value={formData.costPerPerson}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, costPerPerson: text }))
                    }
                    keyboardType="numeric"
                    className="flex-1"
                    error={errors.costPerPerson}
                  />
                </View>

                <Text className="text-sm text-neutral-600 leading-5">
                  会計情報を記録しておくと、今後の予算設定の参考になります
                </Text>
              </View>
            </Card>

            {/* 共有設定 */}
            <Card variant="elevated" shadow="none">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-purple-100 justify-center items-center">
                    <Ionicons name="share-social" size={20} color="#7c3aed" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    共有設定
                  </Text>
                </View>

                <View className="flex-row items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <View className="flex-1 mr-4">
                    <Text className="text-base font-medium text-purple-900 mb-1">
                      他の幹事に記録を共有する
                    </Text>
                    <Text className="text-sm text-purple-700 leading-5">
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

                <View className="p-3 bg-amber-50 rounded-xl">
                  <View className="flex-row items-start gap-3">
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color="#f59e0b"
                    />
                    <Text className="text-sm text-amber-800 leading-5 flex-1">
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
        <View className="px-6 py-4 bg-white border-t border-neutral-200">
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
      </SafeAreaView>
    </Modal>
  );
};
