import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

// Placeholder — Module 8 will build this out fully
export default function History() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📋</Text>
      <Text style={styles.title}>Survey History</Text>
      <Text style={styles.sub}>Coming in Module 8</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "bold", color: Colors.text },
  sub: { fontSize: 14, color: Colors.gray, marginTop: 6 },
});