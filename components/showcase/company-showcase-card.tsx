// Path: components/showcase/company-showcase-card.tsx
import React, { useRef } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react-native";

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

  return (
    <View className="md:mb-8 md:rounded-xl overflow-hidden py-6">
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
                <View className="w-14 h-14 rounded-full items-center justify-center bg-primary-50">
                  <ShoppingBag size={24} color={THEME_COLORS.primary} />
                </View>

                <Text className="text-center font-medium text-primary-500 text-lg">
                  Ver todos os produtos
                </Text>

                <Text
                  className="text-center text-sm mt-2"
                  style={{
                    color: "#374151",
                  }}
                >
                  Acesse o catálogo completo da empresa
                </Text>
              </View>
            </Box>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
