// Path: src/features/leaflets-page/components/category-filter-chips.tsx

import React from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { Category } from "../models/leaflet";
import { THEME_COLORS } from "@/src/styles/colors";

interface CategoryFilterChipsProps {
  categories: Category[];
  activeCategories: string[];
  toggleCategory: (categoryId: string) => void;
  selectAll: () => void;
  isLoading: boolean;
}

export function CategoryFilterChips({
  categories,
  activeCategories,
  toggleCategory,
  selectAll,
  isLoading,
}: CategoryFilterChipsProps) {
  const allSelected = activeCategories.length === categories.length;

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
            className="h-8 w-24 bg-gray-200 rounded-full mx-1 animate-pulse"
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
    >
      <TouchableOpacity
        onPress={selectAll}
        className={`px-4 py-2 rounded-full mr-2 ${
          allSelected
            ? "bg-secondary-500"
            : "bg-gray-100 border border-gray-200"
        }`}
      >
        <Text
          className={allSelected ? "text-white font-medium" : "text-gray-800"}
        >
          Todas
        </Text>
      </TouchableOpacity>

      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => toggleCategory(category.id)}
          className={`px-4 py-2 rounded-full mr-2 ${
            activeCategories.includes(category.id)
              ? "bg-secondary-500"
              : "bg-gray-100 border border-gray-200"
          }`}
        >
          <Text
            className={
              activeCategories.includes(category.id)
                ? "text-white font-medium"
                : "text-gray-800"
            }
          >
            {category.nome}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
