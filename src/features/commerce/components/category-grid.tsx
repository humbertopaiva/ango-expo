// Path: src/features/commerce/components/category-grid.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  ImageBackground,
} from "react-native";
import { Category } from "../models/category";
import { Grid, Sparkles } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { router } from "expo-router";

interface CategoryGridProps {
  categories: Category[];
  isLoading: boolean;
}

export function CategoryGrid({ categories, isLoading }: CategoryGridProps) {
  if (isLoading) {
    return (
      <View>
        <View className="inline-flex items-center gap-2 bg-primary-100 mb-4 px-4 py-2 rounded-full">
          <Sparkles className="h-4 w-4 text-primary-600" />
          <Text className="text-sm font-gothic text-primary-600">
            Categorias em Destaque
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-3">
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              className="w-1/2 md:w-1/4 aspect-square animate-pulse bg-gray-200 rounded-xl"
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View>
      <View className="mb-6">
        <View className="inline-flex items-center gap-2 bg-primary-100 mb-4 px-4 py-2 rounded-full">
          <Sparkles className="h-4 w-4 text-primary-600" />
          <Text className="text-sm font-medium text-primary-600">
            Categorias em Destaque
          </Text>
        </View>

        <Text className="text-2xl font-bold mb-2 text-gray-900">
          EXPLORE O <Text className="text-primary-500">COMÉRCIO LOCAL</Text>
        </Text>

        <Text className="text-gray-600 mb-6">
          Descubra os melhores produtos e serviços da nossa cidade
        </Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={Platform.OS === "web" ? 4 : 2}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View className="w-1/2 md:w-1/4 p-2">
            <TouchableOpacity
              onPress={() => router.push(`/(drawer)/categoria/${item.slug}`)}
              className="w-full aspect-square"
            >
              {item.imagem ? (
                <View className="relative w-full h-full overflow-hidden rounded-xl">
                  <ImagePreview
                    uri={item.imagem}
                    width="100%"
                    height="100%"
                    resizeMode="cover"
                    containerClassName="rounded-xl"
                  />
                  <View className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <View className="absolute inset-x-0 bottom-0 p-3">
                    <Text className="text-white font-semibold text-center">
                      {item.nome}
                    </Text>
                  </View>
                </View>
              ) : (
                <View className="w-full h-full bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-center">
                  <View className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center mb-2">
                    <Grid size={20} color="#F4511E" />
                  </View>
                  <Text className="text-primary-800 font-medium text-center px-2">
                    {item.nome}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{
          flexGrow: Platform.OS === "web" ? 0 : 1,
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-gray-500 text-center">
              Nenhuma categoria encontrada
            </Text>
          </View>
        }
      />
    </View>
  );
}
