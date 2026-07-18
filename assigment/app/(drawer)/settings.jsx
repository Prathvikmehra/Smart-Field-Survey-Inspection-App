import { View, Text, StyleSheet, Pressable, Alert, ScrollView, Switch } from "react-native";
import AppHeader from "@/components/AppHeader";
import { useTheme } from "@/context/ThemeContext";
import { useSurveys } from "@/context/SurveyContext";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const { colors, toggleTheme, isDark } = useTheme();
  const { surveys, setSurveys } = useSurveys();

  function handleClearAllSurveys() {
    Alert.alert(
      "Confirm",
      "Delete all surveys? This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => setSurveys([]) 
        }
      ]
    );
  }

  function SettingsItem({ icon, label, onPress, value, switchValue, onSwitchChange }) {
    return (
      <Pressable 
        style={[styles.item, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
        onPress={onPress}
        disabled={onSwitchChange != null}
      >
        <View style={styles.itemLeft}>
          <View style={[styles.iconBox, { backgroundColor: colors.primary + "15" }]}>
            <Ionicons name={icon} size={18} color={colors.primary} />
          </View>
          <Text style={[styles.itemLabel, { color: colors.text }]}>{label}</Text>
        </View>
        {value ? (
          <Text style={[styles.itemValue, { color: colors.gray }]}>{value}</Text>
        ) : null}
        {onSwitchChange != null ? (
          <Switch 
            value={switchValue} 
            onValueChange={onSwitchChange}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={"white"}
          />
        ) : (
          <Ionicons name="chevron-forward" size={18} color={colors.gray} />
        )}
      </Pressable>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <AppHeader title="Settings" subtitle="Customize your experience" />
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.gray }]}>Appearance</Text>
        <SettingsItem 
          icon={isDark ? "sunny" : "moon"} 
          label="Dark Mode" 
          switchValue={isDark}
          onSwitchChange={toggleTheme}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.gray }]}>Data</Text>
        <SettingsItem 
          icon="trash-outline" 
          label="Clear All Surveys"
          onPress={handleClearAllSurveys}
          value={`${surveys.length} survey${surveys.length === 1 ? "" : "s"}`}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.gray }]}>About</Text>
        <SettingsItem 
          icon="information-circle-outline" 
          label="Version"
          value="1.0.0"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: "600", 
    marginBottom: 6, 
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4
  },
  item: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: 14, 
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: { fontSize: 14, fontWeight: "500" },
  itemValue: { fontSize: 13, fontWeight: "500" }
});
