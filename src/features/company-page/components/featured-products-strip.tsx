// Path: src/features/company-page/components/featured-products-strip.tsx
import React, { useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { HStack } from "@gluestack-ui/themed";
import { SafeMap } from "@/components/common/safe-map";
import { AdaptiveProductCard } from "./adaptive-product-card";

export function FeaturedProductsStrip() {
  const vm = useCompanyPageContext();
  const scrollViewRef = useRef<ScrollView>(null);

  // Se não houver produtos em destaque, não renderiza nada
  if (!vm.showcaseProducts || vm.showcaseProducts.length === 0) {
    return null;
  }

  // Botões para navegação horizontal
  const handleScrollLeft = () => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  const handleScrollRight = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  // Cor primária da empresa ou cor padrão
  const primaryColor = vm.primaryColor || "#F4511E";

  return (
    <View className="mb-6">
      {/* Cabeçalho */}
      <View className="px-4 mb-4">
        <HStack className="items-center gap-2 mb-2">
          <Sparkles size={16} color={primaryColor} />
          <Text style={{ color: primaryColor }} className="font-medium">
            Em destaque
          </Text>
        </HStack>

        <Text className="text-xl font-bold text-gray-800">
          Produtos em Destaque
        </Text>
      </View>

      {/* Lista horizontal de produtos */}
      <View className="relative">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
        >
          <SafeMap
            data={vm.showcaseProducts}
            renderItem={(product, index) => (
              <View key={`showcase-${product.id}`} className="w-56 mr-4">
                <AdaptiveProductCard
                  product={product}
                  showFeaturedBadge={true}
                />
              </View>
            )}
          />
        </ScrollView>

        {/* Botões de navegação - só exibe se houver mais de 2 produtos */}
        {vm.showcaseProducts.length > 2 && (
          <View className="absolute top-1/2 left-0 right-0 flex-row justify-between px-2 -translate-y-6 pointer-events-none">
            <TouchableOpacity
              onPress={handleScrollLeft}
              className="w-8 h-8 rounded-full bg-white shadow-md items-center justify-center pointer-events-auto"
            >
              <ChevronLeft size={16} color="#374151" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleScrollRight}
              className="w-8 h-8 rounded-full bg-white shadow-md items-center justify-center pointer-events-auto"
            >
              <ChevronRight size={16} color="#374151" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
