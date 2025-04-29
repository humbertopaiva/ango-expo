// Path: src/features/commerce/components/enhanced-vitrine/EnhancedVitrineSection.tsx
import React from "react";
import { View, Text, ScrollView, ImageBackground } from "react-native";
import { Sparkles } from "lucide-react-native";

import { HStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";
import { useVitrine } from "@/src/features/commerce/hooks/use-vitrine";
import { CompanyVitrineCard } from "./company-showcase-card";

export function EnhancedVitrineSection() {
  const { companiesWithVitrine, isLoading } = useVitrine();

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
    <ScrollView className="flex-1">
      <Text className="text-xl font-gothic text-primary-500 mb-4-800 px-4 pt-4">
        VITRINES
      </Text>

      {/* Lista de vitrines */}
      <View className="">
        {companiesWithVitrine.map((company: any) => (
          <CompanyVitrineCard key={company.id} company={company} />
        ))}
      </View>
    </ScrollView>
  );
}
