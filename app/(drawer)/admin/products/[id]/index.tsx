// Path: app/(drawer)/admin/products/[id].tsx
import { ProductFormScreen } from "@/src/features/products/screens/product-form-screen";
import { View } from "@gluestack-ui/themed";
import { useLocalSearchParams, Stack } from "expo-router";
import React from "react";

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <View className="flex-1 bg-white">
        <ProductFormScreen productId={id} />
      </View>
    </>
  );
}
