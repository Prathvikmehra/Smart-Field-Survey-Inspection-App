import { useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "@/components/AppHeader";
import Colors from "@/constants/Colors";
import { useSurveys } from "@/context/SurveyContext";

export default function HistoryScreen() {
  const router = useRouter();
  const { surveys, deleteSurvey } = useSurveys();
  
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");

  // Filter surveys based on search query and priority
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
    const priorityColor = item.priority === "High" ? Colors.danger : item.priority === "Medium" ? Colors.warning : Colors.success;
    
    return (
      <Pressable 
        style={styles.card} 
        onPress={() => router.push(`/preview?id=${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.idText}>{item.id}</Text>
          <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
        </View>
        
        <Text style={styles.siteText} numberOfLines={1}>{item.site}</Text>
        <Text style={styles.clientText} numberOfLines={1}>{item.client}</Text>
        
        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>{item.date}</Text>
          <Pressable style={styles.deleteBtn} onPress={() => confirmDelete(item.id, item.site)}>
            <Ionicons name="trash-outline" size={20} color={Colors.danger} />
          </Pressable>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Survey History" subtitle="Manage your surveys" />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.gray} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search by ID, Site or Client..."
          placeholderTextColor={Colors.gray}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={20} color={Colors.gray} />
          </Pressable>
        )}
      </View>

      {/* Priority Filters */}
      <View style={styles.filterContainer}>
        {["All", "High", "Medium", "Low"].map(p => (
          <Pressable 
            key={p} 
            style={[styles.filterBtn, filterPriority === p && styles.filterBtnActive]}
            onPress={() => setFilterPriority(p)}
          >
            <Text style={[styles.filterText, filterPriority === p && styles.filterTextActive]}>{p}</Text>
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
            <Ionicons name="document-text-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>No surveys found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchContainer: { 
    flexDirection: "row", alignItems: "center", 
    backgroundColor: Colors.card, margin: 16, marginBottom: 8,
    borderRadius: 12, paddingHorizontal: 12, 
    borderWidth: 1, borderColor: Colors.border 
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 48, fontSize: 15, color: Colors.text },
  clearBtn: { padding: 4 },
  filterContainer: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 12, gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  filterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, fontWeight: "600", color: Colors.gray },
  filterTextActive: { color: "white" },
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  card: { backgroundColor: Colors.card, padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 5, elevation: 1 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  idText: { fontSize: 13, fontWeight: "bold", color: Colors.primary, backgroundColor: Colors.primary + "15", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  priorityDot: { width: 10, height: 10, borderRadius: 5 },
  siteText: { fontSize: 18, fontWeight: "bold", color: Colors.text, marginBottom: 4 },
  clientText: { fontSize: 14, color: Colors.gray, marginBottom: 12 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12 },
  dateText: { fontSize: 13, color: Colors.gray, fontWeight: "500" },
  deleteBtn: { padding: 4 },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingTop: 60 },
  emptyText: { marginTop: 16, fontSize: 16, color: Colors.gray },
});
