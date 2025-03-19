// Path: src/features/company-page/components/adaptive-product-card.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Card, HStack, useToast } from "@gluestack-ui/themed";
import { Package, Star, ShoppingBag } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { CompanyProduct } from "../models/company-product";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { getContrastColor } from "@/src/utils/color.utils";
import { toastUtils } from "@/src/utils/toast.utils";

interface AdaptiveProductCardProps {
  product: CompanyProduct;
  style?: any;
  showFeaturedBadge?: boolean;
  isHighlighted?: boolean;
}

export function AdaptiveProductCard({
  product,
  style,
  showFeaturedBadge = false,
  isHighlighted = false,
}: AdaptiveProductCardProps) {
  const vm = useCompanyPageContext();
  const cartVm = useCartViewModel();

  const { width } = Dimensions.get("window");
  const isWeb = Platform.OS === "web";

  const toast = useToast();

  // Formatação de moeda
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  // Calcular desconto
  const calculateDiscount = (original: string, promotional: string) => {
    if (!promotional) return 0;
    const originalValue = parseFloat(original);
    const promotionalValue = parseFloat(promotional);
    return Math.round(
      ((originalValue - promotionalValue) / originalValue) * 100
    );
  };

  // Navegar para a página de detalhes do produto
  const handleProductPress = () => {
    router.push({
      pathname:
        `/(drawer)/empresa/${vm.profile?.empresa.slug}/product/${product.id}` as any,
      params: { productId: product.id },
    });
  };

  // Adicionar ao carrinho diretamente
  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    if (!product || !vm.profile) return;

    cartVm.addProduct(product, vm.profile.empresa.slug, vm.profile.nome);
    // Mostrar toast usando toastUtils
    toastUtils.success(toast, `${product.nome} adicionado ao carrinho!`);
  };

  const contrastTextColor = getContrastColor(vm.primaryColor || "#F4511E");

  // Proporção 4:3
  const cardWidth = isWeb ? (width > 768 ? 380 : width * 0.85) : width * 0.85;
  const cardHeight = cardWidth * 0.75; // Proporção 4:3

  return (
    <TouchableOpacity
      onPress={handleProductPress}
      className="relative"
      activeOpacity={0.8}
      style={[
        style,
        {
          height: cardHeight,
          borderRadius: 16,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        },
      ]}
    >
      <View className="w-full h-full">
        {/* Imagem de fundo com gradiente */}
        <View className="absolute w-full h-full">
          <ImagePreview
            uri={product.imagem}
            fallbackIcon={Package}
            width="100%"
            height="100%"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
            style={{ position: "absolute", height: "100%", width: "100%" }}
          />
        </View>

        {/* Botão de adicionar ao carrinho no canto superior direito */}
        <TouchableOpacity
          onPress={handleAddToCart}
          className="absolute bottom-4 right-4 rounded-full p-3 z-10"
          style={{ backgroundColor: vm.primaryColor || "#F4511E" }}
        >
          <ShoppingBag size={24} color={contrastTextColor} />
        </TouchableOpacity>

        {/* Conteúdo do card */}
        <View className="flex-1 justify-end p-5">
          <HStack className="items-center mb-4 gap-2">
            {/* Nome do produto (sem descrição) */}
            <Text
              className="text-white font-semibold text-2xl "
              numberOfLines={2}
            >
              {product.nome}
            </Text>
            {product.preco_promocional && (
              <View className="">
                <Text className="text-white font-semibold text-xs bg-red-600 px-2 py-1 rounded-full ml-2">
                  {calculateDiscount(product.preco, product.preco_promocional)}%
                  OFF
                </Text>
              </View>
            )}
          </HStack>

          {/* Preço e badge de desconto juntos */}
          <View className="flex-row items-center">
            <View className="flex-1">
              {product.preco_promocional ? (
                <View className="flex-row items-center">
                  <View>
                    <Text className="text-white/80 text-md line-through">
                      {formatCurrency(product.preco)}
                    </Text>
                    <Text className="text-white font-semibold text-2xl">
                      {formatCurrency(product.preco_promocional)}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text className="text-white font-semibold text-xl">
                  {formatCurrency(product.preco)}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
