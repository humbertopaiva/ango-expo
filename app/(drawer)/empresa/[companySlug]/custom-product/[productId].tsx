// Path: app/(drawer)/empresa/[companySlug]/custom-product/[productId].tsx

import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { CompanySpecificHeader } from "@/src/features/company-page/components/company-specific-header";
import { Settings } from "lucide-react-native";

export default function CustomProductScreen() {
  const { productId, companySlug } = useLocalSearchParams<{
    productId: string;
    companySlug: string;
  }>();

  return (
    <View className="flex-1 bg-white">
      <CompanySpecificHeader
        title="Produto Personalizado"
        backTo={`/(drawer)/empresa/${companySlug}`}
      />

      <View className="flex-1 justify-center items-center p-6">
        <Settings size={64} color="#F4511E" />
        <Text className="text-2xl font-bold text-center mt-6 mb-2">
          Personalização de Produto
        </Text>
        <Text className="text-base text-gray-600 text-center">
          Esta tela permitirá personalizar seu produto em várias etapas,
          escolhendo as opções disponíveis em cada passo.
        </Text>
        <Text className="text-sm text-gray-500 text-center mt-4">
          ID do produto: {productId}
        </Text>
      </View>
    </View>
  );
}
