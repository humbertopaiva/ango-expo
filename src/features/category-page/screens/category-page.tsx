// Path: src/features/category-page/screens/category-page.tsx
import React from "react";
import { View } from "react-native";
import { CategoryPageProvider } from "../contexts/category-page-provider";
import { CategoryPageContent } from "./category-page-content";
import { useLocalSearchParams } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";
import { useCategoryDetails } from "../hooks/use-category-details";

export function CategoryPage() {
  const { categorySlug } = useLocalSearchParams<{ categorySlug: string }>();
  const { categoryName, isLoading } = useCategoryDetails(
    categorySlug as string
  );

  if (!categorySlug) {
    return null;
  }

  return (
    <View className="flex-1 bg-background">
      <CategoryPageProvider categorySlug={categorySlug as string}>
        <CategoryPageContent />
      </CategoryPageProvider>
    </View>
  );
}
