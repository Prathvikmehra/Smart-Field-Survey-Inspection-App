import { View, Text, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useSurveys } from "@/context/SurveyContext";

export default function PreviewSurvey() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getSurvey, deleteSurvey } = useSurveys();
  
  const survey = getSurvey(id);

  if (!survey) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Survey not found!</Text>
        <Pressable style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  function handleDelete() {
    deleteSurvey(id);
    router.back();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={28} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Survey Preview</Text>
        <Pressable onPress={handleDelete} style={styles.deleteBtn}>
          <Ionicons name="trash" size={24} color={Colors.danger} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        
        <View style={styles.card}>
          <Text style={styles.idBadge}>{survey.id}</Text>
          
          <Text style={styles.label}>Site Name</Text>
          <Text style={styles.value}>{survey.site}</Text>
          
          <Text style={styles.label}>Client Name</Text>
          <Text style={styles.value}>{survey.client}</Text>
          
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{survey.date}</Text>

          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityBadge}>
            <Text style={[
              styles.priorityText, 
              { color: survey.priority === "High" ? Colors.danger : survey.priority === "Medium" ? Colors.warning : Colors.success }
            ]}>
              • {survey.priority}
            </Text>
          </View>
        </View>

        {(survey.description || survey.location) && (
          <View style={styles.card}>
            {survey.description ? (
              <>
                <Text style={styles.label}>Description</Text>
                <Text style={styles.value}>{survey.description}</Text>
              </>
            ) : null}

            {survey.location ? (
              <>
                <Text style={[styles.label, survey.description && { marginTop: 16 }]}>Location</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={16} color={Colors.primary} />
                  <Text style={styles.locationText}>{survey.location}</Text>
                </View>
              </>
            ) : null}
          </View>
        )}

        {survey.photo && (
          <View style={styles.card}>
            <Text style={styles.label}>Site Photo</Text>
            <Image source={{ uri: survey.photo }} style={styles.photo} />
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, paddingTop: 20, backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: Colors.text },
  deleteBtn: { padding: 4 },
  body: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: Colors.card, padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  idBadge: { alignSelf: "flex-start", backgroundColor: Colors.primary + "20", color: Colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontWeight: "bold", fontSize: 13, marginBottom: 16 },
  label: { fontSize: 13, color: Colors.gray, fontWeight: "600", marginBottom: 4 },
  value: { fontSize: 16, color: Colors.text, fontWeight: "bold", marginBottom: 16 },
  priorityBadge: { alignSelf: "flex-start", backgroundColor: Colors.background, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  priorityText: { fontWeight: "bold", fontSize: 13 },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  locationText: { marginLeft: 6, fontSize: 15, color: Colors.text, fontWeight: "500" },
  photo: { width: "100%", height: 200, borderRadius: 12, marginTop: 8, resizeMode: "cover" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorText: { fontSize: 18, color: Colors.danger, fontWeight: "bold", marginBottom: 20 },
  btn: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 }
});
