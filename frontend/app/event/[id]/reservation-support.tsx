import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking,
  Share,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { Input } from '@/components/common/Input';
import { Colors } from '@/constants';

interface ReservationInfo {
  restaurant: {
    id: string;
    name: string;
    genre: string;
    address: string;
    phone: string;
    mapUrl?: string;
    reservationUrl?: string;
    features: string[];
  };
  event: {
    title: string;
    date: string;
    time: string;
    memberCount: number;
  };
  reservationDetails?: {
    reservationId?: string;
    contactPerson?: string;
    specialRequests?: string;
    isConfirmed: boolean;
    confirmedAt?: string;
  };
}

// Mock data
const mockReservationInfo: ReservationInfo = {
  restaurant: {
    id: '1',
    name: '炭火焼鳥 鳥心',
    genre: '焼鳥・居酒屋',
    address: '東京都新宿区歌舞伎町1-2-3 ビル名 3F',
    phone: '03-1234-5678',
    mapUrl: 'https://maps.google.com/?q=炭火焼鳥+鳥心+新宿',
    reservationUrl: 'https://tabelog.com/tokyo/restaurant/12345/',
    features: ['個室あり', 'アレルギー対応', '飲み放題', '駅近5分'],
  },
  event: {
    title: '新人歓迎会',
    date: '2024-02-15',
    time: '19:00',
    memberCount: 8,
  },
  reservationDetails: {
    isConfirmed: false,
  },
};

