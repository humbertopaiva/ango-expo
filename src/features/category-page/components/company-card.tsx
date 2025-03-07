// Path: src/features/category-page/components/company-card.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { CategoryCompany } from "../models/category-company";
import { ImagePreview } from "@/components/custom/image-preview";
import { router } from "expo-router";
import { Store, MapPin, Clock, Star } from "lucide-react-native";
import { HStack, VStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";

interface CompanyCardProps {
  company: CategoryCompany;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const navigateToCompany = () => {
    router.push(`/(drawer)/empresa/${company.slug}`);
  };

  // Filtra para pegar apenas 3 subcategorias para exibir
  const topSubcategories = company.subcategorias
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
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#F3F4F6",
        },
      ]}
    >
      {/* Imagem de capa */}
      <View style={{ height: 128, width: "100%", position: "relative" }}>
        {company.banner ? (
          <ImagePreview
            uri={company.banner}
            width="100%"
            height="100%"
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#F3F4F6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Store size={32} color={THEME_COLORS.primary} />
          </View>
        )}

        {/* Destaque/Badge caso tenha delivery */}
        {company.subcategorias.some(
          (sub) => sub.subcategorias_empresas_id.slug === "delivery"
        ) && (
          <View
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: THEME_COLORS.primary,
              borderRadius: 9999,
              paddingHorizontal: 12,
              paddingVertical: 4,
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
            <Text style={{ color: "white", fontSize: 12, fontWeight: "500" }}>
              Delivery
            </Text>
          </View>
        )}
      </View>

      <HStack space="md" style={{ padding: 16 }}>
        {/* Logo */}
        <View
          style={{
            height: 64,
            width: 64,
            borderRadius: 12,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#E5E7EB",
            backgroundColor: "white",
          }}
        >
          {company.logo ? (
            <ImagePreview
              uri={company.logo}
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
        </View>

        {/* Informações */}
        <VStack space="xs" style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#1F2937" }}>
            {company.nome}
          </Text>

          {/* Subcategorias como tags */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
            {topSubcategories.map((subcategory) => (
              <View
                key={subcategory.id}
                style={{
                  backgroundColor: `${THEME_COLORS.primary}10`,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 9999,
                }}
              >
                <Text style={{ fontSize: 12, color: THEME_COLORS.primary }}>
                  {subcategory.nome}
                </Text>
              </View>
            ))}

            {company.subcategorias.length > 3 && (
              <Text style={{ fontSize: 12, color: "#6B7280", marginLeft: 4 }}>
                +{company.subcategorias.length - 3} mais
              </Text>
            )}
          </View>

          {/* Informações fictícias para enriquecer o card */}
          <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Star size={14} color="#FFB800" />
              <Text style={{ fontSize: 12, color: "#6B7280" }}>4.5</Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Clock size={14} color="#6B7280" />
              <Text style={{ fontSize: 12, color: "#6B7280" }}>20-30 min</Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <MapPin size={14} color="#6B7280" />
              <Text style={{ fontSize: 12, color: "#6B7280" }}>1.2 km</Text>
            </View>
          </View>
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
});
