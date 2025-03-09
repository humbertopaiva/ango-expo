// Path: src/features/category-page/components/category-breadcrumb.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HStack } from "@gluestack-ui/themed";
import { ChevronRight, Home } from "lucide-react-native";
import { router } from "expo-router";
import { THEME_COLORS } from "@/src/styles/colors";

interface CategoryBreadcrumbProps {
  categoryName: string;
}

export function CategoryBreadcrumb({ categoryName }: CategoryBreadcrumbProps) {
  const goToHome = () => {
    router.push("/(drawer)/(tabs)/comercio-local");
  };

  // Formata o nome da categoria usando a mesma função que usamos no header
  const formattedCategoryName = formatCategoryName(categoryName);

  return (
    <HStack className="px-4 py-2 items-center flex-wrap">
      <TouchableOpacity onPress={goToHome} className="flex-row items-center">
        <Home size={14} color={THEME_COLORS.primary} />
        <Text className="ml-1 text-xs text-primary-600">Início</Text>
      </TouchableOpacity>

      <ChevronRight size={14} color="#9CA3AF" className="mx-1" />

      <TouchableOpacity onPress={goToHome} className="flex-row items-center">
        <Text className="text-xs text-gray-500">Categorias</Text>
      </TouchableOpacity>

      <ChevronRight size={14} color="#9CA3AF" className="mx-1" />

      <Text className="text-xs font-medium text-gray-800" numberOfLines={1}>
        {formattedCategoryName}
      </Text>
    </HStack>
  );
}

// Função para formatar o nome da categoria de forma mais amigável
function formatCategoryName(name: string | null): string {
  if (!name) return "Categoria";

  // Lista de palavras que devem permanecer em minúsculo (conjunções, preposições, etc.)
  const lowercaseWords = [
    "e",
    "de",
    "da",
    "do",
    "das",
    "dos",
    "em",
    "por",
    "com",
    "para",
  ];

  // Transforma "alimentacao-e-bebidas" em "Alimentação e Bebidas"
  return name
    .replace(/-/g, " ")
    .split(" ")
    .map((word, index) => {
      // Se for uma das palavras da lista e não for a primeira palavra
      if (lowercaseWords.includes(word.toLowerCase()) && index !== 0) {
        return word.toLowerCase();
      }
      // Caso contrário, capitalize a primeira letra
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
