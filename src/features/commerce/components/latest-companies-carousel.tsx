// Path: src/features/commerce/components/latest-companies-carousel.tsx
// DELETAR
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
import { Store } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { ShowcaseCompany } from "../models/showcase-company";
import { router } from "expo-router";
import { HStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";

interface LatestCompaniesCarouselProps {
  companies: ShowcaseCompany[];
  isLoading: boolean;
}

export function LatestCompaniesCarousel({
  companies,
  isLoading,
}: LatestCompaniesCarouselProps) {
  // Tamanho dos círculos de logo
  const logoSize = 100;

  // Renderizar estado de carregamento
  if (isLoading) {
    return (
      <View className="mb-6">
        <Text className="text-xl font-semibold mb-4 text-gray-800">
          Empresas com novidades
        </Text>
        <View className="flex-row">
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={{ width: logoSize, height: logoSize }}
              className="rounded-full bg-gray-200 animate-pulse mx-2"
            />
          ))}
        </View>
      </View>
    );
  }

  // Se não houver empresas, não renderiza o componente
  if (companies.length === 0) {
    return null;
  }

  return (
    <View className="mb-6">
      <HStack className="items-center justify-center mb-10">
        <Text className="text-xl font-sans text-gray-500">
          Empresas atualizadas recentemente
        </Text>
      </HStack>

      <FlatList
        data={companies}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="items-center mr-4"
            onPress={() => router.push(`/(drawer)/empresa/${item.slug}`)}
          >
            <View
              style={{
                width: logoSize,
                height: logoSize,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 3,
              }}
              className="rounded-full  overflow-hidden bg-white  mb-2"
            >
              {item.logo ? (
                <ImagePreview
                  uri={item.logo}
                  width="100%"
                  height="100%"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center bg-gray-50">
                  <Store size={32} color={THEME_COLORS.primary} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
