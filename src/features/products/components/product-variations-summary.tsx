// Path: src/features/products/components/product-variations-summary.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card, Badge } from "@gluestack-ui/themed";
import { Tag, ChevronRight, CheckCircle, XCircle } from "lucide-react-native";

interface ProductVariation {
  id: string;
  valor_variacao: string;
  produto?: {
    preco?: string;
    status?: string;
    imagem?: string | null;
  };
}

interface ProductVariationsSummaryProps {
  variations: ProductVariation[];
  variationName: string;
  onPressManage: () => void;
}

export function ProductVariationsSummary({
  variations,
  variationName,
  onPressManage,
}: ProductVariationsSummaryProps) {
  const formatCurrency = (value?: string) => {
    if (!value) return "-";

    try {
      const numericValue = parseFloat(value);
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numericValue);
    } catch (error) {
      return "-";
    }
  };

  return (
    <Card className="p-4 bg-white">
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Tag size={18} color="#0891B2" />
          <Text className="ml-2 font-semibold text-gray-800">
            {variationName} ({variations.length})
          </Text>
        </View>

        <TouchableOpacity
          className="flex-row items-center"
          onPress={onPressManage}
        >
          <Text className="text-primary-500 mr-1">Gerenciar</Text>
          <ChevronRight size={16} color="#0891B2" />
        </TouchableOpacity>
      </View>

      {variations.length === 0 ? (
        <View className="py-4 bg-gray-50 rounded-lg items-center">
          <Text className="text-gray-500">Nenhuma variação cadastrada</Text>
        </View>
      ) : (
        <View className="border-t border-gray-100 pt-2">
          {variations.slice(0, 3).map((variation, index) => (
            <View
              key={variation.id}
              className={`py-2 flex-row justify-between items-center ${
                index < variations.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <View className="flex-row items-center">
                <Text className="text-gray-800 font-medium">
                  {variation.valor_variacao}
                </Text>
                {variation.produto?.status === "disponivel" ? (
                  <CheckCircle size={14} color="#22C55E" className="ml-2" />
                ) : (
                  <XCircle size={14} color="#EF4444" className="ml-2" />
                )}
              </View>
              <Text className="text-gray-600">
                {formatCurrency(variation.produto?.preco)}
              </Text>
            </View>
          ))}

          {variations.length > 3 && (
            <View className="pt-2 border-t border-gray-100 mt-2">
              <Text className="text-center text-gray-500 text-sm">
                +{variations.length - 3} outras variações
              </Text>
            </View>
          )}

          <TouchableOpacity
            className="mt-3 bg-gray-50 py-2 rounded-lg items-center"
            onPress={onPressManage}
          >
            <Text className="text-primary-500">Gerenciar variações</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
}
