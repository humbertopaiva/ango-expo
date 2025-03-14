// Path: app/empresa/[companySlug]/cart.tsx
import React from "react";
import { View } from "react-native";
import { CartScreen } from "@/src/features/cart/screens/cart-screen";

export default function CartPage() {
  return (
    <View className="flex-1">
      <CartScreen />
    </View>
  );
}
