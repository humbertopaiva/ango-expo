// Path: src/features/company-page/components/products-by-category.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  FlatList,
  Animated,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Search, Package, X, SlidersHorizontal } from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
  HStack,
  Card,
  Button,
} from "@gluestack-ui/themed";
import { CategoryProductsList } from "./category-products-list";
import { SafeMap } from "@/components/common/safe-map";
import { useProductsViewModel } from "../view-models/products-by-category.view-model";
import { shouldUseDarkText } from "@/src/utils/color.utils";

interface ProductsByCategoryProps {
  title?: string;
  scrollY?: Animated.Value;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function ProductsByCategory({
  title = "Produtos",
  scrollY = new Animated.Value(0),
  onScroll,
}: ProductsByCategoryProps) {
  const vm = useCompanyPageContext();
  const [showFilters, setShowFilters] = useState(false);
  const filterBarRef = useRef<View>(null);
  const [filterBarHeight, setFilterBarHeight] = useState(0);
  const [filterBarTop, setFilterBarTop] = useState(0);
  const [isFilterBarFixed, setIsFilterBarFixed] = useState(false);
  const contentScrollRef = useRef<ScrollView>(null);
  const isDeliveryPlan =
    vm.profile?.empresa.plano?.nome?.toLowerCase() === "delivery";

  // Animação para opacidade do background do filtro fixo
  const filterBackgroundOpacity = scrollY.interpolate({
    inputRange: [filterBarTop, filterBarTop + 30],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Usar o view model para a lógica de dados
  const productsViewModel = useProductsViewModel(vm.products);

  const primaryColor = vm.primaryColor || "#F4511E";
  const isDarkText = shouldUseDarkText(primaryColor);
  const filterBgColor = `${primaryColor}15`;
  const filterTextColor = primaryColor;

  // Efeito para monitorar a posição de scroll
  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      if (value >= filterBarTop && filterBarTop > 0) {
        setIsFilterBarFixed(true);
      } else {
        setIsFilterBarFixed(false);
      }
    });

    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [filterBarTop]);

  // Medir a posição e altura da barra de filtro
  const measureFilterBar = () => {
    if (filterBarRef.current) {
      filterBarRef.current.measureInWindow((x, y, width, height) => {
        setFilterBarHeight(height);
        setFilterBarTop(y);
      });
    }
  };

  useEffect(() => {
    // Medir após a renderização inicial e quando os dados mudarem
    const timer = setTimeout(measureFilterBar, 500);
    return () => clearTimeout(timer);
  }, [vm.products, productsViewModel.categoryNames]);

  // Renderizar o item da categoria para o FlatList horizontal
  const renderCategoryItem = ({ item }: { item: string }) => {
    const isActive = productsViewModel.selectedCategory === item;

    return (
      <TouchableOpacity
        onPress={() => {
          productsViewModel.setSelectedCategory(isActive ? null : item);
        }}
        className={`mr-3 px-4 py-2 rounded-full ${
          isActive ? "bg-primary-500" : "bg-gray-100"
        }`}
        style={{
          backgroundColor: isActive ? primaryColor : "#f3f4f6",
        }}
      >
        <Text
          className={`text-sm ${
            isActive ? "text-white font-medium" : "text-gray-800"
          }`}
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
              <TouchableOpacity
                key={option.id}
                onPress={() => productsViewModel.setActiveSort(option.id)}
                className={`py-2 px-4 rounded-full mr-2`}
                style={{
                  backgroundColor:
                    productsViewModel.activeSort === option.id
                      ? primaryColor
                      : "#f3f4f6",
                }}
              >
                <Text
                  className={`text-sm ${
                    productsViewModel.activeSort === option.id
                      ? "text-white font-medium"
                      : "text-gray-800"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Lista horizontal fixa de categorias */}
      <View
        ref={filterBarRef}
        onLayout={measureFilterBar}
        className="mb-4 z-10"
      >
        {productsViewModel.categoryNames.length > 0 && (
          <FlatList
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
        )}
      </View>

      {/* Versão fixa do filtro de categorias que aparece ao rolar */}
      {isFilterBarFixed && productsViewModel.categoryNames.length > 0 && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: `rgba(255,255,255,${filterBackgroundOpacity})`,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
            height: filterBarHeight,
            paddingVertical: 8,
          }}
        >
          <FlatList
            data={productsViewModel.categoryNames}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => `fixed-category-${item}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
          />
        </Animated.View>
      )}

      {/* Espaço vazio para o filtro fixo */}
      {isFilterBarFixed && <View style={{ height: filterBarHeight }} />}

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
      <ScrollView
        ref={contentScrollRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        {hasCategories &&
          Object.entries(productsViewModel.filteredCategories).map(
            ([category, products]) => (
              <CategoryProductsList
                key={`category-${category}`}
                title={category}
                products={products}
                viewAllPath={
                  vm.profile?.empresa.slug
                    ? `/(drawer)/empresa/${
                        vm.profile.empresa.slug
                      }/products?category=${encodeURIComponent(category)}`
                    : undefined
                }
              />
            )
          )}
      </ScrollView>
    </View>
  );
}
