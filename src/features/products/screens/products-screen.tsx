// Path: src/features/products/screens/products-screen.tsx
import React from "react";
import { ProductsProvider } from "../contexts/products-provider";
import { ProductsContent } from "./products-content";
import { View } from "react-native";
import { Stack } from "expo-router";

export function ProductsScreen() {
  return (
    <View className="flex-1 bg-white">
      <ProductsProvider>
        <ProductsContent />
      </ProductsProvider>
    </View>
  );
}
