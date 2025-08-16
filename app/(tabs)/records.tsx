import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { BookOpen, Star, MapPin, DollarSign, Lock, Share2, Clock as Unlock } from 'lucide-react-native';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { SharedRecord, EventPurpose } from '@/types';

// Mock data
const mockSharedRecords: SharedRecord[] = [
  {
    id: '1',
    eventLog: {
      id: '1',
      eventId: '1',
      organizerId: '2',
      rating: 4.5,
      notes: '雰囲気が良くて料理も美味しかった。予約が取りやすく、大人数でも対応してくれる。',
      totalCost: 25000,
      costPerPerson: 5000,
      venue: {
        name: '居酒屋花月',
        address: '東京都渋谷区',
        phone: '03-1234-5678',
      },
      isShared: true,
      createdAt: '2024-01-20',
    },
    event: {
      title: '新年会',
      purpose: 'celebration',
    },
    organizer: {
      name: '田中幹事',
    },
  },
  {
    id: '2',
    eventLog: {
      id: '2',
      eventId: '2',
      organizerId: '3',
      rating: 4.0,
      notes: 'コスパが良く、若手にも優しい価格帯。カジュアルな雰囲気で話しやすい。',
      totalCost: 18000,
      costPerPerson: 3600,
      venue: {
        name: 'イタリアン ROSSO',
        address: '東京都新宿区',
      },
      isShared: true,
      createdAt: '2024-01-15',
    },
    event: {
      title: '部署飲み会',
      purpose: 'team_building',
    },
    organizer: {
      name: '佐藤部長',
    },
  },
];

