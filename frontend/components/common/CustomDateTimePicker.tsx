import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

interface CustomDateTimePickerProps {
  isVisible: boolean;
  mode: 'date' | 'time';
  value: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  title?: string;
}

export const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  isVisible,
  mode,
  value,
  minimumDate = new Date(1900, 0, 1),
  maximumDate = new Date(2100, 11, 31),
  onConfirm,
  onCancel,
  title = mode === 'date' ? '日付を選択' : '時間を選択',
}) => {
  // モーダル内で編集中の日付（確定前の一時的な値）
  const [selectedDate, setSelectedDate] = useState(value);

  // Modal表示制御（アニメーション完了まで表示を維持するため）
  const [modalVisible, setModalVisible] = useState(false);

  // アニメーション用のShared Values
  const translateY = useSharedValue(300); // 初期位置：画面下300px
  const opacity = useSharedValue(0); // 初期状態：透明

  // propsのvalueが変更された時に内部状態を同期
  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  // モーダル表示/非表示のアニメーション制御
  useEffect(() => {
    if (isVisible) {
      // 表示時：Modal表示 → フェードイン + スライドアップ
      setModalVisible(true);
      opacity.value = withTiming(1, { duration: 250 }); // 背景のフェードイン
      translateY.value = withTiming(0, { duration: 300 }); // モーダルのスライドアップ
    } else {
      // 非表示時：フェードアウト + スライドダウン → Modal非表示
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(400, { duration: 250 }, () => {
        // アニメーション完了後にModalを非表示にする
        runOnJS(setModalVisible)(false);
      });
    }
  }, [isVisible, opacity, translateY]);

  // 背景のアニメーションスタイル
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // モーダルのアニメーションスタイル
  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

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
    <Modal transparent visible={modalVisible} statusBarTranslucent>
      <View style={styles.container}>
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
              <Text style={styles.cancelText}>キャンセル</Text>
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>

            <TouchableOpacity
              onPress={handleConfirm}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmText}>決定</Text>
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
  const years = Array.from(
    { length: maximumDate.getFullYear() - minimumDate.getFullYear() + 1 },
    (_, i) => minimumDate.getFullYear() + i
  );

  // 月配列（0-11）
  const months = Array.from({ length: 12 }, (_, i) => i);

  // 指定年月の日数を取得
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

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
        items={years.map((year) => ({ label: `${year}年`, value: year }))}
        selectedValue={currentYear}
        onValueChange={(value) => handleChange('year', value)}
      />

      {/* 月ホイール */}
      <PickerWheel
        items={months.map((month) => ({
          label: `${month + 1}月`,
          value: month,
        }))}
        selectedValue={currentMonth}
        onValueChange={(value) => handleChange('month', value)}
      />

      {/* 日ホイール */}
      <PickerWheel
        items={days.map((day) => ({ label: `${day}日`, value: day }))}
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

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

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
        <Text style={styles.separator}>:</Text>
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
  const ITEM_HEIGHT = 50;
  const scrollViewRef = useRef<ScrollView>(null);

  // ユーザーがスクロール中かどうかの状態
  // true: ユーザーの手動操作中 → プログラムによる自動スクロールを無効化
  // false: スクロール静止状態 → プログラムによる自動スクロールを許可
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const selectedIndex = items.findIndex((item) => item.value === selectedValue);

  // 選択値が変更された時の自動スクロール
  useEffect(() => {
    // ユーザーがスクロール中でない場合のみ自動スクロールを実行
    if (scrollViewRef.current && selectedIndex >= 0 && !isUserScrolling) {
      scrollViewRef.current.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, [selectedIndex, isUserScrolling]);

  // ユーザーがスクロールを開始した時
  const handleScrollBeginDrag = () => {
    setIsUserScrolling(true);
  };

  // スクロールのモーメンタム（慣性）が終了した時
  const handleMomentumScrollEnd = (event: any) => {
    setIsUserScrolling(false);

    // スクロール位置から選択すべき項目のインデックスを計算
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);

    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));

    if (items[clampedIndex]) {
      onValueChange(items[clampedIndex].value);
    }
  };

  return (
    <View style={styles.wheelItem}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT} // 項目の高さごとにスナップ
        decelerationRate="fast" // 素早く減速してスナップしやすくする
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={{
          paddingTop: ITEM_HEIGHT * 2,
          paddingBottom: ITEM_HEIGHT * 2,
        }}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.value}
            style={[styles.wheelItemText, { height: ITEM_HEIGHT }]}
            onPress={() => {
              onValueChange(item.value);
              scrollViewRef.current?.scrollTo({
                y: index * ITEM_HEIGHT,
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
    maxHeight: '75%',
    minHeight: 400,
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
    minWidth: 80,
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
    minWidth: 80,
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
    minHeight: 300,
  },
  wheelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    position: 'relative',
  },
  wheelSelection: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 50,
    marginTop: -50,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.primary[300],
    backgroundColor: Colors.primary[50],
    opacity: 0.3,
    zIndex: 1,
  },
  wheelItem: {
    flex: 1,
    height: 300,
  },
  timeWheelWrapper: {
    flex: 1,
    height: 300,
  },
  separatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
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
