import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-surface-dark">
      <ScrollView contentContainerClassName="gap-6 p-5">
        <View>
          <Text className="text-3xl font-bold text-brand dark:text-white">SalahSync</Text>
          <Text className="text-base text-neutral-500 dark:text-neutral-400">
            Scan once. Pray on time.
          </Text>
        </View>

        <View className="rounded-3xl bg-brand p-6">
          <Text className="text-sm uppercase tracking-widest text-gold">Next prayer</Text>
          <Text className="mt-2 text-lg text-white/80">No timetable yet</Text>
          <Text className="mt-1 text-base text-white/70">
            Scan your mosque timetable to see prayer times here.
          </Text>
        </View>

        <Link href="/scan" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Scan timetable"
            className="min-h-14 items-center justify-center rounded-2xl bg-gold px-6 py-4 active:opacity-80">
            <Text className="text-lg font-semibold text-emerald-950">Scan Timetable</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}
