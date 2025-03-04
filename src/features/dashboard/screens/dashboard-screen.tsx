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

import { ResilientImage } from "@/components/common/resilient-image";
import { THEME_COLORS } from "@/src/styles/colors";
import { DashboardMenuCard } from "../components/dashboard-menu-card";
import { DashboardSupportCard } from "../components/dashboard-support-card";
import { useCompanyDetails } from "../hooks/use-company-details";
import { SimpleDashboardCompanyCard } from "../components/dashboard-company-card";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 2 cards por linha com margem total de 48

export default function DashboardScreen() {
  const { company, isLoading, error } = useCompanyDetails();
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

  const subcategoryNames = React.useMemo(() => {
    if (!company?.subcategorias?.length) return [];

    return company.subcategorias
      .filter((item) => item.subcategorias_empresas_id?.nome)
      .map((item) => item.subcategorias_empresas_id.nome);
  }, [company?.subcategorias]);

  return (
    <View style={styles.container}>
      {/* Header personalizado com cor fixa */}
      <View
        style={[
          styles.header,
          { backgroundColor: THEME_COLORS.primary, paddingTop: insets.top },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/logo-white.png")}
              style={styles.logo}
              resizeMode="contain"
            />
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
        {/* Empresa Card - Versão simplificada que não tenta usar navegação */}
        <SimpleDashboardCompanyCard
          name={company?.nome || "Minha Empresa"}
          logo={company?.logo}
          categoryName={company?.categoria?.nome}
          subcategoryNames={subcategoryNames}
          primaryColor={company?.cor_primaria}
          slug={company?.slug}
        />

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
            primaryColor={THEME_COLORS.primary}
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
});
