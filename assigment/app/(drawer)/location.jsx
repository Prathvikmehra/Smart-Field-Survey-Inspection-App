import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "@/components/AppHeader";
import { useTheme } from "@/context/ThemeContext";

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const { colors } = useTheme();

  useEffect(() => {
    fetchLocation();
  }, []);

  async function fetchLocation() {
    setLoading(true);
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    } catch (e) {
      setErrorMsg("Could not fetch location. Ensure GPS is on.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLocation() {
    if (location) {
      const locString = `Lat: ${location.coords.latitude.toFixed(6)}, Lng: ${location.coords.longitude.toFixed(6)}`;
      await Clipboard.setStringAsync(locString);
      Alert.alert("Success", "Location copied to clipboard!");
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Location" subtitle="GPS Coordinates" />
      <View style={styles.body}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.gray }]}>Fetching GPS Data...</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.center}>
            <Ionicons name="warning" size={48} color={colors.danger} />
            <Text style={[styles.errorText, { color: colors.danger }]}>{errorMsg}</Text>
            <Pressable style={[styles.btn, { backgroundColor: colors.primary }]} onPress={fetchLocation}>
              <Text style={styles.btnText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="location" size={48} color={colors.success} style={{ alignSelf: "center", marginBottom: 20 }} />
            
            <View style={[styles.row, { borderBottomColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.gray }]}>Latitude:</Text>
              <Text style={[styles.value, { color: colors.text }]}>{location.coords.latitude.toFixed(6)}</Text>
            </View>
            <View style={[styles.row, { borderBottomColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.gray }]}>Longitude:</Text>
              <Text style={[styles.value, { color: colors.text }]}>{location.coords.longitude.toFixed(6)}</Text>
            </View>
            <View style={[styles.row, { borderBottomColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.gray }]}>Accuracy:</Text>
              <Text style={[styles.value, { color: colors.text }]}>± {location.coords.accuracy.toFixed(2)}m</Text>
            </View>

            <View style={styles.actionRow}>
              <Pressable style={[styles.btn, styles.actionBtn, { backgroundColor: colors.primary }]} onPress={fetchLocation}>
                <Ionicons name="refresh" size={20} color="white" />
                <Text style={styles.btnText}>Refresh</Text>
              </Pressable>
              
              <Pressable style={[styles.btn, styles.actionBtn, { backgroundColor: colors.accent }]} onPress={copyLocation}>
                <Ionicons name="copy" size={20} color="white" />
                <Text style={styles.btnText}>Copy</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, padding: 20, justifyContent: "center" },
  center: { alignItems: "center", justifyContent: "center" },
  card: { borderRadius: 16, padding: 24, borderWidth: 1, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  loadingText: { marginTop: 16, fontSize: 16 },
  errorText: { marginTop: 16, fontSize: 16, textAlign: "center", marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1 },
  label: { fontSize: 16, fontWeight: "600" },
  value: { fontSize: 16, fontWeight: "bold" },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 30 },
  btn: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  actionBtn: { flex: 1 },
  btnText: { color: "white", fontSize: 16, fontWeight: "bold" }
});
