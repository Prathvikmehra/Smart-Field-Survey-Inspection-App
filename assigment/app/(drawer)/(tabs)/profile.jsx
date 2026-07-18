import { View, Text, StyleSheet } from "react-native";
import AppHeader from "@/components/AppHeader";
import { useTheme } from "@/context/ThemeContext";

export default function Profile() {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="My Profile" subtitle="Student Information" />
      <View style={styles.body}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>PM</Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>Prathvik Mehra</Text>
        <Text style={[styles.detail, { color: colors.gray }]}>Enrollment: 23CS001</Text>
        <Text style={[styles.detail, { color: colors.gray }]}>App: Smart Survey v1.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  avatar: { width: 90, height: 90, borderRadius: 45, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  avatarText: { color: "white", fontSize: 32, fontWeight: "bold" },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  detail: { fontSize: 15, marginBottom: 4 },
});
