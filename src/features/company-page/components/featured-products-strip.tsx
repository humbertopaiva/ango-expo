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
import { RelativePathString, router } from "expo-router";

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
  // Cor para text baseada no contraste para garantir legibilidade
  const getTextColor = (bgColor: any) => {
    // Converter cor hexadecimal para RGB
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);

    // Fórmula para calcular brilho percebido
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Retorna branco para fundos escuros e preto para fundos claros
    return brightness < 128 ? "#FFFFFF" : "#333333";
  };

  const textColor = primaryColor.startsWith("#")
    ? getTextColor(primaryColor)
    : "#FFFFFF";

  return (
    <View className="mb-8">
      {/* Container com fundo colorido baseado na cor primária da empresa */}
      <View
        className="pt-6 pb-8 overflow-hidden"
        style={{
          backgroundColor: primaryColor,
          shadowColor: primaryColor,
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        {/* Cabeçalho com textos */}
        <View className="px-4 mb-4">
          <HStack className="items-center justify-between mb-3">
            {/* Seção de título com ícone de destaque */}
            <HStack className="items-center gap-2">
              <View className="p-2 rounded-full bg-white/20">
                <Sparkles size={18} color={textColor} />
              </View>
              <Text className={`text-xl font-bold ${textColor}`}>
                Produtos em Destaque
              </Text>
            </HStack>
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
                    showFeaturedBadge={false}
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
        </View>
      </View>
    </View>
  );
}
