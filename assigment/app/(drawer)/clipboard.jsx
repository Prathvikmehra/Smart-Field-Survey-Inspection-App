import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "@/components/AppHeader";
import Colors from "@/constants/Colors";

export default function ClipboardScreen() {
  const [clipboardText, setClipboardText] = useState("");
  const [hasCopiedData, setHasCopiedData] = useState(false);

  // Fetch clipboard contents when screen focuses
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
    <View style={styles.container}>
      <AppHeader title="Clipboard Viewer" subtitle="Current copied data" />
      
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="clipboard" size={24} color={Colors.primary} />
            <Text style={styles.cardTitle}>Current Clipboard</Text>
            <Pressable style={styles.refreshBtn} onPress={fetchClipboard}>
              <Ionicons name="refresh" size={20} color={Colors.gray} />
            </Pressable>
          </View>

          {hasCopiedData && clipboardText ? (
            <View style={styles.contentBox}>
              <Text style={styles.clipboardText}>{clipboardText}</Text>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Clipboard is empty</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Quick Copy Tests</Text>
        <Text style={styles.sectionSub}>Tap to copy sample survey data to test the clipboard.</Text>

        <View style={styles.testGrid}>
          <Pressable style={styles.testBtn} onPress={() => copyToClipboard("Lat: 18.5204, Lng: 73.8567")}>
            <Ionicons name="location" size={20} color="white" />
            <Text style={styles.testBtnText}>Test Location</Text>
          </Pressable>
          
          <Pressable style={[styles.testBtn, { backgroundColor: Colors.accent }]} onPress={() => copyToClipboard("Client: John Smith - 555-0198")}>
            <Ionicons name="person" size={20} color="white" />
            <Text style={styles.testBtnText}>Test Contact</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  body: { padding: 20 },
  card: { 
    backgroundColor: Colors.card, borderRadius: 16, 
    borderWidth: 1, borderColor: Colors.border, 
    overflow: "hidden", marginBottom: 30,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
  },
  cardHeader: { 
    flexDirection: "row", alignItems: "center", 
    padding: 16, borderBottomWidth: 1, 
    borderBottomColor: Colors.border, backgroundColor: Colors.background 
  },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: "bold", color: Colors.text, marginLeft: 10 },
  refreshBtn: { padding: 4 },
  contentBox: { padding: 20, minHeight: 120 },
  clipboardText: { fontSize: 16, color: Colors.text, lineHeight: 24 },
  emptyBox: { padding: 40, alignItems: "center", justifyContent: "center", minHeight: 120 },
  emptyText: { fontSize: 15, color: Colors.gray, fontStyle: "italic" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: Colors.text },
  sectionSub: { fontSize: 14, color: Colors.gray, marginBottom: 16, marginTop: 4 },
  testGrid: { flexDirection: "row", gap: 12 },
  testBtn: { 
    flex: 1, backgroundColor: Colors.primary, 
    paddingVertical: 14, borderRadius: 12, 
    alignItems: "center", justifyContent: "center", 
    flexDirection: "row", gap: 8 
  },
  testBtnText: { color: "white", fontWeight: "bold", fontSize: 14 }
});
