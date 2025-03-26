// Path: src/features/company-page/components/products-by-category.tsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  FlatList,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import {
  Search,
  Package,
  X,
  SlidersHorizontal,
  Filter,
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
  VStack,
} from "@gluestack-ui/themed";
import { CategoryProductsList } from "./category-products-list";
import { SafeMap } from "@/components/common/safe-map";
import { shouldUseDarkText } from "@/src/utils/color.utils";

// Constante para a categoria "Todos"
const ALL_CATEGORIES = "Todos";

interface ProductsByCategoryProps {
  title?: string;
}

export function ProductsByCategory({
  title = "Produtos",
}: ProductsByCategoryProps) {
  const vm = useCompanyPageContext();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    ALL_CATEGORIES
  );
  const [searchText, setSearchText] = useState("");
  const contentScrollRef = useRef<ScrollView>(null);
  const isDeliveryPlan =
    vm.profile?.empresa.plano?.nome?.toLowerCase() === "delivery";
  const { width } = Dimensions.get("window");

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Estado para armazenar todas as categorias
  const [categories, setCategories] = useState<string[]>([]);

  // Cor primária da empresa
  const primaryColor = vm.primaryColor || "#F4511E";
  const filterBgColor = `${primaryColor}15`;
  const filterTextColor = primaryColor;

  // Iniciar animações quando o componente montar
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
  }, [vm.products]);

  // Filtrar produtos com base na pesquisa e categoria selecionada
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

  // Calcular contagem total de produtos filtrados
  const totalFilteredProducts = useMemo(() => {
    return Object.values(getFilteredProducts).reduce(
      (sum, products) => sum + products.length,
      0
    );
  }, [getFilteredProducts]);

  // Verificar se há categorias para mostrar
  const hasCategories = Object.keys(getFilteredProducts).length > 0;

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
    <View className="mb-8 ">
      {/* Header e barra de pesquisa */}
      <View className="px-4 mb-4">
        <HStack className="items-center justify-between mb-6">
          <Text className="text-2xl font-semibold text-gray-800">{title}</Text>
        </HStack>

        {/* Barra de pesquisa melhorada */}
        <View className="mb-4">
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
              placeholder="Buscar produtos..."
              value={searchText}
              onChangeText={setSearchText}
              className="py-2.5 placeholder:font-sans"
            />
            {searchText ? (
              <InputSlot pr="$3">
                <TouchableOpacity
                  onPress={() => setSearchText("")}
                  className="bg-gray-100 rounded-full p-1"
                >
                  <X size={14} color="#9CA3AF" />
                </TouchableOpacity>
              </InputSlot>
            ) : null}
          </Input>
        </View>

        {/* Cabeçalho de Categorias Melhorado */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="mt-4"
        >
          <HStack className="items-center" space="sm">
            <View
              className="w-5 h-5 rounded-full items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Filter size={12} color={primaryColor} />
            </View>
            <Text className="font-medium text-gray-700">
              Filtre por categorias
            </Text>
          </HStack>
        </Animated.View>
      </View>

      {/* Lista horizontal de categorias melhorada */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          marginBottom: 12,
        }}
      >
        {categories.length > 0 && (
          <FlatList
            data={categories}
            renderItem={({ item }) => {
              const isActive = selectedCategory === item;

              return (
                <TouchableOpacity
                  onPress={() => setSelectedCategory(item)}
                  style={{
                    backgroundColor: isActive ? primaryColor : "#FFFFFF",

                    borderWidth: isActive ? 0 : 1,
                    borderColor: "rgba(229, 231, 235, 0.8)",
                    marginRight: 10,
                    borderRadius: 20,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: isActive ? 3 : 1 },
                    shadowOpacity: isActive ? 0.15 : 0.05,
                    shadowRadius: isActive ? 4 : 2,
                    elevation: isActive ? 3 : 1,
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      color: isActive ? "#FFFFFF" : "#4B5563",
                      fontWeight: isActive ? "600" : "500",
                      fontSize: 14,
                    }}
                    numberOfLines={1}
                    className="font-semibold"
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          />
        )}
      </Animated.View>

      {/* Resultados da busca */}
      {searchText && (
        <View className="px-4 mb-4">
          <Text className="text-gray-600">
            {totalFilteredProducts} resultados para "{searchText}"
          </Text>
        </View>
      )}

      {/* Mensagem de nenhum produto encontrado */}
      {!hasCategories && (
        <View className="px-4">
          <Card className="p-8 items-center justify-center border border-gray-100">
            <Package size={56} color="#9CA3AF" className="mb-3" />
            <Text className="text-lg font-medium text-gray-800 mb-2 text-center">
              {searchText
                ? "Nenhum produto encontrado"
                : "Nenhum produto disponível"}
            </Text>
            <Text className="text-gray-500 text-center mb-4">
              {searchText
                ? `Não encontramos resultados para "${searchText}"`
                : "Esta loja ainda não cadastrou produtos"}
            </Text>
            {searchText ? (
              <Button
                onPress={() => setSearchText("")}
                className="mt-2 bg-secondary-500"
              >
                <Button.Text className="text-secondary-500 font-medium">
                  Limpar busca
                </Button.Text>
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
          Object.entries(getFilteredProducts).map(
            ([category, products]) =>
              category !== ALL_CATEGORIES && (
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
