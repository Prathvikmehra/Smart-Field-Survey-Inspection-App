import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";

export default function SurveySummaryCard({ survey }) {
  const router = useRouter();
  const { colors } = useTheme();
  const priorityMap = {
    High: colors.danger,
    Medium: colors.warning,
    Low: colors.success,
  };
  const badgeColor = priorityMap[survey.priority] || colors.gray;

  return (
    <Pressable 
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => router.push(`/preview?id=${survey.id}`)}
    >
      <View style={styles.row}>
        <Text style={[styles.site, { color: colors.text }]} numberOfLines={1}>
          {survey.site}
        </Text>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{survey.priority}</Text>
        </View>
      </View>

      <Text style={[styles.detail, { color: colors.gray }]}>{survey.client}</Text>
      <Text style={[styles.detail, { color: colors.gray }]}>{survey.date}</Text>

      <View style={[styles.statusBadge, { backgroundColor: badgeColor + "15" }]}>
        <Text style={[styles.statusText, { color: badgeColor }]}>{survey.status}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  site: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },

  badge: {
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },

  detail: {
    fontSize: 13,
    marginBottom: 4,
  },

  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 6,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
});