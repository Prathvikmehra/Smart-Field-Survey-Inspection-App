import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useRouter, usePathname } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

// All drawer menu items
const MENU_ITEMS = [
  { label: "Dashboard",  icon: "home-outline",      route: "/(drawer)/(tabs)/"       },
  { label: "Survey",     icon: "clipboard-outline",  route: "/(drawer)/(tabs)/survey" },
  { label: "Camera",     icon: "camera-outline",     route: "/camera"                 },
  { label: "Contacts",   icon: "people-outline",     route: "/(drawer)/contacts"      },
  { label: "Location",   icon: "location-outline",   route: "/(drawer)/location"      },
  { label: "Clipboard",  icon: "copy-outline",       route: "/(drawer)/clipboard"     },
  { label: "Settings",   icon: "settings-outline",   route: "/(drawer)/settings"      },
];

function CustomDrawerContent(props) {
  const router   = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();

  function navigate(route) {
    props.navigation.closeDrawer();
    router.push(route);
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={[
      { flex: 1 },
      { backgroundColor: colors.background }
    ]}>

      {/* Blue profile header */}
      <View style={[styles.profileBox, { backgroundColor: colors.primary }]}>
        <View style={styles.avatar}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>PM</Text>
        </View>
        <Text style={styles.profileName}>Prathvik Mehra</Text>
        <Text style={[styles.profileSub, { color: colors.primary === "#2563EB" ? "#BFDBFE" : "#2d3748" }]}>Enrollment: 23CS001</Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Menu items */}
      <View style={styles.menuSection}>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.route.replace("/index", "").replace("/(tabs)/", "/(tabs)"));
          return (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.menuItem,
                isActive && [styles.menuItemActive, { backgroundColor: colors.primary + "18" }],
                pressed  && [styles.menuItemPressed, { backgroundColor: colors.border }],
              ]}
              onPress={() => navigate(item.route)}
            >
              <Ionicons 
                name={item.icon} 
                size={22} 
                color={isActive ? colors.primary : colors.gray} 
              />
              <Text style={[
                styles.menuLabel, 
                { color: colors.text },
                isActive && [styles.menuLabelActive, { color: colors.primary }]
              ]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.gray }]}>Smart Survey & Inspection App</Text>
        <Text style={[styles.footerVersion, { color: colors.gray }]}>v1.0  •  Modules 1 – 3</Text>
      </View>

    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName="(tabs)"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle:      { width: 280 },
          overlayColor:     "rgba(0,0,0,0.5)",
          swipeEdgeWidth:   60,
        }}
      >
        <Drawer.Screen name="(tabs)"    options={{ drawerLabel: "Dashboard" }} />
        <Drawer.Screen name="contacts"  options={{ drawerLabel: "Contacts"  }} />
        <Drawer.Screen name="location"  options={{ drawerLabel: "Location"  }} />
        <Drawer.Screen name="clipboard" options={{ drawerLabel: "Clipboard" }} />
        <Drawer.Screen name="settings"  options={{ drawerLabel: "Settings"  }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  profileBox: {
    padding: 24,
    paddingTop: 48,
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
  avatarText:   { fontSize: 24, fontWeight: "bold" },
  profileName:  { color: "white",  fontSize: 17, fontWeight: "700" },
  profileSub:   { fontSize: 13, marginTop: 2 },
  divider:      { height: 1, marginVertical: 8, marginHorizontal: 16 },
  menuSection:  { paddingHorizontal: 12, flex: 1 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 4,
    gap: 14,
  },
  menuLabel:       { fontSize: 15, fontWeight: "500" },
  menuLabelActive: { fontWeight: "700" },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    marginHorizontal: 12,
    marginTop: 8,
  },
  footerText:    { fontSize: 12, fontWeight: "500" },
  footerVersion: { fontSize: 11, marginTop: 2 },
});
