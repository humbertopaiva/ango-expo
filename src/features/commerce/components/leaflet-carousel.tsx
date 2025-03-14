// Path: src/features/commerce/components/leaflet-carousel.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { FileText, ChevronRight } from "lucide-react-native";
import { Card, HStack } from "@gluestack-ui/themed";
import { ImagePreview } from "@/components/custom/image-preview";
import { Leaflet } from "../models/leaflet";
import { router } from "expo-router";
import { THEME_COLORS } from "@/src/styles/colors";

interface LeafletCarouselProps {
  leaflets: Leaflet[];
  isLoading: boolean;
}

export function LeafletCarousel({ leaflets, isLoading }: LeafletCarouselProps) {
  // Estado para armazenar a largura da tela
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );

  // Atualizar largura da tela quando houver mudanças (importante para web)
  useEffect(() => {
    const handleDimensionsChange = ({ window }: any) => {
      setScreenWidth(window.width);
    };

    const subscription = Dimensions.addEventListener(
      "change",
      handleDimensionsChange
    );

    return () => subscription.remove();
  }, []);

  // Calcular a largura do item baseado na tela
  const calculateItemWidth = () => {
    // Em telas menores, usamos uma proporção maior da tela
    if (screenWidth < 768) {
      return screenWidth * 0.75; // 75% da largura da tela em dispositivos móveis
    }
    // Em telas médias
    else if (screenWidth < 1024) {
      return 280; // Tamanho fixo
    }
    // Em telas grandes
    else {
      return 320; // Tamanho fixo maior
    }
  };

  const itemWidth = calculateItemWidth();

  // Determinar altura baseada numa proporção fixa (3:4)
  const itemHeight = itemWidth * (4 / 3);

  if (isLoading) {
    return (
      <View>
        <View className="mb-6">
          <View className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full">
            <HStack className="bg-secondary-100">
              <FileText size={20} color={THEME_COLORS.secondary} />
              <Text className="text-sm font-medium text-secondary-600">
                Encartes Promocionais
              </Text>
            </HStack>
          </View>

          <Text className="text-3xl font-semibold mb-2 text-secondary-600">
            Ofertas Imperdíveis
          </Text>

          <Text className="text-gray-600 mb-6">
            Confira os melhores preços e promoções dos estabelecimentos da sua
            região
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-4 py-2">
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                style={{
                  width: itemWidth,
                  height: itemHeight,
                  marginRight: 16,
                }}
              >
                <Card className="w-full h-full animate-pulse bg-gray-200" />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  if (leaflets.length === 0) {
    return (
      <View className="items-center justify-center p-8">
        <Text className="text-gray-500 text-center">
          Nenhum encarte disponível no momento
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View className="mb-6 px-4">
        <View className="inline-flex items-center mb-2">
          <HStack className="bg-secondary-100 gap-2 mb-4 px-4 py-2 rounded-full">
            <FileText size={20} color={THEME_COLORS.secondary} />
            <Text className="text-sm font-medium text-secondary-600">
              Encartes Promocionais
            </Text>
          </HStack>
        </View>

        <Text className="text-3xl font-semibold mb-2 text-secondary-600 text-center">
          Ofertas Imperdíveis
        </Text>

        <Text className="text-gray-600 font-sans text-center">
          Confira os melhores preços e promoções dos estabelecimentos da sua
          região
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View className="flex-row py-2 pb-4">
          {leaflets.map((leaflet, index) => (
            <TouchableOpacity
              key={leaflet.id}
              style={{
                width: itemWidth,
                marginRight: index < leaflets.length - 1 ? 16 : 0,
              }}
              onPress={() => router.push(`/empresa/${leaflet.empresa}`)}
            >
              <Card className="w-full overflow-hidden border border-gray-200 shadow-sm rounded-xl">
                <View
                  style={{
                    width: itemWidth,
                    height: itemHeight,
                  }}
                  className="relative"
                >
                  {leaflet.imagem_01 ? (
                    <ImagePreview
                      uri={leaflet.imagem_01}
                      width="100%"
                      height="100%"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full items-center justify-center bg-gray-100">
                      <FileText size={48} color="#6B7280" />
                    </View>
                  )}

                  <View className="absolute top-3 right-3 bg-secondary-500 rounded-full px-3 py-1">
                    <Text className="text-white text-xs font-medium">
                      Até {new Date(leaflet.validade).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <View className="p-4">
                  <Text className="font-medium text-lg mb-1">
                    {leaflet.nome}
                  </Text>
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-sm text-gray-500">
                      Válido até{" "}
                      {new Date(leaflet.validade).toLocaleDateString()}
                    </Text>
                    <ChevronRight size={16} color="#6B7280" />
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        className="self-center mt-6 bg-secondary-500 px-6 py-4 rounded-full flex-row items-center font-bold"
        onPress={() => router.push("/(drawer)/(tabs)/encartes")}
      >
        <Text className="text-white font-medium mr-2">
          Ver todos os encartes
        </Text>
        <ChevronRight size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
}
