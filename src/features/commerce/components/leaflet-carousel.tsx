// src/features/commerce/components/leaflet-carousel.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { FileText } from "lucide-react-native";
import { Card } from "@gluestack-ui/themed";
import { ImagePreview } from "@/components/custom/image-preview";
import { Leaflet } from "../models/leaflet";

interface LeafletCarouselProps {
  leaflets: Leaflet[];
  isLoading: boolean;
}

export function LeafletCarousel({ leaflets, isLoading }: LeafletCarouselProps) {
  if (isLoading) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-4 py-2">
          {[1, 2, 3].map((i) => (
            <View key={i} className="w-72 aspect-[3/4] shrink-0">
              <Card className="w-full h-full animate-pulse bg-gray-200" />
            </View>
          ))}
        </View>
      </ScrollView>
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
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-4 py-2 pb-4">
        {leaflets.map((leaflet) => (
          <TouchableOpacity key={leaflet.id} className="w-72 shrink-0">
            <Card className="w-full h-full overflow-hidden">
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
              </View>
              <View className="p-4">
                <Text className="font-medium text-lg mb-1">{leaflet.nome}</Text>
                <Text className="text-sm text-gray-500">
                  Válido até {new Date(leaflet.validade).toLocaleDateString()}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
