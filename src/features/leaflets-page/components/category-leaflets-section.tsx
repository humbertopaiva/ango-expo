// Path: src/features/leaflets-page/components/category-leaflets-section.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { FileText, FileUp, ArrowRight } from "lucide-react-native";
import { Leaflet } from "../models/leaflet";
import { LeafletCard } from "./leaflet-card";
import { THEME_COLORS } from "@/src/styles/colors";
import { router } from "expo-router";
import { HStack } from "@gluestack-ui/themed";

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
  const { width } = useWindowDimensions();

  if (leaflets.length === 0) return null;

  // Calcula as dimensões apropriadas para os cards com base na tela
  const getPerfectItemSize = () => {
    // Para telas pequenas, mostramos cards maiores
    if (width < 768) {
      return {
        width: width * 0.7,
        height: width * 0.7 * 1.33, // Proporção 4:3
      };
    }

    // Para telas médias, tamanho intermediário
    if (width < 1024) {
      return {
        width: 240,
        height: 320,
      };
    }

    // Para telas grandes, cards maiores
    return {
      width: 280,
      height: 373,
    };
  };

  const { width: itemWidth, height: itemHeight } = getPerfectItemSize();

  // Verifica quantos PDFs existem na categoria
  const pdfCount = leaflets.filter((leaflet) => leaflet.pdf).length;
  const hasPdfs = pdfCount > 0;

  return (
    <View className="mb-10">
      {/* Cabeçalho da seção */}
      <View className="flex-row justify-between items-center mb-4 px-4">
        <HStack space="sm" alignItems="center">
          <FileText size={20} color={THEME_COLORS.secondary} />
          <Text className="text-xl font-semibold text-gray-800">
            {categoryName}
          </Text>
        </HStack>
      </View>

      {/* Lista horizontal de encartes */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
        className="pb-4"
      >
        {leaflets.map((leaflet) => (
          <View
            key={leaflet.id}
            style={{
              width: itemWidth,
              height: itemHeight,
              marginRight: 16,
            }}
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
