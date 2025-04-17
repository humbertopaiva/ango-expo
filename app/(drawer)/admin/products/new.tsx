// Path: app/(drawer)/admin/products/new.tsx
import { ProductFormScreen } from "@/src/features/products/screens/product-form-screen";
import { View } from "@gluestack-ui/themed";
import { Stack } from "expo-router";
import React from "react";

export default function NewProductsScreen() {
  return (
    <>
      <View className="flex-1 bg-white">
        <ProductFormScreen />
      </View>
    </>
  );
}
