// Path: src/features/delivery/components/premium-delivery-card.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  StyleSheet,
} from "react-native";
import {
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  Store,
} from "lucide-react-native";
import { ResilientImage } from "@/components/common/resilient-image";
import { DeliveryProfile } from "../models/delivery-profile";
import { router } from "expo-router";
import { StatusBadge } from "@/components/custom/status-badge";
import { THEME_COLORS } from "@/src/styles/colors";
import { checkIfOpen } from "../hooks/use-delivery-page";
import { LinearGradient } from "expo-linear-gradient";

interface DeliveryCardProps {
  profile: DeliveryProfile;
}

export function DeliveryCard({ profile }: DeliveryCardProps) {
  // Verificação de segurança para garantir que o profile existe
  if (!profile) {
    return null;
  }

  // Função para verificar se está aberto de forma segura
  const isOpen = React.useMemo(() => {
    try {
      return checkIfOpen(profile);
    } catch (error) {
      console.error("Error checking if open:", error);
      return false; // Em caso de erro, considera fechado
    }
  }, [profile]);

  // Extrair subcategorias com segurança
  const subcategories = React.useMemo(() => {
    if (!profile.empresa || !profile.empresa.subcategorias) {
      return [];
    }

    if (!Array.isArray(profile.empresa.subcategorias)) {
      return [];
    }

    return profile.empresa.subcategorias.filter(
      (sub) => sub && sub.subcategorias_empresas_id
    );
  }, [profile]);

  // Manipuladores de eventos
  const handleWhatsAppClick = () => {
    try {
      if (!profile.whatsapp) return;

      const phoneNumber = profile.whatsapp.replace(/\D/g, "");
      const whatsappUrl = `https://wa.me/${phoneNumber}`;

      if (Platform.OS === "web") {
        window.open(whatsappUrl, "_blank");
      } else {
        Linking.openURL(whatsappUrl);
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
    }
  };

  const handlePhoneClick = () => {
    try {
      if (!profile.whatsapp) return;

      const phoneNumber = profile.whatsapp.replace(/\D/g, "");
      const telUrl = `tel:${phoneNumber}`;

      if (Platform.OS === "web") {
        window.open(telUrl, "_blank");
      } else {
        Linking.openURL(telUrl);
      }
    } catch (error) {
      console.error("Error making phone call:", error);
    }
  };

  const navigateToCompany = () => {
    try {
      if (!profile.empresa || !profile.empresa.slug) return;
      router.push(`/empresa/${profile.empresa.slug}`);
    } catch (error) {
      console.error("Error navigating to company:", error);
    }
  };

  // Background color for the card (use primary color or default)
  // Substitui preto por um tom mais suave
  let backgroundColor = profile.cor_primaria || THEME_COLORS.primary;
  if (backgroundColor === "#000000" || backgroundColor === "#000") {
    backgroundColor = "#2a2a2a";
  }

  return (
    <TouchableOpacity
      onPress={navigateToCompany}
      activeOpacity={0.9}
      style={[styles.container, { shadowColor: backgroundColor }]}
    >
      {/* Banner Background with Overlay */}
      <View style={styles.bannerContainer}>
        {profile.banner ? (
          <>
            <ResilientImage
              source={profile.banner}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["rgba(40,40,40,0.2)", "rgba(30,30,30,0.75)"]}
              style={styles.gradientOverlay}
            />
          </>
        ) : (
          <View style={[styles.fallbackBanner, { backgroundColor }]}>
            <LinearGradient
              colors={[`${backgroundColor}`, `#2a2a2aCC`]}
              style={styles.gradientOverlay}
            />
          </View>
        )}
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Top Section with Logo and Status */}
        <View style={styles.topSection}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            {profile.logo ? (
              <ResilientImage
                source={profile.logo}
                style={styles.logoImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.fallbackLogo, { backgroundColor }]}>
                <Store size={24} color="white" />
              </View>
            )}
          </View>

          {/* Status Badge */}
          <StatusBadge
            status={isOpen ? "aberto" : "fechado"}
            customLabel={isOpen ? "Aberto agora" : "Fechado"}
            className={isOpen ? "bg-green-100" : "bg-red-100"}
            textClassName={isOpen ? "text-green-800" : "text-red-800"}
          />
        </View>

        {/* Main Info */}
        <View style={styles.mainInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {profile.nome}
          </Text>

          {/* Categories */}
          {subcategories.length > 0 && (
            <View style={styles.categoriesContainer}>
              {subcategories.slice(0, 2).map((sub, index) => {
                if (!sub || !sub.subcategorias_empresas_id) return null;

                return (
                  <View
                    key={sub.subcategorias_empresas_id.id || `cat-${index}`}
                    style={styles.categoryBadge}
                  >
                    <Text style={styles.categoryText}>
                      {sub.subcategorias_empresas_id.nome}
                    </Text>
                  </View>
                );
              })}

              {subcategories.length > 2 && (
                <Text style={styles.moreCategories}>
                  +{subcategories.length - 2}
                </Text>
              )}
            </View>
          )}

          {/* Address */}
          {profile.endereco && (
            <View style={styles.addressContainer}>
              <MapPin size={14} color="white" />
              <Text style={styles.addressText} numberOfLines={1}>
                {profile.endereco}
              </Text>
            </View>
          )}

          {/* Opening hours */}
          <View style={styles.addressContainer}>
            <Clock size={14} color="white" />
            <Text style={styles.addressText}>
              {isOpen ? "Aberto agora" : "Fechado no momento"}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {/* View Menu Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={navigateToCompany}
          >
            <Text style={styles.primaryButtonText}>Ver cardápio</Text>
            <ChevronRight size={16} color="white" />
          </TouchableOpacity>

          {/* Contact Buttons */}
          {profile.whatsapp && (
            <View style={styles.contactButtons}>
              <TouchableOpacity
                style={styles.phoneButton}
                onPress={handlePhoneClick}
              >
                <Phone size={18} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.whatsappButton}
                onPress={handleWhatsAppClick}
              >
                <MessageCircle size={18} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: "#1a1a1a", // Tom mais suave de preto
  },
  bannerContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  fallbackBanner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2a2a2a", // Fundo mais suave quando não há banner
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(24, 24, 24, 0.4)", // Base adicional para suavizar
  },
  contentContainer: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "white",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  fallbackLogo: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  mainInfo: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  categoryText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  moreCategories: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginLeft: 4,
    alignSelf: "center",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  addressText: {
    marginLeft: 6,
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 13,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    marginRight: 4,
  },
  contactButtons: {
    flexDirection: "row",
  },
  phoneButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  whatsappButton: {
    backgroundColor: "#25D36680",
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
