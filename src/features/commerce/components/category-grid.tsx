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
  "#EC4899", // pink
  "#10B981", // emerald
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
            <View
              key={i}
              style={{ width: itemWidth }}
              className="aspect-square p-2"
            >
              <View className="w-full h-full rounded-xl bg-gray-200 animate-pulse" />
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

      {/* Grid de categorias com design minimalista */}
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
                className="overflow-hidden bg-white"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                  height: (width / numColumns) * 1.1, // Altura aumentada para acomodar o texto
                  borderRadius: 12, // Arredondamento apenas para o card inteiro
                }}
              >
                {/* Container para imagem com borda inferior colorida */}
                <View
                  className="overflow-hidden"
                  style={{
                    borderBottomWidth: 3,
                    borderBottomColor: category.color,
                    height: "60%", // Reduzindo um pouco a proporção da imagem para dar mais espaço ao texto
                    borderTopLeftRadius: 12, // Arredondamento apenas no topo
                    borderTopRightRadius: 12, // Arredondamento apenas no topo
                    borderBottomLeftRadius: 0, // Sem arredondamento na parte inferior
                    borderBottomRightRadius: 0, // Sem arredondamento na parte inferior
                  }}
                >
                  {/* Área da imagem */}
                  <View
                    style={{
                      height: "100%",
                      backgroundColor: "#F9FAFB", // Cinza muito claro (gray-50)
                    }}
                    className="w-full items-center justify-center overflow-hidden"
                  >
                    {category.imagem ? (
                      <ImagePreview
                        uri={category.imagem}
                        width="100%"
                        height="100%"
                        resizeMode="cover"
                        containerClassName="w-full h-full rounded-none"
                      />
                    ) : (
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${category.color}15` }}
                      >
                        <Store size={24} color={category.color} />
                      </View>
                    )}
                  </View>
                </View>

                {/* Área do texto (abaixo da imagem) com espaçamento adequado */}
                <View className="flex-1 py-2 px-2 bg-white items-center justify-center">
                  <Text
                    className="text-center text-sm"
                    style={{
                      color: "#374151",
                      fontFamily: "PlusJakartaSans_500Medium",
                      // Garantir que o texto caiba no espaço disponível
                      flexShrink: 1,
                      height: "auto",
                      minHeight: 40, // Altura mínima para acomodar duas linhas
                    }}
                    numberOfLines={2}
                    adjustsFontSizeToFit={false}
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
