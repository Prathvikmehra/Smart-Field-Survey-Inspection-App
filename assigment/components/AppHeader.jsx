import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import Colors from "@/constants/Colors";

// Custom app header shown at the top of each main screen.
// The hamburger button (☰) opens the drawer from anywhere in the app.
export default function AppHeader({ title = "Smart Survey", subtitle = "Field Survey & Inspection" }) {
  const navigation = useNavigation();

  function openDrawer() {
    // Dispatch bubbles up through tabs → drawer, so this works from any nested screen
    navigation.dispatch(DrawerActions.openDrawer());
  }

  return (
    <View style={styles.container}>
      {/* Left — hamburger menu button */}
      <Pressable style={styles.menuBtn} onPress={openDrawer}>
        <Ionicons name="menu" size={28} color="white" />
      </Pressable>

      {/* Centre — title + subtitle */}
      <View style={styles.titleBox}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Right — user initials avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>PM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: 50,                   // space for status bar
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  menuBtn: {
    padding: 4,
    marginRight: 10,
  },

  titleBox: {
    flex: 1,
  },

  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#BFDBFE",
    fontSize: 12,
    marginTop: 1,
  },

  avatar: {
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  avatarText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 15,
  },
});