// Path: src/features/delivery/components/delivery-categories-horizontal.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Subcategory } from "../models/subcategory";
import { ImagePreview } from "@/components/custom/image-preview";
import { THEME_COLORS } from "@/src/styles/colors";
import { Grid, Store, Pizza, Coffee, IceCream } from "lucide-react-native";
import { getCategoryImage } from "../utils/category-images";

interface DeliveryCategoriesHorizontalProps {
  subcategories: Subcategory[];
  selectedSubcategories: string[];
  onSelectSubcategory: (slug: string | null) => void;
  isLoading: boolean;
}

export function DeliveryCategoriesHorizontal({
  subcategories,
  selectedSubcategories,
  onSelectSubcategory,
  isLoading,
}: DeliveryCategoriesHorizontalProps) {
  // Categoria "Todos" para adicionar no início
  const allCategory: Subcategory = {
    id: "all",
    nome: "Todos",
    slug: "all",
    imagem: undefined,
  };

  // Todos com a categoria "Todos" no início
  const allCategories = [allCategory, ...subcategories];

  // Função para obter ícone baseado no slug da categoria
  const getCategoryIcon = (slug: string) => {
    const iconProps = {
      size: 24,
      color:
        (slug === "all" && selectedSubcategories.length === 0) ||
        selectedSubcategories.includes(slug)
          ? "white"
          : THEME_COLORS.primary,
    };

    switch (slug.toLowerCase()) {
      case "pizzarias":
        return <Pizza {...iconProps} />;
      case "cafeterias":
        return <Coffee {...iconProps} />;
      case "acai-e-sorveteria":
        return <IceCream {...iconProps} />;
      case "all":
        return <Grid {...iconProps} />;
      default:
        return <Store {...iconProps} />;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => `skeleton-${item}`}
          contentContainerStyle={styles.listContainer}
          renderItem={() => (
            <View style={styles.skeletonItem}>
              <View style={styles.skeletonCircle} />
              <View style={styles.skeletonText} />
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text className="text-xl font-semibold text-primary-500 px-4 mb-8">
        Categorias
      </Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={allCategories}
        keyExtractor={(item) => item.id || item.slug}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const isSelected =
            (item.slug === "all" && selectedSubcategories.length === 0) ||
            selectedSubcategories.includes(item.slug);

          return (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                if (item.slug === "all") {
                  onSelectSubcategory(null);
                } else {
                  onSelectSubcategory(item.slug);
                }
              }}
            >
              <View
                style={[
                  styles.imageContainer,
                  isSelected && styles.selectedImageContainer,
                ]}
              >
                {item.imagem ? (
                  <ImagePreview
                    uri={item.imagem}
                    width={70}
                    height={70}
                    resizeMode="cover"
                    containerClassName="rounded-full"
                  />
                ) : item.slug !== "all" && getCategoryImage(item.slug) ? (
                  <ImagePreview
                    uri={getCategoryImage(item.slug)}
                    width={60}
                    height={60}
                    resizeMode="cover"
                    containerClassName="rounded-full"
                  />
                ) : (
                  <View
                    style={[
                      styles.iconContainer,
                      isSelected && styles.selectedIconContainer,
                    ]}
                  >
                    {getCategoryIcon(item.slug)}
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.categoryName,
                  isSelected && styles.selectedCategoryName,
                ]}
                numberOfLines={2}
              >
                {item.nome}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 24,
    paddingHorizontal: 16,
    color: "#1F2937",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  itemContainer: {
    alignItems: "center",
    marginRight: 16,
    width: 80,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#e9eaeb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  selectedImageContainer: {
    borderColor: THEME_COLORS.primary,
    backgroundColor: THEME_COLORS.primary + "10",
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedIconContainer: {
    backgroundColor: THEME_COLORS.primary,
  },
  categoryName: {
    fontSize: 13,
    color: "#4B5563",
    textAlign: "center",
    fontWeight: "500",
  },
  selectedCategoryName: {
    color: THEME_COLORS.primary,
    fontWeight: "600",
  },
  loadingContainer: {
    marginBottom: 24,
  },
  skeletonItem: {
    alignItems: "center",
    marginRight: 16,
    width: 80,
  },
  skeletonCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
  },
  skeletonText: {
    width: 60,
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
});
