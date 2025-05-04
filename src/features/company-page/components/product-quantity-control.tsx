// Path: src/features/company-page/components/product-quantity-control.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MinusCircle, PlusCircle } from "lucide-react-native";
import { HStack } from "@gluestack-ui/themed";

interface ProductQuantityControlProps {
  quantity: number;
  maxQuantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  primaryColor: string;
  hasAddons: boolean;
}

export function ProductQuantityControl({
  quantity,
  maxQuantity,
  onIncrease,
  onDecrease,
  primaryColor,
  hasAddons = false, // Nova propriedade para verificar se tem adicionais
}: ProductQuantityControlProps) {
  // Se o produto tiver adicionais, não renderizamos o componente
  if (hasAddons) {
    return null;
  }

  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        Quantidade
      </Text>
      <HStack className="items-center bg-gray-50 self-start rounded-xl border border-gray-200 overflow-hidden">
        <TouchableOpacity
          onPress={onDecrease}
          className="p-3 active:bg-gray-200"
          disabled={quantity <= 1}
          style={{ opacity: quantity <= 1 ? 0.5 : 1 }}
        >
          <MinusCircle size={24} color={primaryColor} />
        </TouchableOpacity>

        <Text className="text-xl font-medium mx-6 min-w-10 text-center">
          {quantity}
        </Text>

        <TouchableOpacity
          onPress={onIncrease}
          className="p-3 active:bg-gray-200"
          disabled={quantity >= maxQuantity}
          style={{ opacity: quantity >= maxQuantity ? 0.5 : 1 }}
        >
          <PlusCircle size={24} color={primaryColor} />
        </TouchableOpacity>
      </HStack>

      {maxQuantity < 999 && (
        <Text className="text-xs text-gray-500 mt-2">
          *Limite máximo de {maxQuantity} unidades por pedido
        </Text>
      )}
    </View>
  );
}
