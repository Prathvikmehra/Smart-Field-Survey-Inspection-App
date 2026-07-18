import { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, Image, ScrollView, Alert, ActivityIndicator } from "react-native";
import AppHeader from "@/components/AppHeader";
import { useTheme } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
  const { colors } = useTheme();
  const { profile, setProfile, loading } = useProfile();
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [tempEnrollment, setTempEnrollment] = useState(profile.enrollment);

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "We need access to your photos to select a profile image!");
      return;
    }

    // Launch image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfile({ photo: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "We need access to your camera to take a profile photo!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfile({ photo: result.assets[0].uri });
    }
  };

  const handleEditSave = () => {
    if (editing) {
      setProfile({ name: tempName, enrollment: tempEnrollment });
    } else {
      setTempName(profile.name);
      setTempEnrollment(profile.enrollment);
    }
    setEditing(!editing);
  };

  const getInitials = (name) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <AppHeader title="My Profile" subtitle="Manage your account details" />

      {/* Profile Photo Section */}
      <View style={styles.photoSection}>
        <View style={styles.photoContainer}>
          {profile.photo ? (
            <Image source={{ uri: profile.photo }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
            </View>
          )}
          <Pressable style={[styles.cameraIcon, { backgroundColor: colors.primary }]} onPress={() => {
            Alert.alert("Change Profile Photo", "Choose an option", [
              { text: "Take Photo", onPress: takePhoto },
              { text: "Choose from Gallery", onPress: pickImage },
              { text: "Cancel", style: "cancel" },
            ]);
          }}>
            <Ionicons name="camera" size={20} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Profile Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.gray }]}>Full Name</Text>
          {editing ? (
            <TextInput
              style={[styles.infoInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              value={tempName}
              onChangeText={setTempName}
            />
          ) : (
            <Text style={[styles.infoValue, { color: colors.text }]}>{profile.name}</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.gray }]}>Enrollment Number</Text>
          {editing ? (
            <TextInput
              style={[styles.infoInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              value={tempEnrollment}
              onChangeText={setTempEnrollment}
            />
          ) : (
            <Text style={[styles.infoValue, { color: colors.text }]}>{profile.enrollment}</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.gray }]}>App Version</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>Smart Survey v1.0</Text>
        </View>
      </View>

      {/* Edit Button */}
      <Pressable
        style={[styles.editButton, { backgroundColor: colors.primary }]}
        onPress={handleEditSave}
      >
        <Ionicons name={editing ? "checkmark" : "pencil"} size={20} color="white" />
        <Text style={styles.editButtonText}>{editing ? "Save Changes" : "Edit Profile"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center" },
  content: { paddingBottom: 40 },
  photoSection: { alignItems: "center", marginTop: 16, marginBottom: 24 },
  photoContainer: { position: "relative" },
  avatar: { width: 120, height: 120, borderRadius: 60, alignItems: "center", justifyContent: "center" },
  avatarImage: { width: 120, height: 120, borderRadius: 60 },
  avatarText: { color: "white", fontSize: 40, fontWeight: "bold" },
  cameraIcon: { 
    position: "absolute", 
    bottom: 0, 
    right: 0, 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    alignItems: "center", 
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "white"
  },
  infoSection: { paddingHorizontal: 16, gap: 16 },
  infoItem: { gap: 6 },
  infoLabel: { fontSize: 13, fontWeight: "500" },
  infoValue: { fontSize: 16, fontWeight: "500" },
  infoInput: {
    fontSize: 16,
    fontWeight: "500",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 10,
  },
  editButton: {
    marginTop: 32,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  editButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600"
  }
});
