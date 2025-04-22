// Path: src/features/products/components/product-card.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Edit, Trash, Eye, Layers, MoreVertical } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { ImagePreview } from "@/components/custom/image-preview";
import { StatusBadge } from "@/components/custom/status-badge";
import { Product } from "../models/product";
import * as Haptics from "expo-haptics";
import { useProducts } from "../hooks/use-products";

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
  const [showActions, setShowActions] = useState(false);
  const { hasVariation } = useProducts();

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

  // Verificar se o produto tem variação
  const productHasVariation = hasVariation(product);

  const toggleActions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowActions(!showActions);
  };

  // Função para obter o nome da variação
  const getVariationName = () => {
    if (!product.variacao) return null;

    if (typeof product.variacao === "object" && product.variacao.nome) {
      return product.variacao.nome;
    }

    return "Variação configurada";
  };

  return (
    <Card className="bg-white overflow-hidden">
      <Pressable
        onPress={onView}
        className="flex-1"
        android_ripple={{ color: "rgba(0, 0, 0, 0.05)" }}
      >
        <View className="p-4">
          <View className="flex-row">
            {/* Imagem do produto */}
            <View className="h-16 w-16 mr-3">
              <ImagePreview
                uri={product.imagem}
                containerClassName="rounded-lg"
              />
            </View>

            {/* Informações do produto */}
            <View className="flex-1 justify-center">
              <Text
                className="font-medium text-sm"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {product.nome}
              </Text>

              {/* Preço */}
              {product.preco && !productHasVariation && (
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

              {/* Variação - mostrar qual variação está configurada */}
              {productHasVariation && (
                <View className="mt-1">
                  <Text className="text-xs text-blue-700">
                    Variação: {getVariationName()}
                  </Text>
                </View>
              )}

              {/* Status e badges */}
              <View className="flex-row items-center mt-1 gap-2">
                <StatusBadge
                  status={product.status}
                  customLabel={
                    product.status === "disponivel"
                      ? "Disponível"
                      : "Indisponível"
                  }
                />

                {productHasVariation && (
                  <View className="px-2 py-1 rounded-full bg-blue-100">
                    <Text className="text-xs text-blue-800">Com variações</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Menu de ações */}
            <TouchableOpacity
              onPress={toggleActions}
              className="p-2 self-start"
            >
              <MoreVertical size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>

      {/* Ações (expandíveis) */}
      {showActions && (
        <View className="flex-row border-t border-gray-100 bg-gray-50">
          {onView && (
            <TouchableOpacity
              onPress={() => {
                onView();
                setShowActions(false);
              }}
              className="flex-1 p-3 flex-row items-center justify-center"
              style={{ borderRightWidth: 1, borderRightColor: "#f3f4f6" }}
            >
              <Eye size={16} color="#374151" className="mr-1" />
              <Text className="text-xs font-medium text-gray-700">Ver</Text>
            </TouchableOpacity>
          )}

          {onEdit && (
            <TouchableOpacity
              onPress={() => {
                onEdit();
                setShowActions(false);
              }}
              className="flex-1 p-3 flex-row items-center justify-center"
              style={{ borderRightWidth: 1, borderRightColor: "#f3f4f6" }}
            >
              <Edit size={16} color="#374151" className="mr-1" />
              <Text className="text-xs font-medium text-gray-700">Editar</Text>
            </TouchableOpacity>
          )}

          {productHasVariation && onAddVariation && (
            <TouchableOpacity
              onPress={() => {
                onAddVariation();
                setShowActions(false);
              }}
              className="flex-1 p-3 flex-row items-center justify-center"
              style={{ borderRightWidth: 1, borderRightColor: "#f3f4f6" }}
            >
              <Layers size={16} color="#1E40AF" className="mr-1" />
              <Text className="text-xs font-medium text-blue-800">
                Variação
              </Text>
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity
              onPress={() => {
                onDelete();
                setShowActions(false);
              }}
              className="flex-1 p-3 flex-row items-center justify-center"
            >
              <Trash size={16} color="#EF4444" className="mr-1" />
              <Text className="text-xs font-medium text-red-500">Excluir</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Card>
  );
}
