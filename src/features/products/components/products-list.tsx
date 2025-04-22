// Path: src/features/products/components/products-list.tsx
import React, { useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { ProductCard } from "./product-card";
import { Product } from "../models/product";
import { ProductSkeletonList } from "./product-skeleton";
import { Package } from "lucide-react-native";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient(); // Adicionar esta linha

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.refetchQueries({ queryKey: ["products"] });
    console.log("Forçando refetch da lista de produtos");
  }, [queryClient]);

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
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    />
  );
}
