// Path: src/features/category-page/components/enhanced-category-header.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, SlidersHorizontal } from "lucide-react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { getContrastText } from "@/src/utils/color.utils";
import { THEME_COLORS } from "@/src/styles/colors";
import { animationUtils } from "@/src/utils/animations.utils";
import { HStack } from "@gluestack-ui/themed";
import { Image } from "@/components/ui/image";

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
  const [imageLoaded, setImageLoaded] = useState(false);

  // Animações
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const titleScaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const titleTranslateY = React.useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!isLoading) {
      // Animar entrada dos elementos
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleScaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading, imageLoaded]);

  const handleGoBack = () => {
    router.back();
  };

  // Formata o nome da categoria para exibição
  const formattedCategoryName = formatCategoryName(categoryName);

  // Placeholder para o estado de carregamento
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <SafeAreaView edges={["top"]}>
          <View
            style={styles.gradientPlaceholder}
            className="bg-gray-200 animate-pulse"
          />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ImageBackground
        source={
          categoryImage
            ? { uri: categoryImage }
            : require("@/assets/images/category-placeholder.svg")
        }
        style={styles.imageBackground}
        imageStyle={{ resizeMode: "cover", alignSelf: "flex-start" }}
        onLoad={() => setImageLoaded(true)}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.1)"]}
          style={styles.gradient}
        >
          <SafeAreaView edges={["top"]} style={styles.safeArea}>
            {/* Botões de Ação */}
            <View style={styles.actionsContainer}>
              <HStack className="items-center justify-between flex-1 w-full">
                <HStack className="items-center gap-4">
                  <TouchableOpacity
                    onPress={handleGoBack}
                    style={styles.backButton}
                  >
                    <ArrowLeft size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Image
                    source={require("@/assets/images/logo-white.png")}
                    style={{ width: 80, height: 28 }}
                    resizeMode="contain"
                    className="w-16"
                  />
                </HStack>
                {onFilterPress && (
                  <TouchableOpacity
                    onPress={onFilterPress}
                    style={styles.filterButton}
                  >
                    <SlidersHorizontal size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </HStack>
            </View>

            {/* Título da Categoria */}
            <Animated.View
              style={[
                styles.titleContainer,
                {
                  transform: [
                    { scale: titleScaleAnim },
                    { translateY: titleTranslateY },
                  ],
                },
              ]}
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
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      },
    }),
  },
  loadingContainer: {
    width: "100%",
    height: 160,
    backgroundColor: "#f0f0f0",
  },
  gradientPlaceholder: {
    width: "100%",
    height: 160,
  },
  imageBackground: {
    width: "100%",
    height: 160,

    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    width: "100%",
    height: "100%",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  categoryTitle: {
    fontSize: 32,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
