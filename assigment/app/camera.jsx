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
import { Ionicons } from "@expo/vector-icons";

export default function CameraScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { setPendingPhoto } = useSurveys();

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [captureTime, setCaptureTime] = useState(null);

  const cameraRef = useRef(null);

  const savePhotoToGallery = async (uri) => {
    try {
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "Photo saved to gallery");
      return true;
    } catch (e) {
      console.error("Failed to save photo:", e);
      Alert.alert(
        "Error", 
        "Failed to save photo. Please ensure you've granted storage permissions in your device settings."
      );
      return false;
    }
  };

  if (!cameraPermission) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.text, { color: colors.gray }]}>Loading camera</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Ionicons name="camera" size={64} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Camera Permission Required</Text>
          <Text style={[styles.subtitle, { color: colors.gray }]}>
            We need access to your camera to capture survey photos.
          </Text>
          <Pressable 
            style={[styles.primaryButton, { backgroundColor: colors.primary }]} 
            onPress={requestCameraPermission}
          >
            <Text style={styles.buttonText}>Grant Permission</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={[styles.secondaryButtonText, { color: colors.gray }]}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

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

  function handleRetake() {
    setPhoto(null);
    setCaptureTime(null);
  }

  if (photo) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={styles.previewHeader}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Photo Preview</Text>
          <View style={{ width: 24 }} />
        </View>

        <Image source={{ uri: photo }} style={styles.previewImage} resizeMode="cover" />

        <View style={styles.previewActions}>
          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]} 
            onPress={handleRetake}
          >
            <Ionicons name="refresh" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Retake</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]} 
            onPress={async () => {
              await savePhotoToGallery(photo);
            }}
          >
            <Ionicons name="download" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Save</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]} 
            onPress={handleDelete}
          >
            <Ionicons name="trash" size={20} color={colors.danger} />
            <Text style={[styles.actionButtonText, { color: colors.danger }]}>Delete</Text>
          </Pressable>
        </View>

        <Pressable 
          style={[styles.usePhotoButton, { backgroundColor: colors.primary }]} 
          onPress={() => {
            setPendingPhoto(photo);
            router.back();
          }}
        >
          <Text style={styles.usePhotoButtonText}>Use Photo</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.cameraHeader}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Camera</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.gray }]}>Capturing photo</Text>
          </View>
        )}
      </View>

      <View style={styles.cameraFooter}>
        <Pressable
          style={({ pressed }) => [
            styles.captureButton,
            pressed && { opacity: 0.9 },
            { backgroundColor: colors.primary },
          ]}
          onPress={takePhoto}
          disabled={loading}
        >
          <Ionicons name="camera" size={28} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 16,
    marginTop: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  primaryButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButton: {
    marginTop: 16,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },

  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cameraHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  previewImage: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 16,
  },

  previewActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },

  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
  },

  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },

  usePhotoButton: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  usePhotoButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  cameraContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
  },

  cameraFooter: {
    paddingVertical: 20,
    paddingBottom: 32,
    alignItems: "center",
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
});
