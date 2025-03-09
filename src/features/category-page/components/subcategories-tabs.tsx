// Path: src/features/category-page/components/subcategories-tabs.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { Grid, Sparkles } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { Subcategory } from "../models/subcategory";
import { THEME_COLORS } from "@/src/styles/colors";
import { HStack, VStack } from "@gluestack-ui/themed";

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
  const isWeb = Platform.OS === "web";
  const numColumns = isWeb ? 4 : 3;

  if (isLoading) {
    return (
      <View className="mb-6">
        <HStack className="inline-flex items-center justify-center mb-4">
          <HStack className="bg-primary-100/60 px-4 py-2 rounded-full flex items-center gap-2">
            <Sparkles size={18} color={THEME_COLORS.primary} />
            <Text className="text-sm font-medium text-primary-500">
              Filtrar por Categoria
            </Text>
          </HStack>
        </HStack>

        <View className="flex-row flex-wrap gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View
              key={i}
              className={`${
                isWeb ? "w-1/4" : "w-1/3"
              } aspect-square animate-pulse bg-gray-200 rounded-xl p-2`}
            />
          ))}
        </View>
      </View>
    );
  }

  // Adicionar "Todas" como uma subcategoria especial
  const allSubcategoriesOption = {
    id: "all",
    nome: "Todas",
    slug: null,
    imagem: null,
  };

  const allOptions = [allSubcategoriesOption, ...subcategories];

  return (
    <View className="mb-6">
      <HStack className="inline-flex items-center justify-center mb-6">
        <HStack className="bg-primary-100/60 px-4 py-2 rounded-full flex items-center gap-2">
          <Sparkles size={18} color={THEME_COLORS.primary} />
          <Text className="text-sm font-medium text-primary-500">
            Filtrar por Categoria
          </Text>
        </HStack>
      </HStack>

      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap">
          {allOptions.map((subcategory) => {
            const isSelected =
              subcategory.slug === selectedSubcategory ||
              (subcategory.slug === null && selectedSubcategory === null);

            return (
              <View
                key={subcategory.id}
                className={`${isWeb ? "w-1/4" : "w-1/3"} p-2`}
              >
                <TouchableOpacity
                  onPress={() => onSelectSubcategory(subcategory.slug)}
                  className="w-full aspect-square"
                >
                  <View className="w-full h-full flex items-center justify-center">
                    <View
                      className={`w-full aspect-square ${
                        isSelected
                          ? "bg-primary-50 border-primary-200"
                          : "bg-white"
                      } border border-gray-100 rounded-2xl shadow-sm p-2 flex items-center justify-center`}
                    >
                      <View className="w-12 h-12 rounded-xl bg-primary-50 items-center justify-center mb-2">
                        {subcategory.imagem ? (
                          <ImagePreview
                            uri={subcategory.imagem}
                            width={28}
                            height={28}
                            resizeMode="contain"
                            containerClassName="rounded-lg"
                          />
                        ) : (
                          <Grid size={20} color="#F4511E" />
                        )}
                      </View>
                      <Text
                        className={`text-center text-xs ${
                          isSelected
                            ? "font-medium text-primary-700"
                            : "font-medium text-gray-800"
                        } line-clamp-2 px-1`}
                      >
                        {subcategory.nome}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
