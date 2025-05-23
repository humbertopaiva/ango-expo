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
import { Box, Card, HStack, useToast, VStack } from "@gluestack-ui/themed";
import {
  Package,
  Star,
  ShoppingBag,
  Tag,
  ExternalLink,
} from "lucide-react-native";
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
  const isCartEnabled = vm.config?.delivery?.habilitar_carrinho !== false;
  const cartVm = useCartViewModel();
  const isDeliveryPlan =
    vm.profile?.empresa.plano?.nome?.toLowerCase() === "delivery";
  const { width } = Dimensions.get("window");
  const isWeb = Platform.OS === "web";

  const toast = useToast();

  // Formatação de moeda
  const formatCurrency = (value: string | null | undefined) => {
    if (!value) return "Preço não informado";

    try {
      const numericValue = parseFloat(value.replace(",", "."));
      if (isNaN(numericValue)) return "Preço não informado";

      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numericValue);
    } catch (error) {
      console.error("Erro ao formatar valor monetário:", error);
      return "Preço não informado";
    }
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

    // Apply a slight delay for the animation to be visible
    setTimeout(() => {
      // Navigate to product variation screen if product has variations
      if (product.tem_variacao) {
        router.push({
          pathname:
            `/(drawer)/empresa/${vm.profile?.empresa.slug}/product-variation/${product.id}` as any,
          params: { productId: product.id },
        });
      } else {
        // Navigate to standard product screen
        router.push({
          pathname:
            `/(drawer)/empresa/${vm.profile?.empresa.slug}/product/${product.id}` as any,
          params: { productId: product.id },
        });
      }
    }, 150);
  };

  // Adicionar ao carrinho diretamente
  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    if (!product || !vm.profile) return;

    cartVm.addProduct(product, vm.profile.empresa.slug, vm.profile.nome);
    // Mostrar toast usando toastUtils
    toastUtils.success(toast, `${product.nome} adicionado ao carrinho!`);
  };

  // Verificar se o produto tem variação
  const hasVariation = product.tem_variacao === true;

  // Determinar se deve exibir o preço - modificado para nunca mostrar preço de produtos com variação
  // const shouldShowPrice =
  //   !hasVariation && product.exibir_preco && product.preco;

  const shouldShowPrice = product.preco;

  // Texto para produtos com variação
  const variationText = hasVariation
    ? `${product.variacao?.nome || "Opções"}: ${
        product.variacao?.variacao?.join(", ") || "Variações disponíveis"
      }`
    : null;

  const contrastTextColor = getContrastColor(vm.primaryColor || "#F4511E");

  // Layout destacado (para vitrine)
  if (isHighlighted) {
    const cardWidth = isWeb ? (width > 768 ? 380 : width * 0.85) : width * 0.6;
    const cardHeight = cardWidth * 1.3; // Adjusted for taller card with content below image

    return (
      <TouchableOpacity
        onPress={handleProductPress}
        className="relative border border-gray-100 shadow-sm"
        activeOpacity={0.8}
        style={[
          style,
          {
            width: cardWidth,
            height: cardHeight,
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
          },
        ]}
      >
        <View className="w-full h-full">
          {/* Image section */}
          <View className="w-full" style={{ height: cardWidth * 0.75 }}>
            <View className="">
              <ImagePreview
                uri={product.imagem}
                fallbackIcon={Package}
                width="100%"
                height="100%"
                resizeMode="cover"
                containerClassName="rounded-lg"
              />
            </View>

            {/* Badges positioned on the image */}
            {hasVariation && (
              <View className="absolute top-4 left-4 bg-purple-500 px-2 py-1 rounded-full shadow-sm z-10">
                <Text className="text-white text-xs font-bold">
                  {product.variacao?.variacao?.length || 0} opções
                </Text>
              </View>
            )}

            {showFeaturedBadge && (
              <View className="absolute top-4 left-4 bg-amber-500 rounded-full p-1.5 shadow-sm z-10">
                <Star size={14} color="#fff" />
              </View>
            )}

            {product.preco_promocional && shouldShowPrice && (
              <View className="absolute top-4 right-4 bg-red-500 px-2 py-1 rounded-full shadow-sm z-10">
                <Text className="text-white text-xs font-bold">
                  {calculateDiscount(product.preco, product.preco_promocional)}%
                  OFF
                </Text>
              </View>
            )}
          </View>

          {/* Content section */}
          <View className="p-4 flex-1">
            {/* Product name */}
            <Text
              className="text-gray-800 font-semibold text-lg"
              numberOfLines={2}
            >
              {product.nome}
            </Text>

            {/* Description or variation info */}
            {hasVariation ? (
              <View className="mt-1 mb-2 bg-gray-50 rounded-lg px-3 py-2">
                <HStack space="xs" alignItems="center" className="mb-1">
                  <Tag size={12} color={vm.primaryColor || "#F4511E"} />
                  <Text className="text-gray-700 font-medium text-xs">
                    Variações disponíveis
                  </Text>
                </HStack>
                <Text className="text-gray-600 text-xs" numberOfLines={1}>
                  {variationText}
                </Text>
              </View>
            ) : product.descricao ? (
              <Text
                className="text-gray-600 text-sm mt-1 mb-2"
                numberOfLines={2}
              >
                {product.descricao}
              </Text>
            ) : null}

            {/* Price section */}
            <HStack className="justify-between items-center mt-auto">
              {shouldShowPrice ? (
                <View className="flex-1">
                  {product.preco_promocional ? (
                    <View>
                      <Text className="text-gray-400 text-xs line-through">
                        {formatCurrency(product.preco)}
                      </Text>
                      <Text
                        className="text-xl font-bold"
                        style={{ color: vm.primaryColor || "#F4511E" }}
                      >
                        {formatCurrency(product.preco_promocional)}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      className="text-xl font-bold"
                      style={{ color: vm.primaryColor || "#F4511E" }}
                    >
                      {formatCurrency(product.preco)}
                    </Text>
                  )}

                  {product.parcelamento_cartao &&
                    product.quantidade_parcelas && (
                      <Text className="text-gray-600 text-xs mt-1">
                        {product.parcelas_sem_juros ? (
                          <>
                            ou {product.quantidade_parcelas}x de{" "}
                            {formatCurrency(
                              (
                                parseFloat(
                                  product.preco_promocional || product.preco
                                ) / parseInt(product.quantidade_parcelas)
                              ).toString()
                            )}{" "}
                            sem juros
                          </>
                        ) : (
                          <>
                            ou {product.quantidade_parcelas}x de{" "}
                            {formatCurrency(
                              (
                                parseFloat(
                                  product.preco_promocional || product.preco
                                ) / parseInt(product.quantidade_parcelas)
                              ).toString()
                            )}
                          </>
                        )}
                      </Text>
                    )}
                </View>
              ) : (
                hasVariation && (
                  <View className="flex-1">
                    <Text
                      className="text-md font-medium"
                      style={{ color: vm.primaryColor || "#F4511E" }}
                    >
                      Ver opções e preços
                    </Text>
                  </View>
                )
              )}

              {/* Add to cart button */}
              {isCartEnabled && (
                <TouchableOpacity
                  onPress={handleAddToCart}
                  className="rounded-full p-3 self-end"
                  style={{
                    backgroundColor: hasVariation
                      ? `${vm.primaryColor || "#F4511E"}20`
                      : vm.primaryColor || "#F4511E",
                  }}
                >
                  <ShoppingBag
                    size={20}
                    color={
                      hasVariation
                        ? vm.primaryColor || "#F4511E"
                        : contrastTextColor
                    }
                  />
                </TouchableOpacity>
              )}
            </HStack>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Layout para delivery com design mais moderno
  if (isDeliveryPlan) {
    return (
      <TouchableOpacity
        onPress={handleProductPress}
        className="w-full"
        activeOpacity={0.7}
        style={style}
      >
        <Box className="flex-row overflow-hidden max-h-40 mb-3 rounded-xl bg-white shadow-sm border border-gray-100">
          {/* Imagem do produto */}
          <View className="w-32 h-32 relative">
            <ImagePreview
              uri={product.imagem}
              fallbackIcon={Package}
              width="100%"
              height="100%"
              resizeMode="cover"
            />

            {/* Badge de variações ou desconto */}
            {hasVariation ? (
              <View className="absolute top-1 left-1 bg-purple-500 px-2 py-0.5 rounded-full">
                <Text className="text-white text-xs font-medium">
                  {product.variacao?.variacao?.length || 0} opções
                </Text>
              </View>
            ) : product.preco_promocional && shouldShowPrice ? (
              <View className="absolute top-1 left-1 bg-red-500 px-2 py-0.5 rounded-full">
                <Text className="text-white text-xs font-medium">
                  {calculateDiscount(product.preco, product.preco_promocional)}%
                  OFF
                </Text>
              </View>
            ) : null}
          </View>

          {/* Informações do produto */}
          <View className="flex-1 p-3 justify-between">
            <VStack space="xs">
              <Text className="font-semibold text-gray-800 line-clamp-1 text-base">
                {product.nome}
              </Text>

              {/* Descrição ou variações */}
              {hasVariation ? (
                <Text className="text-gray-600 text-xs line-clamp-2">
                  <Text className="font-medium">Variações:</Text>{" "}
                  {product.variacao?.variacao?.join(", ") || "Múltiplas opções"}
                </Text>
              ) : product.descricao ? (
                <Text className="text-gray-600 text-xs line-clamp-2">
                  {product.descricao}
                </Text>
              ) : null}
            </VStack>

            {/* Botão e preço */}
            <HStack className="justify-between items-center mt-auto pt-1">
              {shouldShowPrice ? (
                <View>
                  {product.preco_promocional ? (
                    <View>
                      <Text
                        className="text-base font-bold"
                        style={{ color: vm.primaryColor || "#F4511E" }}
                      >
                        {formatCurrency(product.preco_promocional)}
                      </Text>
                      <Text className="text-xs text-gray-400 line-through">
                        {formatCurrency(product.preco)}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      className="text-base font-bold"
                      style={{ color: vm.primaryColor || "#F4511E" }}
                    >
                      {formatCurrency(product.preco)}
                    </Text>
                  )}
                </View>
              ) : (
                <Text className="text-sm text-gray-700 font-medium">
                  {hasVariation ? "Ver opções" : "Consultar preço"}
                </Text>
              )}

              {/* Botão de adicionar ao carrinho */}
              {isCartEnabled && (
                <TouchableOpacity
                  onPress={handleAddToCart}
                  className="rounded-full p-2"
                  style={{
                    backgroundColor: vm.primaryColor || "#F4511E",
                  }}
                >
                  <ShoppingBag size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </HStack>
          </View>
        </Box>
      </TouchableOpacity>
    );
  }

  // Layout de catálogo padrão com design modernizado
  return (
    <TouchableOpacity
      onPress={handleProductPress}
      className="relative"
      activeOpacity={0.7}
      style={style}
    >
      <Card className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Imagem do produto */}
        <View className="aspect-square relative">
          <ImagePreview
            uri={product.imagem}
            fallbackIcon={Package}
            width="100%"
            height="100%"
            resizeMode="cover"
          />

          {/* Badges no canto superior */}
          <View className="absolute top-0 left-0 right-0 p-2 flex-row justify-between">
            {hasVariation ? (
              <View className="bg-purple-500 px-2 py-1 rounded-full shadow-sm">
                <Text className="text-white text-xs font-bold">
                  {product.variacao?.variacao?.length || 0} opções
                </Text>
              </View>
            ) : (
              showFeaturedBadge && (
                <View className="bg-amber-500 rounded-full p-1.5 shadow-sm">
                  <Star size={14} color="#fff" />
                </View>
              )
            )}

            {product.preco_promocional && shouldShowPrice && (
              <View className="bg-red-500 px-2 py-1 rounded-full shadow-sm">
                <Text className="text-white text-xs font-bold">
                  {calculateDiscount(product.preco, product.preco_promocional)}%
                  OFF
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Informações do produto */}
        <View className="p-3">
          {/* Título */}
          <Text
            className="font-medium text-gray-800 text-base"
            numberOfLines={2}
          >
            {product.nome}
          </Text>

          {/* Descrição ou variações */}
          {hasVariation ? (
            <View className="mt-1 mb-2">
              <Text className="text-xs text-gray-500" numberOfLines={2}>
                {variationText}
              </Text>
            </View>
          ) : product.descricao ? (
            <Text className="text-xs text-gray-500 mt-1 mb-2" numberOfLines={2}>
              {product.descricao}
            </Text>
          ) : null}

          {/* Linha divisória */}
          <View className="border-t border-gray-100 pt-2 mt-1">
            {/* Preço e botão */}
            <HStack className="justify-between items-center">
              {shouldShowPrice ? (
                <View>
                  {product.preco_promocional ? (
                    <View>
                      <Text
                        className="text-base font-bold"
                        style={{ color: vm.primaryColor || "#F4511E" }}
                      >
                        {formatCurrency(product.preco_promocional)}
                      </Text>
                      <Text className="text-xs text-gray-400 line-through">
                        {formatCurrency(product.preco)}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      className="text-base font-bold"
                      style={{ color: vm.primaryColor || "#F4511E" }}
                    >
                      {formatCurrency(product.preco)}
                    </Text>
                  )}
                </View>
              ) : (
                <View className="py-1 px-2 rounded-lg bg-gray-50">
                  <Text className="text-sm text-gray-700">
                    {hasVariation ? "Ver opções" : "Consultar"}
                  </Text>
                </View>
              )}

              {/* Botão de adicionar ao carrinho */}
              {isCartEnabled && (
                <TouchableOpacity
                  onPress={handleAddToCart}
                  className="p-2 rounded-full"
                  style={{
                    backgroundColor: `${vm.primaryColor || "#F4511E"}20`,
                  }}
                >
                  <ShoppingBag size={18} color={vm.primaryColor || "#F4511E"} />
                </TouchableOpacity>
              )}
            </HStack>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
