import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Alert,
  Linking,
  Share,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '@/components/common';
import {
  ReservationEventInfo,
  RestaurantContactInfo,
  ReservationActions,
  ReservationReportForm,
  ReservationTips,
} from '../../../src/components/features/event/reservation-support';
import {
  ReservationInfo,
  ReservationForm,
} from '../../../src/types/features/event';
import { Colors } from '@/constants';

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
  const [reservationForm, setReservationForm] = useState<ReservationForm>({
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

  const handleFormChange = (field: keyof ReservationForm, value: string) => {
    setReservationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    const confirmedText = `【予約確定のお知らせ】
${reservationInfo.event.title}

✅ 予約が確定しました

📍 店舗: ${reservationInfo.restaurant.name}
📅 日時: ${formatDate(reservationInfo.event.date)} ${reservationInfo.event.time}
👥 人数: ${reservationInfo.event.memberCount}名
📞 電話: ${reservationInfo.restaurant.phone}
🏠 住所: ${reservationInfo.restaurant.address}

予約者: ${reservationForm.contactPerson}
${
  reservationForm.reservationId
    ? `予約ID: ${reservationForm.reservationId}`
    : ''
}
${
  reservationForm.specialRequests
    ? `備考: ${reservationForm.specialRequests}`
    : ''
}

よろしくお願いします！`;

    try {
      await Share.share({
        message: confirmedText,
      });
    } catch (error) {
      console.error('Share confirmed info error:', error);
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
      <Header
        title="予約サポート"
        subtitle="スムーズな予約をお手伝い"
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
          <ReservationEventInfo
            eventTitle={reservationInfo.event.title}
            eventDate={reservationInfo.event.date}
            eventTime={reservationInfo.event.time}
            memberCount={reservationInfo.event.memberCount}
            formatDate={formatDate}
          />

          {/* 選択された店舗情報 */}
          <RestaurantContactInfo
            restaurantName={reservationInfo.restaurant.name}
            restaurantGenre={reservationInfo.restaurant.genre}
            address={reservationInfo.restaurant.address}
            phone={reservationInfo.restaurant.phone}
            features={reservationInfo.restaurant.features}
          />

          {/* 予約アクション */}
          <ReservationActions
            onCallRestaurant={handleCallRestaurant}
            onOpenMap={handleOpenMap}
            onOpenReservationSite={handleOpenReservationSite}
            onShareReservationInfo={handleShareReservationInfo}
            hasReservationUrl={!!reservationInfo.restaurant.reservationUrl}
            hasMapUrl={!!reservationInfo.restaurant.mapUrl}
          />

          {/* 予約のコツ */}
          <ReservationTips memberCount={reservationInfo.event.memberCount} />

          {/* 予約結果の報告 */}
          <ReservationReportForm
            form={reservationForm}
            onFormChange={handleFormChange}
            onReservationComplete={handleReservationComplete}
            onReservationFailed={handleReservationFailed}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    padding: 24,
    gap: 24,
  },
});
