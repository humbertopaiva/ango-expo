// Path: src/features/dashboard/components/modern-dashboard.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  Package,
  Star,
  FileText,
  Truck,
  User,
  Grid2X2,
  BarChart,
  ExternalLink,
  Link,
  HelpCircle,
} from "lucide-react-native";
import { ResilientImage } from "@/components/common/resilient-image";
import { THEME_COLORS } from "@/src/styles/colors";
import { CompanyDetails } from "../hooks/use-company-details";
import * as Clipboard from "expo-clipboard";
import { Linking, Alert, Platform } from "react-native";

interface ModernDashboardProps {
  company: CompanyDetails | null;
  isLoading: boolean;
  onMenuItemPress: (path: string) => void;
}

export function ModernDashboard({
  company,
  isLoading,
  onMenuItemPress,
}: ModernDashboardProps) {
  // Menu items with configuration
  const menuItems = [
    {
      id: "products",
      title: "Produtos",
      icon: Package,
      iconColor: "#2196F3",
      path: "/admin/products",
    },
    {
      id: "vitrine",
      title: "Destaques",
      icon: Star,
      iconColor: "#FFC107",
      path: "/admin/vitrine",
    },
    {
      id: "leaflets",
      title: "Encartes",
      icon: FileText,
      iconColor: "#9C27B0",
      path: "/admin/leaflets",
    },
    {
      id: "delivery",
      title: "Delivery",
      icon: Truck,
      iconColor: "#F44336",
      path: "/admin/delivery-config",
    },
    {
      id: "profile",
      title: "Perfil",
      icon: User,
      iconColor: "#009688",
      path: "/admin/profile",
    },
  ];

  // Function to open company profile
  const navigateToProfile = () => {
    if (company?.slug) {
      Alert.alert(
        "Informação",
        "Navegando para o perfil da empresa: " + company.slug
      );
    } else {
      Alert.alert("Informação", "O perfil público ainda não está disponível");
    }
  };

  // Function to open external links page
  const navigateToLinks = async () => {
    if (company?.slug) {
      const externalLink = `https://limei.links/${company.slug}`;
      try {
        const canOpen = await Linking.canOpenURL(externalLink);
        if (canOpen) {
          await Linking.openURL(externalLink);
        } else {
          await copyExternalLink();
        }
      } catch (error) {
        console.error("Erro ao abrir link externo:", error);
        Alert.alert(
          "Erro",
          "Não foi possível abrir a página de links. O link foi copiado para a área de transferência.",
          [{ text: "OK", onPress: () => copyExternalLink() }]
        );
      }
    } else {
      Alert.alert("Erro", "Não foi possível gerar o link externo");
    }
  };

  // Function to copy link to clipboard
  const copyExternalLink = async () => {
    if (company?.slug) {
      const externalLink = `https://limei.links/${company.slug}`;
      try {
        await Clipboard.setStringAsync(externalLink);
        Alert.alert("Sucesso", "Link copiado para a área de transferência");
      } catch (error) {
        console.error("Erro ao copiar para clipboard:", error);
        if (Platform.OS === "web") {
          try {
            navigator.clipboard.writeText(externalLink);
            Alert.alert("Sucesso", "Link copiado para a área de transferência");
          } catch (webError) {
            Alert.alert("Erro", "Não foi possível copiar o link");
          }
        } else {
          Alert.alert("Erro", "Não foi possível copiar o link");
        }
      }
    }
  };

  // Handle reports button press
  const handleReportsPress = () => {
    Alert.alert(
      "Em breve",
      "A funcionalidade de relatórios estará disponível em breve!"
    );
  };

  // Get subcategory names
  const subcategoryNames = React.useMemo(() => {
    if (!company?.subcategorias?.length) return [];

    return company.subcategorias
      .filter((item) => item.subcategorias_empresas_id?.nome)
      .map((item) => item.subcategorias_empresas_id.nome);
  }, [company?.subcategorias]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME_COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Company info section */}
      <View style={styles.companyContainer}>
        <View style={styles.logoContainer}>
          {company?.logo ? (
            <ResilientImage
              source={company.logo}
              width={64}
              height={64}
              resizeMode="cover"
              style={styles.logo}
            />
          ) : (
            <View
              style={[
                styles.logoPlaceholder,
                {
                  backgroundColor: `${
                    company?.cor_primaria || THEME_COLORS.primary
                  }15`,
                },
              ]}
            >
              <User
                size={28}
                color={company?.cor_primaria || THEME_COLORS.primary}
              />
            </View>
          )}
        </View>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>
            {company?.nome || "Minha Empresa"}
          </Text>
          {company?.categoria?.nome && (
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{company.categoria.nome}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Quick action buttons */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={navigateToProfile}
        >
          <ExternalLink size={20} color="#1F2937" />
          <Text style={styles.actionText}>Ver Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={navigateToLinks}>
          <Link size={20} color="#1F2937" />
          <Text style={styles.actionText}>Links Externos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleReportsPress}
        >
          <BarChart size={20} color="#1F2937" />
          <Text style={styles.actionText}>Relatórios</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Main menu */}
      <Text style={styles.sectionTitle}>Gerenciar</Text>
      <View style={styles.menuGrid}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => onMenuItemPress(item.path)}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: `${item.iconColor}15` },
              ]}
            >
              <item.icon size={22} color={item.iconColor} />
            </View>
            <Text style={styles.menuItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Support button */}
      <TouchableOpacity
        style={styles.supportButton}
        onPress={() => onMenuItemPress("/(drawer)/support")}
      >
        <HelpCircle size={20} color="#ffffff" />
        <Text style={styles.supportText}>Suporte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  companyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    paddingBottom: 5,
  },
  logoContainer: {
    marginRight: 16,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  categoryPill: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 12,
    color: "#4B5563",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 4,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1F2937",
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  menuItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 24,
    paddingVertical: 12,
    marginVertical: 8,
  },
  supportText: {
    color: "#ffffff",
    fontWeight: "500",
    marginLeft: 8,
  },
});
