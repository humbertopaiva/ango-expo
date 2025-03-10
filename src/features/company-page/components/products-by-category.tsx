// Path: src/features/company-page/components/products-by-category.tsx (ajustado para usar o view model)
import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Platform, FlatList } from "react-native";
import {
  Search,
  Package,
  X,
  SlidersHorizontal,
  Store,
} from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
  HStack,
  Card,
  Button,
  ScrollView,
} from "@gluestack-ui/themed";
import { CategoryProductsList } from "./category-products-list";
import { ImagePreview } from "@/components/custom/image-preview";
import { SafeMap } from "@/components/common/safe-map";
import { useProductsViewModel } from "../view-models/products-by-category.view-model";
import { shouldUseDarkText } from "@/src/utils/color.utils";

interface ProductsByCategoryProps {
  title?: string;
}

export function ProductsByCategory({
  title = "Produtos",
}: ProductsByCategoryProps) {
  const vm = useCompanyPageContext();
  const [showFilters, setShowFilters] = useState(false);
  const categoryScrollRef = useRef<FlatList>(null);
  const isWeb = Platform.OS === "web";
  const isDeliveryPlan =
    vm.profile?.empresa.plano?.nome?.toLowerCase() === "delivery";

  // Usar o view model para a lógica de dados
  const productsViewModel = useProductsViewModel(vm.products);

  const primaryColor = vm.primaryColor || "#F4511E";
  const isDarkText = shouldUseDarkText(primaryColor);
  const filterBgColor = `${primaryColor}15`;
  const filterTextColor = primaryColor;

  // Botão de filtro para cada opção de ordenação
  const SortButton = ({ id, label }: { id: string; label: string }) => (
    <TouchableOpacity
      onPress={() => productsViewModel.setActiveSort(id)}
      className={`py-2 px-4 rounded-full mr-2 ${
        productsViewModel.activeSort === id ? "bg-primary-500" : "bg-gray-100"
      }`}
      style={{
        backgroundColor:
          productsViewModel.activeSort === id ? primaryColor : "#f3f4f6",
      }}
    >
      <Text
        className={`text-sm ${
          productsViewModel.activeSort === id
            ? "text-white font-medium"
            : "text-gray-800"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Renderizar o item da categoria para o FlatList horizontal
  const renderCategoryItem = ({ item }: { item: string }) => {
    const isActive = productsViewModel.selectedCategory === item;
    const categoryProducts = vm.products?.filter(
      (p) => (p.categoria?.nome || "Outros") === item
    );
    const categoryImage = categoryProducts?.[0]?.categoria?.imagem;

    return (
      <TouchableOpacity
        onPress={() => {
          productsViewModel.setSelectedCategory(isActive ? null : item);
        }}
        className="items-center mr-4"
        activeOpacity={0.7}
      >
        <View
          className={`w-16 h-16 rounded-xl items-center justify-center mb-1 ${
            isActive ? "border-2" : ""
          }`}
          style={{
            backgroundColor: `${primaryColor}15`,
            borderColor: isActive ? primaryColor : "transparent",
          }}
        >
          {categoryImage ? (
            <ImagePreview
              uri={categoryImage}
              width="100%"
              height="100%"
              resizeMode="cover"
              containerClassName="rounded-xl"
            />
          ) : (
            <Store size={24} color={isActive ? primaryColor : "#6B7280"} />
          )}
        </View>
        <Text
          className={`text-xs text-center ${
            isActive ? "font-bold" : "font-medium"
          }`}
          style={{ color: isActive ? primaryColor : "#4B5563" }}
          numberOfLines={1}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  if (vm.isLoading) {
    // Skeleton loading state
    return (
      <View className="mb-8">
        <View className="px-4 mb-4">
          <View className="h-7 w-40 bg-gray-200 rounded-lg mb-4 animate-pulse" />
          <View className="h-10 bg-gray-200 rounded-lg mb-3 animate-pulse" />
          <View className="h-6 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
        </View>

        <View className="mt-6">
          <View className="h-20 mx-4 bg-gray-200 rounded-lg mb-4 animate-pulse" />

          <View className="flex-row flex-wrap px-4 mb-6">
            {[1, 2, 3, 4].map((item) => (
              <View key={`skeleton-${item}`} className="w-1/2 p-2">
                <View className="h-48 bg-gray-200 rounded-lg animate-pulse" />
              </View>
            ))}
          </View>

          <View className="h-10 mx-4 bg-gray-200 rounded-lg mb-4 animate-pulse" />

          <View className="flex-row flex-wrap px-4">
            {[1, 2].map((item) => (
              <View key={`skeleton-2-${item}`} className="w-1/2 p-2">
                <View className="h-48 bg-gray-200 rounded-lg animate-pulse" />
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  const hasCategories =
    Object.keys(productsViewModel.filteredCategories).length > 0;

  return (
    <View className="mb-8">
      {/* Header e barra de pesquisa */}
      <View className="px-4 mb-4">
        <HStack className="items-center justify-between mb-2">
          <Text className="text-xl font-bold text-gray-800">{title}</Text>

          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            className="flex-row items-center px-3 py-1.5 rounded-full"
            style={{ backgroundColor: filterBgColor }}
          >
            <SlidersHorizontal size={16} color={filterTextColor} />
            <Text
              className="ml-1.5 text-sm font-medium"
              style={{ color: filterTextColor }}
            >
              Filtrar
            </Text>
          </TouchableOpacity>
        </HStack>

        {/* Barra de pesquisa melhorada */}
        <View className="mb-4">
          <Input
            size="md"
            className="bg-white border-gray-200 shadow-sm rounded-xl"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <InputSlot pl="$3">
              <InputIcon as={Search} color="$gray500" />
            </InputSlot>
            <InputField
              placeholder="Buscar produtos..."
              value={productsViewModel.searchText}
              onChangeText={productsViewModel.setSearchText}
              className="py-2.5"
            />
            {productsViewModel.searchText ? (
              <InputSlot pr="$3">
                <TouchableOpacity
                  onPress={() => productsViewModel.setSearchText("")}
                  className="bg-gray-100 rounded-full p-1"
                >
                  <X size={14} color="#9CA3AF" />
                </TouchableOpacity>
              </InputSlot>
            ) : null}
          </Input>
        </View>

        {/* Filtros de ordenação */}
        {showFilters && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="py-2 -mx-4 px-4"
          >
            {productsViewModel.getSortOptions().map((option) => (
              <SortButton key={option.id} id={option.id} label={option.label} />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Lista horizontal de categorias */}
      {productsViewModel.categoryNames.length > 0 && (
        <View className="mb-4">
          <FlatList
            ref={categoryScrollRef}
            data={productsViewModel.categoryNames}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => `category-${item}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          />
        </View>
      )}

      {/* Resultados da busca */}
      {productsViewModel.searchText && (
        <View className="px-4 mb-4">
          <Text className="text-gray-600">
            {productsViewModel.totalProductCount} resultados para "
            {productsViewModel.searchText}"
          </Text>
        </View>
      )}

      {/* Mensagem de nenhum produto encontrado */}
      {!hasCategories && (
        <View className="px-4">
          <Card className="p-8 items-center justify-center border border-gray-100">
            <Package size={56} color="#9CA3AF" className="mb-3" />
            <Text className="text-lg font-medium text-gray-800 mb-2 text-center">
              {productsViewModel.searchText
                ? "Nenhum produto encontrado"
                : "Nenhum produto disponível"}
            </Text>
            <Text className="text-gray-500 text-center mb-4">
              {productsViewModel.searchText
                ? `Não encontramos resultados para "${productsViewModel.searchText}"`
                : "Esta loja ainda não cadastrou produtos"}
            </Text>
            {productsViewModel.searchText ? (
              <Button
                onPress={() => productsViewModel.setSearchText("")}
                className="mt-2"
                variant="outline"
              >
                <Button.Text>Limpar busca</Button.Text>
              </Button>
            ) : null}
          </Card>
        </View>
      )}

      {/* Listas de produtos por categoria */}
      {hasCategories &&
        Object.entries(productsViewModel.filteredCategories).map(
          ([category, products]) => (
            <CategoryProductsList
              key={`category-${category}`}
              title={category}
              products={products}
              // Para delivery, expandimos todas as categorias por padrão ou
              // se uma categoria específica for selecionada
              expanded={
                isDeliveryPlan ||
                productsViewModel.selectedCategory === category ||
                productsViewModel.searchText.length > 0
              }
            />
          )
        )}
    </View>
  );
}
