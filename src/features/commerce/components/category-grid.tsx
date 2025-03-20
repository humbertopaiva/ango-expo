// Path: src/features/commerce/components/category-grid.tsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Category } from "../models/category";
import { Sparkles, Store } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { router } from "expo-router";
import { HStack, VStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";

interface CategoryGridProps {
  categories: Category[];
  isLoading: boolean;
}

// Lista de cores para usar nas categorias
const CATEGORY_COLORS = [
  "#F4511E", // primary
  "#0891B2", // teal
  "#3B82F6", // blue
  "#8B5CF6", // violet
  "#10B981", // emerald
  "#EC4899", // pink
  "#F59E0B", // amber
  "#EF4444", // red
  "#F97316", // orange
  "#6366F1", // indigo
];

export function CategoryGrid({ categories, isLoading }: CategoryGridProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  // Usar exatamente 3 colunas, independentemente do tamanho da tela
  const numColumns = 3;
  const itemWidth = `${100 / numColumns}%`;

  // Atribuir cores às categorias de forma consistente
  const categoriesWithColors = useMemo(() => {
    return categories.map((category, index) => ({
      ...category,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));
  }, [categories]);

  if (isLoading) {
    return (
      <View>
        <HStack className="inline-flex items-center justify-center mb-6">
          <HStack className="bg-primary-100/60 px-4 py-2 rounded-full flex items-center gap-2">
            <Sparkles size={18} color={THEME_COLORS.primary} />
            <Text className="text-sm font-medium text-primary-500">
              Categorias em Destaque
            </Text>
          </HStack>
        </HStack>

        <VStack className="items-center justify-center w-full gap-1 mb-6">
          <Text className="text-3xl font-gothic text-secondary-500">
            EXPLORE O
          </Text>
          <Text className="text-3xl font-gothic text-primary-500">
            COMÉRCIO LOCAL
          </Text>
        </VStack>

        {/* Grid de categorias em loading state */}
        <View className="flex-row flex-wrap">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i} style={{ width: itemWidth }} className="p-2">
              <View className="w-full h-32 rounded-xl bg-gray-200 animate-pulse" />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View>
      <View className="mb-6 px-4">
        <HStack className="inline-flex items-center justify-center mb-6">
          <HStack className="bg-primary-100/60 px-4 py-2 rounded-full flex items-center gap-2">
            <Sparkles size={18} color={THEME_COLORS.primary} />
            <Text className="text-sm font-medium text-primary-500">
              Categorias em Destaque
            </Text>
          </HStack>
        </HStack>

        <VStack className="items-center justify-center w-full gap-1">
          <Text className="text-3xl font-gothic text-secondary-500">
            EXPLORE O
          </Text>
          <Text className="text-3xl font-gothic text-primary-500">
            COMÉRCIO LOCAL
          </Text>
        </VStack>
      </View>

      {/* Grid de categorias com design ultra minimalista */}
      <View className="flex-row flex-wrap">
        {categoriesWithColors.map((category) => (
          <View key={category.id} style={{ width: itemWidth }} className="p-2">
            <TouchableOpacity
              onPress={() =>
                router.push(`/(drawer)/categoria/${category.slug}`)
              }
              activeOpacity={0.7}
              className="w-full"
            >
              <View
                className="bg-white rounded-xl p-4 items-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.08,
                  shadowRadius: 2,
                  elevation: 1,
                  height: (width / numColumns) * 0.9, // Altura fixa para todos os cards
                }}
              >
                {/* Imagem quadrada com borda colorida */}
                <View
                  className="mb-3 overflow-hidden"
                  style={{
                    width: (width / numColumns) * 0.4, // Quadrado de 40% da largura do card
                    height: (width / numColumns) * 0.4,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: category.color,
                  }}
                >
                  {category.imagem ? (
                    <ImagePreview
                      uri={category.imagem}
                      width="100%"
                      height="100%"
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      className="w-full h-full items-center justify-center"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <Store size={24} color={category.color} />
                    </View>
                  )}
                </View>

                {/* Nome da categoria */}
                <View className="flex-1 items-center justify-center">
                  <Text
                    className="text-center text-sm"
                    style={{
                      color: "#333333",
                      fontFamily: "PlusJakartaSans_500Medium",
                    }}
                    numberOfLines={2}
                  >
                    {category.nome}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}
