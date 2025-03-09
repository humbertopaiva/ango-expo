// Path: src/features/delivery/components/category-filter-grid.tsx
import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Grid, Sparkles } from "lucide-react-native";
import { Subcategory } from "../models/subcategory";
import { THEME_COLORS } from "@/src/styles/colors";
import { HStack } from "@gluestack-ui/themed";
import { SubcategoryCard } from "./subcategory-card";
import { getCategoryImage } from "../utils/category-images";

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
  // Fixo em 3 colunas para mobile
  const columnCount = 3;

  return (
    <View className="py-4">
      {title && (
        <View className="px-4 mb-6">
          {/* Badge estilizada igual ao commerce */}
          <HStack className="inline-flex items-center justify-center mb-4">
            <HStack className="bg-primary-100/60 px-4 py-2 rounded-full flex items-center gap-2">
              <Sparkles size={18} color={THEME_COLORS.primary} />
              <Text className="text-sm font-medium text-primary-500">
                {title}
              </Text>
            </HStack>
          </HStack>

          {description && (
            <Text className="text-gray-600 text-sm text-center mt-1">
              {description}
            </Text>
          )}
        </View>
      )}

      <View className="flex-row flex-wrap px-2">
        {/* Opção "Todos" */}
        <View style={{ width: `${100 / columnCount}%` }} className="px-2">
          <SubcategoryCard
            name="Todos"
            slug="all"
            imageUrl={null}
            isSelected={selectedSubcategories.length === 0}
            onPress={() => onSelectSubcategory(null)}
          />
        </View>

        {/* Subcategorias */}
        {subcategories.map((category) => (
          <View
            key={category.id || category.slug}
            style={{ width: `${100 / columnCount}%` }}
            className="px-2"
          >
            <SubcategoryCard
              name={category.nome}
              slug={category.slug}
              imageUrl={category.imagem || getCategoryImage(category.slug)}
              isSelected={selectedSubcategories.includes(category.slug)}
              onPress={() => onSelectSubcategory(category.slug)}
              totalCompanies={category.total_empresas}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
