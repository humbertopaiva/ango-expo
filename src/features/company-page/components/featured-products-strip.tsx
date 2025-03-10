// Path: src/features/company-page/components/featured-products-strip.tsx
import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
} from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { HStack } from "@gluestack-ui/themed";
import { SafeMap } from "@/components/common/safe-map";
import { AdaptiveProductCard } from "./adaptive-product-card";
import { router } from "expo-router";

export function FeaturedProductsStrip() {
  const vm = useCompanyPageContext();
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get("window");
  const isWeb = Platform.OS === "web";
  const isDeliveryPlan =
    vm.profile?.empresa.plano?.nome?.toLowerCase() === "delivery";

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

  // Navegar para todos os produtos da empresa
  const handleViewAll = () => {
    if (!vm.profile?.empresa.slug) return;

    router.push({
      pathname: `/(drawer)/empresa/${vm.profile.empresa.slug}`,
    });
  };

  // Calcula o tamanho apropriado para o card destacado
  const getCardWidth = () => {
    if (isDeliveryPlan) {
      if (isWeb) {
        return width > 768 ? 380 : width * 0.85;
      }
      return width * 0.85; // 85% da largura em dispositivos móveis
    }

    return isWeb ? (width > 768 ? 280 : width * 0.65) : width * 0.65;
  };

  // Cor primária da empresa ou cor padrão
  const primaryColor = vm.primaryColor || "#F4511E";

  return (
    <View className="mb-8">
      {/* Cabeçalho simplificado */}
      <View className="px-4 mb-4">
        <HStack className="items-center justify-between mb-3">
          <HStack className="items-center gap-2">
            <View
              className="p-2 rounded-full"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <Sparkles size={18} color={primaryColor} />
            </View>
            <Text className="text-lg font-bold text-gray-800">
              Produtos em Destaque
            </Text>
          </HStack>

          <TouchableOpacity
            onPress={handleViewAll}
            className="flex-row items-center"
          >
            <Text className="text-sm mr-1" style={{ color: primaryColor }}>
              Ver todos
            </Text>
            <ArrowRight size={14} color={primaryColor} />
          </TouchableOpacity>
        </HStack>
      </View>

      {/* Lista horizontal de produtos */}
      <View className="relative">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 12,
            paddingTop: 8,
          }}
          className="py-2"
          decelerationRate="fast"
          snapToInterval={getCardWidth() + 16} // Snap to each card
          snapToAlignment="center"
        >
          <SafeMap
            data={vm.showcaseProducts}
            renderItem={(product, index) => (
              <View
                key={`showcase-${product.id}`}
                style={{
                  width: getCardWidth(),
                  marginRight: 16,
                }}
                className={isDeliveryPlan ? "" : "py-2"}
              >
                <AdaptiveProductCard
                  product={product}
                  showFeaturedBadge={false} // Removido ícone de estrela
                  isHighlighted={isDeliveryPlan}
                />
              </View>
            )}
          />
        </ScrollView>

        {/* Botões de navegação - só exibe se houver mais de 2 produtos */}
        {vm.showcaseProducts.length > 2 && (
          <View className="absolute top-1/2 left-0 right-0 flex-row justify-between px-4 -translate-y-10 pointer-events-none">
            <TouchableOpacity
              onPress={handleScrollLeft}
              className="w-10 h-10 rounded-full bg-white shadow-md items-center justify-center pointer-events-auto"
              style={{ elevation: 3 }}
            >
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleScrollRight}
              className="w-10 h-10 rounded-full bg-white shadow-md items-center justify-center pointer-events-auto"
              style={{ elevation: 3 }}
            >
              <ChevronRight size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        )}

        {/* Indicadores de página (dots) */}
        {vm.showcaseProducts.length > 1 && (
          <View className="flex-row justify-center mt-3 gap-1.5">
            {vm.showcaseProducts.map((_, idx) => (
              <View
                key={`dot-${idx}`}
                className="h-2 w-2 rounded-full bg-gray-300"
                style={{
                  // Destaque para o primeiro dot (assumindo que está na primeira página)
                  backgroundColor: idx === 0 ? primaryColor : "#D1D5DB",
                }}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
