// Path: src/features/company-page/components/custom-product-card.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Package,
  ChevronRight,
  Settings,
  ShoppingBag,
} from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { router } from "expo-router";
import { CustomProduct } from "../../custom-products/models/custom-product";

interface CustomProductCardProps {
  product: CustomProduct;
}

export function CustomProductCard({ product }: CustomProductCardProps) {
  const vm = useCompanyPageContext();

  // Navigate to product detail page
  const handlePress = () => {
    if (!vm.profile?.empresa.slug) return;
    router.push({
      pathname:
        `/(drawer)/empresa/${vm.profile.empresa.slug}/custom-product/${product.id}` as any,
      params: { productId: product.id },
    });
  };

  // Primary color from context or default
  const primaryColor = vm.primaryColor || "#F4511E";

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="mb-3 border border-primary-200 rounded-md overflow-hidden bg-white"
    >
      <View
        className="flex-row items-center py-3 px-4"
        style={{ minHeight: 80 }}
      >
        {/* Only show image if it exists */}
        {product.imagem && (
          <View className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-3">
            <ImagePreview
              uri={product.imagem}
              fallbackIcon={Package}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          </View>
        )}

        {/* Content container */}
        <View className="flex-1 justify-center">
          {/* Title */}
          <Text
            className="text-lg font-semibold text-gray-800"
            numberOfLines={1}
          >
            {product.nome}
          </Text>

          {/* Description - limited to one line */}
          <Text className="text-xs text-gray-500 mt-1" numberOfLines={1}>
            {product.descricao || "Produto customizável"}
          </Text>
        </View>

        {/* Indicator icon */}
        <View className="ml-2 p-2">
          <ShoppingBag size={20} color={primaryColor} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
