// Path: src/features/category-page/components/category-breadcrumb.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HStack } from "@gluestack-ui/themed";
import { ChevronRight, Home } from "lucide-react-native";
import { router } from "expo-router";
import { THEME_COLORS } from "@/src/styles/colors";

interface CategoryBreadcrumbProps {
  categoryName: string;
}

export function CategoryBreadcrumb({ categoryName }: CategoryBreadcrumbProps) {
  const goToHome = () => {
    router.push("/(drawer)/(tabs)/comercio-local");
  };

  return (
    <HStack className="px-4 py-2 items-center flex-wrap">
      <TouchableOpacity onPress={goToHome} className="flex-row items-center">
        <Home size={14} color={THEME_COLORS.primary} />
        <Text className="ml-1 text-xs text-primary-600">Início</Text>
      </TouchableOpacity>

      <ChevronRight size={14} color="#9CA3AF" className="mx-1" />

      <TouchableOpacity onPress={goToHome} className="flex-row items-center">
        <Text className="text-xs text-gray-500">Categorias</Text>
      </TouchableOpacity>

      <ChevronRight size={14} color="#9CA3AF" className="mx-1" />

      <Text className="text-xs font-medium text-gray-800" numberOfLines={1}>
        {categoryName}
      </Text>
    </HStack>
  );
}
