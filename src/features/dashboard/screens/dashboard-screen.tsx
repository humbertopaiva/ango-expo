// src/features/dashboard/screens/dashboard-screen.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import {
  Package,
  Star,
  FileText,
  Truck,
  HelpCircle,
  ArrowRight,
  User,
  Menu,
  Grid2X2,
} from "lucide-react-native";
import Animated, {
  FadeInUp,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import useAuthStore from "@/src/stores/auth";

import { DrawerActions } from "@react-navigation/native";
import { ResilientImage } from "@/components/common/resilient-image";
import { useCompanyData } from "@/src/hooks/use-company-data";
import { THEME_COLORS } from "@/src/styles/colors";
import { HStack } from "@gluestack-ui/themed";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 2 cards por linha com margem total de 48

export default function DashboardScreen() {
  const profile = useAuthStore((state) => state.profile);
  const { company, loading } = useCompanyData();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);

  const greeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Bom dia";
    if (hours < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Menu items configuration
  const menuItems = [
    {
      id: "categories",
      title: "Categorias",
      icon: Grid2X2,
      color: "#4CAF50",
      path: "/admin/categories",
      delay: 100,
    },
    {
      id: "products",
      title: "Produtos",
      icon: Package,
      color: "#2196F3",
      path: "/admin/products",
      delay: 200,
    },
    {
      id: "vitrine",
      title: "Destaques",
      icon: Star,
      color: "#FFC107",
      path: "/admin/vitrine",
      delay: 300,
    },
    {
      id: "leaflets",
      title: "Encartes",
      icon: FileText,
      color: "#9C27B0",
      path: "/admin/leaflets",
      delay: 400,
    },
    {
      id: "delivery",
      title: "Delivery",
      icon: Truck,
      color: "#F44336",
      path: "/admin/delivery-config",
      delay: 500,
    },
    {
      id: "profile",
      title: "Perfil",
      icon: User,
      color: "#009688",
      path: "/admin/profile",
      delay: 600,
    },
  ];

  // Animated card press
  const handlePressIn = () => {
    scale.value = withTiming(0.95, {
      duration: 200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  const animatedSupportCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

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
          {/* Logo da empresa */}
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
        <Animated.View
          entering={FadeInDown.duration(800).delay(100)}
          style={styles.greetingContainer}
        >
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
            <Text style={styles.userName} className="font-bold text-xl">
              {company?.nome || "Empresa"}
            </Text>
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
        </Animated.View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.duration(600).delay(item.delay)}
              style={styles.cardContainer}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.menuCard, { borderColor: item.color + "20" }]}
                onPress={() => router.push(item.path as any)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: item.color + "15" },
                  ]}
                >
                  <item.icon size={24} color={item.color} />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <ArrowRight size={16} color="#9CA3AF" style={styles.cardIcon} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Support Card */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(700)}
          style={[styles.supportCardContainer, animatedSupportCardStyle]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.supportCard}
            onPress={() => router.push("/(drawer)/support")}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <LinearGradient
              colors={[primaryColor, "#6200EE"]} // Usar a cor primária da empresa
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.supportGradient}
            >
              <View style={styles.supportContent}>
                <View style={styles.supportIconContainer}>
                  <HelpCircle size={32} color="white" />
                </View>
                <Text style={styles.supportTitle}>Área de Suporte</Text>
                <Text style={styles.supportText}>
                  Precisa de ajuda? Nossa equipe está disponível para atendê-lo.
                </Text>
                <View style={styles.supportButton}>
                  <Text style={styles.supportButtonText}>Acessar Suporte</Text>
                  <ArrowRight size={16} color="white" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
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
    width: 150,
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
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
  menuCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: 120,
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginTop: 8,
  },
  cardIcon: {
    alignSelf: "flex-end",
  },
  supportCardContainer: {
    marginBottom: 16,
  },
  supportCard: {
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  supportGradient: {
    padding: 20,
  },
  supportContent: {
    padding: 4,
  },
  supportIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  supportTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 24,
  },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  supportButtonText: {
    color: "white",
    fontWeight: "600",
    marginRight: 8,
  },
  // Novo container para a empresa com logo
  companyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  // Estilo para o container da logo da empresa
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
  // Estilo para a logo da empresa (pequena, ao lado do nome)
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
