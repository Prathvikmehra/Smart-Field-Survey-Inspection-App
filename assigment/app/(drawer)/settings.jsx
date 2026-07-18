import { View, Text, StyleSheet, Pressable, Alert, ScrollView, Switch, Linking } from "react-native";
import AppHeader from "@/components/AppHeader";
import { useTheme } from "@/context/ThemeContext";
import { useSurveys } from "@/context/SurveyContext";
import { useProfile } from "@/context/ProfileContext";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const { colors, toggleTheme, isDark } = useTheme();
  const { surveys, setSurveys } = useSurveys();
  const { profile } = useProfile();

  function handleClearAllSurveys() {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete ALL surveys? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete All", 
          style: "destructive", 
          onPress: () => {
            setSurveys([]);
            Alert.alert("Success", "All surveys have been deleted!");
          } 
        }
      ]
    );
  }

  function SettingsItem({ icon, label, onPress, value, switchValue, onSwitchChange, destructive = false, iconColor }) {
    return (
      <Pressable 
        style={[styles.item, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
        onPress={onPress}
        disabled={onSwitchChange != null}
      >
        <View style={styles.itemLeft}>
          <View style={[
            styles.iconBox, 
            { 
              backgroundColor: destructive ? `${colors.danger}15` : `${iconColor || colors.primary}15` 
            }
          ]}>
            <Ionicons 
              name={icon} 
              size={18} 
              color={destructive ? colors.danger : (iconColor || colors.primary)} 
            />
          </View>
          <Text style={[styles.itemLabel, { color: destructive ? colors.danger : colors.text }]}>{label}</Text>
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
        ) : onPress ? (
          <Ionicons name="chevron-forward" size={18} color={colors.gray} />
        ) : null}
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
      
      {/* Profile Summary Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.gray }]}>Your Profile</Text>
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>{profile.name}</Text>
            <Text style={[styles.profileEnrollment, { color: colors.gray }]}>{profile.enrollment}</Text>
          </View>
          <Ionicons name="person-circle" size={40} color={colors.primary} />
        </View>
      </View>

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
        <Text style={[styles.sectionTitle, { color: colors.gray }]}>Data Management</Text>
        <SettingsItem 
          icon="document-text-outline" 
          label="Total Surveys"
          value={`${surveys.length} saved`}
        />
        <SettingsItem 
          icon="trash-outline" 
          label="Clear All Surveys"
          onPress={handleClearAllSurveys}
          destructive={true}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.gray }]}>Support & About</Text>
        <SettingsItem 
          icon="help-circle-outline" 
          label="Help & FAQ"
          onPress={() => Alert.alert("Coming Soon", "Help & FAQ section will be available soon!")}
          iconColor={colors.accent}
        />
        <SettingsItem 
          icon="mail-outline" 
          label="Contact Support"
          onPress={() => Linking.openURL("mailto:support@smartsurvey.com")}
          iconColor={colors.success}
        />
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
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginBottom: 2 
  },
  profileEnrollment: { 
    fontSize: 13, 
  },
  item: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: 14, 
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: { fontSize: 14, fontWeight: "500" },
  itemValue: { fontSize: 13, fontWeight: "500" }
});
