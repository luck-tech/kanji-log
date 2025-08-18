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

interface MemberAddModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddMember: (memberData: MemberData) => void;
}

export interface MemberData {
  name: string;
  department?: string;
  notes?: string;
}

export const MemberAddModal: React.FC<MemberAddModalProps> = ({
  isVisible,
  onClose,
  onAddMember,
}) => {
  const [formData, setFormData] = useState<MemberData>({
    name: '',
    department: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      name: '',
      department: '',
      notes: '',
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '名前は必須です';
    }

    if (formData.name.length > 30) {
      newErrors.name = '名前は30文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validateForm()) return;

    onAddMember(formData);
    resetForm();
    onClose();
    Alert.alert('完了', `${formData.name}さんをメンバーリストに追加しました`);
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
              メンバー追加
            </Text>
            <View className="w-10" />
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6 gap-6">
            {/* 説明 */}
            <Card variant="elevated" shadow="none">
              <View className="gap-3">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-blue-100 justify-center items-center">
                    <Ionicons name="person-add" size={20} color="#0284c7" />
                  </View>
                  <Text className="text-lg font-bold text-neutral-900">
                    新しいメンバー
                  </Text>
                </View>
                <Text className="text-neutral-700 leading-6">
                  飲み会に参加予定のメンバーの情報を入力してください。
                  今後のイベントでも簡単に招待できるようになります。
                </Text>
              </View>
            </Card>

            {/* 基本情報 */}
            <Card variant="elevated" shadow="none">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-blue-100 justify-center items-center">
                    <Ionicons name="person" size={20} color="#0284c7" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    基本情報
                  </Text>
                </View>

                <Input
                  label="お名前 *"
                  placeholder="例：田中太郎"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, name: text }))
                  }
                  error={errors.name}
                  maxLength={30}
                />

                <Input
                  label="部署・所属"
                  placeholder="例：営業部、開発チーム"
                  value={formData.department}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, department: text }))
                  }
                />
              </View>
            </Card>

            {/* 補足情報 */}
            <Card variant="elevated" shadow="none">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-green-100 justify-center items-center">
                    <Ionicons name="document-text" size={20} color="#10b981" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    補足情報
                  </Text>
                  <Text className="text-sm text-neutral-500">（任意）</Text>
                </View>

                <Input
                  label="メモ・備考"
                  placeholder="例：お酒が飲めない、魚介類アレルギー"
                  value={formData.notes}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, notes: text }))
                  }
                  multiline
                  numberOfLines={3}
                />

                <View className="p-3 bg-amber-50 rounded-xl">
                  <View className="flex-row items-start gap-3">
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color="#f59e0b"
                    />
                    <Text className="text-sm text-amber-800 leading-5 flex-1">
                      ここに入力した情報は、Webフォーム作成時の参考情報として活用されます。
                      詳細な好みやアレルギー情報は、実際のWebフォームで収集します。
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* プライバシー情報 */}
            <Card variant="elevated" shadow="none">
              <View className="gap-3">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-purple-100 justify-center items-center">
                    <Ionicons
                      name="shield-checkmark"
                      size={20}
                      color="#7c3aed"
                    />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    プライバシー
                  </Text>
                </View>

                <View className="p-3 bg-purple-50 rounded-xl">
                  <Text className="text-sm text-purple-800 leading-5">
                    • メンバー情報は幹事のアプリ内でのみ管理されます{'\n'}•
                    他の幹事や第三者に共有されることはありません{'\n'}•
                    Webフォーム回答時も個人情報は適切に保護されます
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="px-6 py-4 bg-white border-t border-neutral-200">
          <Button
            title="メンバーを追加"
            onPress={handleAdd}
            variant="gradient"
            size="lg"
            fullWidth
            disabled={!formData.name.trim()}
            icon={<Ionicons name="person-add" size={20} color="white" />}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};
