import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";   // required initialiser for Reanimated

// Root Stack — the drawer group is the main entry point.
// Camera is a full-screen Stack screen (outside the drawer).
export default function RootLayout() {
  return (
    <>
      <Stack>
        {/* Drawer group — contains tabs + all drawer screens */}
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        {/* Camera — full-screen, draws its own header */}
        <Stack.Screen name="camera"   options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
