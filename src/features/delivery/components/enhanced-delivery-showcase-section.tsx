// Path: src/features/delivery/components/enhanced-delivery-showcase-section.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Sparkles } from "lucide-react-native";

import { HStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";
import { DeliveryProfile } from "../models/delivery-profile";
import { DeliveryShowcaseItem } from "../models/delivery-showcase-item";
import { DeliveryCompanyShowcaseCard } from "./delivery-company-showcase-card";

interface EnhancedDeliveryShowcaseSectionProps {
  companiesWithShowcases: DeliveryProfile[];
  showcases: Record<string, DeliveryShowcaseItem[]>;
  isLoading: boolean;
}

export function EnhancedDeliveryShowcaseSection({
  companiesWithShowcases,
  showcases,
  isLoading,
}: EnhancedDeliveryShowcaseSectionProps) {
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

  if (companiesWithShowcases.length === 0) {
    return null;
  }

  return (
    <View className="py-8">
      <View className="mb-6 items-center px-4">
        <HStack className="bg-primary-100/60 px-4 py-2 rounded-full items-center gap-2 mb-4">
          <Sparkles size={16} color={THEME_COLORS.primary} />
          <Text className="text-sm font-medium text-primary-600">
            Produtos em Destaque
          </Text>
        </HStack>

        <Text className="text-3xl font-semibold text-center mb-2 text-primary-500">
          Delivery com Qualidade
        </Text>

        <Text className="text-gray-600 text-center font-sans">
          Confira os melhores produtos dos estabelecimentos da região
        </Text>
      </View>

      <View>
        {companiesWithShowcases.map((company) => (
          <DeliveryCompanyShowcaseCard
            key={company.id}
            company={company}
            showcaseItems={showcases[company.empresa.slug] || []}
          />
        ))}
      </View>
    </View>
  );
}
