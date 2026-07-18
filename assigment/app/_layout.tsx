import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";   // required initialiser — must stay at top level

// Root Stack: holds the bottom tabs group + full-screen routes
export default function RootLayout() {
  return (
    <>
      <Stack>
        {/* Bottom tabs group */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Camera — full-screen modal, we draw our own header */}
        <Stack.Screen name="camera" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
