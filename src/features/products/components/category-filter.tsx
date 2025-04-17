// Path: src/features/products/components/category-filter.tsx
import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Filter, Grid } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { Box } from "@/components/ui/box";

interface CategoryFilterProps {
  categories: any;
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <View className="mb-4 mt-2">
      {/* Cabeçalho elegante com degradê */}
      <Box className="rounded-xl mb-4 py-2 px-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Filter size={18} color={THEME_COLORS.primary} />
            <Text className="ml-2 text-md font-medium text-primary-500">
              Descubra por categorias
            </Text>
          </View>
        </View>
      </Box>

      {/* Categorias rolantes */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {/* Opção "Todos" */}
        <TouchableOpacity
          onPress={() => onSelectCategory(null)}
          style={[
            styles.categoryButton,
            selectedCategoryId === null && styles.activeButton,
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategoryId === null && styles.activeText,
            ]}
          >
            Todos os produtos
          </Text>
        </TouchableOpacity>

        {/* Lista de categorias */}
        {categories.map((category: any) => (
          <TouchableOpacity
            key={category.id.toString()}
            onPress={() => onSelectCategory(Number(category.id))}
            style={[
              styles.categoryButton,
              selectedCategoryId === Number(category.id) && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategoryId === Number(category.id) && styles.activeText,
              ]}
            >
              {category.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    marginRight: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(244, 81, 30, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeButton: {
    backgroundColor: THEME_COLORS.primary,
    borderColor: THEME_COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
  },
  activeText: {
    color: "white",
    fontWeight: "600",
  },
});
