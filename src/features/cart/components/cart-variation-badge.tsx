// Path: src/features/cart/components/cart-variation-badge.tsx
// Componente dedicado para exibir variações

import React from "react";
import { View, Text } from "react-native";

interface CartVariationBadgeProps {
  variationName: string;
  primaryColor: string;
}

export const CartVariationBadge: React.FC<CartVariationBadgeProps> = ({
  variationName,
  primaryColor,
}) => {
  return (
    <View
      className="px-2 py-0.5 rounded-md mt-1 self-start"
      style={{ backgroundColor: `${primaryColor}15` }}
    >
      <Text className="text-xs font-medium" style={{ color: primaryColor }}>
        {variationName}
      </Text>
    </View>
  );
};
