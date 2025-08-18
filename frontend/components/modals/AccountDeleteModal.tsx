import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

interface AccountDeleteModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export const AccountDeleteModal: React.FC<AccountDeleteModalProps> = ({
  isVisible,
  onClose,
  onConfirmDelete,
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleClose = () => {
    setConfirmationText('');
    setIsConfirmed(false);
    onClose();
  };

  const handleConfirmationChange = (text: string) => {
    setConfirmationText(text);
    setIsConfirmed(text === '削除を確認');
  };

  const handleDelete = () => {
    if (!isConfirmed) {
      Alert.alert('エラー', '確認テキストを正しく入力してください');
      return;
    }

    Alert.alert(
      '最終確認',
      'この操作は取り消すことができません。アカウントを削除しますか？（個人データが削除されますが、共有記録は保持されます）',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除する',
          style: 'destructive',
          onPress: () => {
            onConfirmDelete();
            handleClose();
          },
        },
      ]
    );
  };

  const dataItems = [
    {
      icon: 'calendar-outline',
      label: '作成したイベント',
      description: '日程調整、メンバー情報、Webフォーム',
    },
    {
      icon: 'people-outline',
      label: 'メンバーリスト',
      description: '登録したメンバーの連絡先と情報',
    },
    {
      icon: 'settings-outline',
      label: 'アカウント設定',
      description: 'プロフィール情報と設定',
    },
  ];

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
            <Text className="text-lg font-bold text-error-600">
              アカウント削除
            </Text>
            <View className="w-10" />
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6 gap-6">
            {/* 警告メッセージ */}
            <Card variant="elevated" shadow="large" animated={true}>
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 rounded-2xl bg-error-100 justify-center items-center">
                    <Ionicons name="warning" size={24} color="#ef4444" />
                  </View>
                  <View className="flex-1">
                    {' '}
                    <Text className="text-xl font-bold text-error-600 mb-1">
                      注意：この操作は取り消せません
                    </Text>
                    <Text className="text-error-700">
                      アカウントを削除すると、個人データが削除されます
                    </Text>
                  </View>
                </View>

                <View className="p-4 bg-error-50 rounded-xl border border-error-200">
                  <Text className="text-error-800 font-medium text-base leading-6">
                    ⚠️ アカウント削除により失われるデータは復元できません。
                    削除前に重要な情報をバックアップしてください。
                  </Text>
                </View>
              </View>
            </Card>

            {/* アカウント情報 */}
            <Card variant="elevated" shadow="soft">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-blue-100 justify-center items-center">
                    <Ionicons name="person" size={20} color="#0284c7" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    削除対象のアカウント
                  </Text>
                </View>

                <View className="p-4 bg-blue-50 rounded-xl">
                  <Text className="text-blue-900 font-bold text-lg">
                    アカウント削除の確認
                  </Text>
                  <Text className="text-blue-700 text-sm mt-1">
                    個人データとアカウント情報が削除されます（共有記録は保持されます）
                  </Text>
                </View>
              </View>
            </Card>

            {/* 削除されるデータの詳細 */}
            <Card variant="elevated" shadow="soft">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-purple-100 justify-center items-center">
                    <Ionicons name="trash" size={20} color="#7c3aed" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    削除されるデータ
                  </Text>
                </View>

                <Text className="text-sm text-neutral-600 leading-5">
                  以下のデータがサーバーから完全に削除され、復元することはできません：
                </Text>

                <View className="gap-3">
                  {dataItems.map((item, index) => (
                    <View
                      key={index}
                      className="flex-row items-start gap-3 p-3 bg-neutral-50 rounded-xl"
                    >
                      <View className="w-8 h-8 rounded-xl bg-neutral-100 justify-center items-center mt-0.5">
                        <Ionicons
                          name={item.icon as any}
                          size={16}
                          color="#64748b"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-medium text-neutral-900 mb-1">
                          {item.label}
                        </Text>
                        <Text className="text-sm text-neutral-600 leading-5">
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </Card>

            {/* データ保護に関する説明 */}
            <Card variant="elevated" shadow="soft">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-green-100 justify-center items-center">
                    <Ionicons
                      name="shield-checkmark"
                      size={20}
                      color="#10b981"
                    />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    プライバシーとデータ保護
                  </Text>
                </View>

                <View className="gap-3">
                  <View className="p-3 bg-green-50 rounded-xl">
                    <Text className="text-green-800 font-medium mb-2">
                      ✅ 確実な削除
                    </Text>
                    <Text className="text-green-700 text-sm leading-5">
                      アカウント削除処理により、お客様のデータはサーバーから完全に削除されます。
                      バックアップサーバーからも30日以内に削除されます。
                    </Text>
                  </View>

                  <View className="p-3 bg-amber-50 rounded-xl">
                    <Text className="text-amber-800 font-medium mb-2">
                      ⚠️ 他の幹事への影響
                    </Text>
                    <Text className="text-amber-700 text-sm leading-5">
                      あなたが共有した記録は匿名化されて残ります。
                      他の幹事のナレッジ共有に影響を与えないためです。
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* 削除の確認 */}
            <Card variant="elevated" shadow="soft">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-error-100 justify-center items-center">
                    <Ionicons name="key" size={20} color="#ef4444" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    削除の確認
                  </Text>
                </View>

                <Text className="text-sm text-neutral-600 leading-5">
                  アカウント削除を実行するには、下のテキストボックスに
                  <Text className="font-bold text-error-600">
                    「削除を確認」
                  </Text>
                  と入力してください。
                </Text>

                <Input
                  placeholder="削除を確認"
                  value={confirmationText}
                  onChangeText={handleConfirmationChange}
                  error={
                    confirmationText.length > 0 && !isConfirmed
                      ? 'テキストが正しくありません'
                      : undefined
                  }
                />

                {isConfirmed && (
                  <View className="p-3 bg-success-50 rounded-xl">
                    <View className="flex-row items-center gap-2">
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#10b981"
                      />
                      <Text className="text-success-700 font-medium">
                        確認テキストが正しく入力されました
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </Card>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="px-6 py-4 bg-white border-t border-neutral-200">
          <View className="flex-row gap-3">
            <Button
              title="キャンセル"
              onPress={handleClose}
              variant="outline"
              size="lg"
              className="flex-1"
            />
            <Button
              title="アカウントを削除"
              onPress={handleDelete}
              variant="primary"
              size="lg"
              className="flex-1 bg-error-600"
              disabled={!isConfirmed}
              icon={<Ionicons name="trash" size={20} color="white" />}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
