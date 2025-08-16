import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'ページが見つかりません' }} />
      <View style={styles.container}>
        <Text style={styles.title}>ページが見つかりませんでした</Text>
        <Text style={styles.description}>
          お探しのページは存在しないか、移動された可能性があります。
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>ホームに戻る</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.padding.lg,
    backgroundColor: Colors.gray[50],
  },
  title: {
    ...Typography.h2,
    color: Colors.gray[900],
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  description: {
    ...Typography.body2,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
    lineHeight: 20,
  },
  link: {
    paddingVertical: Layout.padding.md,
    paddingHorizontal: Layout.padding.lg,
    backgroundColor: Colors.primary[600],
    borderRadius: Layout.borderRadius.md,
  },
  linkText: {
    ...Typography.button,
    color: Colors.white,
  },
});
