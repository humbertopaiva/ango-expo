// Path: src/features/category-page/components/category-header.tsx (atualizado sem animações)
import React from "react";
import { View, Text, Platform } from "react-native";
import { ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

interface CategoryHeaderProps {
  categoryName: string | null;
  categoryImage: string | null;
  isLoading: boolean;
}

export function CategoryHeader({
  categoryName,
  categoryImage,
  isLoading,
}: CategoryHeaderProps) {
  if (isLoading) {
    return (
      <View className="h-32 bg-gray-200 animate-pulse rounded-b-3xl w-full" />
    );
  }

  // Se não tivermos uma imagem, renderizamos um header simples
  if (!categoryImage) {
    return (
      <View className="bg-primary-500 rounded-b-3xl w-full">
        <SafeAreaView className="pt-4 pb-6 px-4">
          <View>
            <Text className="text-white text-2xl font-bold text-center">
              {categoryName || "Categoria"}
            </Text>
            <Text className="text-white/80 text-center mt-1">
              Descubra os melhores locais da região
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Com imagem, renderizamos um header mais rico visualmente
  return (
    <ImageBackground
      source={{ uri: categoryImage }}
      className="w-full"
      style={{ height: Platform.OS === "web" ? 160 : 140 }}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.3)"]}
        className="w-full h-full rounded-b-3xl overflow-hidden"
      >
        <SafeAreaView className="flex-1 justify-end pb-6 px-4">
          <View>
            <Text className="text-white text-3xl font-bold shadow-text">
              {categoryName || "Categoria"}
            </Text>
            <Text className="text-white/90 text-base shadow-text">
              Descubra os melhores locais da região
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}
