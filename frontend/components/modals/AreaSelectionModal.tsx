import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface AreaSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAreaSelect: (areaType: 'center' | 'specified', area?: string) => void;
}

const POPULAR_AREAS = [
  { id: '1', name: '渋谷', station: '渋谷駅', icon: '🏙️' },
  { id: '2', name: '新宿', station: '新宿駅', icon: '🌃' },
  { id: '3', name: '銀座', station: '銀座駅', icon: '✨' },
  { id: '4', name: '池袋', station: '池袋駅', icon: '🎡' },
  { id: '5', name: '品川', station: '品川駅', icon: '🚅' },
  { id: '6', name: '六本木', station: '六本木駅', icon: '🌙' },
];

const RECOMMENDED_CENTER = {
  station: '新宿駅',
  area: '新宿',
  reason: 'メンバーの最寄り駅から最もアクセスが良い駅です',
  averageTime: '15分',
  icon: '📍',
};

export const AreaSelectionModal: React.FC<AreaSelectionModalProps> = ({
  isVisible,
  onClose,
  onAreaSelect,
}) => {
  const insets = useSafeAreaInsets();
  const [selectionType, setSelectionType] = useState<
    'center' | 'specified' | null
  >(null);
  const [customArea, setCustomArea] = useState('');

  const handleClose = () => {
    setSelectionType(null);
    setCustomArea('');
    onClose();
  };

  const handleCenterAreaSelect = () => {
    onAreaSelect('center');
    handleClose();
  };

  const handleSpecifiedAreaSelect = (area: string) => {
    onAreaSelect('specified', area);
    handleClose();
  };

  const handleCustomAreaSelect = () => {
    if (!customArea.trim()) return;
    onAreaSelect('specified', customArea);
    handleClose();
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
            <Text style={styles.headerTitle}>エリア選択</Text>
            <View style={styles.headerSpacer} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* 説明 */}
            <View style={styles.description}>
              <Text style={styles.descriptionText}>
                レストランを探すエリアを選択してください。{'\n'}
                メンバーの利便性を考慮して最適なエリアを提案します。
              </Text>
            </View>

            {/* みんなの中心エリア */}
            <TouchableOpacity
              onPress={() => setSelectionType('center')}
              activeOpacity={0.8}
            >
              <Card
                variant={selectionType === 'center' ? 'gradient' : 'elevated'}
                shadow="none"
              >
                <View style={styles.optionContainer}>
                  <View style={styles.optionHeader}>
                    <LinearGradient
                      colors={['#0ea5e9', '#0284c7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.centerIcon}
                    >
                      <Text style={styles.centerIconText}>
                        {RECOMMENDED_CENTER.icon}
                      </Text>
                    </LinearGradient>
                    <View style={styles.optionInfo}>
                      <View style={styles.optionTitleRow}>
                        <Text style={styles.optionTitle}>
                          みんなの中心エリア
                        </Text>
                        <View style={styles.recommendedBadge}>
                          <Text style={styles.recommendedBadgeText}>推奨</Text>
                        </View>
                      </View>
                      <Text style={styles.optionSubtitle}>
                        AIが最適なエリアを自動選択
                      </Text>
                    </View>
                    {selectionType === 'center' && (
                      <View style={styles.checkmark}>
                        <Ionicons name="checkmark" size={14} color="white" />
                      </View>
                    )}
                  </View>

                  {/* 推奨エリア詳細 */}
                  <View style={styles.centerDetails}>
                    <View style={styles.centerDetailsHeader}>
                      <Ionicons name="location" size={20} color="#0284c7" />
                      <Text style={styles.centerStationName}>
                        {RECOMMENDED_CENTER.station}周辺
                      </Text>
                    </View>
                    <Text style={styles.centerReason}>
                      {RECOMMENDED_CENTER.reason}
                    </Text>
                    <View style={styles.centerStats}>
                      <View style={styles.centerStat}>
                        <Ionicons name="time" size={16} color="#0284c7" />
                        <Text style={styles.centerStatText}>
                          平均移動時間: {RECOMMENDED_CENTER.averageTime}
                        </Text>
                      </View>
                      <View style={styles.centerStat}>
                        <Ionicons name="people" size={16} color="#0284c7" />
                        <Text style={styles.centerStatText}>
                          全員アクセス良好
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>

            {/* 指定エリア */}
            <TouchableOpacity
              onPress={() => setSelectionType('specified')}
              activeOpacity={0.8}
            >
              <Card
                variant={
                  selectionType === 'specified' ? 'gradient' : 'elevated'
                }
                shadow="none"
              >
                <View style={styles.optionContainer}>
                  <View style={styles.optionHeader}>
                    <View style={styles.specifiedIcon}>
                      <Ionicons name="map" size={24} color="#f59e0b" />
                    </View>
                    <View style={styles.optionInfo}>
                      <Text style={styles.optionTitle}>指定エリアで探す</Text>
                      <Text style={styles.optionSubtitle}>
                        特定のエリアや駅を指定
                      </Text>
                    </View>
                    {selectionType === 'specified' && (
                      <View style={styles.checkmark}>
                        <Ionicons name="checkmark" size={14} color="white" />
                      </View>
                    )}
                  </View>

                  {selectionType === 'specified' && (
                    <View style={styles.specifiedOptions}>
                      {/* 人気エリア */}
                      <View style={styles.popularAreas}>
                        <Text style={styles.sectionTitle}>人気エリア</Text>
                        <View style={styles.areasList}>
                          {POPULAR_AREAS.map((area) => (
                            <TouchableOpacity
                              key={area.id}
                              onPress={() =>
                                handleSpecifiedAreaSelect(area.name)
                              }
                              style={styles.areaChip}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.areaIcon}>{area.icon}</Text>
                              <Text style={styles.areaName}>{area.name}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* カスタムエリア入力 */}
                      <View style={styles.customArea}>
                        <Text style={styles.sectionTitle}>
                          その他のエリア・駅名
                        </Text>
                        <View style={styles.inputRow}>
                          <View style={styles.inputContainer}>
                            <Input
                              placeholder="例：恵比寿、表参道、秋葉原"
                              value={customArea}
                              onChangeText={setCustomArea}
                            />
                          </View>
                          <TouchableOpacity
                            onPress={handleCustomAreaSelect}
                            style={styles.submitButton}
                            activeOpacity={0.8}
                          >
                            <Ionicons
                              name="arrow-forward"
                              size={20}
                              color="white"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer */}
        {selectionType === 'center' && (
          <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
            <Button
              title="中心エリアで探す"
              onPress={handleCenterAreaSelect}
              variant="gradient"
              size="lg"
              fullWidth
              icon={<Ionicons name="search" size={20} color="white" />}
            />
          </View>
        )}
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
  description: {
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Layout.spacing.md,
  },
  optionContainer: {
    gap: Layout.spacing.md,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  centerIcon: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIconText: {
    fontSize: 20,
  },
  specifiedIcon: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.lg,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  recommendedBadge: {
    backgroundColor: Colors.success[100],
    borderRadius: Layout.borderRadius.full,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
  },
  recommendedBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.success[700],
  },
  optionSubtitle: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginTop: Layout.spacing.xs,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerDetails: {
    padding: Layout.spacing.md,
    backgroundColor: Colors.primary[50],
    borderRadius: Layout.borderRadius.md,
  },
  centerDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  centerStationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary[900],
  },
  centerReason: {
    fontSize: 14,
    color: Colors.primary[800],
    lineHeight: 20,
    marginBottom: Layout.spacing.sm,
  },
  centerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  centerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  centerStatText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary[800],
  },
  specifiedOptions: {
    gap: Layout.spacing.md,
  },
  popularAreas: {},
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: Layout.spacing.sm,
  },
  areasList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.lg,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  areaIcon: {
    fontSize: 16,
    marginRight: Layout.spacing.sm,
  },
  areaName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#d97706',
  },
  customArea: {},
  inputRow: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  inputContainer: {
    flex: 1,
  },
  submitButton: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.lg,
    backgroundColor: '#ea580c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: Layout.padding.lg,
    paddingVertical: Layout.padding.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
});
