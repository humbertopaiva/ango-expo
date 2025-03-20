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
      {/* Aplicando altura fixa ao Card */}
      <Card className="border border-gray-200 rounded-xl overflow-hidden h-96">
        {/* Seção da imagem com proporção fixa */}
        <View className="relative" style={{ height: "50%" }}>
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

        {/* Seção do conteúdo com altura fixa e scroll interno se necessário */}
        <View className="p-4 flex-1 justify-between">
          <View>
            {/* Título com altura máxima fixa */}
            <Text
              className="text-lg font-semibold text-gray-800"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {product.nome}
            </Text>

            {/* Descrição com altura máxima fixa */}
            <Text
              className="text-sm text-gray-600 mt-1 font-sans"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {product.descricao}
            </Text>
          </View>

          {/* Seção de preço com posicionamento fixo na parte inferior */}
          <View className="mt-2">
            {product.preco_promocional ? (
              <>
                <Text className="text-xl font-bold text-primary-600">
                  {formatCurrency(product.preco_promocional)}
                </Text>
                <Text className="text-sm text-gray-500 line-through font-medium">
                  {formatCurrency(product.preco)}
                </Text>
              </>
            ) : (
              <Text className="text-xl font-bold text-primary-600">
                {formatCurrency(product.preco)}
              </Text>
            )}

            {product.parcelamento_cartao && product.quantidade_parcelas && (
              <Text className="text-sm text-gray-600">
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
