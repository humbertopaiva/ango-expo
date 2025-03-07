// Path: src/features/category-page/screens/category-page.tsx (atualizado sem animações)
import React from "react";
import { View } from "react-native";
import { CategoryPageProvider } from "../contexts/category-page-provider";
import { CategoryPageContent } from "./category-page-content";
import { useLocalSearchParams } from "expo-router";
import { useCategoryDetails } from "../hooks/use-category-details";
import { CategoryHeader } from "../components/category-header";

export function CategoryPage() {
  const { categorySlug } = useLocalSearchParams<{ categorySlug: string }>();
  const { categoryName, categoryImage, isLoading } = useCategoryDetails(
    categorySlug as string
  );

  if (!categorySlug) {
    return null;
  }

  return (
    <View className="flex-1 bg-background">
      <CategoryHeader
        categoryName={categoryName}
        categoryImage={categoryImage}
        isLoading={isLoading}
      />

      <CategoryPageProvider categorySlug={categorySlug as string}>
        <CategoryPageContent />
      </CategoryPageProvider>
    </View>
  );
}
