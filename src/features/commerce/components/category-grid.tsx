// Path: src/features/commerce/components/category-grid.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Category } from "../models/category";
import { Grid, Sparkles } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { router } from "expo-router";
import { HStack, VStack } from "@gluestack-ui/themed";
import { Box } from "@/components/ui/box";
import { THEME_COLORS } from "@/src/styles/colors";

interface CategoryGridProps {
  categories: Category[];
  isLoading: boolean;
}

export function CategoryGrid({ categories, isLoading }: CategoryGridProps) {
  // Cria uma chave única para o FlatList que irá mudar apenas quando o número de colunas mudar
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const numColumns = isWeb ? 4 : 3;

  // Criando um ID único baseado no número de colunas
  const flatListKey = `category-grid-${numColumns}`;

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

      {/* Renderização do grid com FlatList */}
      <FlatList
        key={flatListKey}
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View className={`${isWeb ? "w-1/4" : "w-1/3"} p-2`}>
            <TouchableOpacity
              onPress={() => router.push(`/(drawer)/categoria/${item.slug}`)}
              className="w-full aspect-square"
            >
              <View className="w-full h-full flex items-center justify-center">
                <View className="w-full aspect-square bg-white border border-gray-100 rounded-2xl shadow-sm p-2 flex items-center justify-center">
                  <View className="w-12 h-12 rounded-xl bg-primary-50 items-center justify-center mb-2">
                    {item.imagem ? (
                      <ImagePreview
                        uri={item.imagem}
                        width={28}
                        height={28}
                        resizeMode="contain"
                        containerClassName="rounded-lg"
                      />
                    ) : (
                      <Grid size={20} color="#F4511E" />
                    )}
                  </View>
                  <Text className="text-center text-xs font-medium text-gray-800 line-clamp-2 px-1">
                    {item.nome}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{
          flexGrow: 0,
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-gray-500 text-center">
              Nenhuma categoria encontrada
            </Text>
          </View>
        }
      />
    </View>
  );
}
