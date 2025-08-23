import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { Colors } from '@/utils/constants/design/colors';
import { Layout } from '@/utils/constants/design/layout';
import { DateTimePickerConstants } from '@/utils/constants/design/styles';
import {
  DATE_TIME_DEFAULTS,
  generateYears,
  generateMonths,
  generateHours,
  generateMinutes,
  getDaysInMonth,
} from '@/utils/constants/business/datetime';
import { useModalAnimation, usePickerScrollAnimation } from './Animations';
import { BaseComponentProps } from '@/types/common/ui';

interface DateTimePickerProps extends BaseComponentProps {
  isVisible: boolean;
  mode: 'date' | 'time';
  value: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  title?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  isVisible,
  mode,
  value,
  minimumDate = DATE_TIME_DEFAULTS.minimumDate,
  maximumDate = DATE_TIME_DEFAULTS.maximumDate,
  onConfirm,
  onCancel,
  title = mode === 'date'
    ? DATE_TIME_DEFAULTS.titles.date
    : DATE_TIME_DEFAULTS.titles.time,
  testID,
  style,
}) => {
  // モーダル内で編集中の日付（確定前の一時的な値）
  const [selectedDate, setSelectedDate] = useState(value);

  // アニメーション管理
  const { modalVisible, backdropStyle, modalStyle } =
    useModalAnimation(isVisible);

  // propsのvalueが変更された時に内部状態を同期
  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  // 決定ボタン：モーダル内で選択された値を確定
  const handleConfirm = () => {
    onConfirm(selectedDate);
  };

  // キャンセルボタン：変更を破棄してモーダルを閉じる
  const handleCancel = () => {
    onCancel();
  };

  // アニメーション中はModalを表示しない
  if (!modalVisible) return null;

  return (
    <Modal
      transparent
      visible={modalVisible}
      statusBarTranslucent
      testID={testID}
    >
      <View style={[styles.container, style]}>
        {/* 半透明の背景オーバーレイ */}
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <TouchableOpacity
            style={styles.backdropTouchable}
            onPress={handleCancel}
            activeOpacity={1}
          />
        </Animated.View>

        {/* メインのモーダルコンテンツ */}
        <Animated.View style={[styles.modal, modalStyle]}>
          {/* ヘッダー（キャンセル・タイトル・決定） */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>
                {DATE_TIME_DEFAULTS.labels.cancel}
              </Text>
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>

            <TouchableOpacity
              onPress={handleConfirm}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmText}>
                {DATE_TIME_DEFAULTS.labels.confirm}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ピッカーコンテンツ */}
          <View style={styles.pickerContainer}>
            {mode === 'date' ? (
              <DatePickerWheel
                value={selectedDate}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                onChange={setSelectedDate}
              />
            ) : (
              <TimePickerWheel
                value={selectedDate}
                onChange={setSelectedDate}
              />
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// 日付選択ホイールコンポーネント（年・月・日の3つのホイール）
const DatePickerWheel: React.FC<{
  value: Date;
  minimumDate: Date;
  maximumDate: Date;
  onChange: (date: Date) => void;
}> = ({ value, minimumDate, maximumDate, onChange }) => {
  const currentYear = value.getFullYear();
  const currentMonth = value.getMonth();
  const currentDay = value.getDate();

  // 最小〜最大年の範囲で年配列を生成
  const years = generateYears(minimumDate, maximumDate);

  // 月配列（0-11）
  const months = generateMonths();

  // 現在選択中の年月における日配列を生成
  const days = Array.from(
    { length: getDaysInMonth(currentYear, currentMonth) },
    (_, i) => i + 1
  );

  // 年・月・日のいずれかが変更された時のハンドラー
  const handleChange = (type: 'year' | 'month' | 'day', value: number) => {
    const newDate = new Date(
      type === 'year' ? value : currentYear,
      type === 'month' ? value : currentMonth,
      type === 'day' ? value : currentDay
    );
    onChange(newDate);
  };

  return (
    <View style={styles.wheelContainer}>
      {/* 選択中項目をハイライトする背景 */}
      <View style={styles.wheelSelection} />

      {/* 年ホイール */}
      <PickerWheel
        items={years.map((year) => ({
          label: `${year}${DATE_TIME_DEFAULTS.labels.year}`,
          value: year,
        }))}
        selectedValue={currentYear}
        onValueChange={(value) => handleChange('year', value)}
      />

      {/* 月ホイール */}
      <PickerWheel
        items={months.map((month) => ({
          label: `${month + 1}${DATE_TIME_DEFAULTS.labels.month}`,
          value: month,
        }))}
        selectedValue={currentMonth}
        onValueChange={(value) => handleChange('month', value)}
      />

      {/* 日ホイール */}
      <PickerWheel
        items={days.map((day) => ({
          label: `${day}${DATE_TIME_DEFAULTS.labels.day}`,
          value: day,
        }))}
        selectedValue={currentDay}
        onValueChange={(value) => handleChange('day', value)}
      />
    </View>
  );
};

// 時間選択ホイールコンポーネント（時・分の2つのホイール）
const TimePickerWheel: React.FC<{
  value: Date;
  onChange: (date: Date) => void;
}> = ({ value, onChange }) => {
  const currentHour = value.getHours();
  const currentMinute = value.getMinutes();

  const hours = generateHours();
  const minutes = generateMinutes(DATE_TIME_DEFAULTS.time.minuteInterval);

  // 時・分のいずれかが変更された時のハンドラー
  const handleChange = (type: 'hour' | 'minute', newValue: number) => {
    const newDate = new Date(value);
    if (type === 'hour') {
      newDate.setHours(newValue);
    } else {
      newDate.setMinutes(newValue);
    }
    onChange(newDate);
  };

  return (
    <View style={styles.wheelContainer}>
      {/* 選択中項目をハイライトする背景 */}
      <View style={styles.wheelSelection} />

      {/* 時ホイール */}
      <View style={styles.timeWheelWrapper}>
        <PickerWheel
          items={hours.map((hour) => ({
            label: hour.toString().padStart(2, '0'),
            value: hour,
          }))}
          selectedValue={currentHour}
          onValueChange={(value) => handleChange('hour', value)}
        />
      </View>

      <View style={styles.separatorContainer}>
        <Text style={styles.separator}>
          {DATE_TIME_DEFAULTS.labels.separator}
        </Text>
      </View>

      {/* 分ホイール */}
      <View style={styles.timeWheelWrapper}>
        <PickerWheel
          items={minutes.map((minute) => ({
            label: minute.toString().padStart(2, '0'),
            value: minute,
          }))}
          selectedValue={currentMinute}
          onValueChange={(value) => handleChange('minute', value)}
        />
      </View>
    </View>
  );
};

// 汎用ピッカーホイールコンポーネント
const PickerWheel: React.FC<{
  items: { label: string; value: number }[];
  selectedValue: number;
  onValueChange: (value: number) => void;
}> = ({ items, selectedValue, onValueChange }) => {
  const { scrollViewRef, handleScrollBeginDrag, handleMomentumScrollEnd } =
    usePickerScrollAnimation(
      selectedValue,
      items,
      DateTimePickerConstants.wheel.itemHeight
    );

  const handleMomentumScrollEndWithSelection = (event: any) => {
    const clampedIndex = handleMomentumScrollEnd(event);
    if (items[clampedIndex]) {
      onValueChange(items[clampedIndex].value);
    }
  };

  return (
    <View style={styles.wheelItem}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={DateTimePickerConstants.wheel.itemHeight} // 項目の高さごとにスナップ
        decelerationRate="fast" // 素早く減速してスナップしやすくする
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={handleMomentumScrollEndWithSelection}
        contentContainerStyle={{
          paddingTop: DateTimePickerConstants.wheel.padding.top,
          paddingBottom: DateTimePickerConstants.wheel.padding.bottom,
        }}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.wheelItemText,
              { height: DateTimePickerConstants.wheel.itemHeight },
            ]}
            onPress={() => {
              onValueChange(item.value);
              scrollViewRef.current?.scrollTo({
                y: index * DateTimePickerConstants.wheel.itemHeight,
                animated: true,
              });
            }}
          >
            <Text
              style={[
                styles.wheelText,
                selectedValue === item.value && styles.wheelTextSelected,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  modal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Layout.borderRadius.xl,
    borderTopRightRadius: Layout.borderRadius.xl,
    maxHeight: DateTimePickerConstants.modal.maxHeight,
    minHeight: DateTimePickerConstants.modal.minHeight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.padding.lg,
    paddingVertical: Layout.padding.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  cancelButton: {
    padding: Layout.spacing.sm,
    minWidth: DateTimePickerConstants.modal.minButtonWidth,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.neutral[500],
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  confirmButton: {
    padding: Layout.spacing.sm,
    minWidth: DateTimePickerConstants.modal.minButtonWidth,
    alignItems: 'flex-end',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[600],
  },
  pickerContainer: {
    padding: Layout.padding.lg,
    flex: 1,
    minHeight: DateTimePickerConstants.wheel.minHeight,
  },
  wheelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: DateTimePickerConstants.wheel.containerHeight,
    position: 'relative',
  },
  wheelSelection: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    height: DateTimePickerConstants.wheel.itemHeight,
    marginTop: -(DateTimePickerConstants.wheel.itemHeight / 2),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.primary[300],
    backgroundColor: Colors.primary[50],
    opacity: 0.3,
    zIndex: 1,
  },
  wheelItem: {
    flex: 1,
    height: DateTimePickerConstants.wheel.minHeight,
  },
  timeWheelWrapper: {
    flex: 1,
    height: DateTimePickerConstants.wheel.minHeight,
  },
  separatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DateTimePickerConstants.wheel.itemHeight,
  },
  separator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary[700],
    textAlign: 'center',
  },
  wheelItemText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelText: {
    fontSize: 18,
    color: Colors.neutral[600],
    textAlign: 'center',
  },
  wheelTextSelected: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary[700],
  },
});
