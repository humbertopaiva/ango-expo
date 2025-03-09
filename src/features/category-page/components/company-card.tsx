// Path: src/features/category-page/components/company-card.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { CategoryCompany } from "../models/category-company";
import { ImagePreview } from "@/components/custom/image-preview";
import { router } from "expo-router";
import { Store, MapPin, Clock, Phone } from "lucide-react-native";
import { HStack, VStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";
import { isBusinessOpen, formatBusinessHours } from "../utils/business-hours";

interface CompanyCardProps {
  company: CategoryCompany;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const navigateToCompany = () => {
    router.push(`/(drawer)/empresa/${company.empresa.slug}`);
  };

  // Verificar se o comércio está aberto
  const isOpen = isBusinessOpen(company.perfil);

  // Obter o horário formatado
  const businessHours = formatBusinessHours(company.perfil);

  // Filtrar para pegar apenas 3 subcategorias para exibir
  const topSubcategories = company.empresa.subcategorias
    .slice(0, 3)
    .map((relation) => relation.subcategorias_empresas_id);

  return (
    <Pressable
      onPress={navigateToCompany}
      style={({ pressed }) => [
        styles.container,
        {
          opacity: pressed ? 0.9 : 1,
          backgroundColor: "white",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        },
      ]}
    >
      <HStack space="md">
        {/* Logo */}
        <View
          style={{
            height: 70,
            width: 70,
            borderRadius: 12,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#E5E7EB",
            backgroundColor: "white",
            position: "relative",
          }}
        >
          {company.perfil.logo ? (
            <ImagePreview
              uri={company.perfil.logo}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F9FAFB",
              }}
            >
              <Store size={24} color={THEME_COLORS.primary} />
            </View>
          )}

          {/* Badge de status (Aberto/Fechado) */}
          <View
            style={{
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: [{ translateX: -30 }],
              backgroundColor: isOpen ? "#10B981" : "#6B7280",
              paddingHorizontal: 10,
              paddingVertical: 2,
              borderRadius: 999,
              minWidth: 60,
              alignItems: "center",
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.5,
                },
                android: {
                  elevation: 2,
                },
              }),
            }}
          >
            <Text style={{ color: "white", fontSize: 10, fontWeight: "600" }}>
              {isOpen ? "ABERTO" : "FECHADO"}
            </Text>
          </View>
        </View>

        {/* Informações */}
        <VStack space="xs" style={{ flex: 1 }}>
          <HStack
            style={{
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#1F2937",
                flex: 1,
              }}
            >
              {company.perfil.nome}
            </Text>

            {/* Cor do estabelecimento (se disponível) */}
            {company.perfil.cor_primaria && (
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: company.perfil.cor_primaria,
                  marginLeft: 4,
                }}
              />
            )}
          </HStack>

          {/* Subcategorias como tags */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 4,
              marginTop: 4,
            }}
          >
            {topSubcategories.map((subcategory) => (
              <View
                key={subcategory.id}
                style={{
                  backgroundColor: `${THEME_COLORS.primary}10`,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 999,
                }}
              >
                <Text style={{ fontSize: 11, color: THEME_COLORS.primary }}>
                  {subcategory.nome}
                </Text>
              </View>
            ))}

            {company.empresa.subcategorias.length > 3 && (
              <Text style={{ fontSize: 11, color: "#6B7280", marginLeft: 4 }}>
                +{company.empresa.subcategorias.length - 3} mais
              </Text>
            )}
          </View>

          {/* Informações adicionais */}
          <HStack style={{ marginTop: 8 }}>
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <Clock size={12} color="#6B7280" style={{ marginRight: 4 }} />
              <Text style={{ fontSize: 11, color: "#6B7280" }}>
                {businessHours}
              </Text>
            </View>

            {/* Delivery badge */}
            {company.empresa.subcategorias.some(
              (sub) => sub.subcategorias_empresas_id.slug === "delivery"
            ) && (
              <View
                style={{
                  backgroundColor: `${THEME_COLORS.primary}10`,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 999,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: THEME_COLORS.primary,
                    fontWeight: "500",
                  }}
                >
                  Delivery
                </Text>
              </View>
            )}
          </HStack>

          {/* Linha de adicionais em forma de ícones */}
          {company.perfil.adicionais &&
            company.perfil.adicionais.length > 0 && (
              <View
                style={{ flexDirection: "row", marginTop: 4, flexWrap: "wrap" }}
              >
                {company.perfil.adicionais.includes("wifi") && (
                  <View style={styles.additionalBadge}>
                    <Text style={styles.additionalText}>WiFi</Text>
                  </View>
                )}
                {company.perfil.adicionais.includes("estacionamento") && (
                  <View style={styles.additionalBadge}>
                    <Text style={styles.additionalText}>Estacionamento</Text>
                  </View>
                )}
                {company.perfil.adicionais.includes("retirada") && (
                  <View style={styles.additionalBadge}>
                    <Text style={styles.additionalText}>Retirada</Text>
                  </View>
                )}
              </View>
            )}
        </VStack>
      </HStack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
    }),
  },
  additionalBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  additionalText: {
    fontSize: 9,
    color: "#6B7280",
  },
});
