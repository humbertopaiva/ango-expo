// Path: src/features/category-page/components/subcategories-tabs.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Grid } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { Subcategory } from "../models/subcategory";

interface SubcategoriesTabsProps {
  subcategories: Subcategory[];
  selectedSubcategory: string | null;
  onSelectSubcategory: (slug: string | null) => void;
  isLoading: boolean;
}

export function SubcategoriesTabs({
  subcategories,
  selectedSubcategory,
  onSelectSubcategory,
  isLoading,
}: SubcategoriesTabsProps) {
  if (isLoading) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2 py-2">
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              className="h-10 w-32 rounded-full bg-gray-200 animate-pulse"
            />
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2 py-2">
        <TouchableOpacity
          onPress={() => onSelectSubcategory(null)}
          className={`flex-row items-center px-4 py-2 rounded-full ${
            selectedSubcategory === null ? "bg-primary-500" : "bg-gray-100"
          }`}
        >
          <Grid
            size={18}
            color={selectedSubcategory === null ? "white" : "#6B7280"}
          />
          <Text
            className={`ml-2 ${
              selectedSubcategory === null ? "text-white" : "text-gray-700"
            }`}
          >
            Todas
          </Text>
        </TouchableOpacity>

        {subcategories.map((subcategory) => (
          <TouchableOpacity
            key={subcategory.id}
            onPress={() => onSelectSubcategory(subcategory.slug)}
            className={`flex-row items-center px-4 py-2 rounded-full ${
              selectedSubcategory === subcategory.slug
                ? "bg-primary-500"
                : "bg-gray-100"
            }`}
          >
            {subcategory.imagem ? (
              <View className="w-5 h-5">
                <ImagePreview
                  uri={subcategory.imagem}
                  containerClassName="rounded"
                />
              </View>
            ) : (
              <Grid
                size={18}
                color={
                  selectedSubcategory === subcategory.slug ? "white" : "#6B7280"
                }
              />
            )}
            <Text
              className={`ml-2 ${
                selectedSubcategory === subcategory.slug
                  ? "text-white"
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
