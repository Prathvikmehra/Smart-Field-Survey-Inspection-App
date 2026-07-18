import { View, Text, StyleSheet } from "react-native";
import AppHeader from "@/components/AppHeader";
import Colors from "@/constants/Colors";

export default function Settings() {
  return (
    <View style={styles.container}>
      <AppHeader title="Settings" subtitle="App configuration" />
      <View style={styles.body}>
        <Text style={styles.emoji}>⚙️</Text>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.sub}>Coming soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  body: { flex: 1, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "bold", color: Colors.text },
  sub: { fontSize: 14, color: Colors.gray, marginTop: 6 },
});
