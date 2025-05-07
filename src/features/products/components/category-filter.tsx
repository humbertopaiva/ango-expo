// Path: src/features/products/components/category-filter.tsx
import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { Tag, Filter } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

interface CategoryFilterProps {
  categories: any[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <View className="mb-4">
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Filter size={16} color={THEME_COLORS.primary} />
          <Text className="ml-2 text-sm font-medium text-gray-700">
            Filtrar por categoria
          </Text>
        </View>

        {selectedCategoryId !== null && (
          <TouchableOpacity
            onPress={() => onSelectCategory(null)}
            className="px-2 py-1 bg-gray-100 rounded-md"
          >
            <Text className="text-xs text-gray-600">Limpar filtro</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Categorias rolantes */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4 }}
      >
        {/* Opção "Todos" */}
        <TouchableOpacity
          onPress={() => onSelectCategory(null)}
          style={[
            styles.categoryButton,
            selectedCategoryId === null && styles.activeButton,
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategoryId === null && styles.activeText,
            ]}
          >
            Todos os produtos
          </Text>
        </TouchableOpacity>

        {/* Lista de categorias */}
        {categories.map((category: any) => (
          <TouchableOpacity
            key={category.id.toString()}
            onPress={() => onSelectCategory(Number(category.id))}
            style={[
              styles.categoryButton,
              selectedCategoryId === Number(category.id) && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategoryId === Number(category.id) && styles.activeText,
              ]}
            >
              {category.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Texto de assistência */}
      <Text className="text-xs text-gray-500 mt-2 ml-1">
        {selectedCategoryId === null
          ? "Mostrando todos os produtos"
          : `Mostrando apenas produtos da categoria selecionada (${
              categories.find((c) => c.id === selectedCategoryId)?.nome || ""
            })`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    marginRight: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: THEME_COLORS.primary,
    borderColor: THEME_COLORS.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#4B5563",
  },
  activeText: {
    color: "white",
    fontWeight: "600",
  },
});
