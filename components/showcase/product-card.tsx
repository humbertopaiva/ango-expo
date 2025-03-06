// Path: src/features/commerce/components/enhanced-vitrine/ProductCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Package, Tag } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { ShowcaseItem } from "@/src/features/commerce/models/showcase-item";

interface ProductCardProps {
  product: ShowcaseItem;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
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
    const originalValue = parseFloat(original.replace(",", "."));
    const promotionalValue = parseFloat(promotional.replace(",", "."));
    return Math.round(
      ((originalValue - promotionalValue) / originalValue) * 100
    );
  };

  return (
    <TouchableOpacity onPress={onPress} className="w-64 flex-shrink-0 mr-4">
      <Card className="border border-gray-200 rounded-xl overflow-hidden">
        <View className="relative aspect-square">
          {product.imagem ? (
            <ImagePreview
              uri={product.imagem}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-100">
              <Package size={48} color="#6B7280" />
            </View>
          )}

          {product.preco_promocional && (
            <View className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">
                {calculateDiscount(product.preco, product.preco_promocional)}%
                OFF
              </Text>
            </View>
          )}
        </View>

        <View className="p-4 space-y-2">
          <Text className="text-lg font-semibold text-gray-800 line-clamp-2">
            {product.nome}
          </Text>

          <Text className="text-sm text-gray-600 line-clamp-2">
            {product.descricao}
          </Text>

          <View className="mt-2 space-y-1">
            {product.preco_promocional ? (
              <>
                <Text className="text-lg font-bold text-primary-600">
                  {formatCurrency(product.preco_promocional)}
                </Text>
                <Text className="text-sm text-gray-500 line-through">
                  {formatCurrency(product.preco)}
                </Text>
              </>
            ) : (
              <Text className="text-lg font-bold text-primary-600">
                {formatCurrency(product.preco)}
              </Text>
            )}

            {product.parcelamento_cartao && product.quantidade_parcelas && (
              <Text className="text-xs text-gray-600">
                ou {product.quantidade_parcelas}x de{" "}
                {formatCurrency(
                  (
                    parseFloat(product.preco_promocional || product.preco) /
                    (product.quantidade_parcelas || 1)
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
