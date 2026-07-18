import { Drawer } from "expo-router/drawer";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useRouter, usePathname } from "expo-router";
import Colors from "@/constants/Colors";

// List of all drawer menu items
const MENU_ITEMS = [
  { label: "Dashboard",  icon: "home-outline",       route: "/(drawer)/(tabs)/",         tab: true  },
  { label: "Survey",     icon: "clipboard-outline",   route: "/(drawer)/(tabs)/survey",   tab: true  },
  { label: "Camera",     icon: "camera-outline",      route: "/camera",                   tab: false },
  { label: "Contacts",   icon: "people-outline",      route: "/(drawer)/contacts",        tab: false },
  { label: "Location",   icon: "location-outline",    route: "/(drawer)/location",        tab: false },
  { label: "Clipboard",  icon: "copy-outline",        route: "/(drawer)/clipboard",       tab: false },
  { label: "Settings",   icon: "settings-outline",    route: "/(drawer)/settings",        tab: false },
];

// Custom sidebar content shown inside the drawer
function CustomDrawerContent(props) {
  const router   = useRouter();
  const pathname = usePathname();

  function navigate(route) {
    props.navigation.closeDrawer();
    router.push(route);
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>

      {/* ── Profile header ── */}
      <View style={styles.profileBox}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>PM</Text>
        </View>
        <Text style={styles.profileName}>Prathvik Mehra</Text>
        <Text style={styles.profileSub}>Enrollment: 23CS001</Text>
      </View>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Menu Items ── */}
      <View style={styles.menuSection}>
        {MENU_ITEMS.map((item) => {
          // Highlight active route
          const isActive = pathname === item.route || pathname.startsWith(item.route.replace("/index", ""));
          return (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.menuItem,
                isActive  && styles.menuItemActive,
                pressed   && styles.menuItemPressed,
              ]}
              onPress={() => navigate(item.route)}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={isActive ? Colors.primary : Colors.gray}
              />
              <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Smart Survey & Inspection App</Text>
        <Text style={styles.footerVersion}>v1.0  •  Modules 1–3</Text>
      </View>

    </DrawerContentScrollView>
  );
}

// Root Drawer navigator — wraps the whole app
export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,           // each screen draws its own header
        drawerStyle: { width: 280 },  // sidebar width
      }}
    >
      {/* The bottom-tabs group — appears as "home" in the drawer */}
      <Drawer.Screen name="(tabs)" options={{ drawerLabel: "Dashboard" }} />

      {/* Individual drawer-only screens */}
      <Drawer.Screen name="contacts" options={{ drawerLabel: "Contacts" }} />
      <Drawer.Screen name="location" options={{ drawerLabel: "Location" }} />
      <Drawer.Screen name="clipboard" options={{ drawerLabel: "Clipboard" }} />
      <Drawer.Screen name="settings"  options={{ drawerLabel: "Settings" }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingBottom: 24,
  },

  // ── Profile block ──
  profileBox: {
    backgroundColor: Colors.primary,
    padding: 24,
    paddingTop: 50,
    alignItems: "center",
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  avatarText: {
    color: Colors.primary,
    fontSize: 24,
    fontWeight: "bold",
  },

  profileName: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },

  profileSub: {
    color: "#BFDBFE",
    fontSize: 13,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
    marginHorizontal: 16,
  },

  // ── Menu ──
  menuSection: {
    paddingHorizontal: 12,
    flex: 1,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 4,
    gap: 14,
  },

  menuItemActive: {
    backgroundColor: Colors.primary + "15",   // 15 = ~8% opacity
  },

  menuItemPressed: {
    backgroundColor: Colors.border,
  },

  menuLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.text,
  },

  menuLabelActive: {
    color: Colors.primary,
    fontWeight: "700",
  },

  // ── Footer ──
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginHorizontal: 12,
    marginTop: 8,
  },

  footerText: {
    color: Colors.gray,
    fontSize: 12,
    fontWeight: "500",
  },

  footerVersion: {
    color: Colors.gray,
    fontSize: 11,
    marginTop: 2,
  },
});
