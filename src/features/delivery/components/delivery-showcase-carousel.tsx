// Path: src/features/delivery/components/delivery-showcase-carousel.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Package, ArrowRight } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { DeliveryShowcaseItem } from "../models/delivery-showcase-item";
import { router } from "expo-router";
import { THEME_COLORS } from "@/src/styles/colors";

interface DeliveryShowcaseCarouselProps {
  companyName: string;
  companySlug: string;
  items: DeliveryShowcaseItem[];
  isLoading?: boolean;
}

export function DeliveryShowcaseCarousel({
  companyName,
  companySlug,
  items,
  isLoading = false,
}: DeliveryShowcaseCarouselProps) {
  const { width } = Dimensions.get("window");
  const cardWidth = Math.min(width * 0.7, 280);

  // Formatação de moeda
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  // Calcular desconto
  const calculateDiscount = (original: string, promotional: string) => {
    const originalValue = parseFloat(original.replace(",", "."));
    const promotionalValue = parseFloat(promotional.replace(",", "."));
    return Math.round(
      ((originalValue - promotionalValue) / originalValue) * 100
    );
  };

  // Se não tiver itens, não renderiza
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-center px-4 mb-4">
        <View>
          <Text className="text-sm text-primary-500 font-medium">
            Produtos em Destaque
          </Text>
          <Text className="text-lg font-semibold">{companyName}</Text>
        </View>

        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.push(`/(drawer)/empresa/${companySlug}`)}
        >
          <Text className="text-sm text-primary-600 font-medium mr-1">
            Ver todos
          </Text>
          <ArrowRight size={16} color={THEME_COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="mr-3"
            onPress={() => router.push(`/(drawer)/empresa/${companySlug}`)}
            activeOpacity={0.9}
          >
            <Card
              style={{ width: cardWidth }}
              className="overflow-hidden border border-gray-200 rounded-xl"
            >
              <View className="aspect-square relative">
                {item.imagem ? (
                  <ImagePreview
                    uri={item.imagem}
                    width="100%"
                    height="100%"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full bg-gray-100 items-center justify-center">
                    <Package size={40} color="#9CA3AF" />
                  </View>
                )}

                {item.preco_promocional && (
                  <View className="absolute top-2 right-2 bg-red-500 rounded-full px-2 py-1">
                    <Text className="text-xs font-bold text-white">
                      {calculateDiscount(item.preco, item.preco_promocional)}%
                      OFF
                    </Text>
                  </View>
                )}

                {!item.disponivel && (
                  <View className="absolute inset-0 bg-black/60 items-center justify-center">
                    <Text className="text-white font-bold">Indisponível</Text>
                  </View>
                )}
              </View>

              <View className="p-3">
                <Text
                  className="font-medium text-gray-800 mb-1"
                  numberOfLines={1}
                >
                  {item.nome}
                </Text>

                {item.descricao && (
                  <Text
                    className="text-xs text-gray-500 mb-2"
                    numberOfLines={2}
                  >
                    {item.descricao}
                  </Text>
                )}

                <View className="mt-auto">
                  {item.preco_promocional ? (
                    <View>
                      <Text className="text-lg font-bold text-primary-600">
                        {formatCurrency(item.preco_promocional)}
                      </Text>
                      <Text className="text-xs text-gray-500 line-through">
                        {formatCurrency(item.preco)}
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-lg font-bold text-primary-600">
                      {formatCurrency(item.preco)}
                    </Text>
                  )}
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Card "Ver Mais" */}
        <TouchableOpacity
          className="mr-4 items-center justify-center"
          style={{ width: cardWidth / 2 }}
          onPress={() => router.push(`/(drawer)/empresa/${companySlug}`)}
        >
          <View className="aspect-square rounded-xl border border-gray-200 items-center justify-center">
            <View className="w-12 h-12 rounded-full bg-primary-50 items-center justify-center mb-3">
              <ArrowRight size={20} color={THEME_COLORS.primary} />
            </View>
            <Text className="text-primary-600 font-medium text-sm text-center">
              Ver mais produtos
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
