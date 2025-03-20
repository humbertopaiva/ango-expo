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
import { getContrastText, getContrastColor } from "@/src/utils/color.utils";

export function FeaturedProductsStrip() {
  const vm = useCompanyPageContext();
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get("window");
  const isWeb = Platform.OS === "web";

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
      pathname: `/(drawer)/empresa/${vm.profile.empresa.slug}` as any,
    });
  };

  // Calcula o tamanho apropriado para o card destacado
  const getCardWidth = () => {
    if (isWeb) {
      return width > 768 ? 320 : width * 0.7; // Reduzido para proporcionar uma aparência mais quadrada
    }
    return width * 0.7; // 70% da largura em dispositivos móveis para uma aparência mais quadrada
  };

  // Cor primária da empresa ou cor padrão
  const primaryColor = vm.primaryColor || "#F4511E";

  return (
    <View className="">
      {/* Container com fundo colorido baseado na cor primária da empresa */}
      <View className="pt-8 pb-8 overflow-hidden">
        {/* Cabeçalho com textos */}
        <View className="px-4 mb-4">
          <Text className={`text-2xl font-semibold text-gray-800`}>
            Produtos em Destaque
          </Text>
        </View>

        {/* Lista horizontal de produtos */}
        <View className="relative">
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
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
                  className="py-2"
                >
                  {/* Sempre definir isHighlighted como true para produtos em destaque */}
                  <AdaptiveProductCard
                    product={product}
                    showFeaturedBadge={false}
                    isHighlighted={true} // Forçado como true para todos os produtos em destaque
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
        </View>
      </View>
    </View>
  );
}
