import { useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "@/components/AppHeader";
import { useTheme } from "@/context/ThemeContext";
import { useSurveys } from "@/context/SurveyContext";

export default function HistoryScreen() {
  const router = useRouter();
  const { surveys, deleteSurvey } = useSurveys();
  const { colors } = useTheme();
  
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");

  const filteredSurveys = surveys.filter(s => {
    const matchesSearch = s.site.toLowerCase().includes(search.toLowerCase()) || 
                          s.client.toLowerCase().includes(search.toLowerCase()) ||
                          s.id.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = filterPriority === "All" || s.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  function confirmDelete(id, site) {
    Alert.alert(
      "Delete Survey",
      `Are you sure you want to delete the survey for ${site}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteSurvey(id) }
      ]
    );
  }

  function renderItem({ item }) {
    const priorityMap = {
      High: colors.danger,
      Medium: colors.warning,
      Low: colors.success,
    };
    const priorityColor = priorityMap[item.priority] || colors.gray;
    
    return (
      <Pressable 
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} 
        onPress={() => router.push(`/preview?id=${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.idText, { color: colors.primary, backgroundColor: colors.primary + "15" }]}>
            {item.id}
          </Text>
          <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
        </View>
        
        <Text style={[styles.siteText, { color: colors.text }]} numberOfLines={1}>
          {item.site}
        </Text>
        <Text style={[styles.clientText, { color: colors.gray }]} numberOfLines={1}>
          {item.client}
        </Text>
        
        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
          <Text style={[styles.dateText, { color: colors.gray }]}>{item.date}</Text>
          <Pressable style={styles.deleteBtn} onPress={() => confirmDelete(item.id, item.site)}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </Pressable>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Survey History" subtitle="Manage your surveys" />
      
      {/* Search Bar */}
      <View style={[
        styles.searchContainer,
        { backgroundColor: colors.card, borderColor: colors.border }
      ]}>
        <Ionicons name="search" size={20} color={colors.gray} style={styles.searchIcon} />
        <TextInput 
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search by ID, Site or Client..."
          placeholderTextColor={colors.gray}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={20} color={colors.gray} />
          </Pressable>
        )}
      </View>

      {/* Priority Filters */}
      <View style={styles.filterContainer}>
        {["All", "High", "Medium", "Low"].map(p => (
          <Pressable 
            key={p} 
            style={[
              styles.filterBtn,
              { backgroundColor: colors.card, borderColor: colors.border },
              filterPriority === p && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}
            onPress={() => setFilterPriority(p)}
          >
            <Text style={[
              styles.filterText,
              { color: colors.gray },
              filterPriority === p && { color: "white" }
            ]}>
              {p}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredSurveys}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.gray }]}>No surveys found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { 
    flexDirection: "row", alignItems: "center", 
    margin: 16, marginBottom: 8,
    borderRadius: 12, paddingHorizontal: 12, 
    borderWidth: 1
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 48, fontSize: 15 },
  clearBtn: { padding: 4 },
  filterContainer: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 12, gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: "600" },
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  card: { padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 5, elevation: 1 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  idText: { fontSize: 13, fontWeight: "bold", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  priorityDot: { width: 10, height: 10, borderRadius: 5 },
  siteText: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  clientText: { fontSize: 14, marginBottom: 12 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, paddingTop: 12 },
  dateText: { fontSize: 13, fontWeight: "500" },
  deleteBtn: { padding: 4 },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingTop: 60 },
  emptyText: { marginTop: 16, fontSize: 16 },
});
