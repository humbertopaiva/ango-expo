// Path: src/features/products/components/product-card.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Edit, Trash, Eye, Layers } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { ImagePreview } from "@/components/custom/image-preview";
import { StatusBadge } from "@/components/custom/status-badge";
import { Product } from "../models/product";

interface ProductCardProps {
  product: Product;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onAddVariation?: () => void;
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
  onView,
  onAddVariation,
}: ProductCardProps) {
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

  // Se o produto já tem variação, o botão de adicionar variação ficará ativo
  const canAddVariation = product.tem_variacao;

  return (
    <Card className="p-4 bg-white mb-3">
      <View className="flex-row items-center gap-3">
        {/* Imagem do produto */}
        <View className="h-16 w-16">
          <ImagePreview uri={product.imagem} containerClassName="rounded-lg" />
        </View>

        {/* Informações do produto */}
        <View className="flex-1">
          <Text
            className="font-medium text-sm"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {product.nome}
          </Text>

          {/* Preço */}
          {product.preco && (
            <View className="flex-row items-center mt-1">
              {product.preco_promocional ? (
                <>
                  <Text className="font-medium text-xs text-primary-500">
                    {formatCurrency(product.preco_promocional)}
                  </Text>
                  <Text className="ml-2 text-xs text-gray-500 line-through">
                    {formatCurrency(product.preco)}
                  </Text>
                </>
              ) : (
                <Text className="font-medium text-sm text-primary-600">
                  {formatCurrency(product.preco)}
                </Text>
              )}
            </View>
          )}

          {/* Status e badges */}
          <View className="flex-row items-center mt-1 gap-2">
            <StatusBadge
              status={product.status}
              customLabel={
                product.status === "disponivel" ? "Disponível" : "Indisponível"
              }
            />

            {product.tem_variacao && (
              <View className="px-2 py-1 rounded-full bg-blue-100">
                <Text className="text-xs text-blue-800">Com variações</Text>
              </View>
            )}
          </View>
        </View>

        {/* Ações */}
        <View className="grid grid-cols-2 gap-2">
          {/* Grid de ações 2x2 */}
          <View className="grid grid-cols-2 gap-2">
            {/* Botão de visualizar */}
            <TouchableOpacity
              onPress={onView}
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
            >
              <Eye size={18} color="#374151" />
            </TouchableOpacity>

            {/* Botão de editar */}
            <TouchableOpacity
              onPress={onEdit}
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
            >
              <Edit size={18} color="#374151" />
            </TouchableOpacity>

            {/* Botão de adicionar variação */}
            <TouchableOpacity
              onPress={onAddVariation}
              disabled={!canAddVariation}
              className={`w-9 h-9 rounded-full items-center justify-center ${
                canAddVariation ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <Layers
                size={18}
                color={canAddVariation ? "#1E40AF" : "#9CA3AF"}
              />
            </TouchableOpacity>

            {/* Botão de excluir */}
            <TouchableOpacity
              onPress={onDelete}
              className="w-9 h-9 rounded-full bg-red-100 items-center justify-center"
            >
              <Trash size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );
}
