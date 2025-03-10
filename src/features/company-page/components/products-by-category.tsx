// Path: src/features/company-page/components/products-by-category.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Search } from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { Input, InputField, InputIcon, InputSlot } from "@gluestack-ui/themed";
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
  const isDeliveryPlan =
    vm.profile?.empresa.plano?.nome?.toLowerCase() === "delivery";

  // Agrupar produtos por categoria
  useEffect(() => {
    if (!vm.products || vm.products.length === 0) return;

    const grouped: ProductsByCategory = {};

    vm.products.forEach((product) => {
      // Usar categoria do produto ou "Sem categoria" se não tiver
      const category = product.categoria?.nome || "Outros";

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push(product);
    });

    setCategoryProducts(grouped);
  }, [vm.products]);

  // Filtrar produtos por texto de pesquisa
  useEffect(() => {
    if (!vm.products || vm.products.length === 0 || !searchText.trim()) return;

    const searchLower = searchText.toLowerCase();

    // Se tiver texto de pesquisa, filtra todos os produtos
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

      setCategoryProducts(filtered);
    } else {
      // Se não encontrou nada, mostra objeto vazio
      setCategoryProducts({});
    }
  }, [searchText, vm.products]);

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

  const hasCategories = Object.keys(categoryProducts).length > 0;

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
      </View>

      {/* Mensagem de nenhum produto encontrado */}
      {!hasCategories && (
        <View className="px-4">
          <View className="bg-gray-50 p-4 rounded-lg items-center">
            <Text className="text-gray-500 text-center">
              {searchText
                ? "Nenhum produto encontrado com esse termo"
                : "Nenhum produto disponível"}
            </Text>
            {searchText ? (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Text className="text-primary-600 mt-2">Limpar busca</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      )}

      {/* Listas de produtos por categoria */}
      {hasCategories &&
        Object.entries(categoryProducts).map(([category, products]) => (
          <CategoryProductsList
            key={`category-${category}`}
            title={category}
            products={products}
            // No delivery, expandimos apenas a primeira categoria por padrão
            expanded={
              !isDeliveryPlan || Object.keys(categoryProducts)[0] === category
            }
          />
        ))}
    </View>
  );
}
