// Path: src/features/company-page/components/catalog-product-card.tsx
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { Card, HStack, VStack } from "@gluestack-ui/themed";
import { Package, Star, ShoppingBag, ExternalLink } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { CompanyProduct } from "../models/company-product";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { router } from "expo-router";
import { Eye } from "lucide-react-native";
import { animationUtils } from "@/src/utils/animations.utils";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { useToast } from "@gluestack-ui/themed";
import { toastUtils } from "@/src/utils/toast.utils";

interface CatalogProductCardProps {
  product: CompanyProduct;
  style?: any;
  showFeaturedBadge?: boolean;
}

export function CatalogProductCard({
  product,
  style,
  showFeaturedBadge = false,
}: CatalogProductCardProps) {
  const vm = useCompanyPageContext();
  const { width } = Dimensions.get("window");
  const cartVm = useCartViewModel();
  const toast = useToast();

  // Verificar se o carrinho está habilitado
  const isCartEnabled = vm.config?.delivery?.habilitar_carrinho !== false;

  // Animações
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Prepare animation functions
  const pulseAnimation = animationUtils.createPulseAnimation(scaleAnim);

  // Animation on first render
  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

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
    if (!vm.profile?.empresa.slug) return;

    // Inicie a animação de pulse
    pulseAnimation();

    // Aplique um pequeno atraso para que a animação seja visível antes da navegação
    setTimeout(() => {
      if (hasVariation) {
        router.push({
          pathname:
            `/(drawer)/empresa/${vm.profile?.empresa.slug}/product-variation/${product.id}` as any,
          params: { productId: product.id },
        });
      } else {
        router.push({
          pathname:
            `/(drawer)/empresa/${vm.profile?.empresa.slug}/product/${product.id}` as any,
          params: { productId: product.id },
        });
      }
    }, 150);
  };

  // Adicionar ao carrinho
  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    if (!product || !vm.profile) return;

    // Animação de pulse no botão
    pulseAnimation();

    // Adiciona o produto ao carrinho
    cartVm.addProduct(product, vm.profile.empresa.slug, vm.profile.nome);

    // Mostra um toast de confirmação
    toastUtils.success(toast, `${product.nome} adicionado ao carrinho!`);
  };

  // Verificar se o produto tem variação
  const hasVariation = product.tem_variacao === true;

  // Determinar se deve exibir o preço
  const shouldShowPrice =
    !hasVariation && product.exibir_preco && product.preco;

  // Texto para produtos com variação
  const variationText = hasVariation
    ? `${product.variacao?.nome || "Opções"}: ${
        product.variacao?.variacao?.join(", ") || "Variações disponíveis"
      }`
    : null;

  // Cor primária da empresa ou valor default
  const primaryColor = vm.primaryColor || "#F4511E";

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        },
        styles.container,
      ]}
    >
      <TouchableOpacity
        onPress={handleProductPress}
        activeOpacity={0.8}
        style={[styles.touchable, style]}
        className="h-full"
      >
        <Card className="overflow-hidden rounded-xl border border-gray-100 shadow-sm h-full">
          {/* Imagem do produto */}
          <View style={styles.imageContainer} className="relative">
            <ImagePreview
              uri={product.imagem}
              fallbackIcon={Package}
              width="100%"
              height="100%"
              resizeMode="cover"
            />

            {/* Badge no canto superior */}
            {hasVariation ? (
              <View className="absolute top-2 left-2 bg-purple-500 px-2 py-0.5 rounded-full shadow-sm">
                <Text className="text-white text-xs font-medium">
                  {product.variacao?.variacao?.length || 0} opções
                </Text>
              </View>
            ) : product.preco_promocional && shouldShowPrice ? (
              <View className="absolute top-2 left-2 bg-red-500 px-2 py-0.5 rounded-full shadow-sm">
                <Text className="text-white text-xs font-medium">
                  {calculateDiscount(product.preco, product.preco_promocional)}%
                  OFF
                </Text>
              </View>
            ) : showFeaturedBadge ? (
              <View className="absolute top-2 left-2 bg-amber-500 rounded-full p-1 shadow-sm">
                <Star size={12} color="#FFFFFF" />
              </View>
            ) : null}
          </View>

          {/* Informações do produto */}
          <VStack className="p-3 flex-1 justify-between">
            <View>
              <Text
                className="font-medium text-gray-800 text-base mb-1"
                numberOfLines={2}
              >
                {product.nome}
              </Text>

              {/* Descrição ou variações */}
              {hasVariation ? (
                <Text className="text-xs text-gray-500 mb-2" numberOfLines={2}>
                  {variationText}
                </Text>
              ) : product.descricao ? (
                <Text className="text-xs text-gray-500 mb-2" numberOfLines={2}>
                  {product.descricao}
                </Text>
              ) : null}
            </View>

            {/* Área de preço e botão */}
            <HStack className="justify-between items-center mt-auto pt-2 border-t border-gray-100">
              {shouldShowPrice ? (
                <View>
                  {product.preco_promocional ? (
                    <VStack space="xs">
                      <Text
                        className="text-base font-bold"
                        style={{ color: primaryColor }}
                      >
                        {formatCurrency(product.preco_promocional)}
                      </Text>
                      <Text className="text-xs text-gray-400 line-through">
                        {formatCurrency(product.preco)}
                      </Text>
                    </VStack>
                  ) : (
                    <Text
                      className="text-base font-bold"
                      style={{ color: primaryColor }}
                    >
                      {formatCurrency(product.preco)}
                    </Text>
                  )}
                </View>
              ) : (
                <Text className="text-sm text-gray-600 font-medium">
                  {hasVariation ? "Ver opções" : "Consultar"}
                </Text>
              )}

              {/* Botão de adicionar ao carrinho */}
              {isCartEnabled && (
                <TouchableOpacity
                  onPress={handleAddToCart}
                  className="rounded-full p-2"
                  style={{
                    backgroundColor: hasVariation
                      ? `${primaryColor}20`
                      : primaryColor,
                  }}
                >
                  <ShoppingBag
                    size={16}
                    color={hasVariation ? primaryColor : "#FFFFFF"}
                  />
                </TouchableOpacity>
              )}
            </HStack>
          </VStack>

          {/* Indicador de "Ver detalhes" */}
          {hasVariation && (
            <View className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
              <HStack space="xs" className="items-center">
                <ExternalLink size={14} color="white" />
                <Text className="text-white text-xs font-medium">
                  Ver detalhes e opções
                </Text>
              </HStack>
            </View>
          )}
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  touchable: {
    flex: 1,
  },
  imageContainer: {
    aspectRatio: 1, // Mantém proporção quadrada
    position: "relative",
  },
});
