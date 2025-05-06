// src/features/delivery/components/delivery-showcase.tsx
import React from "react";
import { View, Text, FlatList } from "react-native";
import { DeliveryShowcaseProduct } from "../models/delivery-showcase";
import { Card } from "@gluestack-ui/themed";
import { Store } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";

interface DeliveryShowcaseProps {
  products: DeliveryShowcaseProduct[];
  companyName: string;
  isLoading?: boolean;
}

export function DeliveryShowcase({
  products,
  companyName,
  isLoading,
}: DeliveryShowcaseProps) {
  if (isLoading) {
    return (
      <View className="gap-4">
        <View className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <View className="flex-row gap-4">
          {[1, 2, 3, 4].map((i) => (
            <View
              key={`skeleton-${i}`}
              className="h-64 w-40 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </View>
      </View>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  // Certifique-se de adicionar a keyExtractor para garantir chaves únicas
  return (
    <View className="mb-8">
      <Text className="text-xl font-semibold mb-4">
        Destaques de {companyName}
      </Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card className="mr-4 mb-2 overflow-hidden w-40">
            <View className="aspect-square">
              <ImagePreview
                uri={item.imagem}
                fallbackIcon={Store}
                width="100%"
                height="100%"
                containerClassName="rounded-none"
              />
            </View>
            <View className="p-4">
              <Text className="font-medium mb-1" numberOfLines={2}>
                {item.nome}
              </Text>
              {item.descricao && (
                <Text className="text-sm text-gray-500 mb-2" numberOfLines={2}>
                  {item.descricao}
                </Text>
              )}
              <View className="mt-2">
                {item.preco_promocional ? (
                  <View>
                    <Text className="text-sm text-gray-500 line-through">
                      R$ {item.preco}
                    </Text>
                    <Text className="text-lg font-bold text-primary-500">
                      R$ {item.preco_promocional}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-lg font-bold">R$ {item.preco}</Text>
                )}
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
}
