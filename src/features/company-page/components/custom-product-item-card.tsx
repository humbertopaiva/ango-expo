// Path: src/features/company-page/components/custom-product-item-card.tsx

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { CustomProductItem } from "../models/custom-product";
import { ImagePreview } from "@/components/custom/image-preview";

interface CustomProductItemCardProps {
  item: CustomProductItem;
  isSelected: boolean;
  onSelect: () => void;
  primaryColor: string;
  showPrice: boolean;
}

export function CustomProductItemCard({
  item,
  isSelected,
  onSelect,
  primaryColor,
  showPrice,
}: CustomProductItemCardProps) {
  const produto = item.produto_detalhes;

  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.7}
      className={`
        flex-row items-center p-2 rounded-lg
        ${
          isSelected
            ? `border border-${primaryColor}`
            : "border border-gray-100"
        }
        ${isSelected ? `bg-${primaryColor}05` : "bg-white"}
      `}
    >
      {/* Selection indicator */}
      <View
        className={`
          w-6 h-6 rounded-full items-center justify-center mr-3
          ${isSelected ? "bg-" + primaryColor : "bg-gray-100"}
        `}
      >
        {isSelected && <Check size={16} color="white" />}
      </View>

      {/* Product image */}
      {produto.imagem && (
        <View className="w-12 h-12 rounded-md overflow-hidden mr-3">
          <ImagePreview
            uri={produto.imagem}
            width="100%"
            height="100%"
            resizeMode="cover"
            containerClassName="bg-gray-100"
          />
        </View>
      )}

      {/* Product info */}
      <View className="flex-1">
        <Text className="text-gray-800 font-medium">{produto.nome}</Text>

        {produto.descricao && (
          <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>
            {produto.descricao}
          </Text>
        )}

        {/* Price information */}
        {showPrice && (produto.preco || produto.preco_promocional) && (
          <Text
            className="text-sm font-medium mt-1"
            style={{ color: primaryColor }}
          >
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(
              parseFloat(produto.preco_promocional || produto.preco || "0")
            )}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
