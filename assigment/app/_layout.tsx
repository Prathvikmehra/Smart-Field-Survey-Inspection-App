import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

// Tell Expo Router which group is the entry point
export const unstable_settings = {
  initialRouteName: "(drawer)",
};

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="camera"   options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
