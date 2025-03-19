// Path: src/features/company-page/components/company-showcase.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Package } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { CompanyProduct } from "../models/company-product";
import { AdaptiveProductCard } from "./adaptive-product-card";

interface CompanyShowcaseProps {
  products: CompanyProduct[];
  isLoading: boolean;
}

export function CompanyShowcase({ products, isLoading }: CompanyShowcaseProps) {
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  if (isLoading) {
    return (
      <View className="space-y-4">
        <View className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
        <View className="flex-row flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="w-1/2 md:w-1/3 lg:w-1/4 p-2">
              <Card className="h-64 bg-gray-200 animate-pulse" />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <View className="space-y-4 mx-4">
      <Text className="text-xl font-semibold">Produtos em Destaque</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={Platform.OS === "web" ? 2 : 1}
        scrollEnabled={false}
        contentContainerStyle={{
          paddingHorizontal: Platform.OS === "web" ? 0 : 8,
        }}
        renderItem={({ item }) => (
          <View
            className={Platform.OS === "web" ? "w-1/2 p-2" : "w-full p-2"}
            style={{
              aspectRatio: Platform.OS === "web" ? undefined : 1, // Força aspecto quadrado em mobile
              maxHeight: Platform.OS === "web" ? undefined : 400, // Limita altura em mobile
            }}
          >
            {/* Usar o AdaptiveProductCard com isHighlighted como true */}
            <AdaptiveProductCard product={item} isHighlighted={true} />
          </View>
        )}
      />
    </View>
  );
}
