// Path: app/(drawer)/_layout.tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Dimensions, Platform } from "react-native";
import { CustomDrawerContent } from "@/components/navigation/custom-drawer-content";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCallback } from "react";
import { THEME_COLORS } from "@/src/styles/colors";
import { DrawerActions, useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function DrawerLayout() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const isLargeScreen = width >= 1024;

  // Use permanent drawer apenas em telas grandes na web
  const isPermanentDrawer = isWeb && isLargeScreen;

  // Define diferentes larguras para web e mobile
  const drawerWidth = isPermanentDrawer
    ? Math.min(width * 0.25, 300) // Para web em telas grandes, 25% da largura até max 300px
    : width * 0.75; // Para mobile e web em telas pequenas, 75% da largura

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerPosition: "left",
          drawerType: isPermanentDrawer ? "permanent" : "front", // Permanente na web em telas grandes
          drawerStyle: {
            width: drawerWidth,
            backgroundColor: "white",
            borderRightWidth: isPermanentDrawer ? 1 : 0,
            borderRightColor: "#e2e8f0",
          },
          overlayColor: "rgba(0, 0, 0, 0.5)",
          swipeEnabled: !isPermanentDrawer, // Permitir swipe apenas em dispositivos móveis e web em telas pequenas
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Início",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="admin"
          options={{
            drawerLabel: "Painel Administrativo",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="(auth)"
          options={{
            drawerLabel: "Login",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="support"
          options={{
            drawerLabel: "Suporte",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="about"
          options={{
            drawerLabel: "Quem Somos",
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
