// Path: src/features/company-page/components/category-products-list.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { ChevronRight, Package } from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { SafeMap } from "@/components/common/safe-map";
import { AdaptiveProductCard } from "./adaptive-product-card";
import { Card, HStack } from "@gluestack-ui/themed";
import { CompanyProduct } from "../models/company-product";
import { router } from "expo-router";

interface CategoryProductsListProps {
  title: string;
  products: CompanyProduct[];
  viewAllPath?: string;
}

export function CategoryProductsList({
  title,
  products,
  viewAllPath,
}: CategoryProductsListProps) {
  const vm = useCompanyPageContext();
  const { width } = Dimensions.get("window");
  const isDeliveryPlan =
    vm.profile?.empresa.plano?.nome?.toLowerCase() === "delivery";

  // Número de produtos a exibir inicialmente para catálogo (máximo 10)
  const MAX_CATALOG_PRODUCTS = 10;
  const limitedProducts = isDeliveryPlan
    ? products
    : products.slice(0, MAX_CATALOG_PRODUCTS);

  // Calcular número de colunas para layout grid
  const numColumns = 2;

  // Cor primária da empresa
  const primaryColor = vm.primaryColor || "#F4511E";

  // Handler para "Ver todos"
  const handleViewAll = () => {
    if (viewAllPath) {
      router.push(`/(drawer)/empresa/${vm.profile?.empresa.slug}`);
    } else if (vm.profile?.empresa.slug) {
      // Construir URL com parâmetros para filtrar por categoria
      router.push({
        pathname: `/(drawer)/empresa/${vm.profile.empresa.slug}/products`,
        params: { category: encodeURIComponent(title) },
      });
    }
  };

  // Se não houver produtos, retornar null
  if (products.length === 0) {
    return null;
  }

  return (
    <View className="mb-6">
      {/* Cabeçalho da categoria com contagem e botão Ver Todos */}
      <View className="px-4 mb-3">
        <HStack className="items-center justify-between">
          <HStack className="items-center">
            <Text className="text-lg font-bold text-gray-800">{title}</Text>
            <View className="px-2 py-0.5 rounded-full ml-2 bg-gray-100">
              <Text className="text-xs font-medium text-gray-600">
                {products.length}
              </Text>
            </View>
          </HStack>

          {products.length > MAX_CATALOG_PRODUCTS && !isDeliveryPlan && (
            <TouchableOpacity
              onPress={handleViewAll}
              className="flex-row items-center"
            >
              <Text
                style={{ color: primaryColor }}
                className="mr-1 font-medium"
              >
                Ver todos
              </Text>
              <ChevronRight size={16} color={primaryColor} />
            </TouchableOpacity>
          )}
        </HStack>
      </View>

      {isDeliveryPlan ? (
        /* Lista vertical para delivery */
        <View className="px-4 space-y-3">
          <SafeMap
            data={limitedProducts}
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
        </View>
      ) : (
        /* Grid para catálogo */
        <View className="px-4">
          <FlatList
            data={limitedProducts}
            keyExtractor={(item) => `${title}-${item.id}`}
            numColumns={numColumns}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <View style={{ flex: 1 / numColumns, padding: 4 }}>
                <AdaptiveProductCard product={item} />
              </View>
            )}
            ListEmptyComponent={
              <Card className="p-4 items-center border border-gray-100">
                <Package size={48} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2">
                  Nenhum produto nesta categoria
                </Text>
              </Card>
            }
          />

          {/* Botão "Ver Todos" no final da grid para catálogo */}
          {products.length > MAX_CATALOG_PRODUCTS && (
            <TouchableOpacity
              onPress={handleViewAll}
              className="mt-4 py-3 border border-gray-200 rounded-lg"
            >
              <Text
                className="text-center font-medium"
                style={{ color: primaryColor }}
              >
                Ver todos os {products.length} produtos
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