export default function ReservationSupportScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
    restaurantId?: string;
  }>();
  const router = useRouter();
  const [reservationInfo] = useState<ReservationInfo>(mockReservationInfo);
  const [reservationForm, setReservationForm] = useState({
    contactPerson: '',
    specialRequests: '',
    reservationId: '',
  });

  const handleBackPress = () => {
    router.back();
  };

  const handleCallRestaurant = () => {
    Linking.openURL(`tel:${reservationInfo.restaurant.phone}`);
  };

  const handleOpenMap = () => {
    if (reservationInfo.restaurant.mapUrl) {
      Linking.openURL(reservationInfo.restaurant.mapUrl);
    }
  };

  const handleOpenReservationSite = () => {
    if (reservationInfo.restaurant.reservationUrl) {
      Linking.openURL(reservationInfo.restaurant.reservationUrl);
    }
  };

  const handleShareReservationInfo = async () => {
    const shareText = `【予約情報】
${reservationInfo.event.title}

📍 店舗: ${reservationInfo.restaurant.name}
📅 日時: ${formatDate(reservationInfo.event.date)} ${reservationInfo.event.time}
👥 人数: ${reservationInfo.event.memberCount}名
📞 電話: ${reservationInfo.restaurant.phone}
🏠 住所: ${reservationInfo.restaurant.address}`;

    try {
      await Share.share({
        message: shareText,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleReservationComplete = () => {
    if (!reservationForm.contactPerson.trim()) {
      Alert.alert('エラー', '予約者名を入力してください');
      return;
    }

    Alert.alert(
      '予約完了',
      '予約が完了しました。\nメンバーに確定情報を共有しますか？',
      [
        { text: 'あとで', style: 'cancel' },
        {
          text: '共有する',
          onPress: () => {
            handleShareConfirmedInfo();
          },
        },
      ]
    );
  };

  const handleReservationFailed = () => {
    Alert.alert(
      '予約失敗',
      'このお店の予約が取れませんでした。\n次の候補店舗を表示しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '次の候補',
          onPress: () => {
            router.push(`/event/${id}/restaurant-suggestions`);
          },
        },
      ]
    );
  };

  const handleShareConfirmedInfo = async () => {
    const shareText = `【${reservationInfo.event.title} 確定のお知らせ】

🎉 予約が確定しました！

📍 お店: ${reservationInfo.restaurant.name}
📅 日時: ${formatDate(reservationInfo.event.date)} ${
      reservationInfo.event.time
    }〜
👥 人数: ${reservationInfo.event.memberCount}名
🏠 住所: ${reservationInfo.restaurant.address}
📞 電話: ${reservationInfo.restaurant.phone}

皆さんのご参加をお待ちしています！`;

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
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return `${date.getMonth() + 1}/${date.getDate()} (${
      weekdays[date.getDay()]
    })`;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="予約サポート"
          subtitle="予約に必要な情報をまとめて表示"
          variant="gradient"
          leftIcon="arrow-back"
          onLeftPress={handleBackPress}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            {/* イベント概要 */}
            <Card variant="gradient" shadow="none">
              <View style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <View style={styles.eventIcon}>
                    <Ionicons name="calendar" size={20} color="white" />
                  </View>
                  <Text style={styles.eventTitle}>
                    {reservationInfo.event.title}
                  </Text>
                </View>

                <View style={styles.eventDetails}>
                  <View style={styles.eventDetailItem}>
                    <Text style={styles.eventDetailLabel}>開催日時</Text>
                    <Text style={styles.eventDetailValue}>
                      {formatDate(reservationInfo.event.date)}
                    </Text>
                    <Text style={styles.eventDetailValue}>
                      {reservationInfo.event.time}〜
                    </Text>
                  </View>
                  <View style={styles.eventDetailItem}>
                    <Text style={styles.eventDetailLabel}>参加人数</Text>
                    <Text style={styles.eventMemberCount}>
                      {reservationInfo.event.memberCount}名
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* 選択された店舗情報 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.restaurantCard}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.redIcon]}>
                    <Ionicons name="restaurant" size={20} color="#ef4444" />
                  </View>
                  <Text style={styles.sectionTitle}>
                    選択されたお店
                  </Text>
                </View>

                <View style={styles.restaurantInfo}>
                  <View>
                    <Text style={styles.restaurantName}>
                      {reservationInfo.restaurant.name}
                    </Text>
                    <Text style={styles.restaurantGenre}>
                      {reservationInfo.restaurant.genre}
                    </Text>
                  </View>

                  <View style={styles.contactCard}>
                    <View style={styles.contactItem}>
                      <Ionicons name="location" size={18} color="#64748b" />
                      <Text style={styles.contactText}>
                        {reservationInfo.restaurant.address}
                      </Text>
                    </View>
                    <View style={styles.contactItem}>
                      <Ionicons name="call" size={18} color="#64748b" />
                      <Text style={styles.contactText}>
                        {reservationInfo.restaurant.phone}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.featuresContainer}>
                    {reservationInfo.restaurant.features.map(
                      (feature, index) => (
                        <View
                          key={index}
                          style={styles.featureChip}
                        >
                          <Text style={styles.featureText}>
                            {feature}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                </View>
              </View>
            </Card>

            {/* 予約アクション */}
            <Card variant="elevated" shadow="none">
              <View style={styles.actionsCard}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.greenIcon]}>
                    <Ionicons name="call" size={20} color="#10b981" />
                  </View>
                  <Text style={styles.sectionTitle}>
                    予約手続き
                  </Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={handleCallRestaurant}
                    style={styles.primaryButton}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="call" size={20} color="white" />
                    <Text style={styles.primaryButtonText}>
                      電話で予約する
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.secondaryButtonRow}>
                    <TouchableOpacity
                      onPress={handleOpenMap}
                      style={[styles.secondaryButton, styles.blueButton]}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="map" size={18} color="#0284c7" />
                      <Text style={styles.blueButtonText}>
                        地図を開く
                      </Text>
                    </TouchableOpacity>

                    {reservationInfo.restaurant.reservationUrl && (
                      <TouchableOpacity
                        onPress={handleOpenReservationSite}
                        style={[styles.secondaryButton, styles.orangeButton]}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="globe" size={18} color="#f59e0b" />
                        <Text style={styles.orangeButtonText}>
                          予約サイト
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={handleShareReservationInfo}
                    style={[styles.secondaryButton, styles.purpleButton]}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="share" size={18} color="#7c3aed" />
                    <Text style={styles.purpleButtonText}>
                      予約情報を共有
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>

            {/* 予約完了報告 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.reportCard}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.purpleIcon]}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#7c3aed"
                    />
                  </View>
                  <Text style={styles.sectionTitle}>
                    予約完了報告
                  </Text>
                </View>

                <Text style={styles.reportDescription}>
                  予約が完了したら、以下の情報を入力して完了報告をしてください。
                  メンバーに確定情報が自動で共有されます。
                </Text>

                <View style={styles.inputsContainer}>
                  <Input
                    label="予約者名"
                    placeholder="例：田中太郎"
                    value={reservationForm.contactPerson}
                    onChangeText={(text) =>
                      setReservationForm((prev) => ({
                        ...prev,
                        contactPerson: text,
                      }))
                    }
                  />

                  <Input
                    label="予約ID・確認番号"
                    placeholder="例：RSV12345（任意）"
                    value={reservationForm.reservationId}
                    onChangeText={(text) =>
                      setReservationForm((prev) => ({
                        ...prev,
                        reservationId: text,
                      }))
                    }
                  />

                  <Input
                    label="特別なリクエスト・メモ"
                    placeholder="例：アレルギー対応をお願いしました"
                    value={reservationForm.specialRequests}
                    onChangeText={(text) =>
                      setReservationForm((prev) => ({
                        ...prev,
                        specialRequests: text,
                      }))
                    }
                    multiline
                    numberOfLines={2}
                  />
                </View>

                <View style={styles.reportButtons}>
                  <View style={styles.reportButton}>
                    <Button
                      title="予約完了"
                      onPress={handleReservationComplete}
                      variant="gradient"
                      size="md"
                      fullWidth
                      icon={
                        <Ionicons name="checkmark" size={18} color="white" />
                      }
                    />
                  </View>
                  <View style={styles.reportButton}>
                    <Button
                      title="予約失敗"
                      onPress={handleReservationFailed}
                      variant="outline"
                      size="md"
                      fullWidth
                      icon={<Ionicons name="close" size={18} color="#ef4444" />}
                    />
                  </View>
                </View>
              </View>
            </Card>

            {/* 予約のコツ */}
            <Card variant="elevated" shadow="none">
              <View style={styles.tipsCard}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconContainer, styles.amberIcon]}>
                    <Ionicons name="bulb" size={20} color="#f59e0b" />
                  </View>
                  <Text style={styles.sectionTitle}>
                    予約のコツ
                  </Text>
                </View>

                <View style={styles.tipsContent}>
                  <Text style={styles.tipsLabel}>
                    📞 電話予約時に伝える内容：
                  </Text>
                  <View style={styles.tipsList}>
                    <Text style={styles.tipItem}>
                      • 日時: {formatDate(reservationInfo.event.date)}
                      {reservationInfo.event.time}〜
                    </Text>
                    <Text style={styles.tipItem}>
                      • 人数: {reservationInfo.event.memberCount}名
                    </Text>
                    <Text style={styles.tipItem}>
                      • 用途: {reservationInfo.event.title}
                    </Text>
                    <Text style={styles.tipItem}>
                      • 個室希望（可能であれば）
                    </Text>
                    <Text style={styles.tipItem}>
                      • アレルギー対応の確認
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  eventCard: {
    gap: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  eventDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  eventDetailItem: {
    flex: 1,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  eventDetailLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  eventDetailValue: {
    color: 'white',
    fontWeight: '700',
  },
  eventMemberCount: {
    color: 'white',
    fontWeight: '700',
    fontSize: 24,
    textAlign: 'center',
  },
  restaurantCard: {
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
  redIcon: {
    backgroundColor: Colors.error[100],
  },
  greenIcon: {
    backgroundColor: Colors.success[100],
  },
  purpleIcon: {
    backgroundColor: Colors.secondary[100],
  },
  amberIcon: {
    backgroundColor: Colors.warning[100],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  restaurantInfo: {
    gap: 12,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  restaurantGenre: {
    fontSize: 16,
    color: Colors.neutral[600],
  },
  contactCard: {
    padding: 16,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: Colors.neutral[900],
    fontWeight: '500',
    flex: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: Colors.primary[100],
    borderRadius: 20,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary[700],
  },
  actionsCard: {
    gap: 16,
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: Colors.success[600],
    borderRadius: 16,
  },
  primaryButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  secondaryButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  blueButton: {
    borderColor: Colors.primary[500],
  },
  blueButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary[700],
  },
  orangeButton: {
    borderColor: Colors.warning[500],
  },
  orangeButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.warning[700],
  },
  purpleButton: {
    borderColor: Colors.secondary[500],
  },
  purpleButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.secondary[700],
  },
  reportCard: {
    gap: 16,
  },
  reportDescription: {
    fontSize: 14,
    color: Colors.neutral[600],
    lineHeight: 20,
  },
  inputsContainer: {
    gap: 12,
  },
  reportButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  reportButton: {
    flex: 1,
  },
  tipsCard: {
    gap: 12,
  },
  tipsContent: {
    gap: 8,
  },
  tipsLabel: {
    fontSize: 14,
    color: Colors.neutral[700],
    lineHeight: 20,
  },
  tipsList: {
    paddingLeft: 16,
    gap: 4,
  },
  tipItem: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
});
