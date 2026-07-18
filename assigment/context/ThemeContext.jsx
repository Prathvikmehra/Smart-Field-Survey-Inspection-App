import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

// Fallback in-memory storage if AsyncStorage native module isn't available
const memoryStorage = new Map();

const safeAsyncStorage = {
  async getItem(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.warn("AsyncStorage unavailable, using memory fallback:", e);
      return memoryStorage.get(key) || null;
    }
  },
  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.warn("AsyncStorage unavailable, using memory fallback:", e);
      memoryStorage.set(key, value);
    }
  }
};

const lightColors = {
  primary: "#2563EB",
  secondary: "#38BDF8",
  background: "#F1F5F9",
  card: "#FFFFFF",
  text: "#1E293B",
  gray: "#64748B",
  border: "#E2E8F0",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  accent: "#7C3AED",
};

const darkColors = {
  primary: "#60A5FA",
  secondary: "#7DD3FC",
  background: "#0F172A",
  card: "#1E293B",
  text: "#F8FAFC",
  gray: "#94A3B8",
  border: "#334155",
  success: "#4ADE80",
  warning: "#FBBF24",
  danger: "#F87171",
  accent: "#A78BFA",
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(systemColorScheme || "light");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await safeAsyncStorage.getItem("theme");
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (e) {
        console.error("Failed to load theme:", e);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try {
      await safeAsyncStorage.setItem("theme", newTheme);
    } catch (e) {
      console.error("Failed to save theme:", e);
    }
  };

  const colors = theme === "light" ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
