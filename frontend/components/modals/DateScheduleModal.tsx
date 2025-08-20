import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface DateScheduleModalProps {
  isVisible: boolean;
  onClose: () => void;
  onScheduleSetup: (scheduleData: ScheduleData) => void;
}

export interface ScheduleData {
  title: string;
  description?: string;
  dateOptions: DateOption[];
  deadline?: string;
}

interface DateOption {
  id: string;
  date: string;
  time: string;
  label?: string;
}

export const DateScheduleModal: React.FC<DateScheduleModalProps> = ({
  isVisible,
  onClose,
  onScheduleSetup,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateOptions, setDateOptions] = useState<DateOption[]>([
    { id: '1', date: '', time: '19:00' },
    { id: '2', date: '', time: '19:30' },
  ]);
  const [deadline, setDeadline] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState<string | null>(null);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDateOptions([
      { id: '1', date: '', time: '19:00' },
      { id: '2', date: '', time: '19:30' },
    ]);
    setDeadline('');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }

    const validOptions = dateOptions.filter((option) => option.date.trim());
    if (validOptions.length < 2) {
      newErrors.dateOptions = '少なくとも2つの候補日を設定してください';
    }

    // 日付の重複チェック
    const dates = validOptions.map((option) => `${option.date}-${option.time}`);
    const uniqueDates = new Set(dates);
    if (dates.length !== uniqueDates.size) {
      newErrors.dateOptions = '同じ日時の候補が重複しています';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSetup = () => {
    if (!validateForm()) return;

    const validOptions = dateOptions.filter((option) => option.date.trim());
    const scheduleData: ScheduleData = {
      title,
      description,
      dateOptions: validOptions,
      deadline,
    };

    onScheduleSetup(scheduleData);
    resetForm();
    onClose();
  };

  const addDateOption = () => {
    const newOption: DateOption = {
      id: Date.now().toString(),
      date: '',
      time: '19:00',
    };
    setDateOptions((prev) => [...prev, newOption]);
  };

  const removeDateOption = (id: string) => {
    if (dateOptions.length <= 2) {
      Alert.alert('エラー', '最低2つの候補日が必要です');
      return;
    }
    setDateOptions((prev) => prev.filter((option) => option.id !== id));
  };

  const updateDateOption = (
    id: string,
    field: 'date' | 'time',
    value: string
  ) => {
    setDateOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, [field]: value } : option
      )
    );
  };

  const handleDateChange = (id: string, event: any, selectedDate?: Date) => {
    setShowDatePicker(null);
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      updateDateOption(id, 'date', dateString);
    }
  };

  const handleTimeChange = (id: string, event: any, selectedTime?: Date) => {
    setShowTimePicker(null);
    if (selectedTime) {
      const timeString = selectedTime.toTimeString().slice(0, 5);
      updateDateOption(id, 'time', timeString);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handleDeadlineChange = (event: any, selectedDate?: Date) => {
    setShowDeadlinePicker(false);
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      setDeadline(dateString);
    }
  };

  const validOptionsCount = dateOptions.filter((option) =>
    option.date.trim()
  ).length;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              日程調整設定
            </Text>
            <View style={styles.headerSpacer} />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* 説明 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.calendarIcon]}>
                    <Ionicons name="calendar" size={20} color="#f59e0b" />
                  </View>
                  <Text style={styles.sectionTitle}>
                    日程調整の設定
                  </Text>
                </View>
                <Text style={styles.sectionDescription}>
                  メンバーに都合を聞くための候補日を設定します。
                  複数の候補日を用意して、最も多くの人が参加できる日程を見つけましょう。
                </Text>
              </View>
            </Card>

            {/* 基本情報 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.infoIcon]}>
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color="#0284c7"
                    />
                  </View>
                  <Text style={styles.sectionTitle}>
                    基本情報
                  </Text>
                </View>

                <Input
                  label="調整タイトル *"
                  placeholder="例：新人歓迎会の日程調整"
                  value={title}
                  onChangeText={setTitle}
                  error={errors.title}
                />

                <Input
                  label="補足説明"
                  placeholder="例：2時間程度を予定しています"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={2}
                />
              </View>
            </Card>

            {/* 候補日設定 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.candidatesHeader}>
                  <View style={styles.sectionHeader}>
                    <View style={[styles.sectionIcon, styles.timeIcon]}>
                      <Ionicons name="time" size={20} color="#f59e0b" />
                    </View>
                    <Text style={styles.sectionTitle}>
                      候補日設定
                    </Text>
                  </View>
                  <View style={styles.candidatesCounter}>
                    <Text style={styles.candidatesCounterText}>
                      {validOptionsCount}候補
                    </Text>
                  </View>
                </View>

                {errors.dateOptions && (
                  <Text style={styles.errorText}>
                    {errors.dateOptions}
                  </Text>
                )}

                {/* 候補日リスト */}
                <View style={styles.candidatesList}>
                  {dateOptions.map((option, index) => (
                    <View
                      key={option.id}
                      style={styles.candidateItem}
                    >
                      <View style={styles.candidateHeader}>
                        <Text style={styles.candidateLabel}>
                          候補 {index + 1}
                        </Text>
                        {dateOptions.length > 2 && (
                          <TouchableOpacity
                            onPress={() => removeDateOption(option.id)}
                            style={styles.deleteButton}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={16}
                              color="#ef4444"
                            />
                          </TouchableOpacity>
                        )}
                      </View>

                      <View style={styles.candidateFields}>
                        <TouchableOpacity
                          onPress={() => setShowDatePicker(option.id)}
                          style={styles.candidateField}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.fieldLabel}>
                            日付
                          </Text>
                          <Text
                            style={[
                              styles.fieldValue,
                              option.date ? styles.fieldValueSet : styles.fieldValuePlaceholder
                            ]}
                          >
                            {option.date
                              ? formatDate(option.date)
                              : '日付を選択'}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => setShowTimePicker(option.id)}
                          style={styles.candidateField}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.fieldLabel}>
                            時間
                          </Text>
                          <Text style={[styles.fieldValue, styles.fieldValueSet]}>
                            {option.time}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>

                {/* 候補日追加ボタン */}
                <TouchableOpacity
                  onPress={addDateOption}
                  style={styles.addButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={20} color="#f59e0b" />
                  <Text style={styles.addButtonText}>
                    候補日を追加
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>

            {/* 回答期限 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.deadlineIcon]}>
                    <Ionicons name="alarm" size={20} color="#ef4444" />
                  </View>
                  <Text style={styles.sectionTitle}>
                    回答期限
                  </Text>
                  <Text style={styles.optionalLabel}>（任意）</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setShowDeadlinePicker(true)}
                  style={styles.deadlineField}
                  activeOpacity={0.7}
                >
                  <Text style={styles.fieldLabel}>
                    期限日
                  </Text>
                  <Text
                    style={[
                      styles.fieldValue,
                      deadline ? styles.fieldValueSet : styles.fieldValuePlaceholder
                    ]}
                  >
                    {deadline ? formatDate(deadline) : '期限を選択'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.deadlineTip}>
                  <Text style={styles.deadlineTipText}>
                    💡
                    期限を設定すると、メンバーにより早めの回答を促すことができます
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="日程調整を開始"
            onPress={handleSetup}
            variant="gradient"
            size="lg"
            fullWidth
            disabled={!title.trim() || validOptionsCount < 2}
            icon={<Ionicons name="send" size={20} color="white" />}
          />
        </View>

        {/* Date/Time Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event, date) =>
              handleDateChange(showDatePicker, event, date)
            }
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display="default"
            onChange={(event, time) =>
              handleTimeChange(showTimePicker, event, time)
            }
          />
        )}

        {showDeadlinePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleDeadlineChange}
          />
        )}
      </SafeAreaView>
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
  calendarIcon: {
    backgroundColor: '#fef3c7',
  },
  infoIcon: {
    backgroundColor: Colors.primary[100],
  },
  timeIcon: {
    backgroundColor: '#fef3c7',
  },
  deadlineIcon: {
    backgroundColor: '#fee2e2',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  sectionDescription: {
    color: Colors.neutral[700],
    lineHeight: 24,
  },
  optionalLabel: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  candidatesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  candidatesCounter: {
    backgroundColor: '#fef3c7',
    borderRadius: Layout.borderRadius.full,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
  },
  candidatesCounterText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400e',
  },
  errorText: {
    fontSize: 14,
    color: Colors.error[600],
  },
  candidatesList: {
    gap: Layout.spacing.sm,
  },
  candidateItem: {
    padding: Layout.spacing.md,
    backgroundColor: Colors.neutral[50],
    borderRadius: Layout.borderRadius.md,
  },
  candidateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  candidateLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[900],
  },
  deleteButton: {
    padding: Layout.spacing.xs,
  },
  candidateFields: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  candidateField: {
    flex: 1,
    padding: Layout.spacing.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: Layout.borderRadius.md,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
    marginBottom: Layout.spacing.xs,
  },
  fieldValue: {
    fontSize: 16,
  },
  fieldValueSet: {
    color: Colors.neutral[900],
  },
  fieldValuePlaceholder: {
    color: Colors.neutral[400],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#fbbf24',
    borderRadius: Layout.borderRadius.md,
  },
  addButtonText: {
    marginLeft: Layout.spacing.sm,
    fontSize: 16,
    fontWeight: '500',
    color: '#d97706',
  },
  deadlineField: {
    padding: Layout.spacing.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: Layout.borderRadius.md,
  },
  deadlineTip: {
    padding: Layout.spacing.sm,
    backgroundColor: '#fee2e2',
    borderRadius: Layout.borderRadius.md,
  },
  deadlineTipText: {
    fontSize: 14,
    color: '#991b1b',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: Layout.padding.lg,
    paddingVertical: Layout.padding.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
});
