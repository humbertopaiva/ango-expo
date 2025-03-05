// Path: src/features/commerce/components/category-grid.tsx (atualização)
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
import { Category } from "../models/category";
import { Grid } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { Card } from "@gluestack-ui/themed";
import { router } from "expo-router";

interface CategoryGridProps {
  categories: Category[];
  isLoading: boolean;
}

export function CategoryGrid({ categories, isLoading }: CategoryGridProps) {
  if (isLoading) {
    return (
      <View className="flex-row flex-wrap gap-4">
        {[1, 2, 3, 4].map((i) => (
          <View key={i} className="w-1/2 md:w-1/4 aspect-square">
            <Card className="w-full h-full animate-pulse bg-gray-200" />
          </View>
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      numColumns={Platform.OS === "web" ? 4 : 2}
      renderItem={({ item }) => (
        <View className="w-1/2 md:w-1/4 p-2">
          <TouchableOpacity
            onPress={() => router.push(`/(drawer)/categoria/${item.slug}`)}
            className="w-full aspect-square"
          >
            <Card className="w-full h-full overflow-hidden">
              <View className="relative w-full h-full">
                {item.imagem ? (
                  <ImagePreview
                    uri={item.imagem}
                    width="100%"
                    height="100%"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full items-center justify-center bg-gray-100">
                    <Grid size={48} color="#6B7280" />
                  </View>
                )}
                <View className="absolute inset-0 bg-black/40 flex items-end justify-end p-4">
                  <Text className="text-white font-medium text-lg">
                    {item.nome}
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        </View>
      )}
      contentContainerStyle={{
        flexGrow: 1,
      }}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-gray-500 text-center">
            Nenhuma categoria encontrada
          </Text>
        </View>
      }
    />
  );
}
