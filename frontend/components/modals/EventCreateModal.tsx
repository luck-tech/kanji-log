import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { EventPurpose } from '@/types';
import DateTimePicker from '@react-native-community/datetimepicker';

interface EventCreateModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCreate: (eventData: EventCreateData) => void;
}

export interface EventCreateData {
  title: string;
  purpose: EventPurpose | '';
  date?: string;
  time?: string;
  notes?: string;
  hasScheduling: boolean;
}

const PURPOSE_OPTIONS = [
  { key: 'welcome', label: '歓迎会', icon: '🎉' },
  { key: 'farewell', label: '送別会', icon: '👋' },
  { key: 'celebration', label: 'お祝い', icon: '🎊' },
  { key: 'team_building', label: 'チームビルディング', icon: '🤝' },
  { key: 'casual', label: '親睦会', icon: '🍻' },
  { key: 'other', label: 'その他', icon: '📝' },
];

export const EventCreateModal: React.FC<EventCreateModalProps> = ({
  isVisible,
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] = useState<EventCreateData>({
    title: '',
    purpose: '',
    hasScheduling: false,
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(() => {
    const defaultTime = new Date();
    defaultTime.setHours(19, 0, 0, 0); // 初期値19:00
    return defaultTime;
  });

  const resetForm = () => {
    setFormData({
      title: '',
      purpose: '',
      hasScheduling: false,
      notes: '',
    });
    setErrors({});
    setSelectedDate(new Date());
    const defaultTime = new Date();
    defaultTime.setHours(19, 0, 0, 0);
    setSelectedTime(defaultTime);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'イベント名は必須です';
    }

    if (formData.title.length > 50) {
      newErrors.title = 'イベント名は50文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validateForm()) return;

    onCreate(formData);
    resetForm();
    onClose();
  };

  const handlePurposeSelect = (purpose: EventPurpose) => {
    setFormData((prev) => ({
      ...prev,
      purpose: prev.purpose === purpose ? '' : purpose,
    }));
  };

  const formatDate = (date: Date) => {
    return date
      .toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '-');
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handleDateTimeOption = (option: 'now' | 'later') => {
    if (option === 'now') {
      setFormData((prev) => ({
        ...prev,
        hasScheduling: false,
        date: formatDate(selectedDate),
        time: formatTime(selectedTime),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        hasScheduling: true,
        date: undefined,
        time: undefined,
      }));
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      setFormData((prev) => ({
        ...prev,
        date: formatDate(date),
      }));
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (time) {
      setSelectedTime(time);
      setFormData((prev) => ({
        ...prev,
        time: formatTime(time),
      }));
    }
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
              新しいイベント
            </Text>
            <View className="w-10" />
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6 gap-6">
            {/* イベント名 */}
            <Card variant="elevated" shadow="soft">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-blue-100 justify-center items-center">
                    <Ionicons name="calendar" size={20} color="#0284c7" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    イベント情報
                  </Text>
                </View>

                <Input
                  label="イベント名 *"
                  placeholder="例：新人歓迎会、部署懇親会"
                  value={formData.title}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, title: text }))
                  }
                  error={errors.title}
                  maxLength={50}
                />

                <Input
                  label="補足・備考"
                  placeholder="イベントの詳細や注意事項があれば入力"
                  value={formData.notes}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, notes: text }))
                  }
                  multiline
                  numberOfLines={3}
                />
              </View>
            </Card>

            {/* 目的選択 */}
            <Card variant="elevated" shadow="soft">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-orange-100 justify-center items-center">
                    <Text className="text-lg">🎯</Text>
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    飲み会の目的
                  </Text>
                  <Text className="text-sm text-neutral-500">（任意）</Text>
                </View>

                <View className="flex-row flex-wrap gap-2">
                  {PURPOSE_OPTIONS.map((option) => {
                    const isSelected = formData.purpose === option.key;
                    return (
                      <TouchableOpacity
                        key={option.key}
                        onPress={() =>
                          handlePurposeSelect(option.key as EventPurpose)
                        }
                        className={`flex-row items-center px-3 py-2 rounded-2xl border ${
                          isSelected
                            ? 'bg-primary-100 border-primary-500'
                            : 'bg-neutral-50 border-neutral-200'
                        }`}
                        activeOpacity={0.7}
                      >
                        <Text className="text-base mr-2">{option.icon}</Text>
                        <Text
                          className={`text-sm font-medium ${
                            isSelected ? 'text-primary-700' : 'text-neutral-600'
                          }`}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Card>

            {/* 日程設定 */}
            <Card variant="elevated" shadow="soft">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-green-100 justify-center items-center">
                    <Ionicons name="time" size={20} color="#10b981" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    開催日時
                  </Text>
                </View>

                <Text className="text-sm text-neutral-600 leading-5">
                  日程が決まっている場合は「日時を設定」、メンバーと調整する場合は「後で日程調整」を選択してください。
                </Text>

                <View className="gap-3">
                  <TouchableOpacity
                    onPress={() => handleDateTimeOption('now')}
                    className={`p-4 rounded-2xl border-2 ${
                      !formData.hasScheduling
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 bg-white'
                    }`}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className={`w-6 h-6 rounded-full border-2 ${
                          !formData.hasScheduling
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-neutral-300'
                        } justify-center items-center`}
                      >
                        {!formData.hasScheduling && (
                          <View className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </View>
                      <Text
                        className={`text-base font-medium ${
                          !formData.hasScheduling
                            ? 'text-primary-700'
                            : 'text-neutral-700'
                        }`}
                      >
                        日時を設定して始める
                      </Text>
                    </View>
                    <Text className="text-sm text-neutral-500 ml-9 mt-1">
                      開催日時が決まっている場合
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDateTimeOption('later')}
                    className={`p-4 rounded-2xl border-2 ${
                      formData.hasScheduling
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 bg-white'
                    }`}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className={`w-6 h-6 rounded-full border-2 ${
                          formData.hasScheduling
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-neutral-300'
                        } justify-center items-center`}
                      >
                        {formData.hasScheduling && (
                          <View className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </View>
                      <Text
                        className={`text-base font-medium ${
                          formData.hasScheduling
                            ? 'text-primary-700'
                            : 'text-neutral-700'
                        }`}
                      >
                        後で日程調整する
                      </Text>
                    </View>
                    <Text className="text-sm text-neutral-500 ml-9 mt-1">
                      メンバーと都合を合わせる場合
                    </Text>
                  </TouchableOpacity>
                </View>

                {!formData.hasScheduling && (
                  <View className="gap-3 mt-4 p-4 bg-primary-50 rounded-2xl">
                    <View className="flex-row gap-3">
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        className="flex-1"
                      >
                        <View className="mb-4">
                          <Text className="text-base font-semibold text-neutral-700 mb-2">
                            開催日
                          </Text>
                          <View className="flex-row items-center min-h-12 px-4 py-3 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-neutral-200">
                            <Ionicons
                              name="calendar"
                              size={20}
                              color="#64748b"
                            />
                            <Text className="ml-3 text-base text-neutral-900">
                              {formData.date || formatDate(selectedDate)}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setShowTimePicker(true)}
                        className="flex-1"
                      >
                        <View className="mb-4">
                          <Text className="text-base font-semibold text-neutral-700 mb-2">
                            開始時間
                          </Text>
                          <View className="flex-row items-center min-h-12 px-4 py-3 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-neutral-200">
                            <Ionicons name="time" size={20} color="#64748b" />
                            <Text className="ml-3 text-base text-neutral-900">
                              {formData.time || formatTime(selectedTime)}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </Card>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="px-6 py-4 bg-white border-t border-neutral-200">
          <Button
            title="イベントを作成"
            onPress={handleCreate}
            variant="gradient"
            size="lg"
            fullWidth
            disabled={!formData.title.trim()}
            icon={<Ionicons name="add" size={20} color="white" />}
          />
        </View>
      </SafeAreaView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </Modal>
  );
};
