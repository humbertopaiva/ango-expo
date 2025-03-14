// Path: src/features/leaflets-page/components/category-leaflets-section.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { FileText, ArrowRight } from "lucide-react-native";
import { Leaflet } from "../models/leaflet";
import { LeafletCard } from "./leaflet-card";
import { THEME_COLORS } from "@/src/styles/colors";
import { router } from "expo-router";

interface CategoryLeafletsSectionProps {
  categoryName: string;
  categorySlug: string;
  leaflets: Leaflet[];
  onLeafletPress: (leaflet: Leaflet) => void;
}

export function CategoryLeafletsSection({
  categoryName,
  categorySlug,
  leaflets,
  onLeafletPress,
}: CategoryLeafletsSectionProps) {
  if (leaflets.length === 0) return null;

  // Calcula as dimensões apropriadas para os cards
  const itemWidth = 280;
  const itemHeight = itemWidth * (4 / 3);

  return (
    <View className="mb-10">
      <View className="flex-row justify-between items-center mb-4 px-4">
        <View className="flex-row items-center">
          <FileText size={20} color={THEME_COLORS.secondary} />
          <Text className="text-xl font-semibold ml-2 text-gray-800">
            {categoryName}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push(`/categoria/${categorySlug}`)}
          className="flex-row items-center"
        >
          <Text className="text-secondary-600 text-sm font-medium mr-1">
            Ver todos
          </Text>
          <ArrowRight size={16} color={THEME_COLORS.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
      >
        {leaflets.map((leaflet) => (
          <View
            key={leaflet.id}
            style={{ width: itemWidth, height: itemHeight, marginRight: 16 }}
          >
            <LeafletCard
              leaflet={leaflet}
              onPress={() => onLeafletPress(leaflet)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
