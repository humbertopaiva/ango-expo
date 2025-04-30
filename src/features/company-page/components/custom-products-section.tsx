// Path: src/features/company-page/components/custom-products-section.tsx

import React from "react";
import { View, Text } from "react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { CustomProductCard } from "./custom-product-card";
import { Layers, Settings } from "lucide-react-native";
import { Card, HStack } from "@gluestack-ui/themed";

export function CustomProductsSection() {
  const vm = useCompanyPageContext();
  const { customProducts } = vm;

  console.log("Custom Products Section", customProducts);

  // Não renderiza nada se não houver produtos personalizados
  if (!customProducts || customProducts.length === 0) {
    return null;
  }

  // Cor primária da empresa
  const primaryColor = vm.primaryColor || "#F4511E";

  return (
    <View className="mt-8">
      {/* Lista de produtos personalizados */}
      <View className="px-4">
        {customProducts.map((product) => (
          <CustomProductCard key={`custom-${product.id}`} product={product} />
        ))}
      </View>
    </View>
  );
}
