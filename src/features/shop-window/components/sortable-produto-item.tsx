// Path: src/features/shop-window/components/sortable-produto-item.tsx

import React, { useRef, useState } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { Card } from "@gluestack-ui/themed";
import {
  Package,
  Trash,
  DollarSign,
  MoreVertical,
  Edit,
} from "lucide-react-native";
import { VitrineProduto } from "../models";
import { ResilientImage } from "@/components/common/resilient-image";
import { ReorderButtons } from "@/components/common/reorder-buttons";

interface SortableProdutoItemProps {
  produto: VitrineProduto;
  onDelete: (produto: VitrineProduto) => void;
  onEdit?: (produto: VitrineProduto) => void;
  isReordering?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  position?: number;
}

export function SortableProdutoItem({
  produto,
  onDelete,
  onEdit,
  isReordering,
  onMoveUp,
  onMoveDown,
  position,
}: SortableProdutoItemProps) {
  const [isActionsVisible, setIsActionsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

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

  // Function to show or hide actions
  const toggleActions = () => {
    if (isActionsVisible) {
      // Hide actions
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      setIsActionsVisible(false);
    } else {
      // Show actions
      Animated.spring(slideAnim, {
        toValue: -100, // Negative value to slide left
        useNativeDriver: true,
      }).start();
      setIsActionsVisible(true);
    }
  };

  // Determine if it's a product with variation and has a variation product selected
  const hasVariation = produto.produto.tem_variacao;
  const hasVariationSelected = !!produto.produto_variado;

  // Get the correct image (from variation product if available, else from main product)
  const productImage =
    produto.produto_variado?.imagem || produto.produto.imagem;

  // Get the correct price (from variation product if available, else from main product)
  const productPrice = hasVariationSelected
    ? produto.produto_variado?.preco
    : produto.produto.preco;

  const productPromotionalPrice = hasVariationSelected
    ? produto.produto_variado?.preco_promocional
    : produto.produto.preco_promocional;

  // Format the product name to include the variation
  const displayName =
    hasVariationSelected && produto.produto_variado?.valor_variacao
      ? `${produto.produto.nome} - ${produto.produto_variado.valor_variacao}`
      : produto.produto.nome;

  // Get the correct availability status
  const isAvailable = hasVariationSelected
    ? produto.produto_variado?.disponivel
    : produto.disponivel;

  // Get the description (from variation if available, else from main product)
  const productDescription =
    hasVariationSelected && produto.produto_variado?.descricao
      ? produto.produto_variado.descricao
      : produto.produto.descricao;

  return (
    <View className="overflow-hidden relative mb-3">
      {/* Action buttons that appear when sliding */}
      <View
        className="absolute right-0 top-0 bottom-0 flex-row items-center justify-center h-full"
        style={{ width: 100 }}
      >
        {/* Add edit button if available */}
        {onEdit && (
          <Pressable
            onPress={() => onEdit(produto)}
            className="bg-gray-100 h-full w-1/2 items-center justify-center"
          >
            <Edit size={20} color="#374151" />
          </Pressable>
        )}
        <Pressable
          onPress={() => onDelete(produto)}
          className="bg-red-100 h-full w-1/2 items-center justify-center"
        >
          <Trash size={20} color="#ef4444" />
        </Pressable>
      </View>

      {/* Main card that slides */}
      <Animated.View
        style={{
          transform: [{ translateX: slideAnim }],
        }}
      >
        <Card
          className={`bg-white border border-gray-100 overflow-hidden ${
            !isAvailable ? "opacity-70" : ""
          }`}
        >
          {/* Item position as tag in top right corner */}
          {!isReordering && position && (
            <View className="absolute top-0 right-0 bg-primary-100 rounded-bl-lg px-1.5 py-0.5 z-10">
              <Text className="text-xs font-bold text-primary-700">
                #{position}
              </Text>
            </View>
          )}

          <View className="p-3 flex-row items-center">
            {/* Reordering area or image */}
            {isReordering ? (
              <View className="mr-3">
                <ReorderButtons onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
              </View>
            ) : (
              <View className="h-14 w-14 bg-gray-100 rounded-lg overflow-hidden mr-3">
                {productImage ? (
                  <ResilientImage
                    source={productImage}
                    style={{ height: "100%", width: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-full w-full items-center justify-center">
                    <Package size={20} color="#6B7280" />
                  </View>
                )}
              </View>
            )}

            {/* Product information */}
            <View className="flex-1">
              {/* Availability status */}
              <View className="flex-row mb-0.5">
                <View
                  className={`px-1.5 py-0.5 rounded-full ${
                    isAvailable ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      isAvailable ? "text-green-700" : "text-gray-700"
                    }`}
                  >
                    {isAvailable ? "Disponível" : "Indisponível"}
                  </Text>
                </View>
              </View>

              {/* Product name (now including variation) */}
              <Text className="font-medium text-sm" numberOfLines={2}>
                {displayName}
              </Text>

              {/* Price information */}
              {productPrice ? (
                <View className="flex-row items-center mt-0.5 flex-wrap">
                  <View className="flex-row items-center bg-gray-50 px-1.5 py-0.5 rounded-md mr-2">
                    <DollarSign size={10} color="#4B5563" />
                    <Text className="font-medium text-xs text-gray-700 ml-0.5">
                      {formatCurrency(productPrice)}
                    </Text>
                  </View>

                  {productPromotionalPrice && (
                    <Text className="text-xs text-gray-500 line-through">
                      {formatCurrency(productPromotionalPrice)}
                    </Text>
                  )}
                </View>
              ) : (
                <Text className="text-xs text-red-500 mt-0.5">
                  {hasVariation && !hasVariationSelected
                    ? "Selecione uma variação"
                    : "Preço não definido"}
                </Text>
              )}
            </View>

            {/* More options button - only visible when not reordering */}
            {!isReordering && (
              <Pressable
                onPress={toggleActions}
                className="p-1 ml-1 self-center"
              >
                <MoreVertical size={18} color="#6B7280" />
              </Pressable>
            )}
          </View>
        </Card>
      </Animated.View>
    </View>
  );
}
