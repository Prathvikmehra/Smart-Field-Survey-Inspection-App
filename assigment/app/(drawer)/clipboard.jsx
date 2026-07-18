import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "@/components/AppHeader";
import { useTheme } from "@/context/ThemeContext";

export default function ClipboardScreen() {
  const [clipboardText, setClipboardText] = useState("");
  const [hasCopiedData, setHasCopiedData] = useState(false);
  const { colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      fetchClipboard();
    }, [])
  );

  async function fetchClipboard() {
    const hasText = await Clipboard.hasStringAsync();
    setHasCopiedData(hasText);
    if (hasText) {
      const text = await Clipboard.getStringAsync();
      setClipboardText(text);
    } else {
      setClipboardText("");
    }
  }

  async function copyToClipboard(text) {
    await Clipboard.setStringAsync(text);
    Alert.alert("Success", "Text copied to clipboard!");
    fetchClipboard();
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Clipboard Viewer" subtitle="Current copied data" />
      
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.cardHeader, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
            <Ionicons name="clipboard" size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Current Clipboard</Text>
            <Pressable style={styles.refreshBtn} onPress={fetchClipboard}>
              <Ionicons name="refresh" size={20} color={colors.gray} />
            </Pressable>
          </View>

          {hasCopiedData && clipboardText ? (
            <View style={styles.contentBox}>
              <Text style={[styles.clipboardText, { color: colors.text }]}>{clipboardText}</Text>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={[styles.emptyText, { color: colors.gray }]}>Clipboard is empty</Text>
            </View>
          )}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Copy Tests</Text>
        <Text style={[styles.sectionSub, { color: colors.gray }]}>Tap to copy sample survey data to test the clipboard.</Text>

        <View style={styles.testGrid}>
          <Pressable style={[styles.testBtn, { backgroundColor: colors.primary }]} onPress={() => copyToClipboard("Lat: 18.5204, Lng: 73.8567")}>
            <Ionicons name="location" size={20} color="white" />
            <Text style={styles.testBtnText}>Test Location</Text>
          </Pressable>
          
          <Pressable style={[styles.testBtn, { backgroundColor: colors.accent }]} onPress={() => copyToClipboard("Client: John Smith - 555-0198")}>
            <Ionicons name="person" size={20} color="white" />
            <Text style={styles.testBtnText}>Test Contact</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { padding: 20 },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden", marginBottom: 30, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardHeader: { flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1 },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: "bold", marginLeft: 10 },
  refreshBtn: { padding: 4 },
  contentBox: { padding: 20, minHeight: 120 },
  clipboardText: { fontSize: 16, lineHeight: 24 },
  emptyBox: { padding: 40, alignItems: "center", justifyContent: "center", minHeight: 120 },
  emptyText: { fontSize: 15, fontStyle: "italic" },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  sectionSub: { fontSize: 14, marginBottom: 16, marginTop: 4 },
  testGrid: { flexDirection: "row", gap: 12 },
  testBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  testBtnText: { color: "white", fontWeight: "bold", fontSize: 14 }
});
