// Path: src/features/company-page/components/featured-products.tsx
import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { Card, HStack } from "@gluestack-ui/themed";
import { AdaptiveProductCard } from "./adaptive-product-card";
import { THEME_COLORS } from "@/src/styles/colors";
import { SafeMap } from "@/components/common/safe-map";
import { CompanyProduct } from "../models/company-product";

/**
 * Componente para exibir produtos em destaque com um cabeçalho e controles de navegação
 */
export function FeaturedProducts() {
  const vm = useCompanyPageContext();
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get("window");

  // Calcular largura ideal do item com base na largura da tela
  const getItemWidth = () => {
    if (width > 768) return 320; // Tablets e Desktop: layout mais amplo
    return width * 0.8; // Celulares: 80% da largura da tela
  };

  const handleScrollLeft = () => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  const handleScrollRight = () => {
    // Estima um scroll amplo para ir até o final
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  // Se não houver produtos em destaque, não renderiza nada
  if (!vm.showcaseProducts || vm.showcaseProducts.length === 0) {
    return null;
  }

  // Cor primária da empresa ou cor padrão
  const primaryColor = vm.primaryColor || THEME_COLORS.primary;

  return (
    <View className="mb-8">
      {/* Cabeçalho */}
      <View className="px-4 mb-4">
        <HStack className="items-center gap-2 mb-2">
          <Sparkles size={16} color={primaryColor} />
          <Text style={{ color: primaryColor }} className="font-medium">
            Produtos em destaque
          </Text>
        </HStack>

        <Text className="text-xl font-bold text-gray-800">
          Destaques da Loja
        </Text>

        <Text className="text-gray-600 mt-1">
          Confira os produtos selecionados especialmente para você
        </Text>
      </View>

      {/* Produtos */}
      <View className="relative">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
          className="pb-2"
        >
          <SafeMap
            data={vm.showcaseProducts}
            renderItem={(product, index) => (
              <View
                key={`showcase-${product.id}`}
                style={{ width: getItemWidth() }}
                className="mr-4"
              >
                {/* Sempre use isHighlighted como true para produtos em destaque */}
                <AdaptiveProductCard
                  product={product}
                  showFeaturedBadge={false}
                  isHighlighted={true} // Forçado como true para garantir uniformidade
                />
              </View>
            )}
          />
        </ScrollView>

        {/* Botões de navegação */}
        {vm.showcaseProducts.length > 2 && (
          <View className="absolute top-1/2 left-0 right-0 flex-row justify-between px-2 -translate-y-6 pointer-events-none">
            <TouchableOpacity
              onPress={handleScrollLeft}
              className="w-10 h-10 rounded-full bg-white shadow-md items-center justify-center pointer-events-auto"
            >
              <ChevronLeft size={20} color="#374151" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleScrollRight}
              className="w-10 h-10 rounded-full bg-white shadow-md items-center justify-center pointer-events-auto"
            >
              <ChevronRight size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Botão para ver todos */}
      {vm.showcaseProducts.length > 0 && (
        <TouchableOpacity className="mx-auto mt-4 px-4 py-2 rounded-lg border border-gray-200">
          <Text className="text-center font-medium text-gray-700">
            Ver todos os produtos
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
