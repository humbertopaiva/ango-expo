// Path: src/features/company-page/components/-products-grid.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, FlatList } from "react-native";
import { Package, Search, SlidersHorizontal } from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import {
  Card,
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from "@gluestack-ui/themed";
import { ImagePreview } from "@/components/custom/image-preview";
import { CompanyProduct } from "../models/company-product";

interface ProductsGridProps {
  title?: string;
  onProductPress?: (product: CompanyProduct) => void;
}

/**
 * Componente de grade de produtos com filtragem e pesquisa
 */
export function ProductsGrid({
  title = "Todos os Produtos",
  onProductPress,
}: ProductsGridProps) {
  const vm = useCompanyPageContext();
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState<
    "featured" | "priceLow" | "priceHigh"
  >("featured");

  // Filtragem e ordenação de produtos
  const getFilteredProducts = () => {
    if (!vm.products) return [];

    // Filtrar por texto de pesquisa
    let filtered = vm.products.filter(
      (product) =>
        product.nome.toLowerCase().includes(searchText.toLowerCase()) ||
        (product.descricao &&
          product.descricao.toLowerCase().includes(searchText.toLowerCase()))
    );

    // Ordenar produtos
    switch (sortOption) {
      case "priceLow":
        return filtered.sort((a, b) => {
          const priceA = parseFloat(a.preco_promocional || a.preco);
          const priceB = parseFloat(b.preco_promocional || b.preco);
          return priceA - priceB;
        });
      case "priceHigh":
        return filtered.sort((a, b) => {
          const priceA = parseFloat(a.preco_promocional || a.preco);
          const priceB = parseFloat(b.preco_promocional || b.preco);
          return priceB - priceA;
        });
      default:
        return filtered;
    }
  };

  const filteredProducts = getFilteredProducts();

  // Formatação de valores monetários
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  // Calcular desconto percentual
  const calculateDiscount = (original: string, promotional: string) => {
    if (!promotional) return 0;
    const originalValue = parseFloat(original);
    const promotionalValue = parseFloat(promotional);
    return Math.round(
      ((originalValue - promotionalValue) / originalValue) * 100
    );
  };

  // Número de colunas baseado na plataforma
  const numColumns = Platform.OS === "web" ? 3 : 2;

  // Botão de classificação
  const SortButton = ({
    option,
    label,
  }: {
    option: "featured" | "priceLow" | "priceHigh";
    label: string;
  }) => (
    <TouchableOpacity
      onPress={() => setSortOption(option)}
      className={`py-1 px-3 rounded-full mr-2 ${
        sortOption === option ? "bg-primary-100" : "bg-gray-100"
      }`}
    >
      <Text
        className={
          sortOption === option
            ? "text-primary-700 font-medium"
            : "text-gray-700"
        }
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (vm.isLoading) {
    // Renderizar esqueletos de carregamento
    return (
      <View className="mb-8">
        <Text className="text-xl font-bold px-4 mb-4">{title}</Text>
        <View className="flex-row flex-wrap px-2">
          {[1, 2, 3, 4].map((item) => (
            <View key={`skeleton-${item}`} className="w-1/2 md:w-1/3 p-2">
              <View className="h-40 bg-gray-200 rounded-lg animate-pulse" />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <View className="mb-8">
        <Text className="text-xl font-bold px-4 mb-4">{title}</Text>

        {/* Barra de pesquisa */}
        <View className="px-4 mb-4">
          <Input size="md" className="bg-white">
            <InputSlot>
              <InputIcon as={Search} className="ml-2" />
            </InputSlot>
            <InputField
              placeholder="Buscar produtos..."
              value={searchText}
              onChangeText={setSearchText}
              className="py-2"
            />
          </Input>
        </View>

        <Card className="mx-4 p-8 items-center">
          <Package size={48} color="#9CA3AF" />
          <Text className="text-gray-500 mt-2 text-center">
            Nenhum produto disponível
          </Text>
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Text className="text-primary-600 mt-2">Limpar busca</Text>
            </TouchableOpacity>
          ) : null}
        </Card>
      </View>
    );
  }

  return (
    <View className="mb-8">
      <View className="px-4 mb-4">
        <Text className="text-xl font-bold mb-4">{title}</Text>

        {/* Barra de pesquisa */}
        <Input size="md" className="bg-white mb-3">
          <InputSlot>
            <InputIcon as={Search} className="ml-2" />
          </InputSlot>
          <InputField
            placeholder="Buscar produtos..."
            value={searchText}
            onChangeText={setSearchText}
            className="py-2"
          />
        </Input>

        {/* Opções de filtro */}
        <View className="flex-row items-center mb-2 overflow-x-auto">
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            className="flex-row items-center py-1 px-3 bg-gray-100 rounded-full mr-2"
          >
            <SlidersHorizontal size={16} color="#374151" />
            <Text className="ml-1 text-gray-700">Filtrar</Text>
          </TouchableOpacity>

          <SortButton option="featured" label="Destaque" />
          <SortButton option="priceLow" label="Menor preço" />
          <SortButton option="priceHigh" label="Maior preço" />
        </View>

        {/* Indicador de resultados */}
        <Text className="text-sm text-gray-500 mb-2">
          {filteredProducts.length} produto
          {filteredProducts.length !== 1 ? "s" : ""} encontrado
          {filteredProducts.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Lista de produtos */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <View className={`${numColumns === 3 ? "w-1/3" : "w-1/2"} p-2`}>
            <TouchableOpacity
              onPress={() => onProductPress && onProductPress(item)}
              activeOpacity={0.7}
            >
              <Card className="overflow-hidden h-full border border-gray-100">
                {/* Imagem do produto */}
                <View className="aspect-square">
                  <ImagePreview
                    uri={item.imagem}
                    fallbackIcon={Package}
                    width="100%"
                    height="100%"
                    resizeMode="cover"
                  />

                  {/* Tag de promoção, se aplicável */}
                  {item.preco_promocional && (
                    <View className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded-full">
                      <Text className="text-white text-xs font-bold">
                        {calculateDiscount(item.preco, item.preco_promocional)}%
                        OFF
                      </Text>
                    </View>
                  )}
                </View>

                {/* Informações do produto */}
                <View className="p-3">
                  <Text className="font-medium line-clamp-2" numberOfLines={2}>
                    {item.nome}
                  </Text>

                  {item.descricao && (
                    <Text
                      className="text-gray-500 text-sm line-clamp-2 mt-1"
                      numberOfLines={2}
                    >
                      {item.descricao}
                    </Text>
                  )}

                  {/* Preço */}
                  <View className="mt-2">
                    {item.preco_promocional ? (
                      <>
                        <Text className="text-primary-600 font-bold">
                          {formatCurrency(item.preco_promocional)}
                        </Text>
                        <Text className="text-gray-500 text-sm line-through">
                          {formatCurrency(item.preco)}
                        </Text>
                      </>
                    ) : (
                      <Text className="text-primary-600 font-bold">
                        {formatCurrency(item.preco)}
                      </Text>
                    )}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ListEmptyComponent={
          <Card className="p-8 items-center">
            <Package size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2 text-center">
              Nenhum produto disponível
            </Text>
          </Card>
        }
      />
    </View>
  );
}
