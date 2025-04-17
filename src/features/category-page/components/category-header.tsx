// Path: src/features/category-page/components/new-category-header.tsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { SlidersHorizontal } from "lucide-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface CategoryHeaderProps {
  categoryName: string | null;
  categoryImage: string | null;
  isLoading: boolean;
  onFilterPress?: () => void;
}

export function CategoryHeader({
  categoryName,
  categoryImage,
  isLoading,
  onFilterPress,
}: CategoryHeaderProps) {
  // Formata o nome da categoria para exibição
  const formattedCategoryName = formatCategoryName(categoryName);

  if (isLoading) {
    return (
      <View className="w-full px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse" />
          <View className="h-5 w-1/3 bg-gray-200 animate-pulse rounded-sm" />
          <View className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        </View>
      </View>
    );
  }

  return (
    <View className="w-full px-4 py-3  bg-background border-b border-gray-100">
      <View className="flex-row items-center justify-between">
        {/* Imagem da categoria (quadrado arredondado) */}
        <View className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border-2 border-primary-500">
          {categoryImage ? (
            <Image
              source={{ uri: categoryImage }}
              style={styles.categoryImage}
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-primary-50" />
          )}
        </View>

        {/* Nome da categoria */}
        <Text
          className="font-semibold text-primary-500 flex-1 mx-3"
          style={styles.categoryTitle}
          numberOfLines={1}
        >
          {formattedCategoryName}
        </Text>

        {/* Botão de filtro */}
        {onFilterPress && (
          <TouchableOpacity
            onPress={onFilterPress}
            className="bg-primary-500 w-10 h-10 items-center justify-center rounded-full"
            style={styles.filterButton}
          >
            <SlidersHorizontal size={18} color={THEME_COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// Função para formatar o nome da categoria
function formatCategoryName(name: string | null): string {
  if (!name) return "Categoria";

  const lowercaseWords = [
    "e",
    "de",
    "da",
    "do",
    "das",
    "dos",
    "em",
    "por",
    "com",
    "para",
  ];

  return name
    .replace(/-/g, " ")
    .split(" ")
    .map((word, index) => {
      if (lowercaseWords.includes(word.toLowerCase()) && index !== 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

const styles = StyleSheet.create({
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryTitle: {
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  filterButton: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});
