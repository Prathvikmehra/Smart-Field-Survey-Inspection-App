import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import Colors from "../../constants/Colors";

// Priority options with their colours
const PRIORITIES = ["High", "Medium", "Low"];

const priorityColor = {
  High:   Colors.danger,
  Medium: Colors.warning,
  Low:    Colors.success,
};

export default function CreateSurvey() {
  // Form state
  const [siteName,    setSiteName]    = useState("");
  const [clientName,  setClientName]  = useState("");
  const [description, setDescription] = useState("");
  const [priority,    setPriority]    = useState("Medium");

  // Today's date shown as a read-only field
  const today = new Date().toDateString();

  // Reset all fields back to empty
  function resetForm() {
    setSiteName("");
    setClientName("");
    setDescription("");
    setPriority("Medium");
  }

  // Validate and submit the survey
  function handleSubmit() {
    // Required field check
    if (!siteName.trim()) {
      Alert.alert("Missing Field", "Please enter the Site Name.");
      return;
    }
    if (!clientName.trim()) {
      Alert.alert("Missing Field", "Please enter the Client Name.");
      return;
    }

    // Generate a short unique Survey ID
    const surveyId = "SRV-" + Date.now().toString().slice(-6);

    Alert.alert(
      "✅ Survey Created!",
      `Survey ID : ${surveyId}\nSite       : ${siteName}\nClient     : ${clientName}\nPriority   : ${priority}\nDate       : ${today}`,
      [
        {
          text: "OK",
          onPress: resetForm,   // clear the form after acknowledging
        },
      ]
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Page header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📝 Create Survey</Text>
        <Text style={styles.headerSub}>Fill in all required fields</Text>
      </View>

      <View style={styles.form}>

        {/* ── Site Name ── */}
        <Text style={styles.label}>Site Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. ABC Industries"
          placeholderTextColor={Colors.gray}
          value={siteName}
          onChangeText={setSiteName}
        />

        {/* ── Client Name ── */}
        <Text style={styles.label}>Client Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. John Smith"
          placeholderTextColor={Colors.gray}
          value={clientName}
          onChangeText={setClientName}
        />

        {/* ── Description ── */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter survey description..."
          placeholderTextColor={Colors.gray}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* ── Priority Picker ── */}
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => {
            const isActive = priority === p;
            return (
              <Pressable
                key={p}
                style={[
                  styles.priorityBtn,
                  isActive && { backgroundColor: priorityColor[p], borderColor: priorityColor[p] },
                ]}
                onPress={() => setPriority(p)}
              >
                <Text
                  style={[
                    styles.priorityText,
                    isActive && styles.priorityTextActive,
                  ]}
                >
                  {p}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── Date (read-only) ── */}
        <Text style={styles.label}>Date</Text>
        <View style={styles.dateBox}>
          <Text style={styles.dateText}>📅  {today}</Text>
        </View>

        {/* ── Submit Button ── */}
        <Pressable
          style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.8 }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Submit Survey</Text>
        </Pressable>

        {/* ── Reset Button ── */}
        <Pressable style={styles.resetBtn} onPress={resetForm}>
          <Text style={styles.resetText}>Reset Form</Text>
        </Pressable>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Blue page header (consistent with AppHeader style)
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  headerSub: {
    color: "#BFDBFE",
    fontSize: 13,
    marginTop: 4,
  },

  form: {
    padding: 20,
    paddingBottom: 40,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
    marginTop: 16,
  },

  // Red asterisk for required fields
  required: {
    color: Colors.danger,
  },

  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
  },

  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },

  // Three side-by-side priority buttons
  priorityRow: {
    flexDirection: "row",
    gap: 10,
  },

  priorityBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: Colors.card,
  },

  priorityText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.gray,
  },

  priorityTextActive: {
    color: "white",
  },

  // Read-only date display
  dateBox: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  dateText: {
    fontSize: 15,
    color: Colors.text,
  },

  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 28,
  },

  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  resetBtn: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },

  resetText: {
    color: Colors.gray,
    fontSize: 14,
    fontWeight: "600",
  },
});