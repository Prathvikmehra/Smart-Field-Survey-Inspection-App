import { View, Text, StyleSheet, Pressable, Alert, ScrollView, Switch } from "react-native";
import AppHeader from "@/components/AppHeader";
import { useTheme } from "@/context/ThemeContext";
import { useSurveys } from "@/context/SurveyContext";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const { colors, theme, toggleTheme, isDark } = useTheme();
  const { surveys, setSurveys } = useSurveys();

  function handleClearAllSurveys() {
    Alert.alert(
      "Confirm Clear All",
      "Are you sure you want to delete all surveys? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete All", 
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
            <Ionicons name={icon} size={20} color={colors.primary} />
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
          <Ionicons name="chevron-forward" size={20} color={colors.gray} />
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
          icon={isDark ? "moon" : "sunny"} 
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
        <SettingsItem 
          icon="code-slash-outline" 
          label="Smart Field Survey App"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { 
    fontSize: 13, 
    fontWeight: "700", 
    marginBottom: 8, 
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  item: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: 16, 
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: { fontSize: 15, fontWeight: "500" },
  itemValue: { fontSize: 14, fontWeight: "500" }
});
