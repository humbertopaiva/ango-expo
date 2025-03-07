// Path: src/components/custom/category-filter-grid.tsx

import React from "react";
import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
import { Tag, Sparkles } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { THEME_COLORS } from "@/src/styles/colors";
import { Subcategory } from "@/src/features/delivery/models/subcategory";

interface Category {
  id: string;
  nome: string;
  slug: string;
  imagem?: string;
  total_empresas?: number;
}

interface CategoryFilterGridProps {
  title?: string;
  description?: string;
  categories: Category[] | Subcategory[];
  selectedItem?: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoryFilterGrid({
  title = "Filtrar por categoria",
  description = "Selecione uma categoria para filtrar os resultados",
  categories,
  selectedItem,
  onSelect,
}: CategoryFilterGridProps) {
  // Criar um item "Todas" com um ID único
  const allCategory = {
    id: "all-categories",
    nome: "Todas",
    slug: null,
  };

  // Combinar com as categorias existentes
  const allCategories = [allCategory, ...categories];

  // Número de colunas com base na plataforma
  const numColumns = Platform.OS === "web" ? 5 : 3;

  // Gerar um ID único para o FlatList
  const flatListKey = `category-grid-${numColumns}`;

  // Renderizar um item da categoria
  const renderItem = ({ item }: { item: any }) => {
    const isAllCategory = item.id === "all-categories";
    const isSelected = isAllCategory
      ? !selectedItem
      : selectedItem === item.slug;

    return (
      <TouchableOpacity
        onPress={() => onSelect(item.slug)}
        className="p-2"
        style={{ width: `${100 / numColumns}%` }}
      >
        <View
          className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-2 ${
            isSelected
              ? "bg-white border-primary shadow"
              : "bg-white/80 border-white/20"
          }`}
        >
          <View
            className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 overflow-hidden ${
              isSelected ? "bg-primary/10" : "bg-primary/5"
            }`}
          >
            {isAllCategory ? (
              <Tag
                size={20}
                color={isSelected ? THEME_COLORS.primary : "#6B7280"}
              />
            ) : item.imagem ? (
              <ImagePreview
                uri={item.imagem}
                width="100%"
                height="100%"
                resizeMode="contain"
              />
            ) : (
              <Text
                className={`text-lg font-semibold ${
                  isSelected ? "text-primary" : "text-gray-600"
                }`}
              >
                {item.nome.charAt(0)}
              </Text>
            )}
          </View>

          <Text
            className={`text-center text-xs font-medium ${
              isSelected ? "text-primary" : "text-gray-700"
            }`}
            numberOfLines={2}
          >
            {item.nome}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="w-full bg-primary-50/50 py-6 rounded-xl">
      <View className="mb-4 px-4">
        <View className="flex-row items-center mb-1">
          <Sparkles size={16} color={THEME_COLORS.primary} className="mr-2" />
          <Text className="text-lg font-semibold text-primary">{title}</Text>
        </View>
        {description && (
          <Text className="text-sm text-gray-600">{description}</Text>
        )}
      </View>

      <FlatList
        key={flatListKey}
        data={allCategories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || item.slug || item.nome}
        numColumns={numColumns}
        scrollEnabled={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
}