export default function RecordsScreen() {
  const [hasSharedRecord, setHasSharedRecord] = useState(false);

  const handleUnlock = () => {
    console.log('Navigate to my events for sharing');
  };

  const handleRecordPress = (record: SharedRecord) => {
    console.log('View record details:', record.id);
  };

  const getPurposeLabel = (purpose: EventPurpose): string => {
    const purposeMap = {
      welcome: '歓迎会',
      farewell: '送別会',
      celebration: 'お祝い',
      team_building: 'チームビルディング',
      casual: '親睦会',
      other: 'その他',
    };
    return purposeMap[purpose] || 'その他';
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          color={Colors.accent[500]}
          fill={Colors.accent[500]}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          size={14}
          color={Colors.accent[500]}
          fill={Colors.accent[200]}
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          size={14}
          color={Colors.gray[300]}
        />
      );
    }

    return <View style={styles.starsContainer}>{stars}</View>;
  };

  if (!hasSharedRecord) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>みんなの記録</Text>
          <Text style={styles.headerSubtitle}>
            他の幹事が共有した貴重な経験とナレッジ
          </Text>
        </View>

        {/* Unlock Screen */}
        <View style={styles.unlockContainer}>
          <View style={styles.unlockContent}>
            <View style={styles.lockIcon}>
              <Lock size={48} color={Colors.gray[400]} strokeWidth={1.5} />
            </View>
            
            <Text style={styles.unlockTitle}>記録を共有して、</Text>
            <Text style={styles.unlockTitle}>他の幹事のナレッジを閲覧しよう</Text>
            
            <Text style={styles.unlockDescription}>
              あなたの終了済みイベントの記録を1つ以上共有すると、
              {'\n'}他の幹事が投稿した貴重な情報にアクセスできます。
            </Text>

            <Card style={styles.benefitsCard}>
              <View style={styles.benefitItem}>
                <Star size={20} color={Colors.accent[500]} />
                <Text style={styles.benefitText}>お店の評価とレビュー</Text>
              </View>
              <View style={styles.benefitItem}>
                <DollarSign size={20} color={Colors.success[500]} />
                <Text style={styles.benefitText}>予算と費用の参考情報</Text>
              </View>
              <View style={styles.benefitItem}>
                <MapPin size={20} color={Colors.primary[600]} />
                <Text style={styles.benefitText}>エリア別のおすすめ店舗</Text>
              </View>
              <View style={styles.benefitItem}>
                <Share2 size={20} color={Colors.secondary[600]} />
                <Text style={styles.benefitText}>イベント企画のコツ</Text>
              </View>
            </Card>

            <Button
              title="記録を共有する"
              onPress={handleUnlock}
              size="lg"
              fullWidth
              icon={<Unlock size={20} color={Colors.white} />}
              style={styles.unlockButton}
            />

            <Text style={styles.privacyNote}>
              共有する記録は、店舗情報と評価のみ表示され、
              {'\n'}個人情報は一切公開されません。
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>みんなの記録</Text>
        <Text style={styles.headerSubtitle}>
          他の幹事が共有した貴重な経験とナレッジ
        </Text>
      </View>

      {/* Records List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.recordsList}>
          {mockSharedRecords.map((record) => (
            <TouchableOpacity
              key={record.id}
              onPress={() => handleRecordPress(record)}
              activeOpacity={0.7}
            >
              <Card style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <View style={styles.venueInfo}>
                    <Text style={styles.venueName}>{record.eventLog.venue.name}</Text>
                    <View style={styles.ratingContainer}>
                      {renderStars(record.eventLog.rating)}
                      <Text style={styles.ratingText}>
                        {record.eventLog.rating.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.purposeBadge}>
                    <Text style={styles.purposeText}>
                      {getPurposeLabel(record.event.purpose)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.recordNotes} numberOfLines={2}>
                  {record.eventLog.notes}
                </Text>

                <View style={styles.recordFooter}>
                  <View style={styles.footerItem}>
                    <DollarSign size={16} color={Colors.success[500]} />
                    <Text style={styles.footerText}>
                      ¥{record.eventLog.costPerPerson.toLocaleString()}/人
                    </Text>
                  </View>
                  
                  <View style={styles.footerItem}>
                    <MapPin size={16} color={Colors.gray[500]} />
                    <Text style={styles.footerText}>
                      {record.eventLog.venue.address}
                    </Text>
                  </View>
                </View>

                <View style={styles.organizerInfo}>
                  <Text style={styles.organizerText}>
                    {record.organizer.name}さんの記録
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    paddingHorizontal: Layout.padding.lg,
    paddingTop: Layout.padding.md,
    paddingBottom: Layout.padding.lg,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.gray[900],
    marginBottom: Layout.spacing.xs,
  },
  headerSubtitle: {
    ...Typography.body2,
    color: Colors.gray[600],
  },
  unlockContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Layout.padding.lg,
  },
  unlockContent: {
    alignItems: 'center',
  },
  lockIcon: {
    marginBottom: Layout.spacing.lg,
  },
  unlockTitle: {
    ...Typography.h3,
    color: Colors.gray[900],
    textAlign: 'center',
    lineHeight: 28,
  },
  unlockDescription: {
    ...Typography.body1,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
    marginVertical: Layout.spacing.lg,
  },
  benefitsCard: {
    width: '100%',
    marginBottom: Layout.spacing.xl,
    padding: Layout.padding.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  benefitText: {
    ...Typography.body2,
    color: Colors.gray[700],
  },
  unlockButton: {
    marginBottom: Layout.spacing.lg,
  },
  privacyNote: {
    ...Typography.caption,
    color: Colors.gray[500],
    textAlign: 'center',
    lineHeight: 16,
  },
  content: {
    flex: 1,
    padding: Layout.padding.lg,
  },
  recordsList: {
    gap: Layout.spacing.md,
  },
  recordCard: {
    marginBottom: Layout.spacing.md,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  venueInfo: {
    flex: 1,
    marginRight: Layout.spacing.sm,
  },
  venueName: {
    ...Typography.h4,
    color: Colors.gray[900],
    marginBottom: Layout.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    ...Typography.body2,
    color: Colors.gray[600],
    fontWeight: '600',
  },
  purposeBadge: {
    backgroundColor: Colors.primary[50],
    paddingHorizontal: Layout.padding.sm,
    paddingVertical: Layout.padding.xs,
    borderRadius: Layout.borderRadius.md,
  },
  purposeText: {
    ...Typography.caption,
    color: Colors.primary[700],
    fontWeight: '600',
  },
  recordNotes: {
    ...Typography.body2,
    color: Colors.gray[700],
    lineHeight: 20,
    marginBottom: Layout.spacing.sm,
  },
  recordFooter: {
    flexDirection: 'row',
    gap: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  footerText: {
    ...Typography.body2,
    color: Colors.gray[600],
  },
  organizerInfo: {
    paddingTop: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  organizerText: {
    ...Typography.caption,
    color: Colors.gray[500],
    textAlign: 'right',
  },
});