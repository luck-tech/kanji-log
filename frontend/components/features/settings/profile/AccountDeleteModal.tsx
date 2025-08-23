import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Button, Input } from '@/components/common';
import { Colors } from '@/constants';

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
  const insets = useSafeAreaInsets();
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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.neutral[500]} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>アカウント削除</Text>
            <View style={styles.spacer} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* 警告メッセージ */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.warningHeader}>
                  <View style={styles.warningIcon}>
                    <Ionicons
                      name="warning"
                      size={24}
                      color={Colors.error[500]}
                    />
                  </View>
                  <View style={styles.warningTextContainer}>
                    <Text style={styles.warningTitle}>
                      注意：この操作は取り消せません
                    </Text>
                    <Text style={styles.warningSubtitle}>
                      アカウントを削除すると、個人データが削除されます
                    </Text>
                  </View>
                </View>

                <View style={styles.errorAlert}>
                  <Text style={styles.errorAlertText}>
                    ⚠️ アカウント削除により失われるデータは復元できません。
                    削除前に重要な情報をバックアップしてください。
                  </Text>
                </View>
              </View>
            </Card>

            {/* アカウント情報 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.primaryIcon]}>
                    <Ionicons
                      name="person"
                      size={20}
                      color={Colors.primary[600]}
                    />
                  </View>
                  <Text style={styles.sectionTitle}>削除対象のアカウント</Text>
                </View>

                <View style={styles.blueAlert}>
                  <Text style={styles.blueAlertTitle}>
                    アカウント削除の確認
                  </Text>
                  <Text style={styles.blueAlertText}>
                    個人データとアカウント情報が削除されます（共有記録は保持されます）
                  </Text>
                </View>
              </View>
            </Card>

            {/* 削除されるデータの詳細 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.accentIcon]}>
                    <Ionicons
                      name="trash"
                      size={20}
                      color={Colors.accent[600]}
                    />
                  </View>
                  <Text style={styles.sectionTitle}>削除されるデータ</Text>
                </View>

                <Text style={styles.description}>
                  以下のデータがサーバーから完全に削除され、復元することはできません：
                </Text>

                <View style={styles.dataItemsList}>
                  {dataItems.map((item, index) => (
                    <View key={index} style={styles.dataItem}>
                      <View style={styles.dataItemIcon}>
                        <Ionicons
                          name={item.icon as any}
                          size={16}
                          color={Colors.neutral[500]}
                        />
                      </View>
                      <View style={styles.dataItemContent}>
                        <Text style={styles.dataItemLabel}>{item.label}</Text>
                        <Text style={styles.dataItemDescription}>
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </Card>

            {/* データ保護に関する説明 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.successIcon]}>
                    <Ionicons
                      name="shield-checkmark"
                      size={20}
                      color={Colors.success[600]}
                    />
                  </View>
                  <Text style={styles.sectionTitle}>
                    プライバシーとデータ保護
                  </Text>
                </View>

                <View style={styles.protectionList}>
                  <View style={styles.greenAlert}>
                    <Text style={styles.greenAlertTitle}>✅ 確実な削除</Text>
                    <Text style={styles.greenAlertText}>
                      アカウント削除処理により、お客様のデータはサーバーから完全に削除されます。
                      バックアップサーバーからも30日以内に削除されます。
                    </Text>
                  </View>

                  <View style={styles.amberAlert}>
                    <Text style={styles.amberAlertTitle}>
                      ⚠️ 他の幹事への影響
                    </Text>
                    <Text style={styles.amberAlertText}>
                      あなたが共有した記録は匿名化されて残ります。
                      他の幹事のナレッジ共有に影響を与えないためです。
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* 削除の確認 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.errorIcon]}>
                    <Ionicons name="key" size={20} color={Colors.error[500]} />
                  </View>
                  <Text style={styles.sectionTitle}>削除の確認</Text>
                </View>

                <Text style={styles.description}>
                  アカウント削除を実行するには、下のテキストボックスに
                  <Text style={styles.confirmTextHighlight}>
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
                  <View style={styles.successAlert}>
                    <View style={styles.successHeader}>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={Colors.success[600]}
                      />
                      <Text style={styles.successText}>
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
        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
          <View style={styles.footerButtons}>
            <Button
              title="アカウントを削除"
              onPress={handleDelete}
              variant="primary"
              size="lg"
              fullWidth
              disabled={!isConfirmed}
              icon={<Ionicons name="trash" size={20} color="white" />}
            />
            <Button
              title="キャンセル"
              onPress={handleClose}
              variant="outline"
              size="lg"
              fullWidth
            />
          </View>
        </View>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
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
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.error[600],
  },
  spacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  cardContent: {
    gap: 16,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  warningIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.error[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.error[600],
    marginBottom: 4,
  },
  warningSubtitle: {
    color: Colors.error[700],
  },
  errorAlert: {
    padding: 16,
    backgroundColor: Colors.error[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error[200],
  },
  errorAlertText: {
    color: Colors.error[800],
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryIcon: {
    backgroundColor: Colors.primary[100],
  },
  accentIcon: {
    backgroundColor: Colors.accent[100],
  },
  successIcon: {
    backgroundColor: Colors.success[100],
  },
  errorIcon: {
    backgroundColor: Colors.error[100],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  blueAlert: {
    padding: 16,
    backgroundColor: Colors.primary[50],
    borderRadius: 12,
  },
  blueAlertTitle: {
    color: Colors.primary[900],
    fontWeight: '700',
    fontSize: 18,
  },
  blueAlertText: {
    color: Colors.primary[700],
    fontSize: 14,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.neutral[600],
    lineHeight: 20,
  },
  dataItemsList: {
    gap: 12,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
  },
  dataItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  dataItemContent: {
    flex: 1,
  },
  dataItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  dataItemDescription: {
    fontSize: 14,
    color: Colors.neutral[600],
    lineHeight: 20,
  },
  protectionList: {
    gap: 12,
  },
  greenAlert: {
    padding: 12,
    backgroundColor: Colors.success[50],
    borderRadius: 12,
  },
  greenAlertTitle: {
    color: Colors.success[800],
    fontWeight: '500',
    marginBottom: 8,
  },
  greenAlertText: {
    color: Colors.success[700],
    fontSize: 14,
    lineHeight: 20,
  },
  amberAlert: {
    padding: 12,
    backgroundColor: Colors.warning[50],
    borderRadius: 12,
  },
  amberAlertTitle: {
    color: Colors.warning[800],
    fontWeight: '500',
    marginBottom: 8,
  },
  amberAlertText: {
    color: Colors.warning[700],
    fontSize: 14,
    lineHeight: 20,
  },
  confirmTextHighlight: {
    fontWeight: '700',
    color: Colors.error[600],
  },
  successAlert: {
    padding: 12,
    backgroundColor: Colors.success[50],
    borderRadius: 12,
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  successText: {
    color: Colors.success[700],
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  footerButtons: {
    gap: 12,
    // flexDirection: 'row' を削除して縦並びにする
  },
  buttonContainer: {
    // flex: 1 を削除（不要になったため）
  },
});
