// Path: components/showcase/product-card.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Package } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { ShowcaseItem } from "@/src/features/commerce/models/showcase-item";

interface ProductCardProps {
  product: ShowcaseItem;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  // Format currency
  const formatCurrency = (value: string) => {
    if (!value) return "";
    try {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) return "";
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numericValue);
    } catch (error) {
      console.error("Error formatting currency value:", error);
      return value;
    }
  };

  // Calculate discount
  const calculateDiscount = (original: string, promotional: string) => {
    if (!original || !promotional) return 0;
    try {
      const originalValue = parseFloat(original.replace(",", "."));
      const promotionalValue = parseFloat(promotional.replace(",", "."));
      return Math.round(
        ((originalValue - promotionalValue) / originalValue) * 100
      );
    } catch (error) {
      console.error("Error calculating discount:", error);
      return 0;
    }
  };

  // Determine if it's a product with variation and has a variation selected
  const hasVariationSelected = !!product.produto_variado;

  // Get the correct image (from variation product if available, else from main product)
  const productImage = hasVariationSelected
    ? product.produto_variado?.imagem || product.imagem
    : product.imagem;

  // Get the correct price (from variation product if available, else from main product)
  const productPrice = hasVariationSelected
    ? product.produto_variado?.preco
    : product.preco;

  const productPromotionalPrice = hasVariationSelected
    ? product.produto_variado?.preco_promocional
    : product.preco_promocional;

  // Format the display name to include variation if available
  const displayName =
    hasVariationSelected && product.produto_variado?.valor_variacao
      ? `${product.nome} - ${product.produto_variado.valor_variacao}`
      : product.nome;

  // Get the correct description
  const productDescription =
    hasVariationSelected && product.produto_variado?.descricao
      ? product.produto_variado.descricao
      : product.descricao;

  // Get the correct availability
  const isAvailable = hasVariationSelected
    ? product.produto_variado?.disponivel
    : product.disponivel;

  return (
    <TouchableOpacity onPress={onPress} className="w-64 flex-shrink-0 mr-4">
      {/* Fixed height Card */}
      <Card
        className={` rounded-xl overflow-hidden h-96 ${
          !isAvailable ? "opacity-70" : ""
        }`}
      >
        {/* Image section with fixed proportion */}
        <View className="relative" style={{ height: "50%" }}>
          {productImage ? (
            <ImagePreview
              uri={productImage}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-100">
              <Package size={48} color="#6B7280" />
            </View>
          )}

          {productPromotionalPrice && (
            <View className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">
                {calculateDiscount(
                  productPrice || "0",
                  productPromotionalPrice
                )}
                % OFF
              </Text>
            </View>
          )}

          {!isAvailable && (
            <View className="absolute top-2 left-2 bg-gray-700 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">Indisponível</Text>
            </View>
          )}
        </View>

        {/* Content section with fixed height and internal scroll if needed */}
        <View className="p-4 flex-1 justify-between">
          <View>
            {/* Title with fixed max height */}
            <Text
              className="text-lg font-semibold text-gray-800"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {displayName}
            </Text>

            {/* Description with fixed max height */}
            <Text
              className="text-sm text-gray-600 mt-1 font-sans"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {productDescription}
            </Text>
          </View>

          {/* Price section with fixed position at the bottom */}
          <View className="mt-2">
            {productPromotionalPrice ? (
              <>
                <Text className="text-xl font-bold text-primary-600">
                  {formatCurrency(productPromotionalPrice)}
                </Text>
                <Text className="text-sm text-gray-500 line-through font-medium">
                  {formatCurrency(productPrice || "0")}
                </Text>
              </>
            ) : (
              productPrice && (
                <Text className="text-xl font-bold text-primary-600">
                  {formatCurrency(productPrice)}
                </Text>
              )
            )}

            {product.parcelamento_cartao &&
              product.quantidade_parcelas &&
              productPrice && (
                <Text className="text-sm text-gray-600">
                  ou {product.quantidade_parcelas}x de{" "}
                  {formatCurrency(
                    (
                      parseFloat(
                        (productPromotionalPrice || productPrice).replace(
                          ",",
                          "."
                        )
                      ) / (product.quantidade_parcelas || 1)
                    ).toString()
                  )}
                  {product.parcelas_sem_juros && " sem juros"}
                </Text>
              )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
