// Path: src/features/products/components/category-filter.tsx
import React from "react";
import { ScrollView, TouchableOpacity, Text, View } from "react-native";
import { Category } from "@/src/features/categories/models/category";

interface CategoryFilterProps {
  categories: Category[];
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="py-2"
      >
        {/* Opção "Todos" */}
        <TouchableOpacity
          onPress={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full mr-2 ${
            selectedCategoryId === null
              ? "bg-primary-500"
              : "bg-gray-100 border border-gray-200"
          }`}
        >
          <Text
            className={`${
              selectedCategoryId === null ? "text-white" : "text-gray-800"
            } font-medium`}
          >
            Todos
          </Text>
        </TouchableOpacity>

        {/* Lista de categorias */}
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => onSelectCategory(Number(category.id))}
            className={`px-4 py-2 rounded-full mr-2 ${
              selectedCategoryId === Number(category.id)
                ? "bg-primary-500"
                : "bg-gray-100 border border-gray-200"
            }`}
          >
            <Text
              className={`${
                selectedCategoryId === Number(category.id)
                  ? "text-white"
                  : "text-gray-800"
              } font-medium`}
            >
              {category.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
