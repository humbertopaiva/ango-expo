// Path: src/features/company-page/view-models/products-by-category.view-model.ts
import { useEffect, useState, useMemo } from "react";
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

// Constante para a categoria "Todos"
export const ALL_CATEGORIES = "Todos";

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    ALL_CATEGORIES
  );
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
        return sorted.sort((a, b) => {
          // Se ambos tiverem variação, manter a ordem original
          if (a.tem_variacao && b.tem_variacao) return 0;
          // Se apenas a tem variação, considerar b como menor
          if (a.tem_variacao) return 1;
          // Se apenas b tem variação, considerar a como menor
          if (b.tem_variacao) return -1;

          // Caso contrário, ordenar por preço
          return (
            parseFloat(a.preco_promocional || a.preco || "0") -
            parseFloat(b.preco_promocional || b.preco || "0")
          );
        });
      case "price_desc":
        return sorted.sort((a, b) => {
          // Se ambos tiverem variação, manter a ordem original
          if (a.tem_variacao && b.tem_variacao) return 0;
          // Se apenas a tem variação, considerar b como maior
          if (a.tem_variacao) return 1;
          // Se apenas b tem variação, considerar a como maior
          if (b.tem_variacao) return -1;

          // Caso contrário, ordenar por preço
          return (
            parseFloat(b.preco_promocional || b.preco || "0") -
            parseFloat(a.preco_promocional || a.preco || "0")
          );
        });
      case "name_asc":
        return sorted.sort((a, b) => a.nome.localeCompare(b.nome));
      case "relevance":
      default:
        return sorted;
    }
  };

  // Todos os produtos ordenados (para a categoria "Todos")
  const allSortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return sortProducts([...products], activeSort);
  }, [products, activeSort]);

  // Agrupar produtos por categoria
  useEffect(() => {
    if (!products || products.length === 0) return;

    const grouped: ProductsByCategory = {
      [ALL_CATEGORIES]: allSortedProducts, // Adiciona opção "Todos"
    };

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
      if (category !== ALL_CATEGORIES) {
        // Pulamos "Todos" pois já foi ordenado
        grouped[category] = sortProducts(grouped[category], activeSort);
      }
    });

    setCategoryProducts(grouped);
  }, [products, activeSort, allSortedProducts]);

  // Filtrar categorias baseado na pesquisa e categoria selecionada
  const getFilteredCategories = (): ProductsByCategory => {
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

      // Se estamos na categoria "Todos", mostrar resultados agrupados por categoria
      if (selectedCategory === ALL_CATEGORIES || !selectedCategory) {
        // Adicionar categoria "Todos" com todos os produtos filtrados
        filtered[ALL_CATEGORIES] = sortProducts(filteredProducts, activeSort);

        // Agrupar por categorias reais
        filteredProducts.forEach((product) => {
          const category = product.categoria?.nome || "Outros";

          if (!filtered[category]) {
            filtered[category] = [];
          }

          filtered[category].push(product);
        });

        // Ordenar produtos de cada categoria
        Object.keys(filtered).forEach((category) => {
          if (category !== ALL_CATEGORIES) {
            filtered[category] = sortProducts(filtered[category], activeSort);
          }
        });
      } else {
        // Se uma categoria específica está selecionada, filtrar apenas por ela
        const categoryProducts = filteredProducts.filter(
          (product) =>
            (product.categoria?.nome || "Outros") === selectedCategory
        );

        if (categoryProducts.length > 0) {
          filtered[selectedCategory] = sortProducts(
            categoryProducts,
            activeSort
          );
        }
      }

      return filtered;
    }

    // Sem pesquisa de texto, apenas filtrar por categoria selecionada
    if (selectedCategory === ALL_CATEGORIES) {
      // Mostrar todas as categorias quando "Todos" está selecionado
      return categoryProducts;
    } else if (selectedCategory) {
      // Mostrar apenas a categoria selecionada
      return selectedCategory in categoryProducts
        ? { [selectedCategory]: categoryProducts[selectedCategory] }
        : {};
    }

    return categoryProducts;
  };

  const filteredCategories = getFilteredCategories();

  // Ordenar categorias para que "Todos" sempre seja o primeiro
  const categoryNames = useMemo(() => {
    const names = Object.keys(categoryProducts);
    if (names.includes(ALL_CATEGORIES)) {
      return [
        ALL_CATEGORIES,
        ...names.filter((name) => name !== ALL_CATEGORIES),
      ];
    }
    return names;
  }, [categoryProducts]);

  const totalProductCount = Object.entries(filteredCategories)
    .filter(([category]) => category !== ALL_CATEGORIES)
    .reduce((sum, [_, products]) => sum + products.length, 0);

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
