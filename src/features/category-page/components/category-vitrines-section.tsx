// Path: src/features/category-page/components/category-vitrines-section.tsx

import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Sparkles } from "lucide-react-native";
import { HStack } from "@gluestack-ui/themed";
import { CompanyWithVitrine } from "../hooks/use-category-vitrine";
import { CompanyVitrineCard } from "@/components/showcase/company-showcase-card";
import { THEME_COLORS } from "@/src/styles/colors";

interface CategoryVitrinesSectionProps {
  companiesWithVitrine: CompanyWithVitrine[];
  isLoading: boolean;
  categoryName: string;
}

export function CategoryVitrinesSection({
  companiesWithVitrine,
  isLoading,
  categoryName,
}: CategoryVitrinesSectionProps) {
  if (isLoading) {
    return (
      <View className="py-8">
        <View className="mb-6 items-center">
          <HStack className="bg-primary-100/60 px-4 py-2 rounded-full items-center gap-2 mb-4">
            <Sparkles size={16} color={THEME_COLORS.primary} />
            <Text className="text-sm font-medium text-primary-600">
              Produtos em Destaque
            </Text>
          </HStack>

          <Text className="text-2xl font-bold text-center mb-2">
            Carregando produtos...
          </Text>
        </View>

        <View className="space-y-6">
          {[1, 2].map((i) => (
            <View
              key={i}
              className="h-80 bg-gray-200 rounded-xl animate-pulse mx-4"
            />
          ))}
        </View>
      </View>
    );
  }

  if (companiesWithVitrine.length === 0) {
    return (
      <View className="py-8 items-center justify-center">
        <Text className="text-gray-500 text-center">
          Não encontramos produtos em destaque nesta categoria.
        </Text>
      </View>
    );
  }

  return (
    <View className="py-4">
      <View className="mb-6 items-center px-4">
        <HStack className="bg-primary-100/60 px-4 py-2 rounded-full items-center gap-2 mb-4">
          <Sparkles size={16} color={THEME_COLORS.primary} />
          <Text className="text-sm font-medium text-primary-600">
            Produtos em Destaque
          </Text>
        </HStack>

        <Text className="text-2xl font-semibold text-center mb-2 text-primary-500">
          {categoryName}
        </Text>

        <Text className="text-gray-600 text-center">
          Confira os melhores produtos e ofertas desta categoria
        </Text>
      </View>

      <ScrollView>
        {companiesWithVitrine.map((company) => (
          <CompanyVitrineCard key={company.id} company={company} />
        ))}
      </ScrollView>
    </View>
  );
}
