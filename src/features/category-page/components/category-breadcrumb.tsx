// Path: src/features/category-page/components/category-breadcrumb.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { HStack } from "@gluestack-ui/themed";
import { ChevronRight, Home, Grid } from "lucide-react-native";
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
    <View style={styles.container}>
      <HStack space="sm" style={styles.breadcrumbContent}>
        <TouchableOpacity
          onPress={goToHome}
          style={styles.breadcrumbItem}
          activeOpacity={0.7}
        >
          <Home size={14} color={THEME_COLORS.primary} />
          <Text style={styles.breadcrumbItemHome}>Início</Text>
        </TouchableOpacity>

        <ChevronRight size={14} color="#9CA3AF" />

        <TouchableOpacity
          onPress={goToHome}
          style={styles.breadcrumbItem}
          activeOpacity={0.7}
        >
          <Grid size={14} color="#6B7280" />
          <Text style={styles.breadcrumbItemText}>Categorias</Text>
        </TouchableOpacity>

        <ChevronRight size={14} color="#9CA3AF" />

        <Text style={styles.currentItem} numberOfLines={1}>
          {formattedCategoryName}
        </Text>
      </HStack>
    </View>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      },
    }),
  },
  breadcrumbContent: {
    alignItems: "center",
    flexWrap: "wrap",
  },
  breadcrumbItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  breadcrumbItemHome: {
    marginLeft: 4,
    fontSize: 13,
    color: THEME_COLORS.primary,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  breadcrumbItemText: {
    marginLeft: 4,
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "PlusJakartaSans_400Regular",
  },
  currentItem: {
    fontSize: 13,
    color: "#111827",
    fontFamily: "PlusJakartaSans_600SemiBold",
    maxWidth: 150,
  },
});
