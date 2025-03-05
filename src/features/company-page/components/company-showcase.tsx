// src/features/company-page/components/company-showcase.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Package } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { CompanyProduct } from "../models/company-product";

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
        numColumns={Platform.OS === "web" ? 4 : 2}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View className="w-1/2 md:w-1/4 p-2">
            <TouchableOpacity className="flex-1">
              <Card className="overflow-hidden h-full">
                <View className="aspect-square relative">
                  <ImagePreview
                    uri={item.imagem}
                    fallbackIcon={Package}
                    width="100%"
                    height="100%"
                    resizeMode="cover"
                  />
                </View>
                <View className="p-4">
                  <Text
                    className="font-medium text-sm line-clamp-2"
                    numberOfLines={2}
                  >
                    {item.nome}
                  </Text>
                  {item.descricao && (
                    <Text
                      className="text-xs text-gray-500 mt-1 line-clamp-2"
                      numberOfLines={2}
                    >
                      {item.descricao}
                    </Text>
                  )}
                  <View className="mt-2 space-y-1">
                    {item.preco_promocional ? (
                      <>
                        <Text className="text-xs text-gray-500 line-through">
                          {formatCurrency(item.preco)}
                        </Text>
                        <Text className="text-sm font-bold text-primary-600">
                          {formatCurrency(item.preco_promocional)}
                        </Text>
                      </>
                    ) : (
                      <Text className="text-sm font-bold text-primary-600">
                        {formatCurrency(item.preco)}
                      </Text>
                    )}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
