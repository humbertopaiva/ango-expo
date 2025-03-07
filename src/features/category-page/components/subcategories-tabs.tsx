// Path: src/features/category-page/components/subcategories-tabs.tsx (atualizado sem animações)
import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Grid, Filter } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { Subcategory } from "../models/subcategory";
import { THEME_COLORS } from "@/src/styles/colors";

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
  const scrollViewRef = useRef<ScrollView>(null);

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
    <View className="mb-6">
      <Text className="text-gray-700 font-medium mb-3">Filtrar por</Text>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pb-1"
      >
        <View className="flex-row gap-2 py-2">
          <TouchableOpacity
            onPress={() => onSelectSubcategory(null)}
            className={`flex-row items-center px-4 py-2 rounded-full ${
              selectedSubcategory === null
                ? "bg-primary-500 shadow-sm"
                : "bg-gray-100"
            }`}
            style={
              selectedSubcategory === null && Platform.OS !== "web"
                ? {
                    shadowColor: THEME_COLORS.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 3,
                  }
                : {}
            }
          >
            <Grid
              size={18}
              color={selectedSubcategory === null ? "white" : "#6B7280"}
            />
            <Text
              className={`ml-2 ${
                selectedSubcategory === null
                  ? "text-white font-medium"
                  : "text-gray-700"
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
                  ? "bg-primary-500 shadow-sm"
                  : "bg-gray-100"
              }`}
              style={
                selectedSubcategory === subcategory.slug &&
                Platform.OS !== "web"
                  ? {
                      shadowColor: THEME_COLORS.primary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 3,
                      elevation: 3,
                    }
                  : {}
              }
            >
              {subcategory.imagem ? (
                <View className="w-5 h-5 rounded-full overflow-hidden">
                  <ImagePreview
                    uri={subcategory.imagem}
                    width="100%"
                    height="100%"
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <Filter
                  size={18}
                  color={
                    selectedSubcategory === subcategory.slug
                      ? "white"
                      : "#6B7280"
                  }
                />
              )}
              <Text
                className={`ml-2 ${
                  selectedSubcategory === subcategory.slug
                    ? "text-white font-medium"
                    : "text-gray-700"
                }`}
              >
                {subcategory.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
