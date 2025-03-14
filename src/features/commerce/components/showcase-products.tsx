// Path: src/features/commerce/components/showcase-products.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Package, ArrowRight } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { ShowcaseProduct } from "../models/showcase-product";
import { router } from "expo-router";

interface ShowcaseProductsProps {
  products: ShowcaseProduct[];
  isLoading: boolean;
  companyName: string;
  companySlug?: string;
}

export function ShowcaseProducts({
  products,
  isLoading,
  companyName,
  companySlug,
}: ShowcaseProductsProps) {
  // Formatação de moeda
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  if (isLoading) {
    return (
      <View className="space-y-4 mb-8">
        <Text className="text-lg font-medium">Carregando produtos...</Text>
        <View className="flex-row flex-wrap gap-4">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="w-1/2 md:w-1/4">
              <Card className="p-4 h-64 animate-pulse bg-gray-200" />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <View className="space-y-4 mb-8">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-800">
          Produtos em destaque de {companyName}
        </Text>

        {companySlug && (
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => router.push(`/empresa/${companySlug}`)}
          >
            <Text className="text-primary-600 text-sm font-medium mr-1">
              Ver mais
            </Text>
            <ArrowRight size={16} color="#F4511E" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={Platform.OS === "web" ? 4 : 2}
        renderItem={({ item }) => (
          <View className="w-1/2 md:w-1/4 p-2">
            <TouchableOpacity
              className="w-full h-full"
              onPress={() => console.log("Clicou Produto")}
            >
              <Card className="w-full h-full overflow-hidden border border-gray-200 rounded-xl shadow-sm">
                <View className="aspect-square relative">
                  {item.imagem ? (
                    <ImagePreview
                      uri={item.imagem}
                      width="100%"
                      height="100%"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full items-center justify-center bg-gray-100">
                      <Package size={48} color="#6B7280" />
                    </View>
                  )}

                  {item.preco_promocional && (
                    <View className="absolute top-2 right-2 bg-red-500 rounded-full px-2 py-1">
                      <Text className="text-white text-xs font-bold">
                        OFERTA
                      </Text>
                    </View>
                  )}
                </View>
                <View className="p-4">
                  <Text className="font-medium line-clamp-2 mb-2 text-gray-800">
                    {item.nome}
                  </Text>
                  <Text className="text-sm text-gray-500 line-clamp-2 mb-2">
                    {item.descricao}
                  </Text>
                  <View className="space-y-1">
                    {item.preco_promocional ? (
                      <>
                        <Text className="text-lg font-medium text-primary-600">
                          {formatCurrency(item.preco_promocional)}
                        </Text>
                        <Text className="text-sm text-gray-500 line-through">
                          {formatCurrency(item.preco)}
                        </Text>
                      </>
                    ) : (
                      <Text className="text-lg font-medium text-primary-600">
                        {formatCurrency(item.preco)}
                      </Text>
                    )}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );
}
