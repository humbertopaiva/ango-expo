// Path: src/features/addons/hooks/use-addon-form-data.ts
import { useState, useEffect } from "react";
import { useCategories } from "@/src/features/categories/hooks/use-categories";
import { useProducts } from "@/src/features/products/hooks/use-products";
import { Category } from "@/src/features/categories/models/category";
import { Product } from "@/src/features/products/models/product";

/**
 * Hook para gerenciar dados do formulário de adicionais
 */
export function useAddonFormData(
  initialCategories: number[] = [],
  initialProducts: string[] = []
) {
  // Estados para os dados selecionados
  const [selectedCategoryIds, setSelectedCategoryIds] =
    useState<number[]>(initialCategories);
  const [selectedProductIds, setSelectedProductIds] =
    useState<string[]>(initialProducts);

  // Estados para pesquisa
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");

  // Buscar categorias e produtos
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { products, isLoading: isProductsLoading } = useProducts();

  // Aplicar filtros de pesquisa
  const filteredCategories = categories.filter((category) =>
    category.nome.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    product.nome.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  // Funções para manipular seleção
  const toggleCategorySelection = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Selecionar múltiplos itens
  const selectMultipleCategories = (categoryIds: number[]) => {
    setSelectedCategoryIds(categoryIds);
  };

  const selectMultipleProducts = (productIds: string[]) => {
    setSelectedProductIds(productIds);
  };

  // Limpar seleções
  const clearSelections = () => {
    setSelectedCategoryIds([]);
    setSelectedProductIds([]);
  };

  return {
    // Dados
    categories,
    products,
    filteredCategories,
    filteredProducts,
    selectedCategoryIds,
    selectedProductIds,

    // Estados de carregamento
    isCategoriesLoading,
    isProductsLoading,

    // Termos de pesquisa
    categorySearchTerm,
    productSearchTerm,
    setCategorySearchTerm,
    setProductSearchTerm,

    // Ações
    toggleCategorySelection,
    toggleProductSelection,
    selectMultipleCategories,
    selectMultipleProducts,
    clearSelections,

    // Helpers
    getSelectedCategories: () =>
      categories.filter((c) => selectedCategoryIds.includes(Number(c.id))),
    getSelectedProducts: () =>
      products.filter((p) => selectedProductIds.includes(p.id)),
  };
}
