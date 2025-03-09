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
        <View className="flex-row py-2">
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={{
                width: 80,
                marginHorizontal: 8,
                alignItems: "center",
              }}
            >
              <View className="h-16 w-16 rounded-full bg-gray-200 animate-pulse" />
              <View className="h-4 w-20 bg-gray-200 animate-pulse mt-2 rounded" />
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <View className="mb-6">
      <Text className="text-gray-700 font-medium mb-3">Categorias</Text>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pb-1"
      >
        <View className="flex-row py-2">
          {/* Botão para "Todas" */}
          <Pressable
            onPress={() => handleSelectSubcategory(null)}
            style={({ pressed }) => [
              {
                width: 80,
                alignItems: "center",
                marginHorizontal: 8,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor:
                  selectedSubcategory === null
                    ? THEME_COLORS.primary
                    : "#F3F4F6",
                alignItems: "center",
                justifyContent: "center",
                ...(selectedSubcategory === null
                  ? {
                      shadowColor: THEME_COLORS.primary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 4,
                    }
                  : {}),
              }}
            >
              <Grid
                size={24}
                color={selectedSubcategory === null ? "white" : "#6B7280"}
              />
            </View>
            <Text
              style={{
                marginTop: 8,
                color: "#1F2937",
                fontSize: 12,
                fontWeight: selectedSubcategory === null ? "500" : "400",
                textAlign: "center",
                maxWidth: 75,
              }}
              numberOfLines={2}
            >
              Todas
            </Text>
          </Pressable>

          {/* Botões para subcategorias */}
          {subcategories.map((subcategory) => (
            <Pressable
              key={subcategory.id}
              onPress={() => handleSelectSubcategory(subcategory.slug)}
              style={({ pressed }) => [
                {
                  width: 80,
                  alignItems: "center",
                  marginHorizontal: 8,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor:
                    selectedSubcategory === subcategory.slug
                      ? THEME_COLORS.primary
                      : "#F3F4F6",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  ...(selectedSubcategory === subcategory.slug
                    ? {
                        shadowColor: THEME_COLORS.primary,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 4,
                      }
                    : {}),
                }}
              >
                {subcategory.imagem ? (
                  <ImagePreview
                    uri={subcategory.imagem}
                    width="100%"
                    height="100%"
                    resizeMode="cover"
                  />
                ) : (
                  <Filter
                    size={24}
                    color={
                      selectedSubcategory === subcategory.slug
                        ? "white"
                        : "#6B7280"
                    }
                  />
                )}
              </View>
              <Text
                style={{
                  marginTop: 8,
                  color: "#1F2937",
                  fontSize: 12,
                  fontWeight:
                    selectedSubcategory === subcategory.slug ? "500" : "400",
                  textAlign: "center",
                  maxWidth: 75,
                }}
                numberOfLines={2}
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
