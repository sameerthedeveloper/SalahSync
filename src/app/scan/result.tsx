import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

export default function ResultScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();

  return (
    <ScrollView contentContainerClassName="gap-4 p-5" className="bg-surface dark:bg-surface-dark">
      {uri ? <Image source={{ uri }} style={{ width: '100%', aspectRatio: 3 / 4, borderRadius: 16 }} contentFit="contain" /> : null}
      <View className="rounded-2xl border border-gold p-4">
        <Text className="text-base font-semibold text-brand dark:text-white">
          OCR not implemented yet
        </Text>
        <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Native iOS Vision module is the next step. No placeholder text is generated.
        </Text>
      </View>
    </ScrollView>
  );
}
