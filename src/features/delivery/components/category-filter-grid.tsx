// Path: src/features/delivery/components/category-filter-grid.tsx
import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import {
  Grid,
  Store,
  Pizza,
  Coffee,
  IceCream,
  UtensilsCrossed,
} from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { Subcategory } from "../models/subcategory";
import { THEME_COLORS } from "@/src/styles/colors";

interface CategoryFilterGridProps {
  subcategories: Subcategory[];
  selectedSubcategories: string[];
  onSelectSubcategory: (slug: string | null) => void;
  title?: string;
  description?: string;
}

export function CategoryFilterGrid({
  subcategories,
  selectedSubcategories,
  onSelectSubcategory,
  title = "Categorias",
  description,
}: CategoryFilterGridProps) {
  // Fixo em 3 colunas para todos os tamanhos de tela
  const columnCount = 3;

  // Mapeamento de ícones com base no slug
  const getCategoryIcon = (slug: string) => {
    const iconProps = {
      size: 20,
      color: selectedSubcategories.includes(slug)
        ? THEME_COLORS.primary
        : "#6B7280",
    };

    switch (slug.toLowerCase()) {
      case "hamburguerias":
        return <Store {...iconProps} />;
      case "pizzarias":
        return <Pizza {...iconProps} />;
      case "acai-e-sorveteria":
        return <IceCream {...iconProps} />;
      case "cachorro-quente":
        return <UtensilsCrossed {...iconProps} />;
      case "sushis":
        return <UtensilsCrossed {...iconProps} />;
      case "porcoes":
        return <Coffee {...iconProps} />;
      default:
        return <Store {...iconProps} />;
    }
  };

  return (
    <View className="py-4">
      {title && (
        <View className="px-4 mb-4">
          <Text className="text-xl font-semibold">{title}</Text>
          {description && (
            <Text className="text-gray-600 text-sm mt-1">{description}</Text>
          )}
        </View>
      )}

      <View className="flex-row flex-wrap px-2">
        {/* Opção "Todos" */}
        <TouchableOpacity
          onPress={() => onSelectSubcategory(null)}
          activeOpacity={0.7}
          style={{ width: `${100 / columnCount}%` }}
          className="px-2 mb-4"
        >
          <View
            className={`aspect-square items-center justify-center rounded-xl border 
            ${
              selectedSubcategories.length === 0
                ? "bg-primary-50 border-primary-200"
                : "bg-white border-gray-200"
            }`}
          >
            <View className="w-12 h-12 rounded-xl bg-white border border-gray-100 items-center justify-center mb-2">
              <Grid
                size={20}
                color={
                  selectedSubcategories.length === 0
                    ? THEME_COLORS.primary
                    : "#6B7280"
                }
              />
            </View>
            <Text
              className={`text-xs font-medium text-center ${
                selectedSubcategories.length === 0
                  ? "text-primary-600"
                  : "text-gray-700"
              }`}
              numberOfLines={2}
            >
              Todas
            </Text>
          </View>
        </TouchableOpacity>

        {/* Categorias */}
        {subcategories.map((category) => (
          <TouchableOpacity
            key={category.id || category.slug}
            onPress={() => onSelectSubcategory(category.slug)}
            activeOpacity={0.7}
            style={{ width: `${100 / columnCount}%` }}
            className="px-2 mb-4"
          >
            <View
              className={`aspect-square items-center justify-center rounded-xl border
              ${
                selectedSubcategories.includes(category.slug)
                  ? "bg-primary-50 border-primary-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <View className="w-12 h-12 rounded-xl bg-white border border-gray-100 items-center justify-center mb-2 overflow-hidden">
                {category.imagem ? (
                  <ImagePreview
                    uri={category.imagem}
                    width={28}
                    height={28}
                    resizeMode="contain"
                    containerClassName="rounded-lg"
                  />
                ) : (
                  getCategoryIcon(category.slug)
                )}
              </View>
              <Text
                className={`text-xs font-medium text-center px-1 ${
                  selectedSubcategories.includes(category.slug)
                    ? "text-primary-600"
                    : "text-gray-700"
                }`}
                numberOfLines={2}
              >
                {category.nome}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
