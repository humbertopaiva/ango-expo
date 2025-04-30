// Path: src/features/company-page/components/products-by-category.tsx
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  memo,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { Search, Package, X } from "lucide-react-native";
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
import { useCategoryFilterStore } from "../stores/category-filter.store";
import { FeaturedProductsStrip } from "./featured-products-strip";

// Constante para a categoria "Todos"
const ALL_CATEGORIES = "Todos";

// Componente otimizado com memo para a lista de produtos por categoria
const MemoizedCategoryProductsList = memo(CategoryProductsList);

// Componente para o campo de busca
const SearchField = memo(
  ({
    searchText,
    onChangeText,
  }: {
    searchText: string;
    onChangeText: (text: string) => void;
  }) => (
    <Input
      size="md"
      className="bg-white border-gray-300 shadow-sm rounded-xl"
      style={{
        elevation: 2,
      }}
    >
      <InputSlot pl="$3">
        <InputIcon as={Search} color="#9CA3AF" />
      </InputSlot>
      <InputField
        placeholder="Buscar produtos2..."
        value={searchText}
        onChangeText={onChangeText}
        className="py-2.5 placeholder:font-sans"
      />
      {searchText ? (
        <InputSlot pr="$3">
          <TouchableOpacity
            onPress={() => onChangeText("")}
            className="bg-gray-100 rounded-full p-1"
          >
            <X size={14} color="#9CA3AF" />
          </TouchableOpacity>
        </InputSlot>
      ) : null}
    </Input>
  )
);

// Componente para mensagem de nenhum produto encontrado
const NoProductsMessage = memo(
  ({
    searchText,
    onClearSearch,
  }: {
    searchText: string;
    onClearSearch: () => void;
  }) => (
    <Card className="p-8 items-center justify-center border border-gray-100">
      <Package size={56} color="#9CA3AF" className="mb-3" />
      <Text className="text-lg font-medium text-gray-800 mb-2 text-center">
        {searchText ? "Nenhum produto encontrado" : "Nenhum produto disponível"}
      </Text>
      <Text className="text-gray-500 text-center mb-4">
        {searchText
          ? `Não encontramos resultados para "${searchText}"`
          : "Esta loja ainda não cadastrou produtos"}
      </Text>
      {searchText ? (
        <Button onPress={onClearSearch} className="mt-2 bg-secondary-500">
          <Button.Text className="text-secondary-500 font-medium">
            Limpar busca
          </Button.Text>
        </Button>
      ) : null}
    </Card>
  )
);

interface ProductsByCategoryProps {
  title?: string;
}

