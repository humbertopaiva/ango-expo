// Path: src/features/products/components/product-card.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";
import { Edit, Trash, Eye, Layers, ChevronRight } from "lucide-react-native";
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
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

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

  // Animation on press
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        backgroundColor: "white",
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <Pressable
        onPress={onView}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
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
                className="font-medium text-base text-gray-800"
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
                      <Text className="font-medium text-base text-primary-500">
                        {formatCurrency(product.preco_promocional)}
                      </Text>
                      <Text className="ml-2 text-xs text-gray-500 line-through">
                        {formatCurrency(product.preco)}
                      </Text>
                    </>
                  ) : (
                    <Text className="font-medium text-base text-primary-600">
                      {formatCurrency(product.preco)}
                    </Text>
                  )}
                </View>
              )}

              {/* Variação - mostrar qual variação está configurada */}
              {productHasVariation && (
                <View className="mt-1">
                  <Text className="text-xs text-blue-700 font-medium">
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

            {/* Indicator icon */}
            <View className="justify-center">
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>
      </Pressable>

      {/* Quick Actions Bar - Always shown at the bottom */}
      <View className="flex-row border-t border-gray-100 bg-gray-50">
        {onView && (
          <TouchableOpacity
            onPress={onView}
            className="flex-1 p-3 flex-row items-center justify-center gap-1"
            style={{ borderRightWidth: 1, borderRightColor: "#f3f4f6" }}
          >
            <Eye size={16} color="#374151" className="mr-1" />
            <Text className="text-xs font-medium text-gray-700">Ver</Text>
          </TouchableOpacity>
        )}

        {onEdit && (
          <TouchableOpacity
            onPress={onEdit}
            className="flex-1 p-3 flex-row items-center justify-center gap-1"
            style={{ borderRightWidth: 1, borderRightColor: "#f3f4f6" }}
          >
            <Edit size={16} color="#374151" className="mr-1" />
            <Text className="text-xs font-medium text-gray-700">Editar</Text>
          </TouchableOpacity>
        )}

        {productHasVariation && onAddVariation && (
          <TouchableOpacity
            onPress={onAddVariation}
            className="flex-1 p-3 flex-row items-center justify-center gap-1"
            style={{ borderRightWidth: 1, borderRightColor: "#f3f4f6" }}
          >
            <Layers size={16} color="#1E40AF" className="mr-1" />
            <Text className="text-xs font-medium text-blue-800">Variação</Text>
          </TouchableOpacity>
        )}

        {onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            className="flex-1 p-3 flex-row items-center justify-center gap-1"
          >
            <Trash size={16} color="#EF4444" className="mr-1" />
            <Text className="text-xs font-medium text-red-500">Excluir</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}
