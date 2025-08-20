import { Link, Stack } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'ページが見つかりません' }} />
      <View style={styles.container}>
        <Text style={styles.title}>ページが見つかりませんでした</Text>
        <Text style={styles.description}>
          お探しのページは存在しないか、移動された可能性があります。
        </Text>
        <Link href="/" style={styles.linkButton}>
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
    padding: 24,
    backgroundColor: Colors.gray[50],
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  linkButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary[600],
    borderRadius: 6,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
