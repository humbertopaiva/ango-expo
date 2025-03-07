// Path: src/features/category-page/components/subcategories-tabs.tsx
import React, { useRef } from "react";
import { View, Text, ScrollView, Pressable, Platform } from "react-native";
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

  const handleSelectSubcategory = (slug: string | null) => {
    onSelectSubcategory(slug);
  };

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
          <Pressable
            onPress={() => handleSelectSubcategory(null)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
                backgroundColor:
                  selectedSubcategory === null
                    ? THEME_COLORS.primary
                    : "#F3F4F6",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 9999,
                ...(selectedSubcategory === null && Platform.OS !== "web"
                  ? {
                      shadowColor: THEME_COLORS.primary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 3,
                      elevation: 3,
                    }
                  : {}),
              },
            ]}
          >
            <Grid
              size={18}
              color={selectedSubcategory === null ? "white" : "#6B7280"}
            />
            <Text
              style={{
                marginLeft: 8,
                color: selectedSubcategory === null ? "white" : "#6B7280",
                fontWeight: selectedSubcategory === null ? "500" : "normal",
              }}
            >
              Todas
            </Text>
          </Pressable>

          {subcategories.map((subcategory) => (
            <Pressable
              key={subcategory.id}
              onPress={() => handleSelectSubcategory(subcategory.slug)}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor:
                    selectedSubcategory === subcategory.slug
                      ? THEME_COLORS.primary
                      : "#F3F4F6",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 9999,
                  ...(selectedSubcategory === subcategory.slug &&
                  Platform.OS !== "web"
                    ? {
                        shadowColor: THEME_COLORS.primary,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                        elevation: 3,
                      }
                    : {}),
                },
              ]}
            >
              {subcategory.imagem ? (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 9999,
                    overflow: "hidden",
                  }}
                >
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
                style={{
                  marginLeft: 8,
                  color:
                    selectedSubcategory === subcategory.slug
                      ? "white"
                      : "#6B7280",
                  fontWeight:
                    selectedSubcategory === subcategory.slug ? "500" : "normal",
                }}
              >
                {subcategory.nome}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
