import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "@/components/AppHeader";
import Colors from "@/constants/Colors";

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

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
    <View style={styles.container}>
      <AppHeader title="Location" subtitle="GPS Coordinates" />
      <View style={styles.body}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Fetching GPS Data...</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.center}>
            <Ionicons name="warning" size={48} color={Colors.danger} />
            <Text style={styles.errorText}>{errorMsg}</Text>
            <Pressable style={styles.btn} onPress={fetchLocation}>
              <Text style={styles.btnText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <Ionicons name="location" size={48} color={Colors.success} style={{ alignSelf: "center", marginBottom: 20 }} />
            
            <View style={styles.row}>
              <Text style={styles.label}>Latitude:</Text>
              <Text style={styles.value}>{location.coords.latitude.toFixed(6)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Longitude:</Text>
              <Text style={styles.value}>{location.coords.longitude.toFixed(6)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Accuracy:</Text>
              <Text style={styles.value}>± {location.coords.accuracy.toFixed(2)}m</Text>
            </View>

            <View style={styles.actionRow}>
              <Pressable style={[styles.btn, styles.actionBtn]} onPress={fetchLocation}>
                <Ionicons name="refresh" size={20} color="white" />
                <Text style={styles.btnText}>Refresh</Text>
              </Pressable>
              
              <Pressable style={[styles.btn, styles.actionBtn, { backgroundColor: Colors.accent }]} onPress={copyLocation}>
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
  container: { flex: 1, backgroundColor: Colors.background },
  body: { flex: 1, padding: 20, justifyContent: "center" },
  center: { alignItems: "center", justifyContent: "center" },
  card: { backgroundColor: Colors.card, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: Colors.border, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  loadingText: { marginTop: 16, fontSize: 16, color: Colors.gray },
  errorText: { marginTop: 16, fontSize: 16, color: Colors.danger, textAlign: "center", marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  label: { fontSize: 16, color: Colors.gray, fontWeight: "600" },
  value: { fontSize: 16, color: Colors.text, fontWeight: "bold" },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 30 },
  btn: { backgroundColor: Colors.primary, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  actionBtn: { flex: 1 },
  btnText: { color: "white", fontSize: 16, fontWeight: "bold" }
});
