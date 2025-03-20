// Path: src/features/leaflets-page/components/category-filter-chips.tsx
import React from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { Category } from "../models/leaflet";
import { THEME_COLORS } from "@/src/styles/colors";
import { LayoutGrid } from "lucide-react-native";

interface CategoryFilterChipsProps {
  categories: Category[];
  activeCategories: string[];
  toggleCategory: (categoryId: string) => void;
  selectAll: () => void;
  isLoading: boolean;
  allCategoriesSelected: boolean;
}

// Path: src/features/leaflets-page/components/category-filter-chips.tsx

export function CategoryFilterChips({
  categories,
  activeCategories,
  toggleCategory,
  selectAll,
  allCategoriesSelected,
  isLoading,
}: CategoryFilterChipsProps) {
  if (isLoading) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      >
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            className="h-10 w-32 bg-gray-200 rounded-full mx-1 animate-pulse"
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingLeft: 16,
        paddingRight: 8,
        paddingVertical: 8,
      }}
      className="mb-4"
    >
      {/* Botão "Todas" */}
      <TouchableOpacity
        onPress={selectAll}
        className={`flex-row items-center h-12 px-4 mx-1 rounded-full ${
          allCategoriesSelected
            ? "bg-secondary-500"
            : "bg-gray-100 border border-gray-200"
        }`}
      >
        <LayoutGrid
          size={18}
          color={allCategoriesSelected ? "white" : "#6B7280"}
        />
        <Text
          className={`ml-2 font-medium ${
            allCategoriesSelected ? "text-white" : "text-gray-700"
          }`}
        >
          Todas
        </Text>
      </TouchableOpacity>

      {/* Chips de categorias individuais */}
      {categories.map((category) => {
        // Uma categoria individual só está visualmente selecionada se:
        // 1. NÃO estamos no estado "Todas" E
        // 2. Esta categoria específica está no array activeCategories
        const isSelected =
          !allCategoriesSelected && activeCategories.includes(category.id);

        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => toggleCategory(category.id)}
            className={`px-4 h-12 rounded-full mx-1 flex items-center justify-center ${
              isSelected
                ? "bg-secondary-500"
                : "bg-white border border-gray-200"
            }`}
          >
            <Text
              className={
                isSelected ? "text-white font-medium" : "text-gray-700"
              }
            >
              {category.nome}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
