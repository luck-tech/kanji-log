import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import {
  MemberEditModal,
  MemberEditData,
} from '@/components/modals/MemberEditModal';

interface MemberDetail {
  id: string;
  name: string;
  department?: string;
  notes?: string;
  preferences?: {
    allergies?: string[];
    favoriteGenres?: string[];
    budgetRange?: { min: number; max: number };
    alcoholPreference?: 'yes' | 'no' | 'sometimes';
    dietaryRestrictions?: string[];
  };
}

// Mock data
const mockMemberDetail: MemberDetail = {
  id: '1',
  name: '田中太郎',
  department: '営業部',
  notes: '辛い物が苦手、静かな店舗を希望',
  preferences: {
    allergies: ['魚介類', '甲殻類'],
    favoriteGenres: ['和食', 'イタリアン'],
    budgetRange: { min: 3000, max: 5000 },
    alcoholPreference: 'no',
    dietaryRestrictions: ['ベジタリアン対応希望'],
  },
};

export default function MemberDetailScreen() {
  const router = useRouter();
  const [member] = useState<MemberDetail>(mockMemberDetail);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleEditMember = () => {
    setIsEditModalVisible(true);
  };

  const handleSaveMember = (memberData: MemberEditData) => {
    console.log('Member saved:', memberData);
    // TODO: API call to update member
  };

  const convertToEditData = (member: MemberDetail): MemberEditData => {
    return {
      name: member.name,
      department: member.department || '',
      notes: member.notes || '',
      preferences: {
        allergies: member.preferences?.allergies || [],
        favoriteGenres: member.preferences?.favoriteGenres || [],
        budgetRange: member.preferences?.budgetRange || {
          min: 3000,
          max: 5000,
        },
        alcoholPreference: member.preferences?.alcoholPreference || 'yes',
        dietaryRestrictions: member.preferences?.dietaryRestrictions || [],
      },
    };
  };

  const handleDeleteMember = () => {
    Alert.alert(
      'メンバー削除',
      `${member.name}さんをメンバーリストから削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            console.log('Member deleted');
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <SafeAreaView className="flex-1">
        <Header
          title={member.name}
          subtitle={member.department || 'メンバー詳細'}
          variant="gradient"
          leftIcon="arrow-back"
          onLeftPress={handleBackPress}
          rightIcon="create-outline"
          onRightPress={handleEditMember}
        />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6 gap-6">
            {/* プロフィール概要 */}
            <Card variant="elevated" shadow="large" animated={true}>
              <View className="gap-4">
                <View className="flex-row items-center gap-4">
                  <View className="w-16 h-16 rounded-2xl bg-blue-100 justify-center items-center">
                    <Text className="text-2xl font-bold text-blue-700">
                      {member.name.charAt(0)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-neutral-900 mb-1">
                      {member.name}
                    </Text>
                    <Text className="text-neutral-600 text-base">
                      {member.department || '部署未設定'}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* 好み・制限事項 */}
            {member.preferences && (
              <Card variant="elevated" shadow="soft">
                <View className="gap-4">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-2xl bg-orange-100 justify-center items-center">
                      <Ionicons name="restaurant" size={20} color="#f59e0b" />
                    </View>
                    <Text className="text-lg font-semibold text-neutral-900">
                      食事の好み・制限
                    </Text>
                  </View>

                  <View className="gap-4">
                    {/* アルコール */}
                    <View>
                      <Text className="text-sm font-medium text-neutral-700 mb-2">
                        アルコール
                      </Text>
                      <View
                        className={`px-3 py-2 rounded-xl ${
                          member.preferences.alcoholPreference === 'yes'
                            ? 'bg-success-100'
                            : member.preferences.alcoholPreference === 'no'
                            ? 'bg-error-100'
                            : 'bg-warning-100'
                        }`}
                      >
                        <Text
                          className={`font-medium ${
                            member.preferences.alcoholPreference === 'yes'
                              ? 'text-success-700'
                              : member.preferences.alcoholPreference === 'no'
                              ? 'text-error-700'
                              : 'text-warning-700'
                          }`}
                        >
                          {member.preferences.alcoholPreference === 'yes'
                            ? '飲める'
                            : member.preferences.alcoholPreference === 'no'
                            ? '飲めない'
                            : 'たまに飲む'}
                        </Text>
                      </View>
                    </View>

                    {/* アレルギー */}
                    {member.preferences.allergies &&
                      member.preferences.allergies.length > 0 && (
                        <View>
                          <Text className="text-sm font-medium text-neutral-700 mb-2">
                            アレルギー
                          </Text>
                          <View className="flex-row flex-wrap gap-2">
                            {member.preferences.allergies.map(
                              (allergy, index) => (
                                <View
                                  key={index}
                                  className="px-3 py-1 bg-error-100 rounded-full"
                                >
                                  <Text className="text-error-700 font-medium text-sm">
                                    {allergy}
                                  </Text>
                                </View>
                              )
                            )}
                          </View>
                        </View>
                      )}

                    {/* 好きなジャンル */}
                    {member.preferences.favoriteGenres &&
                      member.preferences.favoriteGenres.length > 0 && (
                        <View>
                          <Text className="text-sm font-medium text-neutral-700 mb-2">
                            好きな料理ジャンル
                          </Text>
                          <View className="flex-row flex-wrap gap-2">
                            {member.preferences.favoriteGenres.map(
                              (genre, index) => (
                                <View
                                  key={index}
                                  className="px-3 py-1 bg-blue-100 rounded-full"
                                >
                                  <Text className="text-blue-700 font-medium text-sm">
                                    {genre}
                                  </Text>
                                </View>
                              )
                            )}
                          </View>
                        </View>
                      )}

                    {/* 予算帯 */}
                    {member.preferences.budgetRange && (
                      <View>
                        <Text className="text-sm font-medium text-neutral-700 mb-2">
                          希望予算帯
                        </Text>
                        <View className="px-3 py-2 bg-green-100 rounded-xl">
                          <Text className="text-green-700 font-medium">
                            ¥
                            {member.preferences.budgetRange.min.toLocaleString()}{' '}
                            - ¥
                            {member.preferences.budgetRange.max.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </Card>
            )}

            {/* メモ */}
            {member.notes && (
              <Card variant="elevated" shadow="soft">
                <View className="gap-4">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-2xl bg-purple-100 justify-center items-center">
                      <Ionicons
                        name="document-text"
                        size={20}
                        color="#7c3aed"
                      />
                    </View>
                    <Text className="text-lg font-semibold text-neutral-900">
                      メモ
                    </Text>
                  </View>

                  <View className="p-4 bg-purple-50 rounded-xl">
                    <Text className="text-purple-800 leading-6">
                      {member.notes}
                    </Text>
                  </View>
                </View>
              </Card>
            )}

            {/* アクション */}
            <Card variant="elevated" shadow="soft">
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-amber-100 justify-center items-center">
                    <Ionicons name="settings" size={20} color="#f59e0b" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    アクション
                  </Text>
                </View>

                <View className="gap-3">
                  <Button
                    title="プロフィールを編集"
                    onPress={handleEditMember}
                    variant="primary"
                    size="md"
                    fullWidth
                    icon={
                      <Ionicons name="create-outline" size={18} color="white" />
                    }
                  />

                  <Button
                    title="メンバーを削除"
                    onPress={handleDeleteMember}
                    variant="outline"
                    size="md"
                    fullWidth
                    className="border-error-500"
                    icon={
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#ef4444"
                      />
                    }
                  />
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>

        <MemberEditModal
          isVisible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          onSave={handleSaveMember}
          initialData={convertToEditData(member)}
        />
      </SafeAreaView>
    </View>
  );
}
