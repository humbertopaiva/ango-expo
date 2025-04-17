// Path: src/features/category-page/components/category-header.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, SlidersHorizontal } from "lucide-react-native";
import { router } from "expo-router";
import { THEME_COLORS } from "@/src/styles/colors";
import { LinearGradient } from "expo-linear-gradient";
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
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;
  const [imageLoaded, setImageLoaded] = useState(false);

  // Formata o nome da categoria para exibição
  const formattedCategoryName = formatCategoryName(categoryName);

  useEffect(() => {
    if (!isLoading && (imageLoaded || !categoryImage)) {
      // Animar entrada dos elementos
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading, imageLoaded, categoryImage, fadeAnim, translateY]);

  const handleGoBack = () => {
    router.back();
  };

  // Placeholder para o estado de carregamento
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBar} className="bg-gray-200 animate-pulse" />
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <ImageBackground
        source={
          categoryImage
            ? { uri: categoryImage }
            : require("@/assets/images/category-placeholder.svg")
        }
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
        onLoad={() => setImageLoaded(true)}
      >
        <LinearGradient
          colors={[`${THEME_COLORS.primary}CC`, `${THEME_COLORS.primary}99`]}
          style={styles.gradient}
        >
          <SafeAreaView edges={["top"]} style={styles.safeArea}>
            {/* Barra de navegação */}
            <HStack className="justify-between items-center px-4 py-3">
              <TouchableOpacity
                onPress={handleGoBack}
                style={styles.iconButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ArrowLeft size={22} color="white" />
              </TouchableOpacity>

              {/* Botão de filtro à direita */}
              {onFilterPress && (
                <TouchableOpacity
                  onPress={onFilterPress}
                  style={styles.iconButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <SlidersHorizontal size={20} color="white" />
                </TouchableOpacity>
              )}
            </HStack>

            {/* Título da categoria - centralizado e proeminente */}
            <Animated.View
              style={[styles.titleContainer, { transform: [{ translateY }] }]}
            >
              <Text style={styles.categoryTitle} numberOfLines={2}>
                {formattedCategoryName}
              </Text>
            </Animated.View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </Animated.View>
  );
}

// Função para formatar o nome da categoria de forma mais amigável
function formatCategoryName(name: string | null): string {
  if (!name) return "Categoria";

  // Lista de palavras que devem permanecer em minúsculo
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
    width: "100%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      },
    }),
  },
  imageBackground: {
    width: "100%",
    height: 160, // Altura ajustável conforme necessário
  },
  imageStyle: {
    resizeMode: "cover",
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
  safeArea: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    width: "100%",
    height: 160,
    justifyContent: "center",
    backgroundColor: THEME_COLORS.primary,
  },
  loadingBar: {
    height: 30,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  categoryTitle: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
