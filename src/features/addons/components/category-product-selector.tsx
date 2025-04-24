// Path: src/features/addons/components/category-product-selector.tsx
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useCategories } from "@/src/features/categories/hooks/use-categories";
import { useProducts } from "@/src/features/products/hooks/use-products";
import {
  Box,
  CheckIcon,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@gluestack-ui/themed";
import { SectionCard } from "@/components/custom/section-card";

interface CategoryProductSelectorProps {
  selectedCategories: number[];
  selectedProducts: string[];
  onCategoriesChange: (categoryIds: number[]) => void;
  onProductsChange: (productIds: string[]) => void;
}

export function CategoryProductSelector({
  selectedCategories,
  selectedProducts,
  onCategoriesChange,
  onProductsChange,
}: CategoryProductSelectorProps) {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { products, isLoading: productsLoading } = useProducts();

  // Filter products by selected categories
  const filteredProducts = React.useMemo(() => {
    if (selectedCategories.length === 0) return products;

    return products.filter((product) => {
      if (typeof product.categoria === "object") {
        return (
          product.categoria && selectedCategories.includes(product.categoria.id)
        );
      }
      return selectedCategories.includes(product.categoria);
    });
  }, [products, selectedCategories]);

  // Handle category selection
  const toggleCategory = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoriesChange(selectedCategories.filter((id) => id !== categoryId));
    } else {
      onCategoriesChange([...selectedCategories, categoryId]);
    }
  };

  // Handle product selection
  const toggleProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      onProductsChange(selectedProducts.filter((id) => id !== productId));
    } else {
      onProductsChange([...selectedProducts, productId]);
    }
  };

  return (
    <View className="space-y-6">
      {/* Seleção de Categorias */}
      <SectionCard title="Categorias">
        <ScrollView className="max-h-48">
          {categoriesLoading ? (
            <Text className="text-gray-500 py-2">Carregando categorias...</Text>
          ) : categories.length === 0 ? (
            <Text className="text-gray-500 py-2">
              Nenhuma categoria encontrada
            </Text>
          ) : (
            categories.map((category) => (
              <View
                key={category.id.toString()}
                className="py-2 border-b border-gray-100"
              >
                <Checkbox
                  value={category.id.toString()}
                  isChecked={selectedCategories.includes(Number(category.id))}
                  onChange={() => toggleCategory(Number(category.id))}
                  size="md"
                >
                  <CheckboxIndicator mr="$2">
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>{category.nome}</CheckboxLabel>
                </Checkbox>
              </View>
            ))
          )}
        </ScrollView>
      </SectionCard>

      {/* Seleção de Produtos */}
      <SectionCard title="Produtos">
        <ScrollView className="max-h-60">
          {productsLoading ? (
            <Text className="text-gray-500 py-2">Carregando produtos...</Text>
          ) : filteredProducts.length === 0 ? (
            <Text className="text-gray-500 py-2">
              {selectedCategories.length > 0
                ? "Nenhum produto encontrado nas categorias selecionadas"
                : "Nenhum produto encontrado"}
            </Text>
          ) : (
            filteredProducts.map((product) => (
              <View key={product.id} className="py-2 border-b border-gray-100">
                <Checkbox
                  value={product.id}
                  isChecked={selectedProducts.includes(product.id)}
                  onChange={() => toggleProduct(product.id)}
                  size="md"
                >
                  <CheckboxIndicator mr="$2">
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>{product.nome}</CheckboxLabel>
                </Checkbox>
              </View>
            ))
          )}
        </ScrollView>
      </SectionCard>
    </View>
  );
}
