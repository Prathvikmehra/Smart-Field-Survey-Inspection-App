import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AppHeader from "@/components/AppHeader";
import QuickActionCard from "@/components/QuickActionCard";
import SurveySummaryCard from "@/components/SurveySummaryCard";
import { useTheme } from "@/context/ThemeContext";
import { useSurveys } from "@/context/SurveyContext";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Dashboard() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { surveys, loading } = useSurveys();

  const recentSurveys = surveys.slice(0, 3);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <AppHeader />

      <View style={styles.content}>
        <Text style={[styles.greeting, { color: colors.text }]}>{getGreeting()}</Text>
        <Text style={[styles.name, { color: colors.text }]}>Prathvik Mehra</Text>
        <Text style={[styles.enrollment, { color: colors.gray }]}>Enrollment No: 23CS001</Text>

        <View style={[styles.countCard, { backgroundColor: colors.primary }]}>
          <Text style={[styles.countLabel, { color: isDark ? "#C7D2FE" : "#BFDBFE" }]}>
            Total Surveys
          </Text>
          <Text style={styles.countNumber}>{surveys.length}</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.grid}>
          <QuickActionCard
            title="New Survey"
            icon="clipboard-outline"
            color={colors.primary}
            onPress={() => router.push("/(drawer)/(tabs)/survey")}
          />
          <QuickActionCard
            title="Camera"
            icon="camera-outline"
            color={colors.accent}
            onPress={() => router.push("/camera")}
          />
          <QuickActionCard
            title="Location"
            icon="location-outline"
            color={colors.success}
            onPress={() => router.push("/(drawer)/location")}
          />
          <QuickActionCard
            title="History"
            icon="time-outline"
            color={colors.warning}
            onPress={() => router.push("/(drawer)/(tabs)/history")}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Surveys</Text>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : recentSurveys.length > 0 ? (
          recentSurveys.map((survey) => <SurveySummaryCard key={survey.id} survey={survey} />)
        ) : (
          <Text style={[styles.noData, { color: colors.gray }]}>No surveys yet</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 2,
  },
  enrollment: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 4,
  },
  countCard: {
    borderRadius: 14,
    padding: 18,
    marginTop: 16,
    marginBottom: 4,
  },
  countLabel: {
    fontSize: 14,
  },
  countNumber: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    lineHeight: 44,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  noData: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 10,
  },
});
