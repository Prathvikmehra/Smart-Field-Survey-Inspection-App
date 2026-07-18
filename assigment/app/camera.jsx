import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useSurveys } from "@/context/SurveyContext";

export default function CameraScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { setPendingPhoto } = useSurveys();

  // expo-camera permission hook
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  // UI states
  const [loading, setLoading] = useState(false); // capturing in progress
  const [photo, setPhoto] = useState(null); // URI of captured photo
  const [captureTime, setCaptureTime] = useState(null); // timestamp of capture

  const cameraRef = useRef(null);

  // Save photo to gallery function
  const savePhotoToGallery = async (uri) => {
    try {
      if (!mediaPermission?.granted) {
        const { granted } = await requestMediaPermission();
        if (!granted) {
          Alert.alert("Permission needed", "Please grant media library permission to save photos");
          return false;
        }
      }

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "Photo saved to gallery!");
      return true;
    } catch (e) {
      console.error("Failed to save photo:", e);
      Alert.alert("Error", "Failed to save photo to gallery");
      return false;
    }
  };

  // ── 1. Waiting for permission decision ──────────────────────────────────────
  if (!cameraPermission) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.gray }]}>Loading camera...</Text>
      </SafeAreaView>
    );
  }

  // ── 2. Permission denied — show rationale + grant button ────────────────────
  if (!cameraPermission.granted) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={styles.permEmoji}>📷</Text>
        <Text style={[styles.permTitle, { color: colors.text }]}>Camera Permission Required</Text>
        <Text style={[styles.permSub, { color: colors.gray }]}>
          We need access to your camera to capture survey photos.
        </Text>
        <Pressable style={[styles.btn, { backgroundColor: colors.primary }]} onPress={requestCameraPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </Pressable>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={[styles.backText, { color: colors.gray }]}>← Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // ── Capture photo ─────────────────────────────────────────────────────────
  async function takePhoto() {
    if (!cameraRef.current) return;
    setLoading(true);
    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      setPhoto(result.uri);
      setCaptureTime(new Date().toLocaleString());
    } catch (e) {
      console.error("Failed to capture photo:", e);
      Alert.alert("Error", "Could not capture photo. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Delete photo with confirmation ────────────────────────────────────────
  function handleDelete() {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setPhoto(null);
            setCaptureTime(null);
          },
        },
      ]
    );
  }

  // ── Retake — simply clear photo state ────────────────────────────────────
  function handleRetake() {
    setPhoto(null);
    setCaptureTime(null);
  }

  // ── 3. Preview mode — show captured image ─────────────────────────────────
  if (photo) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.accent }]}>
          <Text style={styles.headerTitle}>📸 Photo Preview</Text>
        </View>

        {/* Photo */}
        <Image source={{ uri: photo }} style={styles.preview} resizeMode="cover" />

        {/* Capture time */}
        <Text style={[styles.timeText, { color: colors.gray }]}>🕐 Captured: {captureTime}</Text>

        {/* Action buttons */}
        <View style={styles.row}>
          <Pressable
            style={[styles.btn, { backgroundColor: colors.primary }]}
            onPress={handleRetake}
          >
            <Text style={styles.btnText}>🔄 Retake</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, { backgroundColor: colors.danger }]}
            onPress={handleDelete}
          >
            <Text style={styles.btnText}>🗑️ Delete</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.btn, { backgroundColor: colors.success, marginHorizontal: 16, marginBottom: 8 }]}
          onPress={async () => {
            await savePhotoToGallery(photo);
          }}
        >
          <Text style={styles.btnText}>💾 Save to Gallery</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { marginHorizontal: 16, marginBottom: 8, backgroundColor: colors.primary }]}
          onPress={() => {
            setPendingPhoto(photo);
            router.back();
          }}
        >
          <Text style={styles.btnText}>✅ Use Photo</Text>
        </Pressable>

        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={[styles.backText, { color: colors.gray }]}>← Back to Dashboard</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // ── 4. Camera active ──────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.accent }]}>
        <Text style={styles.headerTitle}>📷 Camera</Text>
        <Text style={[styles.headerSub, { color: isDark ? "#C7D2FE" : "#DDD6FE" }]}>
          Tap the button below to capture
        </Text>
      </View>

      {/* Camera view or loading spinner */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.gray }]}>Capturing photo...</Text>
        </View>
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      )}

      {/* Capture button */}
      <Pressable
        style={({ pressed }) => [
          styles.captureBtn,
          pressed && { opacity: 0.8 },
          { backgroundColor: colors.accent },
        ]}
        onPress={takePhoto}
        disabled={loading}
      >
        <Text style={styles.captureBtnText}>📷 Capture Photo</Text>
      </Pressable>

      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={[styles.backText, { color: colors.gray }]}>← Go Back</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ── layout ──
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  // ── header ──
  header: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  headerSub: {
    fontSize: 13,
    marginTop: 2,
  },

  // ── camera view ──
  camera: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    overflow: "hidden",
  },

  // ── loading ──
  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 15,
    marginTop: 8,
  },

  // ── preview ──
  preview: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
  },

  timeText: {
    textAlign: "center",
    fontSize: 14,
    marginVertical: 10,
  },

  // ── row of two buttons ──
  row: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  // ── buttons ──
  btn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  btnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },

  captureBtn: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },

  captureBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  backBtn: {
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 4,
  },

  backText: {
    fontSize: 14,
    fontWeight: "600",
  },

  // ── permission screen ──
  permEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },

  permTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  permSub: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
});
