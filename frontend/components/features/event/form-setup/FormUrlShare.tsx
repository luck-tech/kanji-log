import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../../../common/ui';
import { BaseComponentProps } from '../../../../types/common/ui';
import { Colors } from '../../../../utils/constants/design/colors';

interface FormUrlShareProps extends BaseComponentProps {
  formUrl: string;
  onCopyToClipboard: () => void;
  onShareForm: () => void;
}

/**
 * 生成されたURLの表示・共有 - URLの表示とコピー・共有機能を組み合わせた複合コンポーネント
 */
export const FormUrlShare: React.FC<FormUrlShareProps> = ({
  formUrl,
  onCopyToClipboard,
  onShareForm,
  style,
  testID,
}) => {
  return (
    <Card variant="elevated" shadow="none" style={style} testID={testID}>
      <View style={styles.cardContent}>
        <View style={styles.sectionHeader}>
          <View style={styles.successIconContainer}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={Colors.success[500]}
            />
          </View>
          <Text style={styles.sectionTitle}>フォーム生成完了！</Text>
        </View>

        <View style={styles.urlContainer}>
          <Text style={styles.urlLabel}>生成されたURL:</Text>
          <Text style={styles.urlText}>{formUrl}</Text>
        </View>

        <View style={styles.buttonRow}>
          <Button
            title="URLをコピー"
            onPress={onCopyToClipboard}
            variant="outline"
            size="md"
            style={styles.halfButton}
            icon={
              <Ionicons
                name="copy-outline"
                size={18}
                color={Colors.primary[600]}
              />
            }
          />
          <Button
            title="共有する"
            onPress={onShareForm}
            variant="primary"
            size="md"
            style={styles.halfButton}
            icon={<Ionicons name="share-outline" size={18} color="white" />}
          />
        </View>

        <Text style={styles.urlDescription}>
          このURLをLINEやSlackで新規参加者に共有してください
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  successIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: Colors.success[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  urlContainer: {
    padding: 16,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
  },
  urlLabel: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 8,
  },
  urlText: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: Colors.neutral[900],
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfButton: {
    flex: 1,
  },
  urlDescription: {
    fontSize: 14,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: 20,
  },
});
