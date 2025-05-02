// Path: src/features/company-page/components/product-addon-item.tsx

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HStack } from "@gluestack-ui/themed";
import { MinusCircle, PlusCircle, Package } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { AddonProduct } from "../models/product-addon-list";

interface ProductAddonItemProps {
  item: AddonProduct;
  onQuantityChange: (item: AddonProduct, quantity: number) => void;
  primaryColor: string;
}

export function ProductAddonItem({
  item,
  onQuantityChange,
  primaryColor,
}: ProductAddonItemProps) {
  // Estado local para a quantidade
  const [quantity, setQuantity] = useState(item.quantidade || 0);

  // Formatar preço
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

  // Aumentar quantidade
  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(item, newQuantity);
  };

  // Diminuir quantidade
  const handleDecrease = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(item, newQuantity);
    }
  };

  // Atualizar quantidade local quando a prop mudar
  useEffect(() => {
    setQuantity(item.quantidade || 0);
  }, [item.quantidade]);

  return (
    <View className="mb-3  pb-6">
      <HStack className="items-center justify-between">
        {/* Imagem pequena e nome do produto */}
        <HStack className="items-center flex-1">
          <View className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden mr-3">
            <ImagePreview
              uri={item.produtos_id.imagem}
              fallbackIcon={Package}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          </View>

          <View className="flex-1">
            <Text className="font-medium text-gray-800">
              {item.produtos_id.nome}
            </Text>
            <Text
              className="text-sm font-semibold"
              style={{ color: primaryColor }}
            >
              {formatCurrency(
                item.produtos_id.preco_promocional || item.produtos_id.preco
              )}
            </Text>
          </View>
        </HStack>

        {/* Controles de quantidade */}
        <HStack className="items-center bg-gray-50 rounded-lg border border-gray-200">
          <TouchableOpacity
            onPress={handleDecrease}
            className="p-2"
            disabled={quantity === 0}
            style={{ opacity: quantity === 0 ? 0.5 : 1 }}
          >
            <MinusCircle
              size={20}
              color={quantity === 0 ? "#9CA3AF" : primaryColor}
            />
          </TouchableOpacity>

          <Text className="font-medium text-gray-800 mx-2 w-6 text-center">
            {quantity}
          </Text>

          <TouchableOpacity onPress={handleIncrease} className="p-2">
            <PlusCircle size={20} color={primaryColor} />
          </TouchableOpacity>
        </HStack>
      </HStack>
    </View>
  );
}
