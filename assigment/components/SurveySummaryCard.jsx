import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

// Priority badge colour map
const priorityColor = {
  High:   Colors.danger,
  Medium: Colors.warning,
  Low:    Colors.success,
};

// Displays a single survey summary with site, client, date, priority badge and status
// Props: survey — { site, client, priority, date, status }
export default function SurveySummaryCard({ survey }) {
  const badgeColor = priorityColor[survey.priority] || Colors.gray;

  return (
    <View style={styles.card}>
      {/* Top row — site name + priority badge */}
      <View style={styles.row}>
        <Text style={styles.site} numberOfLines={1}>{survey.site}</Text>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{survey.priority}</Text>
        </View>
      </View>

      {/* Client and date */}
      <Text style={styles.detail}>👤 {survey.client}</Text>
      <Text style={styles.detail}>📅 {survey.date}</Text>

      {/* Status */}
      <View style={[styles.statusBadge, { backgroundColor: badgeColor + "20" }]}>
        <Text style={[styles.statusText, { color: badgeColor }]}>{survey.status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  site: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },

  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },

  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  detail: {
    color: Colors.gray,
    fontSize: 14,
    marginBottom: 4,
  },

  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});