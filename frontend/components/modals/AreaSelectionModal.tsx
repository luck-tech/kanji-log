import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

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
      <SafeAreaView className="flex-1 bg-neutral-50">
        {/* Header */}
        <View className="px-6 py-4 bg-white border-b border-neutral-200">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={handleClose} className="p-2 -ml-2">
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-neutral-900">
              エリア選択
            </Text>
            <View className="w-10" />
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6 gap-6">
            {/* 説明 */}
            <View className="items-center">
              <Text className="text-base text-neutral-600 text-center leading-6 mb-4">
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
                animated={false}
              >
                <View className="gap-4">
                  <View className="flex-row items-center gap-3">
                    <LinearGradient
                      colors={['#0ea5e9', '#0284c7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="w-12 h-12 rounded-2xl justify-center items-center"
                    >
                      <Text className="text-xl">{RECOMMENDED_CENTER.icon}</Text>
                    </LinearGradient>
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-lg font-bold text-neutral-900">
                          みんなの中心エリア
                        </Text>
                        <View className="bg-success-100 rounded-full px-2 py-1">
                          <Text className="text-xs font-bold text-success-700">
                            推奨
                          </Text>
                        </View>
                      </View>
                      <Text className="text-sm text-neutral-600 mt-1">
                        AIが最適なエリアを自動選択
                      </Text>
                    </View>
                    {selectionType === 'center' && (
                      <View className="w-6 h-6 rounded-full bg-primary-500 justify-center items-center">
                        <Ionicons name="checkmark" size={14} color="white" />
                      </View>
                    )}
                  </View>

                  {/* 推奨エリア詳細 */}
                  <View className="p-4 bg-blue-50 rounded-xl">
                    <View className="flex-row items-center gap-3 mb-3">
                      <Ionicons name="location" size={20} color="#0284c7" />
                      <Text className="text-lg font-bold text-blue-900">
                        {RECOMMENDED_CENTER.station}周辺
                      </Text>
                    </View>
                    <Text className="text-sm text-blue-800 leading-5 mb-3">
                      {RECOMMENDED_CENTER.reason}
                    </Text>
                    <View className="flex-row items-center gap-4">
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="time" size={16} color="#0284c7" />
                        <Text className="text-sm font-medium text-blue-800">
                          平均移動時間: {RECOMMENDED_CENTER.averageTime}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="people" size={16} color="#0284c7" />
                        <Text className="text-sm font-medium text-blue-800">
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
                animated={false}
              >
                <View className="gap-4">
                  <View className="flex-row items-center gap-3">
                    <View className="w-12 h-12 rounded-2xl bg-orange-100 justify-center items-center">
                      <Ionicons name="map" size={24} color="#f59e0b" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-neutral-900">
                        指定エリアで探す
                      </Text>
                      <Text className="text-sm text-neutral-600 mt-1">
                        特定のエリアや駅を指定
                      </Text>
                    </View>
                    {selectionType === 'specified' && (
                      <View className="w-6 h-6 rounded-full bg-primary-500 justify-center items-center">
                        <Ionicons name="checkmark" size={14} color="white" />
                      </View>
                    )}
                  </View>

                  {selectionType === 'specified' && (
                    <View className="gap-4">
                      {/* 人気エリア */}
                      <View>
                        <Text className="text-base font-semibold text-neutral-900 mb-3">
                          人気エリア
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                          {POPULAR_AREAS.map((area) => (
                            <TouchableOpacity
                              key={area.id}
                              onPress={() =>
                                handleSpecifiedAreaSelect(area.name)
                              }
                              className="flex-row items-center px-3 py-2 rounded-2xl bg-orange-100 border border-orange-200"
                              activeOpacity={0.7}
                            >
                              <Text className="text-base mr-2">
                                {area.icon}
                              </Text>
                              <Text className="text-sm font-medium text-orange-700">
                                {area.name}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* カスタムエリア入力 */}
                      <View>
                        <Text className="text-base font-semibold text-neutral-900 mb-3">
                          その他のエリア・駅名
                        </Text>
                        <View className="flex-row gap-3">
                          <Input
                            placeholder="例：恵比寿、表参道、秋葉原"
                            value={customArea}
                            onChangeText={setCustomArea}
                            className="flex-1"
                          />
                          <TouchableOpacity
                            onPress={handleCustomAreaSelect}
                            className="w-12 h-12 rounded-2xl bg-orange-600 justify-center items-center"
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
          <View className="px-6 py-4 bg-white border-t border-neutral-200">
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
      </SafeAreaView>
    </Modal>
  );
};
