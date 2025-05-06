// Path: src/features/products/components/products-list.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
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
  refreshControl?: React.ReactElement;
}

export function ProductsList({
  products,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onAddVariation,
  emptyMessage = "Nenhum produto encontrado. Crie um novo produto para começar.",
  refreshControl,
}: ProductsListProps) {
  if (isLoading) {
    return <ProductSkeletonList count={3} />;
  }

  if (products.length === 0) {
    return (
      <View className="bg-white p-8 rounded-xl shadow-sm items-center justify-center">
        <Package size={48} color="#9CA3AF" />
        <Text className="text-lg font-medium text-gray-500 mt-4 text-center">
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item)}
          onView={() => onView(item)}
          onAddVariation={() => onAddVariation(item)}
        />
      )}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    />
  );
}
