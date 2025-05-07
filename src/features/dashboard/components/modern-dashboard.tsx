// Path: src/features/dashboard/components/modern-dashboard.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import {
  Package,
  Star,
  FileText,
  Truck,
  User,
  BarChart,
  ExternalLink,
  Link,
  HelpCircle,
  ChevronRight,
} from "lucide-react-native";
import { ResilientImage } from "@/components/common/resilient-image";
import { THEME_COLORS } from "@/src/styles/colors";
import { CompanyDetails } from "../hooks/use-company-details";
import * as Clipboard from "expo-clipboard";
import { Linking, Alert } from "react-native";

// Obter dimensões da tela para posicionamento
const { height } = Dimensions.get("window");

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
      description: "Gerencie seu catálogo de produtos, categorias e variações",
      icon: Package,
      iconColor: "#2196F3",
      path: "/admin/products",
    },
    {
      id: "vitrine",
      title: "Destaques",
      description: "Configure produtos em destaque na sua vitrine virtual",
      icon: Star,
      iconColor: "#FFC107",
      path: "/admin/vitrine",
    },
    {
      id: "leaflets",
      title: "Encartes",
      description: "Crie e gerencie seus encartes promocionais",
      icon: FileText,
      iconColor: "#9C27B0",
      path: "/admin/leaflets",
    },
    {
      id: "delivery",
      title: "Delivery",
      description: "Configure suas opções de entrega e retirada",
      icon: Truck,
      iconColor: "#F44336",
      path: "/admin/delivery-config",
    },
    {
      id: "profile",
      title: "Perfil",
      description: "Edite os dados do seu negócio e personalize sua loja",
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
    <View style={styles.container} className="bg-gray-50">
      {/* Conteúdo com scroll */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
                <Text style={styles.categoryText}>
                  {company.categoria.nome}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick action buttons */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={navigateToProfile}
            activeOpacity={0.7}
          >
            <ExternalLink size={20} color={THEME_COLORS.primary} />
            <Text style={styles.actionText}>Ver Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={navigateToLinks}
            activeOpacity={0.7}
          >
            <Link size={20} color={THEME_COLORS.primary} />
            <Text style={styles.actionText}>Links Externos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleReportsPress}
            activeOpacity={0.7}
          >
            <BarChart size={20} color={THEME_COLORS.primary} />
            <Text style={styles.actionText}>Relatórios</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Cards de gerenciamento (lista vertical) */}
        <Text style={styles.sectionTitle}>Gerenciar</Text>

        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => onMenuItemPress(item.path)}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${item.iconColor}15` },
                ]}
              >
                <item.icon size={24} color={item.iconColor} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        ))}

        {/* Espaço adicional no final da lista para não ficar escondido atrás do botão fixo */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Support button fixo e sobreposto */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.supportButton}
          onPress={() => onMenuItemPress("/(drawer)/support")}
          activeOpacity={0.8}
        >
          <HelpCircle size={20} color="#ffffff" />
          <Text style={styles.supportText}>Suporte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20, // Espaço adicional para o botão flutuante
  },
  companyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
    marginBottom: 16,
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
    backgroundColor: "#e1e1e1",
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 8,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  // Estilo para o botão flutuante
  floatingButtonContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 30 : 20,
    left: 20,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999, // Garante que fique acima de todos os outros elementos
  },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
    width: "100%",
  },
  supportText: {
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
});
