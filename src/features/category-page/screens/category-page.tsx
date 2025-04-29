// Path: src/features/category-page/screens/category-page.tsx
import React, { useState } from "react";
import { View, StatusBar } from "react-native";
import { CategoryPageProvider } from "../contexts/category-page-provider";
import { CategoryPageContent } from "./category-page-content";
import { useLocalSearchParams } from "expo-router";
import { useCategoryDetails } from "../hooks/use-category-details";

import { CategoryHeader } from "../components/category-header";
import { AnimatedPageTransition } from "@/components/animations/animated-page-transition";
import { Loader } from "@/components/common/loader";

export function CategoryPage() {
  const { categorySlug } = useLocalSearchParams<{ categorySlug: string }>();
  const { isLoading } = useCategoryDetails(categorySlug as string);

  const [showFilterModal, setShowFilterModal] = useState(false);

  if (!categorySlug) {
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <AnimatedPageTransition animation="slide" duration={600}>
      <View className="flex-1 bg-white">
        {/* Header simplificado sem margens */}

        <CategoryPageProvider categorySlug={categorySlug as string}>
          <CategoryPageContent
            showFilterModal={showFilterModal}
            setShowFilterModal={setShowFilterModal}
          />
        </CategoryPageProvider>
      </View>
    </AnimatedPageTransition>
  );
}
