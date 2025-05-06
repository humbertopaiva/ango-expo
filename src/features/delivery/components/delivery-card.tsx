// Path: src/features/delivery/components/delivery-card.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { StatusBadge } from "@/components/custom/status-badge";
import { DeliveryProfile } from "../models/delivery-profile";
import { DeliveryShowcaseItem } from "../models/delivery-showcase-item";
import { ImagePreview } from "@/components/custom/image-preview";
import { THEME_COLORS } from "@/src/styles/colors";
import { router } from "expo-router";
import { checkIfOpen } from "../hooks/use-delivery-page";
import {
  Store,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ArrowRight,
} from "lucide-react-native";
import { Linking, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";

interface DeliveryCardProps {
  profile: DeliveryProfile;
  showcaseItems?: DeliveryShowcaseItem[];
  index: number;
}

const { width } = Dimensions.get("window");
const cardWidth = width > 500 ? width / 2 - 24 : width - 32;

export function DeliveryCard({
  profile,
  showcaseItems = [],
  index,
}: DeliveryCardProps) {
  const isOpen = checkIfOpen(profile);
  const hasShowcase = showcaseItems && showcaseItems.length > 0;

  // Formatar preço
  const formatCurrency = (price: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(price.replace(",", ".")));
  };

  // Função para abrir WhatsApp
  const handleWhatsAppClick = () => {
    if (!profile.whatsapp) return;

    const phoneNumber = profile.whatsapp.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${phoneNumber}`;

    Linking.openURL(whatsappUrl).catch((err) => {
      console.error("Erro ao abrir WhatsApp:", err);
    });
  };

  // Função para fazer ligação
  const handlePhoneClick = () => {
    if (!profile.whatsapp) return;

    const phoneNumber = profile.whatsapp.replace(/\D/g, "");
    const telUrl = `tel:${phoneNumber}`;

    Linking.openURL(telUrl).catch((err) => {
      console.error("Erro ao fazer ligação:", err);
    });
  };

  // Navegar para empresa
  const navigateToCompany = () => {
    if (!profile.empresa?.slug) return;
    router.push(`/(drawer)/empresa/${profile.empresa.slug}`);
  };

  // Determinar cor de fundo baseada na cor primária da empresa
  const backgroundColor = profile.cor_primaria || THEME_COLORS.primary;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(400)}
      style={[styles.container, { width: cardWidth }]}
    >
      {/* Banner e overlay */}
      <TouchableOpacity activeOpacity={0.9} onPress={navigateToCompany}>
        <View style={styles.bannerContainer}>
          {profile.banner ? (
            <Image
              source={{ uri: profile.banner }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.fallbackBanner, { backgroundColor }]} />
          )}
          <LinearGradient
            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
            style={styles.gradientOverlay}
          />
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            {profile.logo ? (
              <ImagePreview
                uri={profile.logo}
                width="100%"
                height="100%"
                resizeMode="cover"
                containerClassName="rounded-xl"
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

        {/* Informações da empresa */}
        <View style={styles.companyInfoContainer}>
          <Text style={styles.companyName} numberOfLines={1}>
            {profile.nome}
          </Text>

          {/* Categorias */}
          {profile.empresa?.subcategorias && (
            <View style={styles.categoriesContainer}>
              {profile.empresa.subcategorias
                .slice(0, 2)
                .map((sub, subIndex) => (
                  <View
                    key={`${profile.id}-category-${
                      sub.subcategorias_empresas_id.id || subIndex
                    }`}
                    style={styles.categoryBadge}
                  >
                    <Text style={styles.categoryName}>
                      {sub.subcategorias_empresas_id.nome}
                    </Text>
                  </View>
                ))}
              {profile.empresa.subcategorias.length > 2 && (
                <Text style={styles.moreCategories}>
                  +{profile.empresa.subcategorias.length - 2}
                </Text>
              )}
            </View>
          )}

          {/* Endereço */}
          {profile.endereco && (
            <View style={styles.infoRow}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.infoText} numberOfLines={1}>
                {profile.endereco}
              </Text>
            </View>
          )}

          {/* Horário */}
          <View style={styles.infoRow}>
            <Clock size={14} color={isOpen ? "#10B981" : "#6B7280"} />
            <Text
              style={[
                styles.infoText,
                isOpen && { color: "#10B981", fontWeight: "500" },
              ]}
            >
              {isOpen ? "Aberto agora" : "Fechado no momento"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Vitrine de produtos se existir */}
      {hasShowcase && (
        <View style={styles.showcaseContainer}>
          <Text style={styles.showcaseTitle}>Em destaque</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.showcaseScroll}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
          >
            {showcaseItems.slice(0, 5).map((item, itemIndex) => (
              <TouchableOpacity
                key={`${profile.id}-product-${item.id || itemIndex}`}
                style={styles.productCard}
                onPress={navigateToCompany}
              >
                <View style={styles.productImageContainer}>
                  {item.imagem ? (
                    <ImagePreview
                      uri={item.imagem}
                      width="100%"
                      height="100%"
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.fallbackProductImage}>
                      <Package size={24} color="#9CA3AF" />
                    </View>
                  )}

                  {/* Badge de promoção */}
                  {item.preco_promocional && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>
                        {Math.round(
                          ((parseFloat(item.preco.replace(",", ".")) -
                            parseFloat(
                              item.preco_promocional.replace(",", ".")
                            )) /
                            parseFloat(item.preco.replace(",", "."))) *
                            100
                        )}
                        % OFF
                      </Text>
                    </View>
                  )}

                  {/* Badge de indisponível */}
                  {!item.disponivel && (
                    <View style={styles.unavailableOverlay}>
                      <Text style={styles.unavailableText}>Indisponível</Text>
                    </View>
                  )}
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.nome}
                  </Text>

                  {/* Preço */}
                  <View style={styles.priceContainer}>
                    {item.preco_promocional ? (
                      <>
                        <Text style={styles.promoPrice}>
                          {formatCurrency(item.preco_promocional)}
                        </Text>
                        <Text style={styles.originalPrice}>
                          {formatCurrency(item.preco)}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.price}>
                        {formatCurrency(item.preco)}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {/* Card "Ver Mais" */}
            {showcaseItems.length > 5 && (
              <TouchableOpacity
                style={styles.viewMoreCard}
                onPress={navigateToCompany}
                key={`${profile.id}-view-more`}
              >
                <View style={styles.viewMoreContent}>
                  <View style={styles.viewMoreIconContainer}>
                    <ArrowRight size={24} color={THEME_COLORS.primary} />
                  </View>
                  <Text style={styles.viewMoreText}>
                    Ver mais {showcaseItems.length - 5} produtos
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}

      {/* Botões de ação */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={navigateToCompany}
        >
          <Text style={styles.primaryButtonText}>Ver cardápio</Text>
          <ArrowRight size={16} color="white" />
        </TouchableOpacity>

        {profile.whatsapp && (
          <View style={styles.contactButtons}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handlePhoneClick}
            >
              <Phone size={18} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactButton, styles.whatsappButton]}
              onPress={handleWhatsAppClick}
            >
              <MessageCircle size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

// Importar o componente Package que faltou
import { Package } from "lucide-react-native";
import { ScrollView } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: "white",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  bannerContainer: {
    height: 150,
    width: "100%",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  fallbackBanner: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: -24,
    marginBottom: 8,
  },
  logoWrapper: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "white",
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
    overflow: "hidden",
  },
  fallbackLogo: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  companyInfoContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: `${THEME_COLORS.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: THEME_COLORS.primary,
    fontWeight: "500",
  },
  moreCategories: {
    fontSize: 12,
    color: "#6B7280",
    alignSelf: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 8,
  },
  showcaseContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 16,
    paddingBottom: 8,
  },
  showcaseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  showcaseScroll: {
    flexGrow: 0,
  },
  productCard: {
    width: 140,
    height: 200,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
  },
  productImageContainer: {
    height: 100,
    width: "100%",
    position: "relative",
  },
  fallbackProductImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#EF4444",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  discountText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  unavailableText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "column",
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME_COLORS.primary,
  },
  promoPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME_COLORS.primary,
  },
  originalPrice: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  viewMoreCard: {
    width: 120,
    height: 172,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  viewMoreContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  viewMoreIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${THEME_COLORS.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1F2937",
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    padding: 16,
    paddingTop: 8,
    alignItems: "center",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginRight: 6,
  },
  contactButtons: {
    flexDirection: "row",
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
  },
});
