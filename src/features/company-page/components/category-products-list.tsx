// Path: src/features/company-page/components/category-products-list.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { SafeMap } from "@/components/common/safe-map";
import { AdaptiveProductCard } from "./adaptive-product-card";
import { Card, HStack } from "@gluestack-ui/themed";
import { CompanyProduct } from "../models/company-product";

interface CategoryProductsListProps {
  title: string;
  products: CompanyProduct[];
  expanded?: boolean;
}

export function CategoryProductsList({
  title,
  products,
  expanded = true,
}: CategoryProductsListProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const vm = useCompanyPageContext();
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get("window");

  const isDeliveryPlan =
    vm.profile?.empresa.plano?.nome?.toLowerCase() === "delivery";

  // Calcular largura ideal do item com base na largura da tela
  const getItemWidth = () => {
    if (width > 768) return 240; // Tablets e Desktop
    return width * 0.7; // Celulares: 70% da largura da tela
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <View className="mb-6">
      {/* Cabeçalho da categoria com botão de expandir/recolher */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between px-4 py-2 mb-2"
      >
        <Text className="text-lg font-bold text-gray-800">{title}</Text>
        <View className="bg-gray-100 rounded-full p-1">
          {isExpanded ? (
            <ChevronUp size={16} color="#374151" />
          ) : (
            <ChevronDown size={16} color="#374151" />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <>
          {isDeliveryPlan ? (
            /* Lista vertical para delivery */
            <View className="px-4">
              <SafeMap
                data={products}
                renderItem={(product, index) => (
                  <AdaptiveProductCard
                    key={`${title}-${product.id}`}
                    product={product}
                  />
                )}
                fallback={
                  <Card className="p-4 items-center">
                    <Text className="text-gray-500">
                      Nenhum produto nesta categoria
                    </Text>
                  </Card>
                }
              />
            </View>
          ) : (
            /* Lista horizontal para catálogo */
            <View>
              <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                className="pb-2"
              >
                <SafeMap
                  data={products}
                  renderItem={(product, index) => (
                    <View
                      key={`${title}-${product.id}`}
                      style={{ width: getItemWidth() }}
                      className="mr-4"
                    >
                      <AdaptiveProductCard product={product} />
                    </View>
                  )}
                />

                {/* Botão "Ver todos" no final da lista horizontal */}
                {products.length > 3 && (
                  <TouchableOpacity
                    style={{ width: 100 }}
                    className="items-center justify-center rounded-xl border border-gray-200 mr-4"
                  >
                    <View className="p-4 items-center">
                      <ChevronRight size={24} color="#6B7280" />
                      <Text className="text-sm text-gray-600 mt-2">
                        Ver todos
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          )}
        </>
      )}
    </View>
  );
}
