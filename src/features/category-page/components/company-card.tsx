// Path: src/features/category-page/components/company-card.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { CategoryCompany } from "../models/category-company";
import { ImagePreview } from "@/components/custom/image-preview";
import { router } from "expo-router";
import {
  Store,
  Clock,
  ChevronRight,
  SquareArrowOutUpRight,
} from "lucide-react-native";
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

  // Filtrar para pegar apenas 2 subcategorias para exibir
  const topSubcategories = company.empresa.subcategorias
    .slice(0, 2)
    .map((relation) => relation.subcategorias_empresas_id);

  return (
    <Pressable
      onPress={navigateToCompany}
      style={({ pressed }) => [
        styles.container,
        {
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View className="mb-3 overflow-hidden">
        <View className="p-4">
          <HStack space="md" className="justify-between">
            <HStack space="md" className="flex-1">
              {/* Logo */}
              <View className="relative">
                <View className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  {company.perfil.logo ? (
                    <ImagePreview
                      uri={company.perfil.logo}
                      width="100%"
                      height="100%"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full items-center justify-center">
                      <Store size={24} color={THEME_COLORS.primary} />
                    </View>
                  )}
                </View>

                {/* Status Dot - Apenas o indicador visual sem texto */}
                <View
                  className={`absolute top-0 -right-1 w-4 h-4 rounded-full ${
                    isOpen ? "bg-green-500" : "bg-gray-500"
                  } border-2 border-white`}
                />
              </View>

              {/* Company Info */}
              <VStack space="xs" className="flex-1 ml-2 justify-center">
                <Text className="text-lg font-semibold text-gray-800">
                  {company.perfil.nome}
                </Text>

                {/* Categories */}
                <HStack className="flex-wrap mt-1">
                  {topSubcategories.map((subcategory, index) => (
                    <View
                      key={subcategory.id}
                      className={`bg-primary-50 px-2 py-0.5 rounded-full mr-1 mb-1`}
                    >
                      <Text className="text-xs text-primary-500">
                        {subcategory.nome}
                      </Text>
                    </View>
                  ))}
                  {company.empresa.subcategorias.length > 2 && (
                    <Text className="text-xs text-gray-500 self-center">
                      +{company.empresa.subcategorias.length - 2}
                    </Text>
                  )}
                </HStack>
              </VStack>
            </HStack>

            {/* Ver perfil button - Minimalista */}
            <Pressable onPress={navigateToCompany} className="self-center pl-2">
              <HStack
                space="xs"
                className="items-center bg-primary-50 p-2 rounded-full"
              >
                <SquareArrowOutUpRight size={20} color={THEME_COLORS.primary} />
              </HStack>
            </Pressable>
          </HStack>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12)",
      },
    }),
  },
});
