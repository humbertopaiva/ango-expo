// Path: src/features/delivery/components/subcategory-filters.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import {
  Grid,
  Check,
  UtensilsCrossed,
  Store,
  Pizza,
  Coffee,
  IceCream,
} from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { Subcategory } from "../models/subcategory";
import { THEME_COLORS } from "@/src/styles/colors";

interface SubcategoryFiltersProps {
  subcategories: Subcategory[];
  selectedSubcategories: string[];
  onSelectSubcategory: (slug: string | null) => void;
}

export function SubcategoryFilters({
  subcategories,
  selectedSubcategories,
  onSelectSubcategory,
}: SubcategoryFiltersProps) {
  const isWeb = Platform.OS === "web";
  const { width } = Dimensions.get("window");
  const useGridLayout = isWeb || width >= 768;

  // Mapeamento de ícones com base no slug
  const getCategoryIcon = (slug: string) => {
    const iconProps = {
      size: 24,
      color: selectedSubcategories.includes(slug) ? "white" : "#6B7280",
    };

    switch (slug.toLowerCase()) {
      case "hamburguerias":
        return <Store {...iconProps} />;
      case "pizzarias":
        return <Pizza {...iconProps} />;
      case "acai-e-sorveteria":
        return <IceCream {...iconProps} />;
      case "cachorro-quente":
        return <UtensilsCrossed {...iconProps} />;
      case "sushis":
        return <UtensilsCrossed {...iconProps} />;
      case "porcoes":
        return <Coffee {...iconProps} />;
      default:
        return <Store {...iconProps} />;
    }
  };

  // Se temos muitas categorias e espaço suficiente, usamos grid
  if (useGridLayout && subcategories.length > 6) {
    return (
      <View className="py-4">
        <ScrollView>
          <View className="flex-row flex-wrap justify-center">
            {/* Opção "Todos" */}
            <TouchableOpacity
              onPress={() => onSelectSubcategory(null)}
              activeOpacity={0.7}
              className={`w-1/3 md:w-1/4 lg:w-1/6 items-center mb-4 px-2`}
            >
              <View
                className={`w-16 h-16 rounded-full items-center justify-center shadow-sm ${
                  selectedSubcategories.length === 0
                    ? "bg-primary-500"
                    : "bg-white border border-gray-200"
                }`}
              >
                <Grid
                  size={24}
                  color={
                    selectedSubcategories.length === 0 ? "white" : "#6B7280"
                  }
                />
              </View>
              <Text
                className={`text-xs font-medium text-center mt-2 ${
                  selectedSubcategories.length === 0
                    ? "text-primary-600"
                    : "text-gray-700"
                }`}
              >
                Todos
              </Text>
            </TouchableOpacity>

            {/* Categorias */}
            {subcategories.map((subcategory) => (
              <TouchableOpacity
                key={subcategory.id || subcategory.slug}
                onPress={() => onSelectSubcategory(subcategory.slug)}
                activeOpacity={0.7}
                className={`w-1/3 md:w-1/4 lg:w-1/6 items-center mb-4 px-2`}
              >
                <View
                  className={`w-16 h-16 rounded-full items-center justify-center shadow-sm ${
                    selectedSubcategories.includes(subcategory.slug)
                      ? "bg-primary-500"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  {subcategory.imagem ? (
                    <ImagePreview
                      uri={subcategory.imagem}
                      width={48}
                      height={48}
                      resizeMode="cover"
                      containerClassName="rounded-full"
                    />
                  ) : (
                    getCategoryIcon(subcategory.slug)
                  )}
                </View>
                <Text
                  className={`text-xs font-medium text-center mt-2 ${
                    selectedSubcategories.includes(subcategory.slug)
                      ? "text-primary-600"
                      : "text-gray-700"
                  }`}
                  numberOfLines={2}
                >
                  {subcategory.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Versão com scroll horizontal para mobile ou poucas categorias
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      <View className="flex-row items-center gap-3 py-2">
        {/* Opção "Todos" */}
        <TouchableOpacity
          onPress={() => onSelectSubcategory(null)}
          activeOpacity={0.7}
          className={`items-center ${
            selectedSubcategories.length === 0 ? "opacity-100" : "opacity-70"
          }`}
        >
          <View
            className={`w-16 h-16 rounded-full items-center justify-center mb-2 shadow-sm ${
              selectedSubcategories.length === 0
                ? "bg-primary-500"
                : "bg-white border border-gray-200"
            }`}
          >
            {selectedSubcategories.length === 0 && (
              <View className="absolute top-0 right-0 bg-white rounded-full p-1">
                <Check size={12} color={THEME_COLORS.primary} />
              </View>
            )}
            <Grid
              size={24}
              color={selectedSubcategories.length === 0 ? "white" : "#6B7280"}
            />
          </View>
          <Text
            className={`text-xs font-medium text-center max-w-16 ${
              selectedSubcategories.length === 0
                ? "text-primary-600"
                : "text-gray-700"
            }`}
            numberOfLines={1}
          >
            Todos
          </Text>
        </TouchableOpacity>

        {/* Categorias */}
        {subcategories.map((subcategory) => (
          <TouchableOpacity
            key={subcategory.id || subcategory.slug}
            onPress={() => onSelectSubcategory(subcategory.slug)}
            activeOpacity={0.7}
            className={`items-center ${
              selectedSubcategories.includes(subcategory.slug)
                ? "opacity-100"
                : "opacity-70"
            }`}
          >
            <View
              className={`w-16 h-16 rounded-full items-center justify-center mb-2 shadow-sm overflow-hidden relative ${
                selectedSubcategories.includes(subcategory.slug)
                  ? "border-2 border-primary-500"
                  : "border border-gray-200 bg-white"
              }`}
            >
              {selectedSubcategories.includes(subcategory.slug) && (
                <View className="absolute top-0 right-0 bg-primary-500 rounded-full p-1 z-10">
                  <Check size={12} color="white" />
                </View>
              )}

              {subcategory.imagem ? (
                <ImagePreview
                  uri={subcategory.imagem}
                  width="100%"
                  height="100%"
                  resizeMode="cover"
                  containerClassName="rounded-full"
                />
              ) : (
                <View
                  className={`w-full h-full items-center justify-center ${
                    selectedSubcategories.includes(subcategory.slug)
                      ? "bg-primary-50"
                      : "bg-gray-50"
                  }`}
                >
                  {getCategoryIcon(subcategory.slug)}
                </View>
              )}
            </View>

            <Text
              className={`text-xs font-medium text-center max-w-16 ${
                selectedSubcategories.includes(subcategory.slug)
                  ? "text-primary-600"
                  : "text-gray-700"
              }`}
              numberOfLines={2}
            >
              {subcategory.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
