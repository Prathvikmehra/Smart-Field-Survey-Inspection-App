import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

// Tell Expo Router which group is the entry point
export const unstable_settings = {
  initialRouteName: "(drawer)",
};

import { SurveyProvider } from "@/context/SurveyContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { ProfileProvider } from "@/context/ProfileContext";

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? "light" : "dark"} />;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SurveyProvider>
        <ProfileProvider>
          <Stack>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen name="preview" options={{ headerShown: false, presentation: "modal" }} />
          </Stack>
          <ThemedStatusBar />
        </ProfileProvider>
      </SurveyProvider>
    </ThemeProvider>
  );
}
