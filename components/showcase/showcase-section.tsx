// Path: src/features/commerce/components/enhanced-vitrine/EnhancedVitrineSection.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Sparkles } from "lucide-react-native";

import { HStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";
import { useVitrine } from "@/src/features/commerce/hooks/use-vitrine";
import { CompanyVitrineCard } from "./company-showcase-card";

export function EnhancedVitrineSection() {
  const { companiesWithVitrine, isLoading } = useVitrine();

  if (isLoading) {
    return (
      <View className="py-8">
        <View className="mb-6 items-center">
          <HStack className="bg-primary-100/60 px-4 py-2 rounded-full items-center gap-2 mb-4">
            <Sparkles size={16} color={THEME_COLORS.primary} />
            <Text className="text-sm font-medium text-primary-600">
              Vitrines em Destaque
            </Text>
          </HStack>

          <Text className="text-2xl font-bold text-center mb-2">
            Carregando vitrines...
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
          Nenhuma vitrine disponível no momento
        </Text>
      </View>
    );
  }

  return (
    <View className="py-8">
      <View className="mb-6 items-center px-4">
        <HStack className="bg-primary-100/60 px-4 py-2 rounded-full items-center gap-2 mb-4">
          <Sparkles size={16} color={THEME_COLORS.primary} />
          <Text className="text-sm font-medium text-primary-600">
            Vitrines em Destaque
          </Text>
        </HStack>

        <Text className="text-3xl font-semibold text-center mb-2 text-primary-500">
          Últimas Novidades
        </Text>

        <Text className="text-gray-600 text-center font-sans">
          Confira os produtos mais recentes das lojas da nossa cidade
        </Text>
      </View>

      <View>
        {companiesWithVitrine.map((company: any) => (
          <CompanyVitrineCard key={company.id} company={company} />
        ))}
      </View>
    </View>
  );
}
