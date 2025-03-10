// Path: src/features/company-page/components/category-products-list.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Package,
} from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { SafeMap } from "@/components/common/safe-map";
import { AdaptiveProductCard } from "./adaptive-product-card";
import { Card, HStack, Divider } from "@gluestack-ui/themed";
import { CompanyProduct } from "../models/company-product";
import { LinearGradient } from "expo-linear-gradient";
import { Box } from "@/components/ui/box";

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
  const isWeb = Platform.OS === "web";
  const isDeliveryPlan =
    vm.profile?.empresa.plano?.nome?.toLowerCase() === "delivery";

  // Calcular largura ideal do item com base na largura da tela
  const getItemWidth = () => {
    if (width > 768) return 260; // Tablets e Desktop
    return width * 0.7; // Celulares: 70% da largura da tela
  };

  // Atualiza isExpanded quando a prop expanded muda
  React.useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  if (products.length === 0) {
    return null;
  }

  // Calcular número de colunas para layout grid
  const numColumns = width > 768 ? 3 : 2;

  // Cor primária da empresa
  const primaryColor = vm.primaryColor || "#F4511E";
  const lightPrimaryColor = `${primaryColor}10`;

  return (
    <View className="mb-6">
      {/* Cabeçalho da categoria com botão de expandir/recolher */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="py-3 mb-2"
      >
        <Box
          className="px-4 py-3 rounded-lg mx-4"
          style={{ backgroundColor: lightPrimaryColor }}
        >
          <HStack className="items-center justify-between">
            <View className="flex-row items-center">
              <Text
                className="text-lg font-bold"
                style={{ color: primaryColor }}
              >
                {title}
              </Text>
              <View
                className="px-2 py-0.5 rounded-full ml-2"
                style={{ backgroundColor: "white" }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: primaryColor }}
                >
                  {products.length}
                </Text>
              </View>
            </View>

            <View className="bg-white rounded-full p-1">
              {isExpanded ? (
                <ChevronUp size={18} color={primaryColor} />
              ) : (
                <ChevronDown size={18} color={primaryColor} />
              )}
            </View>
          </HStack>
        </Box>
      </TouchableOpacity>

      {isExpanded && (
        <>
          {isDeliveryPlan ? (
            /* Lista vertical para delivery */
            <View className="px-4 space-y-3">
              <SafeMap
                data={products}
                renderItem={(product, index) => (
                  <AdaptiveProductCard
                    key={`${title}-${product.id}`}
                    product={product}
                  />
                )}
                fallback={
                  <Card className="p-4 items-center border border-gray-100">
                    <Package size={48} color="#9CA3AF" />
                    <Text className="text-gray-500 mt-2">
                      Nenhum produto nesta categoria
                    </Text>
                  </Card>
                }
              />

              {/* Se tiver mais de 4 produtos e eles estiverem parcialmente ocultos,
                  mostra botão "Ver mais" */}
              {products.length > 4 &&
                isDeliveryPlan &&
                products.length > 0 &&
                !isExpanded && (
                  <TouchableOpacity
                    className="py-3 border-t border-gray-100"
                    onPress={() => setIsExpanded(true)}
                  >
                    <Text
                      className="text-center font-medium"
                      style={{ color: primaryColor }}
                    >
                      Ver mais {products.length - 4}{" "}
                      {products.length - 4 === 1 ? "item" : "itens"}
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
          ) : (
            /* Lista horizontal para catálogo */
            <View>
              <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
                className="pb-2"
                decelerationRate="fast"
                snapToInterval={getItemWidth() + 16} // Snap to each card
                snapToAlignment="start"
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
                    style={{ width: 120 }}
                    className="items-center justify-center rounded-xl border border-gray-100 mr-4 shadow-sm"
                  >
                    <View className="h-full items-center justify-center p-4">
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mb-2"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <ChevronRight size={24} color={primaryColor} />
                      </View>
                      <Text
                        className="text-sm text-center font-medium"
                        style={{ color: primaryColor }}
                      >
                        Ver todos {products.length} produtos
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </ScrollView>

              {/* Indicadores de página (dots) para o modo catálogo */}
              {products.length > 3 && (
                <View className="flex-row justify-center mt-1 gap-1.5">
                  {[...Array(Math.min(5, Math.ceil(products.length / 2)))].map(
                    (_, idx) => (
                      <View
                        key={`dot-${idx}`}
                        className="h-1.5 w-1.5 rounded-full bg-gray-300"
                        style={{
                          backgroundColor: idx === 0 ? primaryColor : "#D1D5DB",
                        }}
                      />
                    )
                  )}
                </View>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
}
