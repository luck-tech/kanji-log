import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
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
import { Colors } from '@/constants';

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

    return <View style={styles.starsContainer}>{stars}</View>;
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#f8fafc', '#f1f5f9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      <SafeAreaView style={styles.safeArea}>
        <Header
          title="みんなの記録"
          subtitle="他の幹事が共有した貴重な経験とナレッジ"
          variant="gradient"
        />

        {!hasSharedRecord ? (
          /* Unlock Screen */
          <ScrollView
            style={styles.unlockScrollView}
            contentContainerStyle={styles.unlockContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.unlockCenter}>
              <LinearGradient
                colors={['#f59e0b', '#d97706']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.lockIcon}
              >
                <Ionicons name="lock-closed" size={48} color="white" />
              </LinearGradient>

              <Text style={styles.unlockTitle}>
                記録を共有して、
              </Text>
              <Text style={styles.unlockTitle}>
                他の幹事のナレッジを閲覧しよう
              </Text>

              <Text style={styles.unlockDescription}>
                あなたの終了済みイベントの記録を1つ以上共有すると、他の幹事が投稿した貴重な情報にアクセスできます。
              </Text>

              <Card variant="gradient" shadow="none">
                <Text style={styles.benefitsTitle}>
                  アクセスできる情報
                </Text>
                <View style={styles.benefitsList}>
                  <View style={styles.benefitItem}>
                    <View style={[styles.benefitIcon, styles.warningIcon]}>
                      <Ionicons name="star" size={20} color="#f59e0b" />
                    </View>
                    <Text style={styles.benefitText}>
                      お店の評価とレビュー
                    </Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <View style={[styles.benefitIcon, styles.successIcon]}>
                      <Ionicons name="cash-outline" size={20} color="#10b981" />
                    </View>
                    <Text style={styles.benefitText}>
                      予算と費用の参考情報
                    </Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <View style={[styles.benefitIcon, styles.primaryIcon]}>
                      <Ionicons
                        name="location-outline"
                        size={20}
                        color="#0284c7"
                      />
                    </View>
                    <Text style={styles.benefitText}>
                      エリア別のおすすめ店舗
                    </Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <View style={[styles.benefitIcon, styles.accentIcon]}>
                      <Ionicons
                        name="share-social-outline"
                        size={20}
                        color="#ec7c30"
                      />
                    </View>
                    <Text style={styles.benefitText}>
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
              />

              <Text style={styles.privacyNote}>
                共有する記録は、店舗情報と評価のみ表示され、個人情報は一切公開されません。
              </Text>
            </View>
          </ScrollView>
        ) : (
          /* Records List */
          <View style={styles.recordsContainer}>
            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <View style={styles.tabsBackground}>
                <TouchableOpacity
                  onPress={() => handleTabChange('all')}
                  style={[
                    styles.tab,
                    activeTab === 'all' ? styles.tabActive : styles.tabInactive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'all'
                        ? styles.tabTextActive
                        : styles.tabTextInactive,
                    ]}
                  >
                    すべての記録
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleTabChange('liked')}
                  style={[
                    styles.tab,
                    activeTab === 'liked' ? styles.tabActive : styles.tabInactive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'liked'
                        ? styles.tabTextActive
                        : styles.tabTextInactive,
                    ]}
                  >
                    いいねした記録
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Filter Button */}
            <View style={styles.filterContainer}>
              <TouchableOpacity
                onPress={() => setIsFilterModalVisible(true)}
                style={styles.filterButton}
                activeOpacity={0.8}
              >
                <Ionicons name="options-outline" size={20} color="#0284c7" />
                <Text style={styles.filterButtonText}>
                  フィルター
                </Text>
                {getActiveFilterCount() > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>
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
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsText}>
                {filteredRecords.length}件の記録が見つかりました
              </Text>
            </View>

            <ScrollView
              style={styles.recordsScrollView}
              contentContainerStyle={styles.recordsContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.recordsList}>
                {filteredRecords.map((record, index) => (
                  <TouchableOpacity
                    key={record.id}
                    onPress={() => handleRecordPress(record)}
                    activeOpacity={0.8}
                  >
                    <Card
                      variant="elevated"
                      shadow="none"
                      style={
                        record.organizer.isSameCompany
                          ? styles.sameCompanyCard
                          : undefined
                      }
                    >
                      {record.organizer.isSameCompany && (
                        <View style={styles.sameCompanyBadge}>
                          <Text style={styles.sameCompanyBadgeText}>
                            同じ会社
                          </Text>
                        </View>
                      )}

                      <View style={styles.recordHeader}>
                        <View style={styles.recordInfo}>
                          <Text style={styles.venueName}>
                            {record.eventLog.venue.name}
                          </Text>
                          <View style={styles.ratingRow}>
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

                      <Text
                        style={styles.recordNotes}
                        numberOfLines={2}
                      >
                        {record.eventLog.notes}
                      </Text>

                      <View style={styles.recordDetails}>
                        <View style={styles.detailItem}>
                          <View style={[styles.detailIcon, styles.successIconBg]}>
                            <Ionicons
                              name="cash-outline"
                              size={16}
                              color="#10b981"
                            />
                          </View>
                          <Text style={styles.detailText}>
                            ¥{record.eventLog.costPerPerson.toLocaleString()}/人
                          </Text>
                        </View>

                        <View style={styles.detailItem}>
                          <View style={[styles.detailIcon, styles.neutralIconBg]}>
                            <Ionicons
                              name="location-outline"
                              size={16}
                              color="#64748b"
                            />
                          </View>
                          <Text style={styles.detailText}>
                            {record.eventLog.venue.address}
                          </Text>
                        </View>
                      </View>

                      {/* いいねボタンと情報 */}
                      <View style={styles.recordFooter}>
                        <View style={styles.organizerInfo}>
                          <Text style={styles.organizerName}>
                            {record.organizer.name}さんの記録
                          </Text>
                          {record.organizer.company && (
                            <Text style={styles.organizerCompany}>
                              {record.organizer.company}
                            </Text>
                          )}
                        </View>

                        <View style={styles.actionsRow}>
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              handleLike(record.id);
                            }}
                            style={styles.likeButton}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name={record.isLiked ? 'heart' : 'heart-outline'}
                              size={20}
                              color={record.isLiked ? '#ef4444' : '#94a3b8'}
                            />
                            <Text
                              style={[
                                styles.likeCount,
                                record.isLiked
                                  ? styles.likeCountActive
                                  : styles.likeCountInactive,
                              ]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  unlockScrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  unlockContent: {
    paddingTop: 40,
    paddingBottom: 120,
  },
  unlockCenter: {
    alignItems: 'center',
  },
  lockIcon: {
    width: 96,
    height: 96,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  unlockTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[900],
    textAlign: 'center',
    marginBottom: 8,
  },
  unlockDescription: {
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 320,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 16,
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningIcon: {
    backgroundColor: Colors.warning[100],
  },
  successIcon: {
    backgroundColor: Colors.success[100],
  },
  primaryIcon: {
    backgroundColor: Colors.primary[100],
  },
  accentIcon: {
    backgroundColor: '#fef3e2',
  },
  benefitText: {
    fontSize: 16,
    color: Colors.neutral[700],
    flex: 1,
  },
  privacyNote: {
    fontSize: 14,
    color: Colors.neutral[500],
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 288,
    marginTop: 16,
  },
  recordsContainer: {
    flex: 1,
  },
  tabsContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  tabsBackground: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[100],
    borderRadius: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: 'white',
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  tabText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.primary[600],
  },
  tabTextInactive: {
    color: Colors.neutral[600],
  },
  filterContainer: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[600],
    marginLeft: 8,
  },
  filterBadge: {
    backgroundColor: Colors.primary[600],
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
    minWidth: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  resultsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  recordsScrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  recordsContent: {
    paddingTop: 8,
    paddingBottom: 120,
  },
  recordsList: {
    gap: 16,
  },
  sameCompanyCard: {
    borderWidth: 2,
    borderColor: '#bfdbfe',
  },
  sameCompanyBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    zIndex: 10,
  },
  sameCompanyBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  recordInfo: {
    flex: 1,
    marginRight: 16,
  },
  venueName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 16,
    color: Colors.neutral[600],
    fontWeight: '600',
  },
  purposeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.primary[100],
  },
  purposeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[700],
  },
  recordNotes: {
    fontSize: 16,
    color: Colors.neutral[700],
    lineHeight: 24,
    marginBottom: 16,
  },
  recordDetails: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailIcon: {
    padding: 8,
    borderRadius: 12,
  },
  successIconBg: {
    backgroundColor: Colors.success[100],
  },
  neutralIconBg: {
    backgroundColor: Colors.neutral[100],
  },
  detailText: {
    fontSize: 16,
    color: Colors.neutral[700],
    fontWeight: '500',
  },
  recordFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  organizerName: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  organizerCompany: {
    fontSize: 12,
    color: Colors.neutral[400],
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  likeCountActive: {
    color: Colors.error[500],
  },
  likeCountInactive: {
    color: Colors.neutral[500],
  },
});
