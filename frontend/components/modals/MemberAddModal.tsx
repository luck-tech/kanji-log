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
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Colors } from '@/constants/Colors';

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
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.neutral[500]} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              メンバー追加
            </Text>
            <View style={styles.spacer} />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* 説明 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.primaryIcon]}>
                    <Ionicons name="person-add" size={20} color={Colors.primary[600]} />
                  </View>
                  <Text style={styles.sectionTitle}>
                    新しいメンバー
                  </Text>
                </View>
                <Text style={styles.description}>
                  飲み会に参加予定のメンバーの情報を入力してください。
                  今後のイベントでも簡単に招待できるようになります。
                </Text>
              </View>
            </Card>

            {/* 基本情報 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.primaryIcon]}>
                    <Ionicons name="person" size={20} color={Colors.primary[600]} />
                  </View>
                  <Text style={styles.sectionTitle}>
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
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.successIcon]}>
                    <Ionicons name="document-text" size={20} color={Colors.success[600]} />
                  </View>
                  <Text style={styles.sectionTitle}>
                    補足情報
                  </Text>
                  <Text style={styles.optionalLabel}>（任意）</Text>
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

                <View style={styles.infoAlert}>
                  <View style={styles.infoContent}>
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color={Colors.warning[500]}
                    />
                    <Text style={styles.infoText}>
                      ここに入力した情報は、Webフォーム作成時の参考情報として活用されます。
                      詳細な好みやアレルギー情報は、実際のWebフォームで収集します。
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* プライバシー情報 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.accentIcon]}>
                    <Ionicons
                      name="shield-checkmark"
                      size={20}
                      color={Colors.accent[600]}
                    />
                  </View>
                  <Text style={styles.sectionTitle}>
                    プライバシー
                  </Text>
                </View>

                <View style={styles.privacyAlert}>
                  <Text style={styles.privacyText}>
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
        <View style={styles.footer}>
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
    color: Colors.neutral[900],
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
  successIcon: {
    backgroundColor: Colors.success[100],
  },
  accentIcon: {
    backgroundColor: Colors.accent[100],
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
  description: {
    color: Colors.neutral[700],
    lineHeight: 24,
  },
  infoAlert: {
    padding: 12,
    backgroundColor: Colors.warning[50],
    borderRadius: 12,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.warning[800],
    lineHeight: 20,
    flex: 1,
  },
  privacyAlert: {
    padding: 12,
    backgroundColor: Colors.accent[50],
    borderRadius: 12,
  },
  privacyText: {
    fontSize: 14,
    color: Colors.accent[800],
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
});
