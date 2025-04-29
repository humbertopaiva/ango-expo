import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { SlidersHorizontal } from "lucide-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { HStack } from "@gluestack-ui/themed";

interface CategoryHeaderProps {
  categoryName: string | null;
  categoryImage: string | null;
  isLoading: boolean;
  onFilterPress?: () => void;
}

const screenWidth = Dimensions.get("window").width;

export function CategoryHeader({
  categoryName,
  categoryImage,
  isLoading,
  onFilterPress,
}: CategoryHeaderProps) {
  const formattedCategoryName = formatCategoryName(categoryName);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME_COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HStack className="justify-between items-center pb-4">
        <Text
          className="text-2xl font-semibold text-primary-500 "
          numberOfLines={1}
        >
          {formattedCategoryName}
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (onFilterPress) {
              onFilterPress();
            }
          }}
          className="p-2 rounded-full"
        >
          <SlidersHorizontal size={24} color={THEME_COLORS.primary} />
        </TouchableOpacity>
      </HStack>
      {categoryImage ? (
        <Image
          source={{ uri: categoryImage }}
          style={[styles.categoryImage]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.categoryImage, { backgroundColor: "#F5F5F5" }]} />
      )}
    </View>
  );
}

function formatCategoryName(name: string | null): string {
  if (!name) return "Categoria";
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

  return name
    .replace(/-/g, " ")
    .split(" ")
    .map((word, index) =>
      lowercaseWords.includes(word.toLowerCase()) && index !== 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: 160,
    position: "relative",
    padding: 16,
    marginBottom: 48,
  },
  loadingContainer: {
    width: screenWidth,
    height: 160,
    backgroundColor: "#F3F3F3",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryImage: {
    width: "100%",
    height: "100%",

    borderRadius: 8,
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});
