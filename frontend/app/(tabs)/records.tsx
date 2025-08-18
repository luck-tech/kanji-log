import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { FilterModal, FilterOptions } from '@/components/common/FilterModal';
import { ActiveFilters } from '@/components/common/ActiveFilters';
import { SharedRecord, EventPurpose } from '@/types';
import { RecordDetailModal } from '@/components/modals';

// Extended SharedRecord type for additional features
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

type TabType = 'all' | 'liked';

// Mock data with additional filter data
const mockSharedRecords: ExtendedSharedRecord[] = [
  {
    id: '1',
    likeCount: 15,
    isLiked: false,
    participantCount: 8,
    eventDate: '2024-01-20',
    images: ['image1.jpg', 'image2.jpg'],
    eventLog: {
      id: '1',
      eventId: '1',
      organizerId: '2',
      rating: 4.5,
      notes:
        '雰囲気が良くて料理も美味しかった。予約が取りやすく、大人数でも対応してくれる。接客も丁寧で、会話が弾む環境が整っていました。',
      totalCost: 25000,
      costPerPerson: 5000,
      venue: {
        name: '居酒屋花月',
        address: '東京都渋谷区道玄坂1-2-3',
        phone: '03-1234-5678',
        genre: '居酒屋',
        area: '渋谷区',
      },
      isShared: true,
      createdAt: '2024-01-20',
    },
    event: {
      title: '新年会',
      purpose: 'celebration',
    },
    organizer: {
      id: '2',
      name: '田中幹事',
      company: 'ABC株式会社',
      isSameCompany: true,
    },
  },
  {
    id: '2',
    likeCount: 8,
    isLiked: true,
    participantCount: 6,
    eventDate: '2024-01-15',
    images: ['image3.jpg'],
    eventLog: {
      id: '2',
      eventId: '2',
      organizerId: '3',
      rating: 4.0,
      notes:
        'コスパが良く、若手にも優しい価格帯。カジュアルな雰囲気で話しやすい。パスタが特に美味しく、ワインの種類も豊富でした。',
      totalCost: 18000,
      costPerPerson: 3600,
      venue: {
        name: 'イタリアン ROSSO',
        address: '東京都新宿区新宿3-4-5',
        genre: 'イタリアン',
        area: '新宿区',
      },
      isShared: true,
      createdAt: '2024-01-15',
    },
    event: {
      title: '部署飲み会',
      purpose: 'team_building',
    },
    organizer: {
      id: '3',
      name: '佐藤部長',
      company: 'XYZ商事',
      isSameCompany: false,
    },
  },
  {
    id: '3',
    likeCount: 12,
    isLiked: false,
    participantCount: 5,
    eventDate: '2024-01-10',
    eventLog: {
      id: '3',
      eventId: '3',
      organizerId: '4',
      rating: 3.8,
      notes:
        'フレンドリーなスタッフで、歓迎会にピッタリ。食事も美味しくボリューム満点。個室もあり、ゆっくりとお話しできる環境でした。',
      totalCost: 15000,
      costPerPerson: 3000,
      venue: {
        name: '中華料理 龍園',
        address: '東京都港区六本木7-8-9',
        genre: '中華料理',
        area: '港区',
      },
      isShared: true,
      createdAt: '2024-01-10',
    },
    event: {
      title: '歓迎会',
      purpose: 'welcome',
    },
    organizer: {
      id: '4',
      name: '鈴木課長',
      company: 'ABC株式会社',
      isSameCompany: true,
    },
  },
  {
    id: '4',
    likeCount: 20,
    isLiked: true,
    participantCount: 10,
    eventDate: '2024-01-05',
    images: ['image4.jpg', 'image5.jpg', 'image6.jpg'],
    eventLog: {
      id: '4',
      eventId: '4',
      organizerId: '5',
      rating: 4.2,
      notes:
        '送別会にふさわしい落ち着いた雰囲気。個室があり、ゆっくり話せる。料理の質も高く、特別な日にぴったりでした。',
      totalCost: 30000,
      costPerPerson: 6000,
      venue: {
        name: 'フレンチビストロ Le Petit',
        address: '東京都千代田区丸の内1-2-3',
        genre: 'フレンチ',
        area: '千代田区',
      },
      isShared: true,
      createdAt: '2024-01-05',
    },
    event: {
      title: '送別会',
      purpose: 'farewell',
    },
    organizer: {
      id: '5',
      name: '山田部長',
      company: 'DEF企業',
      isSameCompany: false,
    },
  },
];

