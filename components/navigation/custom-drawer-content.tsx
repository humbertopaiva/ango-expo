// components/navigation/custom-drawer-content.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { router, useNavigation } from "expo-router";
import useAuthStore from "@/src/stores/auth";
import {
  Home,
  Settings,
  LogIn,
  LogOut,
  HelpCircle,
  Info,
  Package,
  X,
} from "lucide-react-native";
import { DrawerActions } from "@react-navigation/native";

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const profile = useAuthStore((state) => state.profile);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    clearAuth();
    router.replace("/(drawer)/(tabs)/comercio-local");
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const handleLogin = () => {
    router.push("/(drawer)/(auth)/login");
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const handleCloseDrawer = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const primaryColor = "#F4511E"; // Cor primária do app
  const secondaryColor = "#6200EE"; // Cor secundária do app
  const primaryLightColor = "#FBE9E7"; // Versão mais clara da cor primária

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            Platform.OS === "ios" ? insets.top : StatusBar.currentHeight,
        },
      ]}
    >
      {/* Header com Logo e botão de fechar */}
      <View style={[styles.header, { backgroundColor: primaryLightColor }]}>
        <Image
          source={require("@/assets/images/logo-white.png")}
          style={styles.logo}
        />
        <TouchableOpacity
          onPress={handleCloseDrawer}
          style={styles.closeButton}
        >
          <X size={24} color={primaryColor} />
        </TouchableOpacity>
      </View>

      {/* Perfil da Empresa (se autenticado) */}
      {isAuthenticated && profile && (
        <View style={styles.profileContainer}>
          <View
            style={[
              styles.profileImage,
              { backgroundColor: primaryLightColor },
            ]}
          >
            <Package size={24} color={primaryColor} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profile.company_id ? "Empresa" : "Usuário"}
            </Text>
            <Text style={styles.profileEmail}>
              {profile.company_id || "Conta pessoal"}
            </Text>
          </View>
        </View>
      )}

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Seção Principal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MENU PRINCIPAL</Text>

          <DrawerItem
            label="Início"
            labelStyle={styles.drawerItemLabel}
            icon={({ size }) => <Home size={size} color={primaryColor} />}
            onPress={() => {
              router.replace("/(drawer)/(tabs)/comercio-local");
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
          />

          {isAuthenticated && (
            <DrawerItem
              label="Gerenciar"
              labelStyle={styles.drawerItemLabel}
              icon={({ size }) => <Settings size={size} color={primaryColor} />}
              onPress={() => {
                router.push("/(drawer)/admin/dashboard");
                navigation.dispatch(DrawerActions.closeDrawer());
              }}
            />
          )}

          <DrawerItem
            label="Suporte"
            labelStyle={styles.drawerItemLabel}
            icon={({ size }) => <HelpCircle size={size} color={primaryColor} />}
            onPress={() => {
              router.push("/(drawer)/support");
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
          />

          <DrawerItem
            label="Quem Somos"
            labelStyle={styles.drawerItemLabel}
            icon={({ size }) => <Info size={size} color={primaryColor} />}
            onPress={() => {
              router.push("/(drawer)/about");
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
          />
        </View>

        {/* Linha divisória */}
        <View style={styles.divider} />

        {/* Seção de Conta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTA</Text>

          {isAuthenticated ? (
            <DrawerItem
              label="Sair"
              labelStyle={[styles.drawerItemLabel, { color: "#EF4444" }]}
              icon={({ size }) => <LogOut size={size} color="#EF4444" />}
              onPress={handleLogout}
            />
          ) : (
            <DrawerItem
              label="Entrar"
              labelStyle={styles.drawerItemLabel}
              icon={({ size }) => <LogIn size={size} color={primaryColor} />}
              onPress={handleLogin}
            />
          )}
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>Versão 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  logo: {
    height: 40,
    width: 120,
    resizeMode: "contain",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  profileContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
  },
  profileEmail: {
    fontSize: 14,
    color: "#6B7280",
  },
  scrollContent: {
    paddingTop: 0,
  },
  section: {
    padding: 8,
  },
  sectionTitle: {
    marginLeft: 16,
    marginBottom: 8,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  drawerItemLabel: {
    color: "#374151",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
    marginHorizontal: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  versionText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
  },
});
