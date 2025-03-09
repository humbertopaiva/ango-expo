// Path: src/features/category-page/screens/category-page.tsx
import React, { useState } from "react";
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
  const [showFilterModal, setShowFilterModal] = useState(false);

  if (!categorySlug) {
    return null;
  }

  return (
    <View className="flex-1 bg-background">
      {/* Utilizando o novo header compacto */}
      <CategoryHeader
        categoryName={categoryName}
        categoryImage={categoryImage}
        isLoading={isLoading}
        onFilterPress={() => setShowFilterModal(true)}
      />

      <CategoryPageProvider categorySlug={categorySlug as string}>
        <CategoryPageContent
          showFilterModal={showFilterModal}
          setShowFilterModal={setShowFilterModal}
        />
      </CategoryPageProvider>
    </View>
  );
}
