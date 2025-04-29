// Path: src/features/company-page/components/custom-product-step-item.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { ImagePreview } from "@/components/custom/image-preview";
import { Package, Check, Circle } from "lucide-react-native";
import { CustomProductItem } from "../models/custom-product";

interface CustomProductStepItemProps {
  item: CustomProductItem;
  isSelected: boolean;
  primaryColor: string;
  onSelect: () => void;
  showPrice: boolean;
}

export function CustomProductStepItem({
  item,
  isSelected,
  primaryColor,
  onSelect,
  showPrice,
}: CustomProductStepItemProps) {
  // Função para formatar preço
  const formatCurrency = (value: string | null | undefined) => {
    if (!value) return "";

    try {
      const numericValue = parseFloat(value.replace(",", "."));
      if (isNaN(numericValue)) return "";

      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numericValue);
    } catch (error) {
      console.error("Erro ao formatar valor monetário:", error);
      return "";
    }
  };

  // Pegar o preço do item (promocional ou normal)
  const itemPrice =
    item.produto_detalhes.preco_promocional || item.produto_detalhes.preco;

  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`border rounded-lg mb-3 overflow-hidden ${
        isSelected ? `border-2` : `border-gray-200`
      }`}
      style={{ borderColor: isSelected ? primaryColor : undefined }}
      activeOpacity={0.7}
    >
      <View className="flex-row">
        {/* Imagem do produto */}
        <View className="w-24 h-24 bg-gray-100">
          <ImagePreview
            uri={item.produto_detalhes.imagem}
            fallbackIcon={Package}
            width="100%"
            height="100%"
            resizeMode="cover"
          />
        </View>

        {/* Conteúdo */}
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text
              className="font-medium text-gray-800 text-base mb-1"
              numberOfLines={1}
            >
              {item.produto_detalhes.nome}
            </Text>
            {item.produto_detalhes.descricao ? (
              <Text className="text-gray-600 text-sm" numberOfLines={2}>
                {item.produto_detalhes.descricao}
              </Text>
            ) : null}
          </View>

          {/* Preço (mostrado apenas quando showPrice é true) */}
          {showPrice && itemPrice && (
            <Text
              className="text-base font-medium mt-1"
              style={{ color: primaryColor }}
            >
              {formatCurrency(itemPrice)}
            </Text>
          )}
        </View>

        {/* Indicador de seleção */}
        <View className="p-3 justify-center">
          {isSelected ? (
            <View
              className="w-6 h-6 rounded-full items-center justify-center"
              style={{ backgroundColor: primaryColor }}
            >
              <Check size={16} color="white" />
            </View>
          ) : (
            <View className="w-6 h-6 rounded-full border-2 border-gray-300" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
