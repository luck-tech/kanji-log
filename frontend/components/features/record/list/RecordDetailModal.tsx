import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common';
import { SharedRecord } from '@/types';
import { Colors } from '@/constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();

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

    return <View style={styles.starsContainer}>{stars}</View>;
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>記録詳細</Text>
            <TouchableOpacity onPress={handleShare} style={styles.closeButton}>
              <Ionicons name="share-outline" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, { paddingBottom: insets.bottom }]}>
            {/* 店舗情報カード */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.venueHeader}>
                  <View style={[styles.iconContainer, styles.primaryIcon]}>
                    <Ionicons name="restaurant" size={24} color="#0284c7" />
                  </View>
                  <View style={styles.venueInfo}>
                    <Text style={styles.venueName}>
                      {record.eventLog.venue?.name || 'レストラン名'}
                    </Text>
                    <Text style={styles.venueGenre}>
                      {record.eventLog.venue?.genre || 'ジャンル'} •{' '}
                      {record.eventLog.venue?.area || 'エリア'}
                    </Text>
                  </View>
                </View>

                <View style={styles.ratingContainer}>
                  <View style={styles.starsRow}>
                    {renderStars(record.eventLog.rating)}
                    <Text style={styles.ratingNumber}>
                      {record.eventLog.rating}
                    </Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingLabel}>
                      {getRatingLabel(record.eventLog.rating)}
                    </Text>
                  </View>
                </View>

                {/* 住所 */}
                <View style={styles.infoCard}>
                  <Text style={styles.infoCardLabel}>住所</Text>
                  <Text style={styles.infoCardValue}>
                    {record.eventLog.venue?.address || '住所情報なし'}
                  </Text>
                </View>

                {/* 予算 */}
                <View style={styles.budgetCard}>
                  <Text style={styles.budgetLabel}>予算（一人あたり）</Text>
                  <Text style={styles.budgetValue}>
                    ¥{record.eventLog.costPerPerson?.toLocaleString() || '不明'}
                  </Text>
                </View>
              </View>
            </Card>

            {/* イベント情報 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.blueIcon]}>
                    <Ionicons name="calendar" size={20} color="#0284c7" />
                  </View>
                  <Text style={styles.sectionTitle}>イベント情報</Text>
                </View>

                <View style={styles.eventInfo}>
                  <View style={styles.eventInfoRow}>
                    <Text style={styles.eventInfoLabel}>目的</Text>
                    <Text style={styles.eventInfoValue}>
                      {getPurposeLabel(record.event.purpose)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={onUserPress}
                    style={styles.organizerRow}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.eventInfoLabel}>幹事名</Text>
                    <View style={styles.organizerInfo}>
                      <Text style={styles.organizerName}>
                        {record.organizer.name}さん
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#0284c7"
                      />
                    </View>
                  </TouchableOpacity>

                  <View style={styles.eventInfoRowNeutral}>
                    <Text style={styles.eventInfoLabel}>参加者数</Text>
                    <Text style={styles.eventInfoValueNeutral}>
                      {record.participantCount}名
                    </Text>
                  </View>

                  <View style={styles.eventInfoRowNeutral}>
                    <Text style={styles.eventInfoLabel}>開催日</Text>
                    <Text style={styles.eventInfoValueNeutral}>
                      {formatDate(record.eventDate)}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* 評価理由・記録メモ */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.amberIcon]}>
                    <Ionicons name="star" size={20} color="#f59e0b" />
                  </View>
                  <Text style={styles.sectionTitle}>評価理由・記録メモ</Text>
                </View>

                <View style={styles.notesCard}>
                  <Text style={styles.notesText}>
                    {record.eventLog.notes || '特記事項なし'}
                  </Text>
                </View>
              </View>
            </Card>

            {/* 画像 */}
            {record.images && record.images.length > 0 && (
              <Card variant="elevated" shadow="none">
                <View style={styles.cardContent}>
                  <View style={styles.sectionHeader}>
                    <View style={[styles.iconContainer, styles.purpleIcon]}>
                      <Ionicons name="images" size={20} color="#8b5cf6" />
                    </View>
                    <Text style={styles.sectionTitle}>お店の写真</Text>
                  </View>

                  {/* 画像プレースホルダー（実際の画像表示機能は別途実装） */}
                  <View style={styles.imagesRow}>
                    {record.images.slice(0, 3).map((_, index) => (
                      <View key={index} style={styles.imagePlaceholder}>
                        <Ionicons
                          name="image-outline"
                          size={24}
                          color="#94a3b8"
                        />
                      </View>
                    ))}
                  </View>

                  <Text style={styles.imageNote}>画像表示機能は開発中です</Text>
                </View>
              </Card>
            )}

            {/* アクションボタン */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.greenIcon]}>
                    <Ionicons name="heart" size={20} color="#10b981" />
                  </View>
                  <Text style={styles.sectionTitle}>この記録を活用</Text>
                </View>

                <Text style={styles.actionDescription}>
                  この記録は他の幹事の実体験に基づいています。
                  同じエリアや目的のイベントを企画する際の参考にしてください。
                </Text>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={onLike}
                    style={[
                      styles.likeButton,
                      record.isLiked
                        ? styles.likeButtonActive
                        : styles.likeButtonInactive,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={record.isLiked ? 'heart' : 'heart-outline'}
                      size={20}
                      color={record.isLiked ? '#ef4444' : '#94a3b8'}
                    />
                    <Text
                      style={
                        record.isLiked
                          ? styles.likeTextActive
                          : styles.likeTextInactive
                      }
                    >
                      {record.likeCount}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleShare}
                    style={styles.shareButton}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="share-outline" size={20} color="white" />
                    <Text style={styles.shareButtonText}>共有する</Text>
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
  venueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryIcon: {
    backgroundColor: Colors.primary[100],
  },
  blueIcon: {
    backgroundColor: Colors.primary[100],
    width: 40,
    height: 40,
  },
  amberIcon: {
    backgroundColor: Colors.warning[100],
    width: 40,
    height: 40,
  },
  purpleIcon: {
    backgroundColor: Colors.secondary[100],
    width: 40,
    height: 40,
  },
  greenIcon: {
    backgroundColor: Colors.success[100],
    width: 40,
    height: 40,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  venueGenre: {
    color: Colors.neutral[600],
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingNumber: {
    color: Colors.neutral[900],
    fontWeight: '700',
    fontSize: 18,
  },
  ratingBadge: {
    backgroundColor: Colors.primary[100],
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  ratingLabel: {
    color: Colors.primary[700],
    fontWeight: '700',
    fontSize: 14,
  },
  infoCard: {
    padding: 12,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
  },
  infoCardLabel: {
    color: Colors.neutral[600],
    fontSize: 14,
    marginBottom: 4,
  },
  infoCardValue: {
    color: Colors.neutral[900],
    fontWeight: '500',
    fontSize: 16,
  },
  budgetCard: {
    padding: 12,
    backgroundColor: Colors.success[50],
    borderRadius: 12,
  },
  budgetLabel: {
    color: Colors.success[600],
    fontSize: 14,
    marginBottom: 4,
  },
  budgetValue: {
    color: Colors.success[900],
    fontWeight: '700',
    fontSize: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  eventInfo: {
    gap: 12,
  },
  eventInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.primary[50],
    borderRadius: 12,
  },
  eventInfoRowNeutral: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
  },
  organizerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
  },
  eventInfoLabel: {
    color: Colors.primary[700],
    fontWeight: '500',
  },
  eventInfoValue: {
    color: Colors.primary[900],
    fontWeight: '700',
  },
  eventInfoValueNeutral: {
    color: Colors.neutral[900],
    fontWeight: '700',
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  organizerName: {
    color: Colors.primary[600],
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  notesCard: {
    padding: 16,
    backgroundColor: Colors.warning[50],
    borderRadius: 12,
  },
  notesText: {
    color: Colors.neutral[700],
    lineHeight: 24,
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  imagePlaceholder: {
    flex: 1,
    height: 96,
    backgroundColor: Colors.neutral[200],
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNote: {
    fontSize: 12,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
  actionDescription: {
    color: Colors.neutral[600],
    fontSize: 14,
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  likeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  likeButtonActive: {
    backgroundColor: Colors.error[50],
    borderColor: Colors.error[200],
  },
  likeButtonInactive: {
    backgroundColor: 'white',
    borderColor: Colors.neutral[200],
  },
  likeTextActive: {
    fontWeight: '600',
    color: Colors.error[500],
  },
  likeTextInactive: {
    fontWeight: '600',
    color: Colors.neutral[600],
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary[500],
    borderRadius: 12,
  },
  shareButtonText: {
    fontWeight: '600',
    color: 'white',
  },
});
