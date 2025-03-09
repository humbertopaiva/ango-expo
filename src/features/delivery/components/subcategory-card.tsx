// Path: src/features/delivery/components/subcategory-card.tsx
import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { Pizza, Store } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { ImagePreview } from "@/components/custom/image-preview";
import { LinearGradient } from "expo-linear-gradient";

interface SubcategoryCardProps {
  name: string;
  slug: string;
  imageUrl: string | null;
  isSelected: boolean;
  onPress: () => void;
  totalCompanies?: number;
}

export function SubcategoryCard({
  name,
  slug,
  imageUrl,
  isSelected,
  onPress,
  totalCompanies,
}: SubcategoryCardProps) {
  // Função para obter um ícone de fallback baseado no slug
  const getFallbackIcon = () => {
    switch (slug.toLowerCase()) {
      case "pizzarias":
        return <Pizza size={22} color="#FFF" />;
      default:
        return <Store size={22} color="#FFF" />;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="w-full aspect-square mb-4"
    >
      <View
        className={`w-full h-full rounded-xl overflow-hidden shadow-sm ${
          isSelected ? "border-2 border-primary-500" : "border border-gray-200"
        }`}
      >
        {/* Imagem de fundo ou fallback */}
        {imageUrl ? (
          <ImageBackground
            source={{ uri: imageUrl }}
            className="w-full h-full object-cover"
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
              className="w-full h-full justify-end p-3"
            >
              <Text
                className="text-white font-semibold text-center text-base"
                numberOfLines={2}
              >
                {name}
              </Text>
              {totalCompanies !== undefined && (
                <Text className="text-white/80 text-xs text-center mt-1">
                  {totalCompanies}{" "}
                  {totalCompanies === 1
                    ? "estabelecimento"
                    : "estabelecimentos"}
                </Text>
              )}

              {/* Indicador de seleção */}
              {isSelected && (
                <View className="absolute top-2 right-2 bg-primary-500 rounded-full w-6 h-6 items-center justify-center">
                  <View className="w-3 h-3 bg-white rounded-full" />
                </View>
              )}
            </LinearGradient>
          </ImageBackground>
        ) : (
          <View
            className="w-full h-full items-center justify-center"
            style={{ backgroundColor: THEME_COLORS.primary }}
          >
            <LinearGradient
              colors={[`${THEME_COLORS.primary}`, "rgba(244,81,30,0.7)"]}
              className="w-full h-full items-center justify-center p-3"
            >
              <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mb-3">
                {getFallbackIcon()}
              </View>

              <Text
                className="text-white font-semibold text-center text-base"
                numberOfLines={2}
              >
                {name}
              </Text>

              {totalCompanies !== undefined && (
                <Text className="text-white/80 text-xs text-center mt-1">
                  {totalCompanies}{" "}
                  {totalCompanies === 1
                    ? "estabelecimento"
                    : "estabelecimentos"}
                </Text>
              )}

              {/* Indicador de seleção */}
              {isSelected && (
                <View className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 items-center justify-center">
                  <View className="w-3 h-3 bg-primary-500 rounded-full" />
                </View>
              )}
            </LinearGradient>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
