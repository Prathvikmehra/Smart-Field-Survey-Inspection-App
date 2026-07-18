import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

// Custom app header shown at the top of the Dashboard
export default function AppHeader() {
  return (
    <View style={styles.container}>
      {/* Left side — app title */}
      <View>
        <Text style={styles.title}>📋 Smart Survey</Text>
        <Text style={styles.subtitle}>Field Survey & Inspection</Text>
      </View>

      {/* Right side — user initials avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>PM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 50,                 // leave room for status bar
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#BFDBFE",               // light blue-white
    fontSize: 13,
    marginTop: 2,
  },

  avatar: {
    backgroundColor: "white",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
});