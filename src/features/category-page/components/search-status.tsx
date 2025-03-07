// Path: src/features/category-page/components/search-status.tsx
import React from "react";
import { View, Text } from "react-native";
import { HStack } from "@gluestack-ui/themed";
import { Filter, Search, X } from "lucide-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { THEME_COLORS } from "@/src/styles/colors";

interface SearchStatusProps {
  totalResults: number;
  searchTerm?: string;
  selectedSubcategory?: string | null;
  subcategoryName?: string;
  onClearSearch?: () => void;
  onClearFilter?: () => void;
}

export function SearchStatus({
  totalResults,
  searchTerm,
  selectedSubcategory,
  subcategoryName,
  onClearSearch,
  onClearFilter,
}: SearchStatusProps) {
  const hasSearch = !!searchTerm && searchTerm.length > 0;
  const hasFilter = !!selectedSubcategory;

  if (!hasSearch && !hasFilter) return null;

  return (
    <View className="mb-4">
      <HStack className="justify-between items-center mb-2">
        <Text className="text-gray-700 font-medium">
          {totalResults} {totalResults === 1 ? "resultado" : "resultados"}{" "}
          encontrados
        </Text>
      </HStack>

      <HStack className="flex-wrap gap-2">
        {hasSearch && (
          <HStack className="bg-primary-100 rounded-full px-3 py-1.5 items-center">
            <Search size={14} color={THEME_COLORS.primary} />
            <Text className="mx-2 text-primary-700 text-sm">{searchTerm}</Text>
            {onClearSearch && (
              <TouchableOpacity onPress={onClearSearch}>
                <X size={14} color={THEME_COLORS.primary} />
              </TouchableOpacity>
            )}
          </HStack>
        )}

        {hasFilter && (
          <HStack className="bg-primary-100 rounded-full px-3 py-1.5 items-center">
            <Filter size={14} color={THEME_COLORS.primary} />
            <Text className="mx-2 text-primary-700 text-sm">
              {subcategoryName}
            </Text>
            {onClearFilter && (
              <TouchableOpacity onPress={onClearFilter}>
                <X size={14} color={THEME_COLORS.primary} />
              </TouchableOpacity>
            )}
          </HStack>
        )}
      </HStack>
    </View>
  );
}