export default function RecordsScreen() {
  const [hasSharedRecord] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [records, setRecords] = useState(mockSharedRecords);
  const [filteredRecords, setFilteredRecords] = useState(mockSharedRecords);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<ExtendedSharedRecord | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    areas: [],
    purposes: [],
    genres: [],
    priceRange: { min: 0, max: 10000 },
  });

  const handleUnlock = () => {
    console.log('Navigate to my events for sharing');
  };

  const handleRecordPress = (record: ExtendedSharedRecord) => {
    setSelectedRecord(record);
  };

  const handleLike = (recordId: string) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === recordId
          ? {
              ...record,
              isLiked: !record.isLiked,
              likeCount: record.isLiked
                ? record.likeCount - 1
                : record.likeCount + 1,
            }
          : record
      )
    );
  };

  const handleUserPress = (userId: string) => {
    console.log('Navigate to user profile:', userId);
    // TODO: Navigate to user profile page
  };

  const applyFilters = useCallback(
    (newFilters: FilterOptions) => {
      let baseRecords =
        activeTab === 'liked'
          ? records.filter((record) => record.isLiked)
          : records;

      let filtered = baseRecords;

      // Area filter
      if (newFilters.areas.length > 0) {
        filtered = filtered.filter((record) =>
          newFilters.areas.includes(record.eventLog.venue.area || '')
        );
      }

      // Purpose filter
      if (newFilters.purposes.length > 0) {
        filtered = filtered.filter((record) =>
          newFilters.purposes.includes(record.event.purpose)
        );
      }

      // Genre filter
      if (newFilters.genres.length > 0) {
        filtered = filtered.filter((record) =>
          newFilters.genres.includes(record.eventLog.venue.genre || '')
        );
      }

      // Price range filter
      if (newFilters.priceRange.min > 0 || newFilters.priceRange.max < 10000) {
        filtered = filtered.filter(
          (record) =>
            record.eventLog.costPerPerson >= newFilters.priceRange.min &&
            record.eventLog.costPerPerson <= newFilters.priceRange.max
        );
      }

      // Sort: same company first, then by like count
      filtered = filtered.sort((a, b) => {
        if (a.organizer.isSameCompany && !b.organizer.isSameCompany) return -1;
        if (!a.organizer.isSameCompany && b.organizer.isSameCompany) return 1;
        return b.likeCount - a.likeCount;
      });

      setFilteredRecords(filtered);
      setFilters(newFilters);
    },
    [activeTab, records]
  );

  // Update filtered records when tab changes
  React.useEffect(() => {
    applyFilters(filters);
  }, [activeTab, records, applyFilters, filters]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const removeFilter = useCallback(
    (type: 'areas' | 'purposes' | 'genres' | 'price', value?: string) => {
      const newFilters = { ...filters };

      if (type === 'price') {
        newFilters.priceRange = { min: 0, max: 10000 };
      } else if (value) {
        newFilters[type] = newFilters[type].filter((item) => item !== value);
      }

      applyFilters(newFilters);
    },
    [filters, applyFilters]
  );

  const clearAllFilters = useCallback(() => {
    const emptyFilters = {
      areas: [],
      purposes: [],
      genres: [],
      priceRange: { min: 0, max: 10000 },
    };
    applyFilters(emptyFilters);
  }, [applyFilters]);

  const getActiveFilterCount = () => {
    return (
      filters.areas.length +
      filters.purposes.length +
      filters.genres.length +
      (filters.priceRange.min > 0 || filters.priceRange.max < 10000 ? 1 : 0)
    );
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
      stars.push(<Ionicons key={i} name="star" size={14} color="#f59e0b" />);
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={14} color="#f59e0b" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={14}
          color="#d1d5db"
        />
      );
    }

    return <View className="flex-row gap-0.5">{stars}</View>;
  };

  return (
    <View className="flex-1">
      {/* Background */}
      <LinearGradient
        colors={['#f8fafc', '#f1f5f9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1">
        <Header
          title="みんなの記録"
          subtitle="他の幹事が共有した貴重な経験とナレッジ"
          variant="gradient"
        />

        {!hasSharedRecord ? (
          /* Unlock Screen */
          <ScrollView
            className="flex-1 px-6"
            contentContainerStyle={{ paddingTop: 40, paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="items-center">
              <LinearGradient
                colors={['#f59e0b', '#d97706']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-24 h-24 rounded-3xl justify-center items-center mb-8"
              >
                <Ionicons name="lock-closed" size={48} color="white" />
              </LinearGradient>

              <Text className="text-2xl font-bold text-neutral-900 text-center mb-2">
                記録を共有して、
              </Text>
              <Text className="text-2xl font-bold text-neutral-900 text-center mb-6">
                他の幹事のナレッジを閲覧しよう
              </Text>

              <Text className="text-base text-neutral-600 text-center leading-6 mb-8 max-w-sm">
                あなたの終了済みイベントの記録を1つ以上共有すると、他の幹事が投稿した貴重な情報にアクセスできます。
              </Text>

              <Card
                variant="gradient"
                shadow="none"
                animated={false}
                className="w-full mb-8"
              >
                <Text className="text-lg font-bold text-neutral-900 mb-4">
                  アクセスできる情報
                </Text>
                <View className="gap-4">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-2xl bg-warning-100 justify-center items-center">
                      <Ionicons name="star" size={20} color="#f59e0b" />
                    </View>
                    <Text className="text-base text-neutral-700 flex-1">
                      お店の評価とレビュー
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-2xl bg-success-100 justify-center items-center">
                      <Ionicons name="cash-outline" size={20} color="#10b981" />
                    </View>
                    <Text className="text-base text-neutral-700 flex-1">
                      予算と費用の参考情報
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-2xl bg-primary-100 justify-center items-center">
                      <Ionicons
                        name="location-outline"
                        size={20}
                        color="#0284c7"
                      />
                    </View>
                    <Text className="text-base text-neutral-700 flex-1">
                      エリア別のおすすめ店舗
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-2xl bg-accent-100 justify-center items-center">
                      <Ionicons
                        name="share-social-outline"
                        size={20}
                        color="#ec7c30"
                      />
                    </View>
                    <Text className="text-base text-neutral-700 flex-1">
                      イベント企画のコツ
                    </Text>
                  </View>
                </View>
              </Card>

              <Button
                title="記録を共有する"
                onPress={handleUnlock}
                size="lg"
                variant="gradient"
                fullWidth
                icon={
                  <Ionicons name="lock-open-outline" size={20} color="white" />
                }
                className="mb-6"
              />

              <Text className="text-sm text-neutral-500 text-center leading-5 max-w-xs">
                共有する記録は、店舗情報と評価のみ表示され、個人情報は一切公開されません。
              </Text>
            </View>
          </ScrollView>
        ) : (
          /* Records List */
          <View className="flex-1">
            {/* Tabs */}
            <View className="px-6 pt-4 pb-2">
              <View className="flex-row bg-neutral-100 rounded-2xl p-1">
                <TouchableOpacity
                  onPress={() => handleTabChange('all')}
                  className={`flex-1 py-2 px-4 rounded-xl ${
                    activeTab === 'all' ? 'bg-white' : ''
                  }`}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`text-center font-semibold ${
                      activeTab === 'all'
                        ? 'text-primary-600'
                        : 'text-neutral-600'
                    }`}
                  >
                    すべての記録
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleTabChange('liked')}
                  className={`flex-1 py-2 px-4 rounded-xl ${
                    activeTab === 'liked' ? 'bg-white' : ''
                  }`}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`text-center font-semibold ${
                      activeTab === 'liked'
                        ? 'text-primary-600'
                        : 'text-neutral-600'
                    }`}
                  >
                    いいねした記録
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Filter Button */}
            <View className="px-6 py-2">
              <TouchableOpacity
                onPress={() => setIsFilterModalVisible(true)}
                className="flex-row items-center justify-center py-3 px-4 bg-white rounded-2xl border border-neutral-200"
                activeOpacity={0.8}
              >
                <Ionicons name="options-outline" size={20} color="#0284c7" />
                <Text className="text-base font-semibold text-primary-600 ml-2">
                  フィルター
                </Text>
                {getActiveFilterCount() > 0 && (
                  <View className="bg-primary-600 rounded-full px-2 py-1 ml-2 min-w-6 justify-center items-center">
                    <Text className="text-xs font-bold text-white">
                      {getActiveFilterCount()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Active Filters */}
            <ActiveFilters
              filters={filters}
              onRemoveFilter={removeFilter}
              onClearAll={clearAllFilters}
            />

            {/* Results Count */}
            <View className="px-6 py-2">
              <Text className="text-sm text-neutral-500">
                {filteredRecords.length}件の記録が見つかりました
              </Text>
            </View>

            <ScrollView
              className="flex-1 px-6"
              contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="gap-4">
                {filteredRecords.map((record, index) => (
                  <TouchableOpacity
                    key={record.id}
                    onPress={() => handleRecordPress(record)}
                    activeOpacity={0.8}
                  >
                    <Card
                      variant="elevated"
                      shadow="none"
                      animated={false}
                      className={
                        record.organizer.isSameCompany
                          ? 'border-2 border-blue-200'
                          : ''
                      }
                    >
                      {record.organizer.isSameCompany && (
                        <View className="absolute -top-2 -right-2 bg-blue-500 rounded-full px-3 py-1 z-10">
                          <Text className="text-xs font-bold text-white">
                            同じ会社
                          </Text>
                        </View>
                      )}

                      <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1 mr-4">
                          <Text className="text-xl font-bold text-neutral-900 mb-2">
                            {record.eventLog.venue.name}
                          </Text>
                          <View className="flex-row items-center gap-3 mb-1">
                            {renderStars(record.eventLog.rating)}
                            <Text className="text-base text-neutral-600 font-semibold">
                              {record.eventLog.rating.toFixed(1)}
                            </Text>
                          </View>
                        </View>

                        <View className="px-3 py-1.5 rounded-full bg-primary-100">
                          <Text className="text-sm font-semibold text-primary-700">
                            {getPurposeLabel(record.event.purpose)}
                          </Text>
                        </View>
                      </View>

                      <Text
                        className="text-base text-neutral-700 leading-6 mb-4"
                        numberOfLines={2}
                      >
                        {record.eventLog.notes}
                      </Text>

                      <View className="flex-row gap-6 mb-4">
                        <View className="flex-row items-center gap-2">
                          <View className="p-2 rounded-xl bg-success-100">
                            <Ionicons
                              name="cash-outline"
                              size={16}
                              color="#10b981"
                            />
                          </View>
                          <Text className="text-base text-neutral-700 font-medium">
                            ¥{record.eventLog.costPerPerson.toLocaleString()}/人
                          </Text>
                        </View>

                        <View className="flex-row items-center gap-2">
                          <View className="p-2 rounded-xl bg-neutral-100">
                            <Ionicons
                              name="location-outline"
                              size={16}
                              color="#64748b"
                            />
                          </View>
                          <Text className="text-base text-neutral-700">
                            {record.eventLog.venue.address}
                          </Text>
                        </View>
                      </View>

                      {/* いいねボタンと情報 */}
                      <View className="flex-row items-center justify-between pt-3 border-t border-neutral-200">
                        <View className="flex-row items-center gap-4">
                          <Text className="text-sm text-neutral-500">
                            {record.organizer.name}さんの記録
                          </Text>
                          {record.organizer.company && (
                            <Text className="text-xs text-neutral-400">
                              {record.organizer.company}
                            </Text>
                          )}
                        </View>

                        <View className="flex-row items-center gap-3">
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              handleLike(record.id);
                            }}
                            className="flex-row items-center gap-1"
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name={record.isLiked ? 'heart' : 'heart-outline'}
                              size={20}
                              color={record.isLiked ? '#ef4444' : '#94a3b8'}
                            />
                            <Text
                              className={`text-sm font-medium ${
                                record.isLiked
                                  ? 'text-red-500'
                                  : 'text-neutral-500'
                              }`}
                            >
                              {record.likeCount}
                            </Text>
                          </TouchableOpacity>
                          <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#94a3b8"
                          />
                        </View>
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Filter Modal */}
            <FilterModal
              isVisible={isFilterModalVisible}
              onClose={() => setIsFilterModalVisible(false)}
              onApply={applyFilters}
              initialFilters={filters}
            />

            {/* Record Detail Modal */}
            <RecordDetailModal
              isVisible={selectedRecord !== null}
              onClose={() => setSelectedRecord(null)}
              record={selectedRecord}
              onLike={
                selectedRecord ? () => handleLike(selectedRecord.id) : undefined
              }
              onUserPress={
                selectedRecord
                  ? () => handleUserPress(selectedRecord.organizer.id)
                  : undefined
              }
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
