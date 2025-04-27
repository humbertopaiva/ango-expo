// Path: src/features/company-page/components/custom-products-section.tsx

import React from "react";
import { View, Text } from "react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { CustomProductCard } from "./custom-product-card";
import { Package, Palette } from "lucide-react-native";
import { Card, HStack } from "@gluestack-ui/themed";

export function CustomProductsSection() {
  const vm = useCompanyPageContext();
  const { customProducts } = vm;

  // Não renderiza nada se não houver produtos personalizados
  if (!customProducts || customProducts.length === 0) {
    return null;
  }

  // Cor primária da empresa
  const primaryColor = vm.primaryColor || "#F4511E";

  return (
    <View className="mb-6">
      {/* Cabeçalho da seção */}
      <View className="px-4 mb-4">
        <HStack className="items-center mb-2">
          <Palette size={20} color={primaryColor} className="mr-2" />
          <Text
            className="text-xl font-semibold"
            style={{ color: primaryColor }}
          >
            Produtos Personalizados
          </Text>
        </HStack>

        <Text className="text-gray-600 text-sm">
          Monte seu próprio produto com as opções disponíveis
        </Text>
      </View>

      {/* Lista de produtos personalizados */}
      <View className="px-4">
        {customProducts.map((product) => (
          <CustomProductCard key={`custom-${product.id}`} product={product} />
        ))}
      </View>
    </View>
  );
}
