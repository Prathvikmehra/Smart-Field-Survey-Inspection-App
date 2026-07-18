import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable, TextInput, Alert, RefreshControl } from "react-native";
import * as Contacts from "expo-contacts";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "@/components/AppHeader";
import Colors from "@/constants/Colors";

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
          sort: Contacts.SortTypes.FirstName,
        });

        if (data.length > 0) {
          // Filter out contacts without names or numbers to keep it clean
          const validContacts = data.filter(c => c.name && c.phoneNumbers && c.phoneNumbers.length > 0);
          setContacts(validContacts);
          setFilteredContacts(validContacts);
        } else {
          setErrorMsg("No contacts found on this device.");
        }
      } else {
        setErrorMsg("Permission to access contacts was denied.");
      }
    } catch (e) {
      setErrorMsg("Failed to fetch contacts.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetchContacts();
  };

  function handleSearch(text) {
    setSearch(text);
    if (!text.trim()) {
      setFilteredContacts(contacts);
      return;
    }
    const lower = text.toLowerCase();
    const filtered = contacts.filter(c => c.name.toLowerCase().includes(lower));
    setFilteredContacts(filtered);
  }

  async function copyContact(contact) {
    const phone = contact.phoneNumbers[0].number;
    const textToCopy = `${contact.name}: ${phone}`;
    await Clipboard.setStringAsync(textToCopy);
    Alert.alert("Success", "Contact details copied to clipboard!");
  }

  function renderItem({ item }) {
    const phone = item.phoneNumbers && item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number : "No number";
    
    return (
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.phone}>{phone}</Text>
        </View>
        <Pressable style={styles.copyBtn} onPress={() => copyContact(item)}>
          <Ionicons name="copy-outline" size={20} color={Colors.primary} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Client Contacts" subtitle="Select a contact for survey" />
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.gray} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor={Colors.gray}
          value={search}
          onChangeText={handleSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => handleSearch("")} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={20} color={Colors.gray} />
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle" size={48} color={Colors.danger} />
          <Text style={styles.errorText}>{errorMsg}</Text>
          <Pressable style={styles.retryBtn} onPress={fetchContacts}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyText}>No contacts match your search.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  searchContainer: { 
    flexDirection: "row", alignItems: "center", 
    backgroundColor: Colors.card, margin: 16, 
    borderRadius: 12, paddingHorizontal: 12, 
    borderWidth: 1, borderColor: Colors.border 
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 48, fontSize: 16, color: Colors.text },
  clearBtn: { padding: 4 },
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  card: { 
    flexDirection: "row", alignItems: "center", 
    backgroundColor: Colors.card, padding: 16, 
    borderRadius: 12, marginBottom: 12, 
    borderWidth: 1, borderColor: Colors.border,
    shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 5, elevation: 1
  },
  avatar: { 
    width: 46, height: 46, borderRadius: 23, 
    backgroundColor: Colors.primary + "20", 
    alignItems: "center", justifyContent: "center", 
    marginRight: 14 
  },
  avatarText: { fontSize: 20, fontWeight: "bold", color: Colors.primary },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", color: Colors.text, marginBottom: 4 },
  phone: { fontSize: 14, color: Colors.gray },
  copyBtn: { padding: 10, backgroundColor: Colors.background, borderRadius: 8 },
  loadingText: { marginTop: 12, fontSize: 15, color: Colors.gray },
  errorText: { marginTop: 16, fontSize: 16, color: Colors.danger, textAlign: "center", marginBottom: 20 },
  retryBtn: { backgroundColor: Colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  retryText: { color: "white", fontWeight: "bold", fontSize: 16 },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingTop: 60 },
  emptyText: { marginTop: 16, fontSize: 16, color: Colors.gray },
});
