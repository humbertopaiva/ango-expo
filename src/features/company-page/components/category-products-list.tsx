// Path: src/features/company-page/components/category-products-list.tsx
import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { ChevronRight, Package } from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { SafeMap } from "@/components/common/safe-map";
import { AdaptiveProductCard } from "./adaptive-product-card";
import { CatalogProductCard } from "./catalog-product-card";
import { Card, HStack } from "@gluestack-ui/themed";
import { CompanyProduct } from "../models/company-product";
import { router } from "expo-router";

interface CategoryProductsListProps {
  title: string;
  products: CompanyProduct[];
  viewAllPath?: any;
}

export function CategoryProductsList({
  title,
  products,
  viewAllPath,
}: CategoryProductsListProps) {
  const vm = useCompanyPageContext();
  const isDeliveryPlan =
    vm.profile?.empresa.plano?.nome?.toLowerCase() === "delivery";

  // Número de produtos a exibir inicialmente para catálogo (máximo 10)
  const MAX_CATALOG_PRODUCTS = 10;
  const limitedProducts = isDeliveryPlan
    ? products
    : products.slice(0, MAX_CATALOG_PRODUCTS);

  // Cor primária da empresa
  const primaryColor = vm.primaryColor || "#F4511E";

  // Handler para "Ver todos"
  const handleViewAll = () => {
    if (viewAllPath) {
      router.push(viewAllPath);
    } else if (vm.profile?.empresa.slug) {
      // Construir URL com parâmetros para filtrar por categoria
      router.push({
        pathname:
          `/(drawer)/empresa/${vm.profile.empresa.slug}/products` as any,
        params: { category: encodeURIComponent(title) },
      });
    }
  };

  // Se não houver produtos, retornar null
  if (products.length === 0) {
    return null;
  }

  return (
    <View className="my-6">
      {/* Cabeçalho da categoria com contagem e botão Ver Todos */}
      <View className="px-4 mb-3">
        <HStack className="items-center justify-between">
          <HStack className="items-center w-full">
            <Text className="text-xl font-semibold text-gray-700 w-full pb-4 ">
              {title}
            </Text>
          </HStack>

          {/* Botão "Ver todos" para categorias com muitos produtos */}
          {products.length > MAX_CATALOG_PRODUCTS && (
            <TouchableOpacity
              onPress={handleViewAll}
              className="flex-row items-center"
            >
              <Text
                className="mr-1 text-sm font-medium"
                style={{ color: primaryColor }}
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
                showFeaturedBadge={index === 0 && product.tem_variacao !== true}
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
        /* Grid para catálogo - Solução sem FlatList */
        <View className="px-4">
          <View className="flex-row flex-wrap -mx-1">
            {limitedProducts.map((item, index) => (
              <View
                key={`${title}-${item.id}`}
                style={{ width: "50%", padding: 4 }}
              >
                <CatalogProductCard
                  product={item}
                  showFeaturedBadge={index === 0}
                />
              </View>
            ))}
          </View>

          {products.length === 0 && (
            <Card className="p-4 items-center border border-gray-100">
              <Package size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">
                Nenhum produto nesta categoria
              </Text>
            </Card>
          )}

          {/* Botão "Ver Todos" no final da grid para catálogo */}
          {products.length > MAX_CATALOG_PRODUCTS && (
            <TouchableOpacity
              onPress={handleViewAll}
              className="mt-4 py-3 border border-gray-200 rounded-lg"
              style={{
                borderColor: `${primaryColor}30`,
                backgroundColor: `${primaryColor}05`,
              }}
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
