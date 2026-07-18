import { View, Text, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useSurveys } from "@/context/SurveyContext";

export default function PreviewSurvey() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getSurvey, deleteSurvey, setPendingPhoto } = useSurveys();
  const { colors } = useTheme();
  
  const survey = getSurvey(id);

  if (!survey) {
    return (
      <View style={styles.center}>
        <Text style={[styles.errorText, { color: colors.danger }]}>Survey not found!</Text>
        <Pressable style={[styles.btn, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
          <Text style={styles.btnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  function handleEdit() {
    if (survey.photo) {
      setPendingPhoto(survey.photo);
    }
    router.push({
      pathname: "/(drawer)/survey",
      params: { editId: survey.id }
    });
  }

  function handleDelete() {
    deleteSurvey(id);
    router.back();
  }

  const priorityMap = {
    High: colors.danger,
    Medium: colors.warning,
    Low: colors.success,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={28} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Survey Preview</Text>
        <Pressable onPress={handleDelete} style={styles.deleteBtn}>
          <Ionicons name="trash" size={24} color={colors.danger} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[
            styles.idBadge,
            { backgroundColor: colors.primary + "20", color: colors.primary }
          ]}>{survey.id}</Text>
          
          <Text style={[styles.label, { color: colors.gray }]}>Site Name</Text>
          <Text style={[styles.value, { color: colors.text }]}>{survey.site}</Text>
          
          <Text style={[styles.label, { color: colors.gray }]}>Client Name</Text>
          <Text style={[styles.value, { color: colors.text }]}>{survey.client}</Text>
          
          <Text style={[styles.label, { color: colors.gray }]}>Date</Text>
          <Text style={[styles.value, { color: colors.text }]}>{survey.date}</Text>

          <Text style={[styles.label, { color: colors.gray }]}>Priority</Text>
          <View style={[
            styles.priorityBadge,
            { backgroundColor: colors.background, borderColor: colors.border }
          ]}>
            <Text style={[
              styles.priorityText,
              { color: priorityMap[survey.priority] }
            ]}>
              • {survey.priority}
            </Text>
          </View>
        </View>

        {(survey.description || survey.location) && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {survey.description ? (
              <>
                <Text style={[styles.label, { color: colors.gray }]}>Description</Text>
                <Text style={[styles.value, { color: colors.text }]}>{survey.description}</Text>
              </>
            ) : null}

            {survey.location ? (
              <>
                <Text style={[
                  styles.label,
                  survey.description && { marginTop: 16 },
                  { color: colors.gray }
                ]}>Location</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={16} color={colors.primary} />
                  <Text style={[styles.locationText, { color: colors.text }]}>{survey.location}</Text>
                </View>
              </>
            ) : null}
          </View>
        )}

        {survey.photo && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.gray }]}>Site Photo</Text>
            <Image source={{ uri: survey.photo }} style={styles.photo} />
          </View>
        )}

      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Pressable style={[styles.footerBtn, styles.editBtn, { backgroundColor: colors.accent }]} onPress={handleEdit}>
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.footerBtnText}>Edit Survey</Text>
        </Pressable>
        <Pressable style={[styles.footerBtn, styles.submitBtn, { backgroundColor: colors.success }]}>
          <Ionicons name="checkmark-circle-outline" size={20} color="white" />
          <Text style={styles.footerBtnText}>Submit</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, paddingTop: 20, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  deleteBtn: { padding: 4 },
  body: { padding: 20, paddingBottom: 40 },
  card: { padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1 },
  idBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontWeight: "bold", fontSize: 13, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 4 },
  value: { fontSize: 16, fontWeight: "bold", marginBottom: 16 },
  priorityBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  priorityText: { fontWeight: "bold", fontSize: 13 },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  locationText: { marginLeft: 6, fontSize: 15, fontWeight: "500" },
  photo: { width: "100%", height: 200, borderRadius: 12, marginTop: 8, resizeMode: "cover" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorText: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  btn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },
  footer: { flexDirection: "row", padding: 16, gap: 12, borderTopWidth: 1 },
  footerBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 12 },
  footerBtnText: { color: "white", fontWeight: "bold", fontSize: 15 }
});
