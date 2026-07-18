import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

// Reusable quick-action card — shows an icon, colour accent and title
// Props: title (string), icon (Ionicons name), color (hex), onPress (function)
export default function QuickActionCard({ title, icon, color, onPress }) {
  const { colors } = useTheme();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
        { backgroundColor: colors.card },
      ]}
      onPress={onPress}
    >
      {/* Coloured icon background circle */}
      <View style={[styles.iconBox, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 14,
    // shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    // shadow for Android
    elevation: 3,
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});