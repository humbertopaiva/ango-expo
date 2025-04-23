// Path: src/features/shop-window/components/simple-produto-item.tsx

import React from "react";
import { View, Text } from "react-native";
import { DollarSign, Package } from "lucide-react-native";
import { VitrineProduto } from "../models";
import { ResilientImage } from "@/components/common/resilient-image";
import { SwipeableCard } from "@/components/common/swipeable-card";
import { ReorderButtons } from "@/components/common/reorder-buttons";

interface SimpleProdutoItemProps {
  produto: VitrineProduto;
  onEdit: (produto: VitrineProduto) => void;
  onDelete: (produto: VitrineProduto) => void;
  isReordering?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  position?: number;
}

export function SimpleProdutoItem({
  produto,
  onEdit,
  onDelete,
  isReordering,
  onMoveUp,
  onMoveDown,
  position,
}: SimpleProdutoItemProps) {
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

  const renderProductContent = () => (
    <View className="p-2 flex-row">
      {/* Reordering area or image */}
      <View className="pr-2">
        {isReordering ? (
          <ReorderButtons onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
        ) : (
          <View className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden">
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
      </View>

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

        {/* Product name (now including the variation) */}
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
    </View>
  );

  // During reordering, disable swipe
  if (isReordering) {
    return <View className="mb-3">{renderProductContent()}</View>;
  }

  // Otherwise, use SwipeableCard
  return (
    <SwipeableCard
      onDelete={() => onDelete(produto)}
      onEdit={() => onEdit(produto)}
      position={position}
      badgeColor="bg-primary-100"
    >
      {renderProductContent()}
    </SwipeableCard>
  );
}
