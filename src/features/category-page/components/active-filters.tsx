// Path: src/features/category-page/components/active-filters.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { X, Filter } from "lucide-react-native";
import { HStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";

interface ActiveFiltersProps {
  selectedSubcategory: string | null;
  subcategoryName: string | null;
  onClearFilter: () => void;
}

export function ActiveFilters({
  selectedSubcategory,
  subcategoryName,
  onClearFilter,
}: ActiveFiltersProps) {
  // Se não houver filtro selecionado, não renderiza nada
  if (!selectedSubcategory || !subcategoryName) {
    return null;
  }

  return (
    <View className="mb-4 mt-2">
      <HStack className="px-4 py-2 bg-white">
        <Text className="text-sm font-medium text-gray-700 mb-2">
          Filtros ativos:
        </Text>
      </HStack>

      <HStack className="flex-wrap px-4 gap-2">
        <HStack className="bg-primary-100 rounded-full px-3 py-1.5 items-center">
          <Filter size={14} color={THEME_COLORS.primary} />
          <Text className="mx-2 text-primary-700 text-sm font-medium">
            {subcategoryName}
          </Text>
          <TouchableOpacity onPress={onClearFilter}>
            <View className="bg-primary-200 rounded-full p-1">
              <X size={12} color={THEME_COLORS.primary} />
            </View>
          </TouchableOpacity>
        </HStack>
      </HStack>
    </View>
  );
}
