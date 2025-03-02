// Path: src/features/dashboard/screens/dashboard-screen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import {
  Package,
  Star,
  FileText,
  Truck,
  User,
  Menu,
  Grid2X2,
} from "lucide-react-native";
import { DrawerActions } from "@react-navigation/native";
import useAuthStore from "@/src/stores/auth";

import { ResilientImage } from "@/components/common/resilient-image";
import { useCompanyData } from "@/src/hooks/use-company-data";
import { THEME_COLORS } from "@/src/styles/colors";
import { DashboardMenuCard } from "../components/dashboard-menu-card";
import { DashboardSupportCard } from "../components/dashboard-support-card";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 2 cards por linha com margem total de 48

export default function DashboardScreen() {
  const { company } = useCompanyData();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Menu items configuration
  const menuItems = [
    {
      id: "categories",
      title: "Categorias",
      icon: Grid2X2,
      color: "#4CAF50",
      path: "/admin/categories",
    },
    {
      id: "products",
      title: "Produtos",
      icon: Package,
      color: "#2196F3",
      path: "/admin/products",
    },
    {
      id: "vitrine",
      title: "Destaques",
      icon: Star,
      color: "#FFC107",
      path: "/admin/vitrine",
    },
    {
      id: "leaflets",
      title: "Encartes",
      icon: FileText,
      color: "#9C27B0",
      path: "/admin/leaflets",
    },
    {
      id: "delivery",
      title: "Delivery",
      icon: Truck,
      color: "#F44336",
      path: "/admin/delivery-config",
    },
    {
      id: "profile",
      title: "Perfil",
      icon: User,
      color: "#009688",
      path: "/admin/profile",
    },
  ];

  // Determinar a cor primária da empresa ou usar o padrão
  const primaryColor = THEME_COLORS.primary;

  return (
    <View style={styles.container}>
      {/* Header personalizado */}
      <View
        style={[
          styles.header,
          { backgroundColor: primaryColor, paddingTop: insets.top },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            {company?.logo ? (
              <ResilientImage
                source={require("@/assets/images/logo-white.png")}
                style={styles.logo}
                resizeMode="contain"
                fallbackSource={require("@/assets/images/logo-white.png")}
                className="w-14"
              />
            ) : (
              <Image
                source={require("@/assets/images/logo-white.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            )}
          </View>

          {/* Botão do menu */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          >
            <Menu size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Greeting Section */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Bem-vindo,</Text>

          {/* Empresa com Logo */}
          <View style={styles.companyContainer}>
            {/* Logo pequena */}
            {company?.logo ? (
              <View style={styles.companyLogoContainer}>
                <ResilientImage
                  source={company.logo}
                  style={styles.companyLogo}
                  resizeMode="cover"
                  fallbackSource={require("@/assets/images/logo-white.png")}
                />
              </View>
            ) : (
              <View
                style={[
                  styles.companyLogoContainer,
                  { backgroundColor: primaryColor + "20" },
                ]}
              >
                <Package size={20} color={primaryColor} />
              </View>
            )}

            {/* Nome da empresa */}
            <Text style={styles.userName}>{company?.nome || "Empresa"}</Text>
          </View>

          {/* Badge de categoria */}
          {company?.categoria?.nome && (
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: primaryColor + "15" },
              ]}
            >
              <Text style={[styles.categoryText, { color: primaryColor }]}>
                {company.categoria.nome}
              </Text>
            </View>
          )}
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <View key={item.id} style={styles.cardContainer}>
              <DashboardMenuCard
                title={item.title}
                icon={item.icon}
                color={item.color}
                onPress={() => router.push(item.path as any)}
              />
            </View>
          ))}
        </View>

        {/* Support Card */}
        <View style={styles.supportCardContainer}>
          <DashboardSupportCard
            primaryColor={primaryColor}
            onPress={() => router.push("/(drawer)/support")}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#F4511E",
  },
  headerContent: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  logoContainer: {
    height: 40,
    width: 150,
    justifyContent: "center",
  },
  logo: {
    height: 40,
    width: 80,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  greetingContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: "#6B7280",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  cardContainer: {
    width: cardWidth,
    marginBottom: 16,
  },
  supportCardContainer: {
    marginBottom: 16,
  },
  // Estilos para a empresa com logo
  companyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  companyLogoContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  companyLogo: {
    width: 36,
    height: 36,
  },
  // Estilo para o badge de categoria
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
