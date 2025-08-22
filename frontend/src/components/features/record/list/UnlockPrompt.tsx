import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Button } from '../../../common/ui';
import { BenefitsCard } from './BenefitsCard';
import { BaseComponentProps } from '../../../../types/common/ui';
import { Colors } from '@/constants';

interface UnlockPromptProps extends BaseComponentProps {
  onUnlock: () => void;
}

/**
 * アンロック促進プロンプト - 記録共有促進画面
 */
export const UnlockPrompt: React.FC<UnlockPromptProps> = ({
  onUnlock,
  style,
  testID,
}) => {
  return (
    <ScrollView
      style={[styles.scrollView, style]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      testID={testID}
    >
      <View style={styles.center}>
        <LinearGradient
          colors={[Colors.warning[500], Colors.warning[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.lockIcon}
        >
          <Ionicons name="lock-closed" size={48} color="white" />
        </LinearGradient>

        <Text style={styles.title}>記録を共有して、</Text>
        <Text style={styles.title}>他の幹事のナレッジを閲覧しよう</Text>

        <Text style={styles.description}>
          あなたの終了済みイベントの記録を1つ以上共有すると、他の幹事が投稿した貴重な情報にアクセスできます。
        </Text>

        <BenefitsCard />

        <Button
          title="記録を共有する"
          onPress={onUnlock}
          size="lg"
          variant="gradient"
          fullWidth
          icon={
            <Ionicons name="share-social-outline" size={20} color="white" />
          }
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  lockIcon: {
    width: 96,
    height: 96,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[900],
    textAlign: 'center',
    lineHeight: 30,
  },
  description: {
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
});
