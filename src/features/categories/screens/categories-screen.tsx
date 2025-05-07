// src/features/categories/screens/categories-screen.tsx

import React from "react";
import { CategoriesProvider } from "../contexts/categories-provider";
import { CategoriesContent } from "./categories-content";
import { View } from "react-native";

export function CategoriesScreen() {
  return (
    <View className="flex-1 bg-white">
      <CategoriesProvider>
        <CategoriesContent />
      </CategoriesProvider>
    </View>
  );
}
