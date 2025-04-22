// Path: src/features/products/components/products-list.tsx
import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { ProductCard } from "./product-card";
import { Product } from "../models/product";
import { ProductSkeletonList } from "./product-skeleton";
import { Package } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

interface ProductsListProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
  onAddVariation: (product: Product) => void;
  emptyMessage?: string;
}

export function ProductsList({
  products,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onAddVariation,
  emptyMessage = "Nenhum produto encontrado. Crie um novo produto para começar.",
}: ProductsListProps) {
  if (isLoading) {
    return <ProductSkeletonList count={3} />;
  }

  if (products.length === 0) {
    return (
      <View className="bg-white p-6 rounded-lg items-center justify-center">
        <Package size={40} color="#9CA3AF" />
        <Text className="text-lg font-medium text-gray-500 mt-2">
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <View className="space-y-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={() => onEdit(product)}
          onDelete={() => onDelete(product)}
          onView={() => onView(product)}
          onAddVariation={() => onAddVariation(product)}
        />
      ))}
    </View>
  );
}
