// Path: components/showcase/company-showcase-card.tsx
import React, { useRef } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react-native";

import { router } from "expo-router";
import { Card } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";
import { CompanyWithVitrine } from "@/src/features/commerce/hooks/use-vitrine";
import { CompanyHeader } from "./company-header";
import { ProductCard } from "./product-card";
import { Box } from "../ui/box";

interface CompanyVitrineCardProps {
  company: CompanyWithVitrine;
}

export function CompanyVitrineCard({ company }: CompanyVitrineCardProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNavigateToCompany = () => {
    router.push(`/(drawer)/empresa/${company.slug}`);
  };

  const handleScrollLeft = () => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  const handleScrollRight = () => {
    // Scroll para o final (aproximado)
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  // Determinar se devemos usar texto branco ou escuro com base na cor primária da empresa
  const getTextColor = (backgroundColor: string | null) => {
    if (!backgroundColor) return false;

    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
  };

  const isDarkBackground = company.cor_primaria
    ? !getTextColor(company.cor_primaria)
    : false;

  return (
    <View
      className="md:mb-8 md:rounded-xl overflow-hidden shadow-md elevation-2 py-6"
      style={{ backgroundColor: company.cor_primaria || THEME_COLORS.primary }}
    >
      <CompanyHeader company={company} onViewAll={handleNavigateToCompany} />

      <View className="relative">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
        >
          {company.vitrineItems.map((item, index) => (
            <ProductCard
              key={`product-${company.id}-${item.id}-${index}`}
              product={item}
              onPress={handleNavigateToCompany}
            />
          ))}

          {/* Cartão "Ver Mais" - com a mesma altura dos cartões de produto */}
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
                  Ver todos os produtos
                </Text>

                <Text
                  className="text-center text-sm mt-4"
                  style={{
                    color: isDarkBackground ? "#ffffff" : "#374151",
                  }}
                >
                  Acesse o catálogo completo da empresa
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
