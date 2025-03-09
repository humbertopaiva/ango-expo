// Path: src/features/category-page/components/enhanced-category-header.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, SlidersHorizontal } from "lucide-react-native";
import { router } from "expo-router";
import { HStack } from "@gluestack-ui/themed";

interface CategoryHeaderProps {
  categoryName: string | null;
  categoryImage: string | null;
  isLoading: boolean;
  onFilterPress?: () => void;
}

export function CategoryHeader({
  categoryName,
  categoryImage,
  isLoading,
  onFilterPress,
}: CategoryHeaderProps) {
  const handleGoBack = () => {
    router.back();
  };

  // Formata o nome da categoria para exibição
  const formattedCategoryName = formatCategoryName(categoryName);

  if (isLoading) {
    return (
      <View style={styles.container} className="bg-primary-500">
        <SafeAreaView edges={["top"]}>
          <View className="h-6 w-32 bg-gray-200 animate-pulse rounded-md" />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container} className="bg-primary-500">
      <SafeAreaView edges={["top"]}>
        <HStack className="px-4 py-3 items-center justify-between">
          <HStack>
            <TouchableOpacity
              onPress={handleGoBack}
              className="p-1 rounded-fullmr-2"
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            {/* Parte esquerda: Logo da App */}
            <Image
              source={require("@/assets/images/logo-white.png")}
              style={{ height: 28, width: 90 }}
              resizeMode="contain"
            />
          </HStack>

          {/* Parte direita: Título "Categorias" */}
          <Text className="text-white font-medium">Categorias</Text>
        </HStack>

        {/* Barra de navegação secundária com nome da categoria */}
        <HStack className="px-4 py-3 bg-secondary-500 items-center justify-between">
          <HStack space="md" className="items-center flex-1">
            <HStack space="sm" className="items-center flex-1 ">
              <Text
                className="text-white font-semibold text-xl"
                numberOfLines={1}
              >
                {formattedCategoryName}
              </Text>
            </HStack>
          </HStack>

          {/* Botão de filtro */}
          {onFilterPress && (
            <TouchableOpacity
              onPress={onFilterPress}
              className="p-2 bg-white/20 rounded-full"
            >
              <SlidersHorizontal size={20} color="white" />
            </TouchableOpacity>
          )}
        </HStack>
      </SafeAreaView>
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      },
    }),
  },
});
