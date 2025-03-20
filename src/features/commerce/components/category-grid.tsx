// Path: src/features/commerce/components/category-grid.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ImageBackground,
} from "react-native";
import { Category } from "../models/category";
import { Grid, Sparkles, Store } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { router } from "expo-router";
import { HStack, VStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";
import { LinearGradient } from "expo-linear-gradient";

interface CategoryGridProps {
  categories: Category[];
  isLoading: boolean;
}

export function CategoryGrid({ categories, isLoading }: CategoryGridProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  // Usar exatamente 3 colunas, independentemente do tamanho da tela
  const numColumns = 3;
  const itemWidth = `${100 / numColumns}%`;

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

      {/* Novo estilo de grid de categorias com cards quadrados e overlay */}
      <View className="flex-row flex-wrap">
        {categories.map((category) => (
          <View key={category.id} style={{ width: itemWidth }} className="p-2">
            <TouchableOpacity
              onPress={() =>
                router.push(`/(drawer)/categoria/${category.slug}`)
              }
              activeOpacity={0.9}
              className="w-full aspect-square rounded-xl overflow-hidden shadow-sm"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 3,
              }}
            >
              {category.imagem ? (
                <ImageBackground
                  source={{ uri: category.imagem }}
                  className="w-full h-full"
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={[
                      "rgba(0,0,0,0)",
                      "rgba(0,0,0,0.2)",
                      "rgba(0,0,0,0.7)",
                    ]}
                    className="absolute inset-0 justify-end p-3"
                  >
                    <Text
                      className="text-white font-semibold text-center"
                      numberOfLines={2}
                    >
                      {category.nome}
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              ) : (
                <View className="w-full h-full bg-primary-50 justify-end items-center">
                  <View className="absolute inset-0 flex items-center justify-center">
                    <Store size={32} color={THEME_COLORS.primary} />
                  </View>
                  <LinearGradient
                    colors={[
                      `${THEME_COLORS.primary}00`,
                      `${THEME_COLORS.primary}40`,
                      `${THEME_COLORS.primary}90`,
                    ]}
                    className="absolute inset-0 justify-end p-3"
                  >
                    <Text
                      className="text-white font-semibold text-center"
                      numberOfLines={2}
                    >
                      {category.nome}
                    </Text>
                  </LinearGradient>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}
