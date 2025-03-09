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
import { ArrowLeft, Filter } from "lucide-react-native";
import { router } from "expo-router";
import { HStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";
import { ImagePreview } from "@/components/custom/image-preview";

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
      <View style={styles.container} className="bg-white">
        <SafeAreaView edges={["top"]}>
          <View className="h-6 w-32 bg-gray-200 animate-pulse rounded-md" />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container} className="bg-white">
      <SafeAreaView edges={["top"]}>
        <HStack className="px-4 py-3 items-center justify-between">
          {/* Parte esquerda: Logo da App */}
          <Image
            source={require("@/assets/images/logo-white.png")}
            style={{ height: 28, width: 90 }}
            resizeMode="contain"
            className="opacity-80"
          />

          {/* Parte direita: Título "Categorias" */}
          <Text className="text-primary-600 font-medium">Categorias</Text>
        </HStack>

        {/* Barra de navegação secundária com nome da categoria */}
        <HStack className="px-4 py-2 bg-primary-50 items-center justify-between">
          <HStack space="md" className="items-center flex-1">
            <TouchableOpacity
              onPress={handleGoBack}
              className="p-1 rounded-full"
            >
              <ArrowLeft size={18} color={THEME_COLORS.primary} />
            </TouchableOpacity>

            <HStack space="sm" className="items-center flex-1">
              {categoryImage ? (
                <View className="w-6 h-6 rounded-full overflow-hidden bg-white">
                  <ImagePreview
                    uri={categoryImage}
                    width="100%"
                    height="100%"
                    resizeMode="cover"
                  />
                </View>
              ) : null}

              <Text className="text-primary-700 font-medium" numberOfLines={1}>
                {formattedCategoryName}
              </Text>
            </HStack>
          </HStack>

          {onFilterPress && (
            <TouchableOpacity
              onPress={onFilterPress}
              className="p-1 bg-white rounded-full"
            >
              <Filter size={16} color={THEME_COLORS.primary} />
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

  // Transforma "alimentacao-e-bebidas" em "Alimentação e Bebidas"
  return name
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
