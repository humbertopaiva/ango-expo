// Path: app/(drawer)/admin/products/[id]/variations.tsx
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { ProductVariationsScreen } from "@/src/features/products/screens/product-variations-screen";
import { View } from "react-native";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";

export default function ProductVariationsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) return null;

  return (
    <View className="flex-1 bg-white">
      <AdminScreenHeader
        title="Variações do Produto"
        backTo={`/admin/products/${id}`}
      />
      <ProductVariationsScreen productId={id} />
    </View>
  );
}
