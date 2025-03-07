// Path: src/features/delivery/components/subcategory-filters.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Grid } from "lucide-react-native";
import { Subcategory } from "../models/subcategory";
import { ImagePreview } from "@/components/custom/image-preview";
import { THEME_COLORS } from "@/src/styles/colors";

interface SubcategoryFiltersProps {
  subcategories: Subcategory[];
  selectedSubcategories: string[];
  onSelectSubcategory: (slug: string | null) => void;
}

export function SubcategoryFilters({
  subcategories,
  selectedSubcategories,
  onSelectSubcategory,
}: SubcategoryFiltersProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="pb-4"
    >
      <View className="flex-row items-center gap-3 px-4">
        <TouchableOpacity
          onPress={() => onSelectSubcategory(null)}
          className={`items-center ${
            selectedSubcategories.length === 0 ? "opacity-100" : "opacity-70"
          }`}
        >
          <View
            className={`w-16 h-16 rounded-full items-center justify-center mb-2 ${
              selectedSubcategories.length === 0 ? "bg-primary" : "bg-gray-200"
            }`}
          >
            <Grid
              size={24}
              color={selectedSubcategories.length === 0 ? "white" : "#6B7280"}
            />
          </View>
          <Text
            className={`text-xs font-medium ${
              selectedSubcategories.length === 0
                ? "text-primary"
                : "text-gray-700"
            }`}
          >
            Todos
          </Text>
        </TouchableOpacity>

        {subcategories.map((subcategory) => (
          <TouchableOpacity
            key={subcategory.id}
            onPress={() => onSelectSubcategory(subcategory.slug)}
            className={`items-center ${
              selectedSubcategories.includes(subcategory.slug)
                ? "opacity-100"
                : "opacity-70"
            }`}
          >
            <View
              className={`w-16 h-16 rounded-full items-center justify-center mb-2 overflow-hidden ${
                selectedSubcategories.includes(subcategory.slug)
                  ? "bg-primary"
                  : "bg-gray-200"
              }`}
            >
              {subcategory.imagem ? (
                <ImagePreview
                  uri={subcategory.imagem}
                  width="100%"
                  height="100%"
                  resizeMode="cover"
                />
              ) : (
                <Text
                  className={`text-xl font-bold ${
                    selectedSubcategories.includes(subcategory.slug)
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  {subcategory.nome.charAt(0)}
                </Text>
              )}
            </View>
            <Text
              className={`text-xs font-medium text-center ${
                selectedSubcategories.includes(subcategory.slug)
                  ? "text-primary"
                  : "text-gray-700"
              }`}
            >
              {subcategory.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
