// Path: src/features/commerce/components/leaflet-carousel.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { FileText, ChevronRight } from "lucide-react-native";
import { Card } from "@gluestack-ui/themed";
import { ImagePreview } from "@/components/custom/image-preview";
import { Leaflet } from "../models/leaflet";
import { router } from "expo-router";

interface LeafletCarouselProps {
  leaflets: Leaflet[];
  isLoading: boolean;
}

export function LeafletCarousel({ leaflets, isLoading }: LeafletCarouselProps) {
  if (isLoading) {
    return (
      <View>
        <View className="mb-6">
          <View className="inline-flex items-center gap-2 bg-secondary-100 mb-4 px-4 py-2 rounded-full">
            <FileText className="h-4 w-4 text-secondary-600" />
            <Text className="text-sm font-medium text-secondary-600">
              Encartes Promocionais
            </Text>
          </View>

          <Text className="text-2xl font-bold mb-2 text-secondary-600">
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
              <View key={i} className="w-72 aspect-[3/4] shrink-0">
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
      <View className="mb-6">
        <View className="inline-flex items-center gap-2 bg-secondary-100 mb-4 px-4 py-2 rounded-full">
          <FileText className="h-4 w-4 text-secondary-600" />
          <Text className="text-sm font-medium text-secondary-600">
            Encartes Promocionais
          </Text>
        </View>

        <Text className="text-2xl font-bold mb-2 text-secondary-600">
          Ofertas Imperdíveis
        </Text>

        <Text className="text-gray-600 mb-6">
          Confira os melhores preços e promoções dos estabelecimentos da sua
          região
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-4 py-2 pb-4">
          {leaflets.map((leaflet) => (
            <TouchableOpacity
              key={leaflet.id}
              className="w-72 shrink-0"
              onPress={() =>
                router.push(`/(drawer)/empresa/${leaflet.empresa}`)
              }
            >
              <Card className="w-full h-full overflow-hidden border border-gray-200 shadow-sm rounded-xl">
                <View className="aspect-[3/4] relative">
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
        className="self-center mt-6 bg-secondary-500 px-4 py-2 rounded-full flex-row items-center"
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
