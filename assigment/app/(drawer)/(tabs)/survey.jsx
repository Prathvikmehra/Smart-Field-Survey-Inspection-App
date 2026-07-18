import { useState, useEffect } from "react";
import {
  View, Text, TextInput, ScrollView,
  StyleSheet, Pressable, Alert, Image
} from "react-native";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "@/components/AppHeader";
import Colors from "@/constants/Colors";
import { useSurveys } from "@/context/SurveyContext";

const PRIORITIES = ["High", "Medium", "Low"];

const priorityColor = {
  High:   Colors.danger,
  Medium: Colors.warning,
  Low:    Colors.success,
};

export default function CreateSurvey() {
  const router = useRouter();
  const { addSurvey, editSurvey, pendingPhoto, setPendingPhoto, getSurvey } = useSurveys();
  const { editId } = useLocalSearchParams(); // Get editId from params if editing

  const [siteName,    setSiteName]    = useState("");
  const [clientName,  setClientName]  = useState("");
  const [description, setDescription] = useState("");
  const [priority,    setPriority]    = useState("Medium");
  const [location,    setLocation]    = useState("");

  const today = new Date().toDateString();

  // If editing, load existing data
  useEffect(() => {
    if (editId) {
      const existing = getSurvey(editId);
      if (existing) {
        setSiteName(existing.site);
        setClientName(existing.client);
        setDescription(existing.description || "");
        setPriority(existing.priority);
        setLocation(existing.location || "");
        if (existing.photo) {
          setPendingPhoto(existing.photo);
        }
      }
    }
  }, [editId, getSurvey, setPendingPhoto]);

  function resetForm() {
    setSiteName(""); 
    setClientName(""); 
    setDescription(""); 
    setPriority("Medium");
    setLocation("");
    setPendingPhoto(null);
  }

  async function pasteLocation() {
    const hasText = await Clipboard.hasStringAsync();
    if (hasText) {
      const text = await Clipboard.getStringAsync();
      setLocation(text);
    } else {
      Alert.alert("Empty", "Clipboard is empty.");
    }
  }

  function handleSubmit() {
    if (!siteName.trim()) {
      Alert.alert("Missing Field", "Please enter the Site Name."); return;
    }
    if (!clientName.trim()) {
      Alert.alert("Missing Field", "Please enter the Client Name."); return;
    }
    
    if (editId) {
      // Editing existing survey
      const updatedSurvey = {
        ...getSurvey(editId),
        site: siteName,
        client: clientName,
        description,
        priority,
        location: location || null,
        photo: pendingPhoto || null,
      };
      editSurvey(updatedSurvey);
      Alert.alert(
        "✅ Survey Updated!",
        `Survey ID: ${editId} has been updated.`,
        [
          { text: "View Details", onPress: () => {
              resetForm();
              router.push(`/preview?id=${editId}`);
            }
          },
          { text: "OK", onPress: resetForm }
        ]
      );
    } else {
      // Creating new survey
      const surveyId = "SRV-" + Date.now().toString().slice(-6);
      
      const newSurvey = {
        id: surveyId,
        site: siteName,
        client: clientName,
        description,
        priority,
        date: today,
        status: "In Progress",
        location: location || null,
        photo: pendingPhoto || null,
      };

      addSurvey(newSurvey);

      Alert.alert(
        "✅ Survey Created!",
        `Survey ID: ${surveyId} has been added.`,
        [
          { text: "View Details", onPress: () => {
              resetForm();
              router.push(`/preview?id=${surveyId}`);
            }
          },
          { text: "OK", onPress: resetForm }
        ]
      );
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <AppHeader 
        title={editId ? "Edit Survey" : "Create Survey"} 
        subtitle={editId ? "Update survey details" : "Fill in all required fields"} />

      <View style={styles.form}>

        <Text style={styles.label}>Site Name <Text style={styles.required}>*</Text></Text>
        <TextInput style={styles.input} placeholder="e.g. ABC Industries" placeholderTextColor={Colors.gray} value={siteName} onChangeText={setSiteName} />

        <Text style={styles.label}>Client Name <Text style={styles.required}>*</Text></Text>
        <TextInput style={styles.input} placeholder="e.g. John Smith" placeholderTextColor={Colors.gray} value={clientName} onChangeText={setClientName} />

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Enter survey description..." placeholderTextColor={Colors.gray} value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => {
            const isActive = priority === p;
            return (
              <Pressable
                key={p}
                style={[styles.priorityBtn, isActive && { backgroundColor: priorityColor[p], borderColor: priorityColor[p] }]}
                onPress={() => setPriority(p)}
              >
                <Text style={[styles.priorityText, isActive && styles.priorityTextActive]}>{p}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Location Coordinates</Text>
        <View style={styles.row}>
          <TextInput 
            style={[styles.input, { flex: 1, marginRight: 10 }]} 
            placeholder="Paste or type location..." 
            placeholderTextColor={Colors.gray} 
            value={location} 
            onChangeText={setLocation} 
          />
          <Pressable style={styles.pasteBtn} onPress={pasteLocation}>
            <Ionicons name="clipboard-outline" size={20} color="white" />
          </Pressable>
        </View>

        <Text style={styles.label}>Site Photo</Text>
        {pendingPhoto ? (
          <View style={styles.photoContainer}>
            <Image source={{ uri: pendingPhoto }} style={styles.previewImage} />
            <Pressable style={styles.retakeBtn} onPress={() => router.push("/camera")}>
              <Ionicons name="camera-reverse" size={20} color="white" />
              <Text style={styles.retakeText}>Retake Photo</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.cameraBtn} onPress={() => router.push("/camera")}>
            <Ionicons name="camera" size={24} color={Colors.primary} />
            <Text style={styles.cameraText}>Capture Site Photo</Text>
          </Pressable>
        )}

        <Text style={styles.label}>Date</Text>
        <View style={styles.dateBox}><Text style={styles.dateText}>📅  {today}</Text></View>

        <Pressable style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.8 }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>{editId ? "Update Survey" : "Submit Survey"}</Text>
        </Pressable>
        <Pressable style={styles.resetBtn} onPress={() => {
          resetForm();
          router.back();
        }}>
          <Text style={styles.resetText}>{editId ? "Cancel" : "Reset Form"}</Text>
        </Pressable>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  form: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: "600", color: Colors.text, marginBottom: 6, marginTop: 16 },
  required: { color: Colors.danger },
  input: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.text },
  textArea: { minHeight: 100, paddingTop: 12 },
  priorityRow: { flexDirection: "row", gap: 10 },
  priorityBtn: { flex: 1, borderWidth: 2, borderColor: Colors.border, borderRadius: 12, paddingVertical: 10, alignItems: "center", backgroundColor: Colors.card },
  priorityText: { fontSize: 14, fontWeight: "600", color: Colors.gray },
  priorityTextActive: { color: "white" },
  row: { flexDirection: "row", alignItems: "center" },
  pasteBtn: { backgroundColor: Colors.accent, padding: 12, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  cameraBtn: { backgroundColor: Colors.primary + "15", borderWidth: 1, borderColor: Colors.primary + "40", borderRadius: 12, padding: 20, alignItems: "center", justifyContent: "center", borderStyle: "dashed" },
  cameraText: { color: Colors.primary, fontWeight: "600", marginTop: 8 },
  photoContainer: { borderRadius: 12, overflow: "hidden", position: "relative" },
  previewImage: { width: "100%", height: 200, resizeMode: "cover" },
  retakeBtn: { position: "absolute", bottom: 10, right: 10, backgroundColor: "rgba(0,0,0,0.6)", flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 6 },
  retakeText: { color: "white", fontSize: 12, fontWeight: "bold" },
  dateBox: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  dateText: { fontSize: 15, color: Colors.text },
  submitBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: "center", marginTop: 28 },
  submitText: { color: "white", fontSize: 16, fontWeight: "700" },
  resetBtn: { borderRadius: 14, paddingVertical: 12, alignItems: "center", marginTop: 10 },
  resetText: { color: Colors.gray, fontSize: 14, fontWeight: "600" },
});
