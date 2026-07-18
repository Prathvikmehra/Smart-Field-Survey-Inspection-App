
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

// Simple profile screen showing student info
export default function Profile() {
  return (
    <View style={styles.container}>
      {/* Avatar circle */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>PM</Text>
      </View>
      <Text style={styles.name}>Prathvik Mehra</Text>
      <Text style={styles.detail}>Enrollment: 23CS001</Text>
      <Text style={styles.detail}>App: Smart Survey v1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  avatar: {
    backgroundColor: Colors.primary,
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  detail: {
    fontSize: 15,
    color: Colors.gray,
    marginBottom: 4,
  },
});