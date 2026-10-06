import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center gap-4 bg-surface p-6 dark:bg-surface-dark">
        <Text className="text-center text-xl font-semibold text-brand dark:text-white">
          Camera access needed
        </Text>
        <Text className="text-center text-base text-neutral-500 dark:text-neutral-400">
          SalahSync uses the camera only to photograph your mosque&apos;s prayer timetable. Images stay
          on your device.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={requestPermission}
          className="min-h-12 items-center justify-center rounded-2xl bg-brand px-6 active:opacity-80">
          <Text className="text-base font-semibold text-white">Allow camera</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.back()} className="min-h-12 justify-center">
          <Text className="text-base text-neutral-500">Cancel</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const capture = async () => {
    if (busy || !cameraRef.current) return;
    setBusy(true);
    setError(null);
    try {
      // exif: true keeps GPS metadata for later mosque matching (PRD §13).
      const photo = await cameraRef.current.takePictureAsync({ exif: true, quality: 1 });
      router.push({ pathname: '/scan/result', params: { uri: photo.uri } });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not capture photo. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
      <SafeAreaView className="absolute inset-x-0 bottom-0 items-center gap-3 pb-4" edges={['bottom']}>
        {error ? <Text className="text-white">{error}</Text> : null}
        <View className="w-full flex-row items-center justify-between px-8">
          <Pressable accessibilityRole="button" onPress={() => router.back()} className="min-h-12 justify-center">
            <Text className="text-base text-white">Cancel</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Capture timetable"
            onPress={capture}
            disabled={busy}
            className="size-20 items-center justify-center rounded-full border-4 border-white">
            {busy ? <ActivityIndicator color="white" /> : <View className="size-14 rounded-full bg-white" />}
          </Pressable>
          <View className="w-14" />
        </View>
      </SafeAreaView>
    </View>
  );
}