export function ProductsByCategory({
  title = "Produtos",
}: ProductsByCategoryProps) {
  const vm = useCompanyPageContext();
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState("");
  const contentScrollRef = useRef<ScrollView>(null);

  // Use the category filter store
  const {
    categories: storeCategories,
    selectedCategory,
    setCategories,
    setSelectedCategory,
    setIsVisible,
    updateProductCounts,
  } = useCategoryFilterStore();

  // Cor primária da empresa
  const primaryColor = vm.primaryColor || "#F4511E";

  // Iniciar uso do store com categories sempre false para o componente principal
  useEffect(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  // Calculate product counts and update store
  useEffect(() => {
    if (!vm.products || vm.products.length === 0) return;

    const counts: Record<string, number> = {};

    // Add the ALL_CATEGORIES count
    counts[ALL_CATEGORIES] = vm.products.length;

    // Group products by category and count
    vm.products.forEach((product) => {
      const category = product.categoria?.nome || "Outros";
      if (!counts[category]) counts[category] = 0;
      counts[category]++;
    });

    // Update store
    updateProductCounts(counts);
  }, [vm.products, updateProductCounts]);

  // Calcular todos os produtos e categorias quando os dados estiverem disponíveis
  useEffect(() => {
    if (!vm.products || vm.products.length === 0) return;

    // Agrupar produtos por categorias
    const grouped: Record<string, any[]> = { [ALL_CATEGORIES]: [] };

    vm.products.forEach((product) => {
      // Adicionar à categoria "Todos"
      grouped[ALL_CATEGORIES].push(product);

      // Adicionar à categoria específica
      const category = product.categoria?.nome || "Outros";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });

    // Ordenar categorias alfabeticamente, mas manter "Todos" no topo
    const sortedCategories = Object.keys(grouped).sort((a, b) => {
      if (a === ALL_CATEGORIES) return -1;
      if (b === ALL_CATEGORIES) return 1;
      return a.localeCompare(b);
    });

    setCategories(sortedCategories);
  }, [vm.products, setCategories]);

  // Função para atualizar o texto de busca - com useCallback
  const handleSearchTextChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  // Função para limpar a busca - com useCallback
  const handleClearSearch = useCallback(() => {
    setSearchText("");
  }, []);

  // Filtrar produtos com base na pesquisa e categoria selecionada - com useMemo
  const getFilteredProducts = useMemo(() => {
    if (!vm.products || vm.products.length === 0) return {};

    // Se não houver filtros, retornar todos os produtos agrupados por categoria
    if (
      !searchText &&
      (selectedCategory === ALL_CATEGORIES || !selectedCategory)
    ) {
      const grouped: Record<string, any[]> = {};

      vm.products.forEach((product) => {
        const category = product.categoria?.nome || "Outros";
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(product);
      });

      return grouped;
    }

    // Filtrar produtos pela pesquisa
    let filtered = vm.products;
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.nome.toLowerCase().includes(searchLower) ||
          (product.descricao &&
            product.descricao.toLowerCase().includes(searchLower))
      );
    }

    // Filtrar por categoria se não for "Todos"
    if (selectedCategory && selectedCategory !== ALL_CATEGORIES) {
      filtered = filtered.filter(
        (product) => (product.categoria?.nome || "Outros") === selectedCategory
      );
    }

    // Agrupar resultados filtrados por categoria
    const result: Record<string, any[]> = {};

    if (selectedCategory && selectedCategory !== ALL_CATEGORIES) {
      // Se uma categoria específica está selecionada, mostrar apenas essa categoria
      result[selectedCategory] = filtered;
    } else {
      // Agrupar por categorias
      filtered.forEach((product) => {
        const category = product.categoria?.nome || "Outros";
        if (!result[category]) {
          result[category] = [];
        }
        result[category].push(product);
      });
    }

    return result;
  }, [vm.products, searchText, selectedCategory]);

  // Calcular contagem total de produtos filtrados - com useMemo
  const totalFilteredProducts = useMemo(() => {
    return Object.values(getFilteredProducts).reduce(
      (sum, products) => sum + products.length,
      0
    );
  }, [getFilteredProducts]);

  // Verificar se há categorias para mostrar
  const hasCategories = Object.keys(getFilteredProducts).length > 0;

  const MemoizedFeaturedProductsStrip = memo(FeaturedProductsStrip);

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

  return (
    <View className="my-8">
      {/* Header e barra de pesquisa */}
      <View className="px-4 mb-4">
        <HStack className="items-center justify-between mb-4">
          <Text className="text-2xl font-semibold text-gray-800">{title}</Text>
        </HStack>

        {/* Barra de pesquisa melhorada */}
        <View className="mb-4">
          <SearchField
            searchText={searchText}
            onChangeText={handleSearchTextChange}
          />
        </View>

        {/* Resultados da busca */}
        {searchText && (
          <View className="mb-4">
            <Text className="text-gray-600">
              {totalFilteredProducts} resultados para "{searchText}"
            </Text>
          </View>
        )}
      </View>

      {/* Produtos em destaque (da vitrine) */}
      {vm.showcaseProducts && vm.showcaseProducts.length > 0 && (
        <MemoizedFeaturedProductsStrip />
      )}

      {/* Mensagem de nenhum produto encontrado */}
      {!hasCategories && (
        <View className="px-4">
          <NoProductsMessage
            searchText={searchText}
            onClearSearch={handleClearSearch}
          />
        </View>
      )}

      {/* Listas de produtos por categoria */}
      <ScrollView
        ref={contentScrollRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8 }}
        scrollEnabled={true}
      >
        {hasCategories &&
          Object.entries(getFilteredProducts).map(
            ([category, products]) =>
              category !== ALL_CATEGORIES && (
                <MemoizedCategoryProductsList
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
