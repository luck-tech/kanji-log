import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'ページが見つかりません' }} />
      <View className="flex-1 items-center justify-center p-6 bg-gray-50">
        <Text className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          ページが見つかりませんでした
        </Text>
        <Text className="text-sm text-gray-600 text-center mb-8 leading-5">
          お探しのページは存在しないか、移動された可能性があります。
        </Text>
        <Link href="/" className="py-4 px-6 bg-blue-600 rounded-md">
          <Text className="text-base font-semibold text-white">ホームに戻る</Text>
        </Link>
      </View>
    </>
  );
}
