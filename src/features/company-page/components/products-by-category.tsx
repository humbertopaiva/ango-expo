// Path: src/features/company-page/components/products-by-category.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  Search,
  Package,
  Filter,
  X,
  SlidersHorizontal,
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
import { CompanyProduct } from "../models/company-product";

interface ProductsByCategoryProps {
  title?: string;
}

// Interface para produtos agrupados por categoria
interface ProductsByCategory {
  [category: string]: CompanyProduct[];
}

export function ProductsByCategory({
  title = "Produtos",
}: ProductsByCategoryProps) {
  const vm = useCompanyPageContext();
  const [searchText, setSearchText] = useState("");
  const [categoryProducts, setCategoryProducts] = useState<ProductsByCategory>(
    {}
  );
  const [showFilters, setShowFilters] = useState(false);
  const [activeSort, setActiveSort] = useState<string>("relevance");
  const isWeb = Platform.OS === "web";
  const isDeliveryPlan =
    vm.profile?.empresa.plano?.nome?.toLowerCase() === "delivery";

  const primaryColor = vm.primaryColor || "#F4511E";

  // Opções de ordenação
  const sortOptions = [
    { id: "relevance", label: "Relevância" },
    { id: "price_asc", label: "Menor preço" },
    { id: "price_desc", label: "Maior preço" },
    { id: "name_asc", label: "A-Z" },
  ];

  // Agrupar produtos por categoria
  useEffect(() => {
    if (!vm.products || vm.products.length === 0) return;

    const grouped: ProductsByCategory = {};

    vm.products.forEach((product) => {
      // Usar categoria do produto ou "Outros" se não tiver
      const category = product.categoria?.nome || "Outros";

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push(product);
    });

    // Ordenar produtos conforme a opção selecionada
    Object.keys(grouped).forEach((category) => {
      grouped[category] = sortProducts(grouped[category], activeSort);
    });

    setCategoryProducts(grouped);
  }, [vm.products, activeSort]);

  // Ordenar produtos
  const sortProducts = (products: CompanyProduct[], sortOption: string) => {
    const sorted = [...products];

    switch (sortOption) {
      case "price_asc":
        return sorted.sort(
          (a, b) =>
            parseFloat(a.preco_promocional || a.preco) -
            parseFloat(b.preco_promocional || b.preco)
        );
      case "price_desc":
        return sorted.sort(
          (a, b) =>
            parseFloat(b.preco_promocional || b.preco) -
            parseFloat(a.preco_promocional || a.preco)
        );
      case "name_asc":
        return sorted.sort((a, b) => a.nome.localeCompare(b.nome));
      case "relevance":
      default:
        return sorted;
    }
  };

  // Filtrar produtos por texto de pesquisa
  useEffect(() => {
    if (!vm.products || vm.products.length === 0) return;

    if (!searchText.trim()) {
      // Se não tiver texto de pesquisa, mostrar todos os produtos agrupados
      const grouped: ProductsByCategory = {};

      vm.products.forEach((product) => {
        const category = product.categoria?.nome || "Outros";

        if (!grouped[category]) {
          grouped[category] = [];
        }

        grouped[category].push(product);
      });

      // Ordenar produtos conforme a opção selecionada
      Object.keys(grouped).forEach((category) => {
        grouped[category] = sortProducts(grouped[category], activeSort);
      });

      setCategoryProducts(grouped);
    } else {
      // Se tiver texto de pesquisa, filtra todos os produtos
      const searchLower = searchText.toLowerCase();
      const filteredProducts = vm.products.filter(
        (product) =>
          product.nome.toLowerCase().includes(searchLower) ||
          (product.descricao &&
            product.descricao.toLowerCase().includes(searchLower))
      );

      // Agrupa os produtos filtrados
      if (filteredProducts.length > 0) {
        const filtered: ProductsByCategory = {};

        filteredProducts.forEach((product) => {
          const category = product.categoria?.nome || "Outros";

          if (!filtered[category]) {
            filtered[category] = [];
          }

          filtered[category].push(product);
        });

        // Ordenar produtos conforme a opção selecionada
        Object.keys(filtered).forEach((category) => {
          filtered[category] = sortProducts(filtered[category], activeSort);
        });

        setCategoryProducts(filtered);
      } else {
        // Se não encontrou nada, mostra objeto vazio
        setCategoryProducts({});
      }
    }
  }, [searchText, vm.products, activeSort]);

  // Botão de filtro para cada opção de ordenação
  const SortButton = ({ id, label }: { id: string; label: string }) => (
    <TouchableOpacity
      onPress={() => setActiveSort(id)}
      className={`py-2 px-4 rounded-full mr-2 ${
        activeSort === id ? "bg-primary-500" : "bg-gray-100"
      }`}
      style={{
        backgroundColor: activeSort === id ? primaryColor : "#f3f4f6",
      }}
    >
      <Text
        className={`text-sm ${
          activeSort === id ? "text-white font-medium" : "text-gray-800"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

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
          <View className="h-10 mx-4 bg-gray-200 rounded-lg mb-4 animate-pulse" />

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

  const hasCategories = Object.keys(categoryProducts).length > 0;

  return (
    <View className="mb-8">
      {/* Header e barra de pesquisa */}
      <View className="px-4 mb-4">
        <HStack className="items-center justify-between mb-2">
          <Text className="text-xl font-bold text-gray-800">{title}</Text>

          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            className="flex-row items-center px-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <SlidersHorizontal size={16} color={primaryColor} />
            <Text
              className="ml-1.5 text-sm font-medium"
              style={{ color: primaryColor }}
            >
              Filtrar
            </Text>
          </TouchableOpacity>
        </HStack>

        {/* Barra de pesquisa */}
        <Input size="md" className="bg-white mb-3 border-gray-200 shadow-sm">
          <InputSlot pl="$3">
            <InputIcon as={Search} color="$gray500" />
          </InputSlot>
          <InputField
            placeholder="Buscar produtos..."
            value={searchText}
            onChangeText={setSearchText}
            className="py-2.5"
          />
          {searchText ? (
            <InputSlot pr="$3">
              <TouchableOpacity onPress={() => setSearchText("")}>
                <X size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </InputSlot>
          ) : null}
        </Input>

        {/* Filtros de ordenação */}
        {showFilters && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="py-2 -mx-4 px-4"
          >
            {sortOptions.map((option) => (
              <SortButton key={option.id} id={option.id} label={option.label} />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Resultados da busca */}
      {searchText && (
        <View className="px-4 mb-4">
          <Text className="text-gray-600">
            {Object.values(categoryProducts).flat().length} resultados para "
            {searchText}"
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
        Object.entries(categoryProducts).map(([category, products]) => (
          <CategoryProductsList
            key={`category-${category}`}
            title={category}
            products={products}
            // Para delivery, expandimos apenas a primeira categoria por padrão
            expanded={
              !isDeliveryPlan ||
              Object.keys(categoryProducts)[0] === category ||
              searchText.length > 0
            }
          />
        ))}
    </View>
  );
}
