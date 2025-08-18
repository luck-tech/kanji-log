import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { SharedRecord } from '@/types';

// Extended SharedRecord type for the modal
interface ExtendedSharedRecord extends SharedRecord {
  likeCount: number;
  isLiked: boolean;
  participantCount: number;
  eventDate: string;
  images?: string[];
  organizer: {
    id: string;
    name: string;
    company?: string;
    isSameCompany?: boolean;
  };
}

interface RecordDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  record: ExtendedSharedRecord | null;
  onLike?: () => void;
  onUserPress?: () => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
  isVisible,
  onClose,
  record,
  onLike,
  onUserPress,
}) => {
  if (!record) return null;

  const handleShare = async () => {
    const shareText = `【${record.event.title}の記録】${
      record.eventLog.venue?.name || 'レストラン'
    }

⭐ 評価: ${record.eventLog.rating}/5
💰 予算: 一人${record.eventLog.costPerPerson?.toLocaleString() || '不明'}円
👥 参加者: ${record.participantCount || '不明'}名
📝 記録メモ: ${record.eventLog.notes}

投稿者: ${record.organizer.name}さん

#幹事ナビ #飲み会記録`;

    try {
      await Share.share({
        message: shareText,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getPurposeLabel = (purpose: string): string => {
    const purposeMap: Record<string, string> = {
      welcome: '歓迎会',
      farewell: '送別会',
      celebration: 'お祝い',
      team_building: 'チームビルディング',
      casual: '親睦会',
      other: 'その他',
    };
    return purposeMap[purpose] || 'その他';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return '非常に良い';
    if (rating >= 3.5) return '良い';
    if (rating >= 2.5) return '普通';
    if (rating >= 1.5) return 'やや残念';
    return '残念';
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={20} color="#f59e0b" />);
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={20} color="#f59e0b" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={20}
          color="#d1d5db"
        />
      );
    }

    return <View className="flex-row gap-0.5">{stars}</View>;
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-neutral-50">
        {/* Header */}
        <View className="px-6 py-4 bg-white border-b border-neutral-200">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={onClose} className="p-2 -ml-2">
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-neutral-900">記録詳細</Text>
            <TouchableOpacity onPress={handleShare} className="p-2 -mr-2">
              <Ionicons name="share-outline" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6 gap-6">
            {/* 店舗情報カード */}
            <Card variant="elevated" shadow="none" animated={false}>
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 rounded-2xl bg-primary-100 justify-center items-center">
                    <Ionicons name="restaurant" size={24} color="#0284c7" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-neutral-900 mb-1">
                      {record.eventLog.venue?.name || 'レストラン名'}
                    </Text>
                    <Text className="text-neutral-600 text-base">
                      {record.eventLog.venue?.genre || 'ジャンル'} •
                      {record.eventLog.venue?.area || 'エリア'}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    {renderStars(record.eventLog.rating)}
                    <Text className="text-neutral-900 font-bold text-lg">
                      {record.eventLog.rating}
                    </Text>
                  </View>
                  <View className="bg-primary-100 rounded-full px-3 py-1">
                    <Text className="text-primary-700 font-bold text-sm">
                      {getRatingLabel(record.eventLog.rating)}
                    </Text>
                  </View>
                </View>

                {/* 住所 */}
                <View className="p-3 bg-neutral-50 rounded-xl">
                  <Text className="text-neutral-600 text-sm mb-1">住所</Text>
                  <Text className="text-neutral-900 font-medium text-base">
                    {record.eventLog.venue?.address || '住所情報なし'}
                  </Text>
                </View>

                {/* 予算 */}
                <View className="p-3 bg-success-50 rounded-xl">
                  <Text className="text-success-600 text-sm mb-1">
                    予算（一人あたり）
                  </Text>
                  <Text className="text-success-900 font-bold text-xl">
                    ¥{record.eventLog.costPerPerson?.toLocaleString() || '不明'}
                  </Text>
                </View>
              </View>
            </Card>

            {/* イベント情報 */}
            <Card variant="elevated" shadow="none">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-blue-100 justify-center items-center">
                    <Ionicons name="calendar" size={20} color="#0284c7" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    イベント情報
                  </Text>
                </View>

                <View className="gap-3">
                  <View className="flex-row justify-between items-center p-3 bg-blue-50 rounded-xl">
                    <Text className="text-blue-700 font-medium">目的</Text>
                    <Text className="text-blue-900 font-bold">
                      {getPurposeLabel(record.event.purpose)}
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-center p-3 bg-neutral-50 rounded-xl">
                    <Text className="text-neutral-600 font-medium">幹事名</Text>
                    <TouchableOpacity
                      onPress={onUserPress}
                      className="flex-row items-center gap-2"
                      activeOpacity={0.7}
                    >
                      <Text className="text-primary-600 font-bold underline">
                        {record.organizer.name}さん
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#0284c7"
                      />
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row justify-between items-center p-3 bg-neutral-50 rounded-xl">
                    <Text className="text-neutral-600 font-medium">
                      参加者数
                    </Text>
                    <Text className="text-neutral-900 font-bold">
                      {record.participantCount}名
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-center p-3 bg-neutral-50 rounded-xl">
                    <Text className="text-neutral-600 font-medium">開催日</Text>
                    <Text className="text-neutral-900 font-bold">
                      {formatDate(record.eventDate)}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* 評価理由・記録メモ */}
            <Card variant="elevated" shadow="none">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-amber-100 justify-center items-center">
                    <Ionicons name="star" size={20} color="#f59e0b" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    評価理由・記録メモ
                  </Text>
                </View>

                <View className="p-4 bg-amber-50 rounded-xl">
                  <Text className="text-neutral-700 leading-6">
                    {record.eventLog.notes || '特記事項なし'}
                  </Text>
                </View>
              </View>
            </Card>

            {/* 画像 */}
            {record.images && record.images.length > 0 && (
              <Card variant="elevated" shadow="none">
                <View className="gap-4">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-2xl bg-purple-100 justify-center items-center">
                      <Ionicons name="images" size={20} color="#8b5cf6" />
                    </View>
                    <Text className="text-lg font-semibold text-neutral-900">
                      お店の写真
                    </Text>
                  </View>

                  {/* 画像プレースホルダー（実際の画像表示機能は別途実装） */}
                  <View className="flex-row gap-2">
                    {record.images.slice(0, 3).map((_, index) => (
                      <View
                        key={index}
                        className="flex-1 h-24 bg-neutral-200 rounded-xl justify-center items-center"
                      >
                        <Ionicons
                          name="image-outline"
                          size={24}
                          color="#94a3b8"
                        />
                      </View>
                    ))}
                  </View>

                  <Text className="text-xs text-neutral-500 text-center">
                    画像表示機能は開発中です
                  </Text>
                </View>
              </Card>
            )}

            {/* アクションボタン */}
            <Card variant="elevated" shadow="none">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-green-100 justify-center items-center">
                    <Ionicons name="heart" size={20} color="#10b981" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    この記録を活用
                  </Text>
                </View>

                <Text className="text-neutral-600 text-sm leading-6">
                  この記録は他の幹事の実体験に基づいています。
                  同じエリアや目的のイベントを企画する際の参考にしてください。
                </Text>

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={onLike}
                    className={`flex-1 flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl border ${
                      record.isLiked
                        ? 'bg-red-50 border-red-200'
                        : 'bg-white border-neutral-200'
                    }`}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={record.isLiked ? 'heart' : 'heart-outline'}
                      size={20}
                      color={record.isLiked ? '#ef4444' : '#94a3b8'}
                    />
                    <Text
                      className={`font-semibold ${
                        record.isLiked ? 'text-red-500' : 'text-neutral-600'
                      }`}
                    >
                      {record.likeCount}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleShare}
                    className="flex-1 flex-row items-center justify-center gap-2 py-3 px-4 bg-primary-500 rounded-xl"
                    activeOpacity={0.8}
                  >
                    <Ionicons name="share-outline" size={20} color="white" />
                    <Text className="font-semibold text-white">共有する</Text>
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
