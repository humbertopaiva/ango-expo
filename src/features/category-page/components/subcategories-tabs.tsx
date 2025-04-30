// Path: src/features/category-page/components/subcategories-tabs.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Grid, SlidersHorizontal } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { Subcategory } from "../models/subcategory";
import { THEME_COLORS } from "@/src/styles/colors";
import { HStack } from "@gluestack-ui/themed";

interface SubcategoriesTabsProps {
  subcategories: Subcategory[];
  selectedSubcategory: string | null;
  onSelectSubcategory: (slug: string | null) => void;
  isLoading: boolean;
  onFilterPress?: () => void;
}

export function SubcategoriesTabs({
  subcategories,
  selectedSubcategory,
  onSelectSubcategory,
  isLoading,
  onFilterPress,
}: SubcategoriesTabsProps) {
  const allSubcategoriesOption = {
    id: "all",
    nome: "Todas",
    slug: null,
    imagem: null,
  };

  const allOptions = [allSubcategoriesOption, ...subcategories];

  if (isLoading) {
    return (
      <View className="mb-6">
        <HStack className="mb-4">
          <Text className="text-sm font-medium text-primary-500">
            Filtrar por Subcategoria
          </Text>
        </HStack>
        <ActivityIndicator size="large" color={THEME_COLORS.primary} />
      </View>
    );
  }

  return (
    <View className="mb-6">
      <HStack
        className="mb-8"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Text className="text-lg font-medium text-primary-500">
          Filtrar por Subcategoria
        </Text>
      </HStack>

      <FlatList
        data={allOptions}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        renderItem={({ item }) => {
          const isSelected =
            item.slug === selectedSubcategory ||
            (item.slug === null && selectedSubcategory === null);

          return (
            <TouchableOpacity
              onPress={() => onSelectSubcategory(item.slug)}
              style={{ alignItems: "center" }}
            >
              <View
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  backgroundColor: isSelected ? "#FFF3E5" : "#FFFFFF",
                  borderWidth: 1,
                  borderColor: isSelected ? THEME_COLORS.primary : "#E5E7EB",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.imagem ? (
                  <ImagePreview
                    uri={item.imagem}
                    width={36}
                    height={36}
                    resizeMode="contain"
                    containerClassName="rounded-full p-1"
                  />
                ) : (
                  <Grid size={28} color={THEME_COLORS.primary} />
                )}
              </View>
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  fontWeight: isSelected ? "600" : "500",
                  color: isSelected ? THEME_COLORS.primary : "#374151",
                  textAlign: "center",
                  maxWidth: 72,
                }}
                numberOfLines={2}
              >
                {item.nome}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
