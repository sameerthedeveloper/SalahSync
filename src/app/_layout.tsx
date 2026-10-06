import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="scan/index" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="scan/result" options={{ headerShown: true, title: 'OCR Result' }} />
      </Stack>
    </>
  );
}
