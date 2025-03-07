// Path: src/features/category-page/components/category-header.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Grid } from "lucide-react-native";
import { router } from "expo-router";
import { HStack, VStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";
import { ImagePreview } from "@/components/custom/image-preview";

interface CategoryHeaderProps {
  categoryName: string | null;
  categoryImage: string | null;
  isLoading: boolean;
}

export function CategoryHeader({
  categoryName,
  categoryImage,
  isLoading,
}: CategoryHeaderProps) {
  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.container} className="bg-gray-100">
        <SafeAreaView edges={["top"]}>
          <View className="px-4 pt-4 pb-6">
            <View className="h-6 w-32 bg-gray-200 animate-pulse rounded-md" />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container} className="bg-primary-500">
      <SafeAreaView edges={["top"]}>
        <View className="px-4 pt-2 pb-6">
          {/* Header com botão de voltar */}
          <HStack className="items-center mb-3" space="md">
            <Pressable
              onPress={handleGoBack}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  width: 36,
                  height: 36,
                  borderRadius: 9999,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <ArrowLeft size={20} color="white" />
            </Pressable>

            <Text className="text-white text-xl font-semibold flex-1 text-center mr-9">
              Categoria
            </Text>
          </HStack>

          {/* Conteúdo principal */}
          <HStack className="items-center" space="lg">
            {/* Ícone da categoria */}
            <View className="w-16 h-16 rounded-xl bg-white/20 items-center justify-center overflow-hidden">
              {categoryImage ? (
                <ImagePreview
                  uri={categoryImage}
                  width="60%"
                  height="60%"
                  resizeMode="contain"
                  containerClassName="items-center justify-center"
                />
              ) : (
                <Grid size={32} color="white" />
              )}
            </View>

            {/* Informações da categoria */}
            <VStack className="flex-1" space="xs">
              <Text className="text-white text-2xl font-bold">
                {formatCategoryName(categoryName)}
              </Text>
              <Text className="text-white/80 text-sm">
                Encontre os melhores estabelecimentos
              </Text>
            </VStack>
          </HStack>
        </View>
      </SafeAreaView>

      {/* Elemento decorativo na parte inferior */}
      <View className="absolute -bottom-5 left-0 right-0">
        <View className="h-6 bg-white rounded-t-3xl" />
      </View>
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
    position: "relative",
    paddingBottom: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
    }),
  },
});
