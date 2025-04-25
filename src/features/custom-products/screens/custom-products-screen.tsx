// Path: src/features/custom-products/screens/custom-products-screen.tsx
import React from "react";
import { View } from "react-native";
import { CustomProductsProvider } from "../contexts/custom-products-provider";
import { CustomProductsContent } from "./custom-products-content";

export function CustomProductsScreen() {
  return (
    <View className="flex-1 bg-white">
      <CustomProductsProvider>
        <CustomProductsContent />
      </CustomProductsProvider>
    </View>
  );
}
