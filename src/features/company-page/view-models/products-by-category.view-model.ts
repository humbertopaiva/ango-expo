// Path: src/features/company-page/view-models/products-by-category.view-model.ts
import { useEffect, useState } from "react";
import { CompanyProduct } from "../models/company-product";

// Interface para produtos agrupados por categoria
export interface ProductsByCategory {
  [category: string]: CompanyProduct[];
}

// Interface para ordenação
export interface SortOption {
  id: string;
  label: string;
}

export interface UseProductsViewModel {
  categoryProducts: ProductsByCategory;
  filteredCategories: ProductsByCategory;
  categoryNames: string[];
  totalProductCount: number;
  activeSort: string;
  selectedCategory: string | null;
  searchText: string;

  // Ações
  setSearchText: (text: string) => void;
  setActiveSort: (sortOption: string) => void;
  setSelectedCategory: (category: string | null) => void;

  // Helpers
  sortProducts: (
    products: CompanyProduct[],
    sortOption: string
  ) => CompanyProduct[];
  getSortOptions: () => SortOption[];
}

export const useProductsViewModel = (
  products: CompanyProduct[] | undefined | null,
  initialSort: string = "relevance"
): UseProductsViewModel => {
  const [categoryProducts, setCategoryProducts] = useState<ProductsByCategory>(
    {}
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<string>(initialSort);
  const [searchText, setSearchText] = useState<string>("");

  // Opções de ordenação
  const sortOptions: SortOption[] = [
    { id: "relevance", label: "Relevância" },
    { id: "price_asc", label: "Menor preço" },
    { id: "price_desc", label: "Maior preço" },
    { id: "name_asc", label: "A-Z" },
  ];

  // Ordenar produtos
  const sortProducts = (
    products: CompanyProduct[],
    sortOption: string
  ): CompanyProduct[] => {
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

  // Agrupar produtos por categoria
  useEffect(() => {
    if (!products || products.length === 0) return;

    const grouped: ProductsByCategory = {};

    products.forEach((product) => {
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

    // Selecionar a primeira categoria por padrão, se não houver seleção
    if (!selectedCategory && Object.keys(grouped).length > 0) {
      setSelectedCategory(Object.keys(grouped)[0]);
    }
  }, [products, activeSort]);

  // Filtrar categorias baseado na pesquisa e categoria selecionada
  const getFilteredCategories = (): ProductsByCategory => {
    if (!searchText && !selectedCategory) {
      return categoryProducts;
    }

    // Se há termos de pesquisa, filtrar produtos primeiro
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      const filteredProducts =
        products?.filter(
          (product) =>
            product.nome.toLowerCase().includes(searchLower) ||
            (product.descricao &&
              product.descricao.toLowerCase().includes(searchLower))
        ) || [];

      if (filteredProducts.length === 0) {
        return {};
      }

      const filtered: ProductsByCategory = {};

      filteredProducts.forEach((product) => {
        const category = product.categoria?.nome || "Outros";

        if (!filtered[category]) {
          filtered[category] = [];
        }

        filtered[category].push(product);
      });

      // Ordenar produtos filtrados
      Object.keys(filtered).forEach((category) => {
        filtered[category] = sortProducts(filtered[category], activeSort);
      });

      // Se também há um filtro de categoria, filtrar ainda mais
      if (selectedCategory) {
        return selectedCategory in filtered
          ? { [selectedCategory]: filtered[selectedCategory] }
          : {};
      }

      return filtered;
    }

    // Se só temos filtro de categoria, exibir apenas a categoria selecionada
    if (selectedCategory) {
      return selectedCategory in categoryProducts
        ? { [selectedCategory]: categoryProducts[selectedCategory] }
        : {};
    }

    return categoryProducts;
  };

  const filteredCategories = getFilteredCategories();
  const categoryNames = Object.keys(categoryProducts);
  const totalProductCount = Object.values(filteredCategories).flat().length;

  return {
    categoryProducts,
    filteredCategories,
    categoryNames,
    totalProductCount,
    activeSort,
    selectedCategory,
    searchText,

    setSearchText,
    setActiveSort,
    setSelectedCategory,

    sortProducts,
    getSortOptions: () => sortOptions,
  };
};
