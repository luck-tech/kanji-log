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
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { EventPurpose } from '@/types';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { CustomDateTimePicker } from '@/components/common/CustomDateTimePicker';

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
  const insets = useSafeAreaInsets();
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

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    setFormData((prev) => ({
      ...prev,
      date: formatDate(date),
    }));
    setShowDatePicker(false);
  };

  const handleTimeConfirm = (time: Date) => {
    setSelectedTime(time);
    setFormData((prev) => ({
      ...prev,
      time: formatTime(time),
    }));
    setShowTimePicker(false);
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
            <Text style={styles.headerTitle}>新しいイベント</Text>
            <View style={styles.headerSpacer} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* イベント名 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.eventIcon]}>
                    <Ionicons name="calendar" size={20} color="#0284c7" />
                  </View>
                  <Text style={styles.sectionTitle}>イベント情報</Text>
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
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.purposeIcon]}>
                    <Text style={styles.emojiIcon}>🎯</Text>
                  </View>
                  <Text style={styles.sectionTitle}>飲み会の目的</Text>
                  <Text style={styles.optionalLabel}>（任意）</Text>
                </View>

                <View style={styles.purposeOptions}>
                  {PURPOSE_OPTIONS.map((option) => {
                    const isSelected = formData.purpose === option.key;
                    return (
                      <TouchableOpacity
                        key={option.key}
                        onPress={() =>
                          handlePurposeSelect(option.key as EventPurpose)
                        }
                        style={[
                          styles.purposeOption,
                          isSelected
                            ? styles.purposeOptionSelected
                            : styles.purposeOptionUnselected,
                        ]}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.purposeOptionIcon}>
                          {option.icon}
                        </Text>
                        <Text
                          style={[
                            styles.purposeOptionText,
                            isSelected
                              ? styles.purposeOptionTextSelected
                              : styles.purposeOptionTextUnselected,
                          ]}
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
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.scheduleIcon]}>
                    <Ionicons name="time" size={20} color="#10b981" />
                  </View>
                  <Text style={styles.sectionTitle}>開催日時</Text>
                </View>

                <Text style={styles.scheduleDescription}>
                  日程が決まっている場合は「日時を設定」、メンバーと調整する場合は「後で日程調整」を選択してください。
                </Text>

                <View style={styles.scheduleOptions}>
                  <TouchableOpacity
                    onPress={() => handleDateTimeOption('now')}
                    style={[
                      styles.scheduleOption,
                      !formData.hasScheduling
                        ? styles.scheduleOptionSelected
                        : styles.scheduleOptionUnselected,
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.scheduleOptionHeader}>
                      <View
                        style={[
                          styles.radioButton,
                          !formData.hasScheduling
                            ? styles.radioButtonSelected
                            : styles.radioButtonUnselected,
                        ]}
                      >
                        {!formData.hasScheduling && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.scheduleOptionTitle,
                          !formData.hasScheduling
                            ? styles.scheduleOptionTitleSelected
                            : styles.scheduleOptionTitleUnselected,
                        ]}
                      >
                        日時を設定して始める
                      </Text>
                    </View>
                    <Text style={styles.scheduleOptionDescription}>
                      開催日時が決まっている場合
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDateTimeOption('later')}
                    style={[
                      styles.scheduleOption,
                      formData.hasScheduling
                        ? styles.scheduleOptionSelected
                        : styles.scheduleOptionUnselected,
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.scheduleOptionHeader}>
                      <View
                        style={[
                          styles.radioButton,
                          formData.hasScheduling
                            ? styles.radioButtonSelected
                            : styles.radioButtonUnselected,
                        ]}
                      >
                        {formData.hasScheduling && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.scheduleOptionTitle,
                          formData.hasScheduling
                            ? styles.scheduleOptionTitleSelected
                            : styles.scheduleOptionTitleUnselected,
                        ]}
                      >
                        後で日程調整する
                      </Text>
                    </View>
                    <Text style={styles.scheduleOptionDescription}>
                      メンバーと都合を合わせる場合
                    </Text>
                  </TouchableOpacity>
                </View>

                {!formData.hasScheduling && (
                  <View style={styles.dateTimeContainer}>
                    <View style={styles.dateTimeFields}>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={styles.dateTimeField}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color={Colors.primary[600]}
                        />
                        <View style={styles.dateTimeFieldContent}>
                          <Text style={styles.dateTimeFieldLabel}>開催日</Text>
                          <Text style={styles.dateTimeText}>
                            {formatDate(selectedDate)}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setShowTimePicker(true)}
                        style={styles.dateTimeField}
                      >
                        <Ionicons
                          name="time-outline"
                          size={20}
                          color={Colors.primary[600]}
                        />
                        <View style={styles.dateTimeFieldContent}>
                          <Text style={styles.dateTimeFieldLabel}>
                            開始時間
                          </Text>
                          <Text style={styles.dateTimeText}>
                            {formatTime(selectedTime)}
                          </Text>
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
        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
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
      </View>

      {/* CustomDateTimePickers */}
      <CustomDateTimePicker
        isVisible={showDatePicker}
        mode="date"
        value={selectedDate}
        minimumDate={new Date()}
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
        title="開催日を選択"
      />

      <CustomDateTimePicker
        isVisible={showTimePicker}
        mode="time"
        value={selectedTime}
        onConfirm={handleTimeConfirm}
        onCancel={() => setShowTimePicker(false)}
        title="開始時間を選択"
      />
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
  section: {
    gap: Layout.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventIcon: {
    backgroundColor: Colors.primary[100],
  },
  purposeIcon: {
    backgroundColor: '#fed7aa',
  },
  scheduleIcon: {
    backgroundColor: Colors.success[100],
  },
  emojiIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  optionalLabel: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  purposeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  purposeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
  },
  purposeOptionSelected: {
    backgroundColor: Colors.primary[100],
    borderColor: Colors.primary[500],
  },
  purposeOptionUnselected: {
    backgroundColor: Colors.neutral[50],
    borderColor: Colors.neutral[200],
  },
  purposeOptionIcon: {
    fontSize: 16,
    marginRight: Layout.spacing.sm,
  },
  purposeOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  purposeOptionTextSelected: {
    color: Colors.primary[700],
  },
  purposeOptionTextUnselected: {
    color: Colors.neutral[600],
  },
  scheduleDescription: {
    fontSize: 14,
    color: Colors.neutral[600],
    lineHeight: 20,
  },
  scheduleOptions: {
    gap: Layout.spacing.sm,
  },
  scheduleOption: {
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 2,
  },
  scheduleOptionSelected: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  scheduleOptionUnselected: {
    borderColor: Colors.neutral[200],
    backgroundColor: Colors.white,
  },
  scheduleOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[500],
  },
  radioButtonUnselected: {
    borderColor: Colors.neutral[300],
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  scheduleOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  scheduleOptionTitleSelected: {
    color: Colors.primary[700],
  },
  scheduleOptionTitleUnselected: {
    color: Colors.neutral[700],
  },
  scheduleOptionDescription: {
    fontSize: 14,
    color: Colors.neutral[500],
    marginLeft: 36,
    marginTop: Layout.spacing.xs,
  },
  dateTimeContainer: {
    marginTop: Layout.spacing.md,
    padding: Layout.spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  dateTimeFields: {
    gap: Layout.spacing.md,
  },
  dateTimeField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.lg,
    backgroundColor: Colors.neutral[50],
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    gap: Layout.spacing.md,
  },
  dateTimeFieldContent: {
    flex: 1,
  },
  dateTimeFieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[600],
    marginBottom: Layout.spacing.xs,
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  footer: {
    paddingHorizontal: Layout.padding.lg,
    paddingVertical: Layout.padding.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
});
