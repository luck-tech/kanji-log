import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
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
      notes:
        '雰囲気が良くて料理も美味しかった。予約が取りやすく、大人数でも対応してくれる。',
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
      notes:
        'コスパが良く、若手にも優しい価格帯。カジュアルな雰囲気で話しやすい。',
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
  const [hasSharedRecord] = useState(false);

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
        <Ionicons
          key={i}
          name="star"
          size={14}
          color="#f59e0b"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons
          key="half"
          name="star-half"
          size={14}
          color="#f59e0b"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#d1d5db" />
      );
    }

    return <View className="flex-row gap-0.5">{stars}</View>;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header
        title="みんなの記録"
        subtitle="他の幹事が共有した貴重な経験とナレッジ"
      />

      {!hasSharedRecord ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="pt-6 px-6 pb-8"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center">
            <View className="mb-6">
              <Ionicons name="lock-closed-outline" size={48} color="#9ca3af" />
            </View>

            <Text className="text-xl font-semibold text-gray-900 text-center leading-7">記録を共有して、</Text>
            <Text className="text-xl font-semibold text-gray-900 text-center leading-7">他の幹事のナレッジを閲覧しよう</Text>

            <Text className="text-base text-gray-600 text-center leading-6 my-6">
              あなたの終了済みイベントの記録を1つ以上共有すると、
              {'\n'}他の幹事が投稿した貴重な情報にアクセスできます。
            </Text>

            <Card className="w-full mb-8 p-6">
              <View className="flex-row items-center gap-3 mb-4">
                <Ionicons name="star" size={20} color="#f59e0b" />
                <Text className="text-sm text-gray-700">お店の評価とレビュー</Text>
              </View>
              <View className="flex-row items-center gap-3 mb-4">
                <Ionicons name="cash-outline" size={20} color="#10b981" />
                <Text className="text-sm text-gray-700">予算と費用の参考情報</Text>
              </View>
              <View className="flex-row items-center gap-3 mb-4">
                <Ionicons name="location-outline" size={20} color="#3b82f6" />
                <Text className="text-sm text-gray-700">エリア別のおすすめ店舗</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Ionicons name="share-social-outline" size={20} color="#8b5cf6" />
                <Text className="text-sm text-gray-700">イベント企画のコツ</Text>
              </View>
            </Card>

            <Button
              title="記録を共有する"
              onPress={handleUnlock}
              size="lg"
              fullWidth
              icon={<Ionicons name="lock-open-outline" size={20} color="white" />}
              className="mb-6"
            />

            <Text className="text-xs text-gray-500 text-center leading-4">
              共有する記録は、店舗情報と評価のみ表示され、
              {'\n'}個人情報は一切公開されません。
            </Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="pt-6 px-6 pb-8"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-4">
            {mockSharedRecords.map((record) => (
              <TouchableOpacity
                key={record.id}
                onPress={() => handleRecordPress(record)}
                activeOpacity={0.7}
              >
                <Card className="mb-4">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1 mr-3">
                      <Text className="text-lg font-semibold text-gray-900 mb-1">
                        {record.eventLog.venue.name}
                      </Text>
                      <View className="flex-row items-center gap-2">
                        {renderStars(record.eventLog.rating)}
                        <Text className="text-sm text-gray-600 font-semibold">
                          {record.eventLog.rating.toFixed(1)}
                        </Text>
                      </View>
                    </View>

                    <View className="bg-blue-50 px-3 py-1 rounded-md">
                      <Text className="text-xs text-blue-700 font-semibold">
                        {getPurposeLabel(record.event.purpose)}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-sm text-gray-700 leading-5 mb-3" numberOfLines={2}>
                    {record.eventLog.notes}
                  </Text>

                  <View className="flex-row gap-6 mb-3">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="cash-outline" size={16} color="#10b981" />
                      <Text className="text-sm text-gray-600">
                        ¥{record.eventLog.costPerPerson.toLocaleString()}/人
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                      <Ionicons name="location-outline" size={16} color="#6b7280" />
                      <Text className="text-sm text-gray-600">
                        {record.eventLog.venue.address}
                      </Text>
                    </View>
                  </View>

                  <View className="pt-3 border-t border-gray-100">
                    <Text className="text-xs text-gray-500 text-right">
                      {record.organizer.name}さんの記録
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}


