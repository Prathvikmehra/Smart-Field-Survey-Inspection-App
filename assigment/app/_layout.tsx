import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// Root Stack Navigator — holds the tabs and any full-screen routes (camera, modal)
export default function RootLayout() {
  return (
    <>
      <Stack>
        {/* Bottom tabs group */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Camera — full-screen, no header (we draw our own) */}
        <Stack.Screen name="camera" options={{ headerShown: false }} />
        {/* Modal screen */}
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
