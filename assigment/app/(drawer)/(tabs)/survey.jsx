import { useState, useEffect } from "react";
import {
  View, Text, TextInput, ScrollView,
  StyleSheet, Pressable, Alert, Image
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "@/components/AppHeader";
import { useTheme } from "@/context/ThemeContext";
import { useSurveys } from "@/context/SurveyContext";

const PRIORITIES = ["High", "Medium", "Low"];

export default function CreateSurvey() {
  const router = useRouter();
  const { addSurvey, editSurvey, pendingPhoto, setPendingPhoto, getSurvey } = useSurveys();
  const { colors } = useTheme();
  const { editId } = useLocalSearchParams();

  const priorityMap = {
    High: colors.danger,
    Medium: colors.warning,
    Low: colors.success,
  };

  const [siteName,    setSiteName]    = useState("");
  const [clientName,  setClientName]  = useState("");
  const [description, setDescription] = useState("");
  const [priority,    setPriority]    = useState("Medium");
  const [location,    setLocation]    = useState("");

  const today = new Date().toDateString();

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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <AppHeader 
        title={editId ? "Edit Survey" : "Create Survey"} 
        subtitle={editId ? "Update survey details" : "Fill in all required fields"} 
      />

      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.text }]}>
          Site Name <Text style={[styles.required, { color: colors.danger }]}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="e.g. ABC Industries"
          placeholderTextColor={colors.gray}
          value={siteName}
          onChangeText={setSiteName}
        />

        <Text style={[styles.label, { color: colors.text }]}>
          Client Name <Text style={[styles.required, { color: colors.danger }]}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="e.g. John Smith"
          placeholderTextColor={colors.gray}
          value={clientName}
          onChangeText={setClientName}
        />

        <Text style={[styles.label, { color: colors.text }]}>Description</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Enter survey description..."
          placeholderTextColor={colors.gray}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => {
            const isActive = priority === p;
            return (
              <Pressable
                key={p}
                style={[
                  styles.priorityBtn,
                  {
                    backgroundColor: isActive ? priorityMap[p] : colors.card,
                    borderColor: isActive ? priorityMap[p] : colors.border,
                  },
                ]}
                onPress={() => setPriority(p)}
              >
                <Text style={[styles.priorityText, { color: isActive ? "white" : colors.gray }]}>
                  {p}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Location Coordinates</Text>
        <View style={styles.row}>
          <TextInput
            style={[
              styles.input,
              {
                flex: 1,
                marginRight: 10,
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Paste or type location..."
            placeholderTextColor={colors.gray}
            value={location}
            onChangeText={setLocation}
          />
          <Pressable
            style={[styles.pasteBtn, { backgroundColor: colors.accent }]}
            onPress={pasteLocation}
          >
            <Ionicons name="clipboard-outline" size={20} color="white" />
          </Pressable>
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Site Photo</Text>
        {pendingPhoto ? (
          <View style={styles.photoContainer}>
            <Image source={{ uri: pendingPhoto }} style={styles.previewImage} />
            <Pressable style={styles.retakeBtn} onPress={() => router.push("/camera")}>
              <Ionicons name="camera-reverse" size={20} color="white" />
              <Text style={styles.retakeText}>Retake Photo</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={[
              styles.cameraBtn,
              {
                backgroundColor: colors.primary + "15",
                borderColor: colors.primary + "40",
              },
            ]}
            onPress={() => router.push("/camera")}
          >
            <Ionicons name="camera" size={24} color={colors.primary} />
            <Text style={[styles.cameraText, { color: colors.primary }]}>
              Capture Site Photo
            </Text>
          </Pressable>
        )}

        <Text style={[styles.label, { color: colors.text }]}>Date</Text>
        <View style={[styles.dateBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.dateText, { color: colors.text }]}>📅  {today}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            pressed && { opacity: 0.8 },
            { backgroundColor: colors.primary },
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>
            {editId ? "Update Survey" : "Submit Survey"}
          </Text>
        </Pressable>
        <Pressable style={styles.resetBtn} onPress={() => {
            resetForm();
            router.back();
          }}>
          <Text style={[styles.resetText, { color: colors.gray }]}>
            {editId ? "Cancel" : "Reset Form"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 20, paddingBottom: 40 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 16,
  },
  required: {},
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: { minHeight: 100, paddingTop: 12 },
  priorityRow: { flexDirection: "row", gap: 10 },
  priorityBtn: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  priorityText: { fontSize: 14, fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center" },
  pasteBtn: { padding: 12, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  cameraBtn: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
  },
  cameraText: { fontWeight: "600", marginTop: 8 },
  photoContainer: { borderRadius: 12, overflow: "hidden", position: "relative" },
  previewImage: { width: "100%", height: 200, resizeMode: "cover" },
  retakeBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  retakeText: { color: "white", fontSize: 12, fontWeight: "bold" },
  dateBox: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  dateText: { fontSize: 15 },
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 28,
  },
  submitText: { color: "white", fontSize: 16, fontWeight: "700" },
  resetBtn: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  resetText: { fontSize: 14, fontWeight: "600" },
});
