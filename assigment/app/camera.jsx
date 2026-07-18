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
import { useRouter } from "expo-router";
import Colors from "../constants/Colors";

export default function CameraScreen() {
  const router = useRouter();

  // expo-camera permission hook
  const [permission, requestPermission] = useCameraPermissions();

  // UI states
  const [loading,      setLoading]      = useState(false);   // capturing in progress
  const [photo,        setPhoto]        = useState(null);    // URI of captured photo
  const [captureTime,  setCaptureTime]  = useState(null);    // timestamp of capture

  const cameraRef = useRef(null);

  // ── 1. Waiting for permission decision ──────────────────────────────────────
  if (!permission) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </SafeAreaView>
    );
  }

  // ── 2. Permission denied — show rationale + grant button ────────────────────
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.permEmoji}>📷</Text>
        <Text style={styles.permTitle}>Camera Permission Required</Text>
        <Text style={styles.permSub}>
          We need access to your camera to capture survey photos.
        </Text>
        <Pressable style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </Pressable>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Go Back</Text>
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
    } catch {
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
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📸 Photo Preview</Text>
        </View>

        {/* Photo */}
        <Image source={{ uri: photo }} style={styles.preview} resizeMode="cover" />

        {/* Capture time */}
        <Text style={styles.timeText}>🕐 Captured: {captureTime}</Text>

        {/* Action buttons */}
        <View style={styles.row}>
          <Pressable
            style={[styles.btn, styles.retakeBtn]}
            onPress={handleRetake}
          >
            <Text style={styles.btnText}>🔄 Retake</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, styles.deleteBtn]}
            onPress={handleDelete}
          >
            <Text style={styles.btnText}>🗑️ Delete</Text>
          </Pressable>
        </View>

        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back to Dashboard</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // ── 4. Camera active ──────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📷 Camera</Text>
        <Text style={styles.headerSub}>Tap the button below to capture</Text>
      </View>

      {/* Camera view or loading spinner */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Capturing photo...</Text>
        </View>
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      )}

      {/* Capture button */}
      <Pressable
        style={({ pressed }) => [styles.captureBtn, pressed && { opacity: 0.8 }]}
        onPress={takePhoto}
        disabled={loading}
      >
        <Text style={styles.captureBtnText}>📷  Capture Photo</Text>
      </Pressable>

      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Go Back</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ── layout ──
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    padding: 24,
  },

  // ── header ──
  header: {
    backgroundColor: Colors.accent,     // purple — distinct from blue dashboard
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
    color: "#DDD6FE",
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
    color: Colors.gray,
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
    color: Colors.gray,
    fontSize: 14,
    marginVertical: 10,
  },

  // ── row of two buttons ──
  row: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
  },

  // ── buttons ──
  btn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: Colors.primary,
  },

  retakeBtn: {
    backgroundColor: Colors.primary,
  },

  deleteBtn: {
    backgroundColor: Colors.danger,
  },

  btnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },

  captureBtn: {
    backgroundColor: Colors.accent,
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
    color: Colors.gray,
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
    color: Colors.text,
    textAlign: "center",
    marginBottom: 8,
  },

  permSub: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
});
