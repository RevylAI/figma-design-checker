import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="choose-topic" />
        <Stack.Screen name="reminders" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="course-details" />
        <Stack.Screen name="welcome-sleep" />
        <Stack.Screen name="sleep-music" />
        <Stack.Screen name="player" />
        <Stack.Screen name="sleep-player" />
      </Stack>
    </>
  );
}
