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

  const contrastTextColor = getContrastColor(vm.primaryColor || "#F4511E");

  // Se o card for destacado (usado em vitrines/destaques), usar o design mais visual
  if (isHighlighted) {
    // Proporção mais quadrada (ajustada para 4:4.5 - quase quadrada)
    const cardWidth = isWeb ? (width > 768 ? 380 : width * 0.85) : width * 0.85;
    const cardHeight = cardWidth * 0.9; // Proporção ajustada para ficar mais quadrada

    // Verificar se o produto tem variação
    const hasVariation = product.tem_variacao === true;

    // Determinar se deve exibir o preço
    const shouldShowPrice =
      !hasVariation || (product.exibir_preco && product.preco);

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

          {/* Botão de adicionar ao carrinho no canto inferior direito */}
          {isCartEnabled && !hasVariation && (
            <TouchableOpacity
              onPress={handleAddToCart}
              className="absolute bottom-4 right-4 rounded-full p-3 z-10"
              style={{ backgroundColor: vm.primaryColor || "#F4511E" }}
            >
              <ShoppingBag size={24} color={contrastTextColor} />
            </TouchableOpacity>
          )}

          {/* Badge de variação (se aplicável) */}
          {hasVariation && (
            <View className="absolute top-4 left-4 bg-purple-500 px-2 py-1 rounded-full shadow-sm z-10">
              <Text className="text-white text-xs font-bold">
                {product.variacao?.variacao?.length || 0} opções
              </Text>
            </View>
          )}

          {/* Badge de destaque (se habilitado) */}
          {showFeaturedBadge && !hasVariation && (
            <View className="absolute top-4 left-4 bg-amber-500 rounded-full p-1.5 shadow-sm z-10">
              <Star size={14} color="#fff" />
            </View>
          )}

          {/* Badge de desconto (se aplicável) */}
          {product.preco_promocional && shouldShowPrice && (
            <View className="absolute top-4 right-4 bg-red-500 px-2 py-1 rounded-full shadow-sm z-10">
              <Text className="text-white text-xs font-bold">
                {calculateDiscount(product.preco, product.preco_promocional)}%
                OFF
              </Text>
            </View>
          )}

          {/* Conteúdo do card */}
          <View className="flex-1 justify-end p-5">
            {/* Nome do produto (sem descrição para esse layout) */}
            <Text
              className="text-white font-sans text-2xl mb-3"
              numberOfLines={2}
            >
              {product.nome}
            </Text>

            {/* Preço */}
            <View className="flex-row items-center">
              <View className="flex-1">
                {shouldShowPrice ? (
                  <>
                    {product.preco_promocional ? (
                      <View>
                        <Text className="text-white/80 text-sm line-through">
                          {formatCurrency(product.preco)}
                        </Text>
                        <Text className="text-white font-bold text-3xl">
                          {formatCurrency(product.preco_promocional)}
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-white font-semibold text-xl">
                        {formatCurrency(product.preco)}
                      </Text>
                    )}

                    {/* Informações de parcelamento */}
                    {product.parcelamento_cartao &&
                      product.quantidade_parcelas && (
                        <Text className="text-white text-sm mt-1">
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

                    {/* Preço à vista */}
                    {product.desconto_avista && (
                      <Text className="text-green-300 text-sm font-medium mt-1">
                        {formatCurrency(
                          (
                            parseFloat(
                              product.preco_promocional || product.preco
                            ) *
                            (1 - product.desconto_avista / 100)
                          ).toFixed(2)
                        )}{" "}
                        à vista ({product.desconto_avista}% off)
                      </Text>
                    )}
                  </>
                ) : (
                  hasVariation && (
                    <View className="bg-black/40 rounded-lg py-2 px-3">
                      <Text className="text-white font-medium">
                        {product.variacao?.nome || "Produto com variações"}
                      </Text>
                      <Text className="text-white/80 text-xs mt-1">
                        Clique para ver as opções
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Layout horizontal para delivery
  if (isDeliveryPlan) {
    // Verificar se o produto tem variação
    const hasVariation = product.tem_variacao === true;

    // Determinar se deve exibir o preço
    const shouldShowPrice =
      !hasVariation || (product.exibir_preco && product.preco);

    return (
      <TouchableOpacity
        onPress={handleProductPress}
        className="w-full"
        activeOpacity={0.7}
        style={style}
      >
        <Box className="flex-row  overflow-hidden max-h-40 mb-3 px-2 py-4 rounded-md bg-white">
          {/* Imagem do produto */}
          <ImagePreview
            uri={product.imagem}
            fallbackIcon={Package}
            width="180px"
            height="100%"
            resizeMode="cover"
            containerClassName="aspect-square rounded-md overflow-hidden"
          />

          {/* Informações do produto */}
          <View className="flex-1 px-3 justify-between">
            <VStack>
              <Text className="font-semibold text-gray-800 line-clamp-1 text-lg pb-0 mb-1">
                {product.nome}
              </Text>

              {/* Descricao */}
              {!hasVariation && product.descricao && (
                <Text className="text-gray-600 text-sm line-clamp-1 ">
                  {product.descricao}
                </Text>
              )}
            </VStack>

            {/* Preços */}
            <View className="flex-row justify-between items-center">
              {shouldShowPrice ? (
                <View>
                  {product.preco_promocional ? (
                    <View>
                      <Text
                        className="text-lg font-bold"
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
                <View>
                  <Text className="text-sm text-gray-700 font-medium">
                    {product.variacao?.nome || "Produto com variações"}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleAddToCart}
                className="rounded-full p-2"
                style={{
                  backgroundColor: `${vm.primaryColor || "#F4511E"}20`,
                }}
              >
                <ShoppingBag size={20} color={vm.primaryColor || "#F4511E"} />
              </TouchableOpacity>
            </View>
          </View>
        </Box>
      </TouchableOpacity>
    );
  }

  // Verificar se o produto tem variação
  const hasVariation = product.tem_variacao === true;

  // Determinar se deve exibir o preço
  const shouldShowPrice =
    !hasVariation || (product.exibir_preco && product.preco);

  // Texto adicional para produtos com variação
  const variationText = hasVariation
    ? product.variacao?.nome
      ? `Opções: ${product.variacao.nome}`
      : "Produto com variações"
    : null;

  // Layout vertical padrão para catálogo
  return (
    <TouchableOpacity
      onPress={handleProductPress}
      className="relative"
      activeOpacity={0.7}
      style={style}
    >
      <Card className="rounded-xl border border-gray-100 shadow-sm transition-transform duration-200 hover:shadow-md">
        {/* Imagem do produto */}
        <View className="aspect-square relative">
          <ImagePreview
            uri={product.imagem}
            fallbackIcon={Package}
            width="100%"
            height="100%"
            resizeMode="cover"
          />

          {/* Badges */}
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

          {/* Quick-add button - somente mostrado se não for produto com variação */}
          {isCartEnabled && !hasVariation && (
            <TouchableOpacity
              onPress={handleAddToCart}
              className="absolute bottom-3 right-3 rounded-full p-2 shadow-md"
              style={{ backgroundColor: vm.primaryColor || "#F4511E" }}
            >
              <ShoppingBag size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Informações do produto */}
        <View className="p-3">
          <Text
            className="font-medium text-gray-800 line-clamp-2 text-base"
            numberOfLines={2}
          >
            {product.nome}
          </Text>

          {product.descricao && !hasVariation && (
            <Text
              className="text-xs text-gray-500 mt-1 line-clamp-2"
              numberOfLines={2}
            >
              {product.descricao}
            </Text>
          )}

          <View className="mt-2 pt-2 border-t border-gray-100">
            {shouldShowPrice ? (
              <>
                {product.preco_promocional ? (
                  <View className="flex-row items-baseline gap-2">
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

                {product.parcelamento_cartao && product.quantidade_parcelas && (
                  <Text className="text-xs text-gray-600 mt-1">
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

                {product.desconto_avista && (
                  <Text className="text-xs text-green-600 font-medium mt-1">
                    {formatCurrency(
                      (
                        parseFloat(product.preco_promocional || product.preco) *
                        (1 - product.desconto_avista / 100)
                      ).toFixed(2)
                    )}{" "}
                    à vista ({product.desconto_avista}% de desconto)
                  </Text>
                )}
              </>
            ) : (
              // Mensagem para produtos com variação
              hasVariation && (
                <View className="bg-gray-50 rounded-lg py-2 px-3">
                  <Text className="text-sm text-gray-700 font-medium">
                    {product.variacao?.nome || "Produto com variações"}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {product.variacao?.variacao?.length || 0} opções disponíveis
                  </Text>
                </View>
              )
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
