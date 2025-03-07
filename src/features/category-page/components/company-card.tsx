// Path: src/features/category-page/components/company-card.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
    <TouchableOpacity
      onPress={navigateToCompany}
      activeOpacity={0.7}
      style={styles.container}
      className="bg-white rounded-xl overflow-hidden border border-gray-100"
    >
      {/* Imagem de capa */}
      <View className="h-32 w-full relative">
        {company.banner ? (
          <ImagePreview
            uri={company.banner}
            width="100%"
            height="100%"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-gray-100 items-center justify-center">
            <Store size={32} color={THEME_COLORS.primary} />
          </View>
        )}

        {/* Destaque/Badge caso tenha delivery */}
        {company.subcategorias.some(
          (sub) => sub.subcategorias_empresas_id.slug === "delivery"
        ) && (
          <View className="absolute top-3 right-3 bg-primary-500 rounded-full px-3 py-1 shadow-sm">
            <Text className="text-white text-xs font-medium">Delivery</Text>
          </View>
        )}
      </View>

      <HStack className="p-4" space="md">
        {/* Logo */}
        <View className="h-16 w-16 rounded-xl overflow-hidden border border-gray-200 bg-white">
          {company.logo ? (
            <ImagePreview
              uri={company.logo}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-50">
              <Store size={24} color={THEME_COLORS.primary} />
            </View>
          )}
        </View>

        {/* Informações */}
        <VStack className="flex-1" space="xs">
          <Text className="text-lg font-semibold text-gray-800">
            {company.nome}
          </Text>

          {/* Subcategorias como tags */}
          <HStack className="flex-wrap gap-1" space="sm">
            {topSubcategories.map((subcategory) => (
              <View
                key={subcategory.id}
                className="bg-primary-50 px-2 py-0.5 rounded-full"
              >
                <Text className="text-xs text-primary-700">
                  {subcategory.nome}
                </Text>
              </View>
            ))}

            {company.subcategorias.length > 3 && (
              <Text className="text-xs text-gray-500 ml-1">
                +{company.subcategorias.length - 3} mais
              </Text>
            )}
          </HStack>

          {/* Informações fictícias para enriquecer o card */}
          <HStack space="md">
            <HStack space="xs" alignItems="center">
              <Star size={14} color="#FFB800" />
              <Text className="text-xs text-gray-600">4.5</Text>
            </HStack>

            <HStack space="xs" alignItems="center">
              <Clock size={14} color="#6B7280" />
              <Text className="text-xs text-gray-600">20-30 min</Text>
            </HStack>

            <HStack space="xs" alignItems="center">
              <MapPin size={14} color="#6B7280" />
              <Text className="text-xs text-gray-600">1.2 km</Text>
            </HStack>
          </HStack>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
