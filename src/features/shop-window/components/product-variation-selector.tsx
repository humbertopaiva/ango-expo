// Path: src/features/shop-window/components/product-variation-selector.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Card } from "@gluestack-ui/themed";
import { useProductVariationItems } from "@/src/features/products/hooks/use-product-variations-items";
import { ResilientImage } from "@/components/common/resilient-image";
import { DollarSign, Package } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

interface ProductVariationSelectorProps {
  productId: string;
  productName: string; // Adicionando nome do produto para referência
  selectedVariationId: string | null;
  onSelectVariation: (variationId: string | null) => void;
}

export function ProductVariationSelector({
  productId,
  productName, // Nome do produto para ser usado na visualização
  selectedVariationId,
  onSelectVariation,
}: ProductVariationSelectorProps) {
  const { variationItems, isLoading, refetch } =
    useProductVariationItems(productId);
  const [hasTriedRefetch, setHasTriedRefetch] = useState(false);

  // Tentar uma refetch automática se não houver itens inicialmente
  useEffect(() => {
    if (!isLoading && variationItems.length === 0 && !hasTriedRefetch) {
      setHasTriedRefetch(true);
      refetch();
    }
  }, [isLoading, variationItems, refetch, hasTriedRefetch]);

  const formatCurrency = (value: string | null | undefined) => {
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
      return "";
    }
  };

  if (isLoading) {
    return (
      <View className="py-4 items-center">
        <ActivityIndicator color={THEME_COLORS.primary} size="small" />
        <Text className="text-gray-500 text-sm mt-2">
          Carregando variações...
        </Text>
      </View>
    );
  }

  if (variationItems.length === 0) {
    return (
      <View className="py-4 items-center">
        <Text className="text-gray-500 text-sm">
          Nenhuma variação disponível para este produto.
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="mt-2 bg-gray-100 px-3 py-1 rounded-full"
        >
          <Text className="text-gray-700 text-sm">Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="mt-3">
      <Text className="text-sm font-medium text-gray-700 mb-2">
        Selecione uma variação do produto:
      </Text>
      <FlatList
        data={variationItems}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelectVariation(item.id)}
            className="mb-2"
          >
            <Card
              className={`p-3 border ${
                selectedVariationId === item.id
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <View className="flex-row items-center">
                {/* Imagem da variação (se disponível) */}
                <View className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden mr-3">
                  {item.imagem ? (
                    <ResilientImage
                      source={item.imagem}
                      style={{ height: "100%", width: "100%" }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-full w-full items-center justify-center">
                      <Package size={20} color="#6B7280" />
                    </View>
                  )}
                </View>

                <View className="flex-1">
                  {/* Nome do produto com valor da variação */}
                  <Text className="font-medium text-gray-800" numberOfLines={2}>
                    {productName} -{" "}
                    <Text className="text-primary-600">
                      {item.valor_variacao}
                    </Text>
                  </Text>

                  {/* Status de disponibilidade */}
                  <View className="flex-row mt-1">
                    <View
                      className={`px-1.5 py-0.5 rounded-full ${
                        item.disponivel || item.status === "disponivel"
                          ? "bg-green-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={`text-xs ${
                          item.disponivel || item.status === "disponivel"
                            ? "text-green-700"
                            : "text-gray-700"
                        }`}
                      >
                        {item.disponivel || item.status === "disponivel"
                          ? "Disponível"
                          : "Indisponível"}
                      </Text>
                    </View>
                  </View>

                  {/* Preço */}
                  <View className="flex-row items-center mt-1">
                    <View className="flex-row items-center bg-gray-50 px-1.5 py-0.5 rounded-md mr-2">
                      <DollarSign size={10} color="#4B5563" />
                      <Text className="font-medium text-xs text-gray-700 ml-0.5">
                        {formatCurrency(item.preco)}
                      </Text>
                    </View>

                    {item.preco_promocional && (
                      <Text className="text-xs text-gray-500 line-through">
                        {formatCurrency(item.preco_promocional)}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Indicador de seleção */}
                {selectedVariationId === item.id && (
                  <View className="w-6 h-6 rounded-full bg-primary-500 items-center justify-center">
                    <Text className="text-white font-bold">✓</Text>
                  </View>
                )}
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
