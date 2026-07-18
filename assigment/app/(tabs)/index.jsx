import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AppHeader from "../../components/AppHeader";
import QuickActionCard from "../../components/QuickActionCard";
import SurveySummaryCard from "../../components/SurveySummaryCard";
import Colors from "../../constants/Colors";

// Sample recent survey data for the dashboard summary
const recentSurveys = [
  {
    id: "1",
    site: "ABC Industries",
    client: "John Smith",
    priority: "High",
    date: "18 Jul 2026",
    status: "Completed",
  },
  {
    id: "2",
    site: "XYZ Factory",
    client: "Sarah Lee",
    priority: "Medium",
    date: "17 Jul 2026",
    status: "In Progress",
  },
  {
    id: "3",
    site: "Metro Plaza",
    client: "Raj Kumar",
    priority: "Low",
    date: "16 Jul 2026",
    status: "Pending",
  },
];

// Returns a greeting based on the current hour
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Dashboard() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Top blue header */}
      <AppHeader />

      <View style={styles.content}>

        {/* Greeting + Student Details */}
        <Text style={styles.greeting}>{getGreeting()} 👋</Text>
        <Text style={styles.name}>Prathvik Mehra</Text>
        <Text style={styles.enrollment}>Enrollment No: 23CS001</Text>

        {/* Today's Survey Count Card */}
        <View style={styles.countCard}>
          <Text style={styles.countLabel}>Today's Surveys</Text>
          <Text style={styles.countNumber}>12</Text>
          <Text style={styles.countSub}>✅ Completed today</Text>
        </View>

        {/* Quick Action Cards */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          <QuickActionCard
            title="New Survey"
            icon="clipboard-outline"
            color={Colors.primary}
            onPress={() => router.push("/(tabs)/survey")}
          />
          <QuickActionCard
            title="Camera"
            icon="camera-outline"
            color={Colors.accent}
            onPress={() => router.push("/camera")}
          />
          <QuickActionCard
            title="Location"
            icon="location-outline"
            color={Colors.success}
            onPress={() => {}}   // Module 4 — Location (coming later)
          />
          <QuickActionCard
            title="History"
            icon="time-outline"
            color={Colors.warning}
            onPress={() => router.push("/(tabs)/history")}
          />
        </View>

        {/* Recent Surveys */}
        <Text style={styles.sectionTitle}>Recent Surveys</Text>
        {recentSurveys.map((survey) => (
          <SurveySummaryCard key={survey.id} survey={survey} />
        ))}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 4,
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 4,
  },

  enrollment: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 2,
    marginBottom: 4,
  },

  // Blue count card
  countCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 22,
    marginTop: 20,
    marginBottom: 4,
  },

  countLabel: {
    color: "#BFDBFE",
    fontSize: 15,
  },

  countNumber: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
    lineHeight: 56,
  },

  countSub: {
    color: "#BFDBFE",
    fontSize: 13,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 24,
    marginBottom: 14,
  },

  // 2-column grid for Quick Action cards
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});