// Path: src/features/delivery/components/delivery-company-showcase-card.tsx
import React, { useRef } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Store,
} from "lucide-react-native";

import { router } from "expo-router";
import { DeliveryProfile } from "../models/delivery-profile";
import { DeliveryShowcaseItem } from "../models/delivery-showcase-item";

import { ImagePreview } from "@/components/custom/image-preview";
import { THEME_COLORS } from "@/src/styles/colors";
import { Box } from "@/components/ui/box";
import { checkIfOpen } from "../hooks/use-delivery-page";
import { DeliveryProductCard } from "./delivery-product-card";

interface DeliveryCompanyShowcaseCardProps {
  company: DeliveryProfile;
  showcaseItems: DeliveryShowcaseItem[];
}

export function DeliveryCompanyShowcaseCard({
  company,
  showcaseItems,
}: DeliveryCompanyShowcaseCardProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const isOpen = React.useMemo(() => checkIfOpen(company), [company]);

  const handleNavigateToCompany = () => {
    if (!company.empresa || !company.empresa.slug) return;
    router.push(`/(drawer)/empresa/${company.empresa.slug}`);
  };

  const handleScrollLeft = () => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  const handleScrollRight = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  // Determinar se devemos usar texto branco ou escuro com base na cor primária da empresa
  const getTextColor = () => {
    const primaryColor = company?.cor_primaria || THEME_COLORS.primary;
    if (!primaryColor) return false;

    try {
      const hex = primaryColor.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.6;
    } catch (error) {
      return false;
    }
  };

  const isDarkBackground = !getTextColor();
  const textColorClass = isDarkBackground ? "text-white" : "text-gray-800";
  const backgroundColor = company?.cor_primaria || THEME_COLORS.primary;

  console.log("LOOOGA", company);

  return (
    <View
      className="md:mb-8 md:rounded-xl overflow-hidden shadow-md elevation-2 py-6"
      style={{ backgroundColor }}
    >
      {/* Header */}
      <View className="p-4 rounded-t-xl flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="h-14 w-14 rounded-xl bg-white/20 items-center justify-center overflow-hidden">
            {company.logo ? (
              <ImagePreview
                uri={company.logo}
                width="100%"
                height="100%"
                resizeMode="cover"
              />
            ) : (
              <Store
                size={24}
                color={isDarkBackground ? "#ffffff" : "#374151"}
              />
            )}
          </View>

          <View className="flex-1">
            <Text className={`font-semibold text-base ${textColorClass}`}>
              {company.nome}
            </Text>

            <View className="flex-row flex-wrap mt-1 gap-1">
              {company.empresa?.subcategorias?.slice(0, 2).map((sub) => (
                <View
                  key={`subcategory-${sub.subcategorias_empresas_id.id}`}
                  className="mr-1"
                >
                  <View className="px-2 py-0.5 bg-white/20 rounded-full">
                    <Text className={`text-xs ${textColorClass} opacity-90`}>
                      {sub.subcategorias_empresas_id.nome}
                    </Text>
                  </View>
                </View>
              ))}

              {company.empresa?.subcategorias?.length > 2 && (
                <Text className={`text-xs ${textColorClass} opacity-80`}>
                  +{company.empresa.subcategorias.length - 2} mais
                </Text>
              )}
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleNavigateToCompany}
          className={`flex-row items-center py-1 px-3 rounded-full ${
            isDarkBackground ? "bg-white/20" : "bg-black/10"
          }`}
        >
          <Text className={`mr-1 text-sm ${textColorClass}`}>
            {isOpen ? "Aberto agora" : "Ver empresa"}
          </Text>
          <ArrowRight
            size={14}
            color={isDarkBackground ? "#ffffff" : "#374151"}
          />
        </TouchableOpacity>
      </View>

      {/* Carousel de produtos */}
      <View className="relative">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
        >
          {showcaseItems.map((item, index) => (
            <DeliveryProductCard
              key={`product-${company.id}-${item.id}-${index}`}
              product={item}
              onPress={handleNavigateToCompany}
              isDarkBackground={isDarkBackground}
            />
          ))}

          {/* Cartão "Ver Mais" */}
          <TouchableOpacity
            key={`view-more-${company.id}`}
            onPress={handleNavigateToCompany}
            className="w-48 flex-shrink-0"
          >
            <Box className="h-96 rounded-xl p-4 items-center justify-center">
              <View className="items-center justify-center gap-4">
                <View className="w-14 h-14 rounded-full items-center justify-center bg-white/20">
                  <ArrowRight
                    size={24}
                    color={isDarkBackground ? "#ffffff" : "#374151"}
                  />
                </View>

                <Text
                  className="text-center font-medium"
                  style={{
                    color: isDarkBackground ? "#ffffff" : "#374151",
                  }}
                >
                  Ver cardápio completo
                </Text>

                <Text
                  className="text-center text-sm mt-4"
                  style={{
                    color: isDarkBackground ? "#ffffff" : "#374151",
                  }}
                >
                  Acesse todos os produtos do estabelecimento
                </Text>
              </View>
            </Box>
          </TouchableOpacity>
        </ScrollView>

        {/* Botões de navegação */}
        <View className="absolute top-1/2 left-0 right-0 flex-row justify-between px-2 -translate-y-6 pointer-events-none">
          <TouchableOpacity
            onPress={handleScrollLeft}
            className="w-10 h-10 rounded-full bg-white shadow-md items-center justify-center pointer-events-auto"
          >
            <ChevronLeft size={20} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleScrollRight}
            className="w-10 h-10 rounded-full bg-white shadow-md items-center justify-center pointer-events-auto"
          >
            <ChevronRight size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
