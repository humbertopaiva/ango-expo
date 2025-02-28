// src/features/categories/screens/categories-screen.tsx

import React from "react";
import { CategoriesProvider } from "../contexts/categories-provider";
import { CategoriesContent } from "./categories-content";
import { View } from "react-native";
import ScreenHeader from "@/components/ui/screen-header";
import { Plus } from "lucide-react-native";
import { router } from "expo-router";

export function CategoriesScreen() {
  return (
    <View className="flex-1 bg-white">
      <ScreenHeader
        title="Categorias"
        subtitle="Gerencie as categorias de produtos"
      />
      <CategoriesProvider>
        <CategoriesContent />
      </CategoriesProvider>
    </View>
  );
}
