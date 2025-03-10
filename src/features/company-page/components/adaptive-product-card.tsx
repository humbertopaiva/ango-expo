// Path: src/features/company-page/components/adaptive-product-card.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Package, Star } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { CompanyProduct } from "../models/company-product";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { router } from "expo-router";

interface AdaptiveProductCardProps {
  product: CompanyProduct;
  style?: any;
  showFeaturedBadge?: boolean;
}

export function AdaptiveProductCard({
  product,
  style,
  showFeaturedBadge = false,
}: AdaptiveProductCardProps) {
  const vm = useCompanyPageContext();
  const isDeliveryPlan =
    vm.profile?.empresa.plano?.nome?.toLowerCase() === "delivery";

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
      pathname: `/(drawer)/empresa/${vm.profile?.empresa.slug}/product/${product.id}`,
      params: { productId: product.id },
    });
  };

  // Layout horizontal para delivery
  if (isDeliveryPlan) {
    return (
      <TouchableOpacity
        onPress={handleProductPress}
        className="w-full"
        activeOpacity={0.7}
        style={style}
      >
        <Card className="flex-row border border-gray-100 rounded-xl overflow-hidden h-24 mb-2">
          {/* Imagem do produto */}
          <View className="w-24 h-24 relative">
            <ImagePreview
              uri={product.imagem}
              fallbackIcon={Package}
              width="100%"
              height="100%"
              resizeMode="cover"
            />

            {product.preco_promocional && (
              <View className="absolute top-1 left-1 bg-red-500 px-1.5 py-0.5 rounded-full">
                <Text className="text-white text-xs font-bold">
                  {calculateDiscount(product.preco, product.preco_promocional)}%
                </Text>
              </View>
            )}

            {showFeaturedBadge && (
              <View className="absolute bottom-1 right-1 bg-amber-500 rounded-full p-1">
                <Star size={12} color="#fff" />
              </View>
            )}
          </View>

          {/* Informações do produto */}
          <View className="flex-1 p-3 justify-between">
            <View>
              <Text
                className="font-medium text-sm line-clamp-1"
                numberOfLines={1}
              >
                {product.nome}
              </Text>

              {product.descricao && (
                <Text
                  className="text-xs text-gray-500 line-clamp-2 mt-0.5"
                  numberOfLines={2}
                >
                  {product.descricao}
                </Text>
              )}
            </View>

            <View>
              {product.preco_promocional ? (
                <View className="flex-row items-center">
                  <Text className="text-sm font-bold text-primary-600">
                    {formatCurrency(product.preco_promocional)}
                  </Text>
                  <Text className="text-xs text-gray-400 line-through ml-1">
                    {formatCurrency(product.preco)}
                  </Text>
                </View>
              ) : (
                <Text className="text-sm font-bold text-primary-600">
                  {formatCurrency(product.preco)}
                </Text>
              )}
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  // Layout vertical padrão para catálogo
  return (
    <TouchableOpacity
      onPress={handleProductPress}
      className="relative"
      activeOpacity={0.7}
      style={style}
    >
      <Card className="overflow-hidden rounded-xl border border-gray-100">
        {/* Imagem do produto */}
        <View className="aspect-square relative">
          <ImagePreview
            uri={product.imagem}
            fallbackIcon={Package}
            width="100%"
            height="100%"
            resizeMode="cover"
          />

          {product.preco_promocional && (
            <View className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">
                {calculateDiscount(product.preco, product.preco_promocional)}%
              </Text>
            </View>
          )}

          {showFeaturedBadge && (
            <View className="absolute top-2 left-2 bg-amber-500 rounded-full p-1.5">
              <Star size={14} color="#fff" />
            </View>
          )}
        </View>

        {/* Informações do produto */}
        <View className="p-3">
          <Text
            className="font-medium text-gray-800 line-clamp-2"
            numberOfLines={2}
          >
            {product.nome}
          </Text>

          {product.descricao && (
            <Text
              className="text-xs text-gray-500 mt-1 line-clamp-2"
              numberOfLines={2}
            >
              {product.descricao}
            </Text>
          )}

          <View className="mt-2">
            {product.preco_promocional ? (
              <>
                <Text className="text-sm font-bold text-primary-600">
                  {formatCurrency(product.preco_promocional)}
                </Text>
                <Text className="text-xs text-gray-400 line-through">
                  {formatCurrency(product.preco)}
                </Text>
              </>
            ) : (
              <Text className="text-sm font-bold text-primary-600">
                {formatCurrency(product.preco)}
              </Text>
            )}

            {product.parcelamento_cartao && product.quantidade_parcelas && (
              <Text className="text-xs text-gray-500 mt-1">
                ou {product.quantidade_parcelas}x de{" "}
                {formatCurrency(
                  (
                    parseFloat(product.preco_promocional || product.preco) /
                    parseInt(product.quantidade_parcelas)
                  ).toString()
                )}
                {product.parcelas_sem_juros ? " sem juros" : ""}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
