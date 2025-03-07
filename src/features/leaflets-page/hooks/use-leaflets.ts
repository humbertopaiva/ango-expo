// src/features/leaflets/hooks/use-leaflets.ts
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { leafletService } from "../services/leaflet.service";
import { Category, Company, Leaflet } from "../models/leaflet";
import { LeafletCategory } from "../view-models/leaflets.view-model.interface";

export function useLeaflets() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  // Buscar encartes da API
  const { data: leaflets = [], isLoading: isLoadingLeaflets } = useQuery({
    queryKey: ["leaflets", "latest"],
    queryFn: leafletService.getLatestLeaflets,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Buscar categorias
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["leaflets", "categories"],
    queryFn: () => {
      // Extrair categorias únicas dos encartes
      const uniqueCategories = Array.from(
        new Set(leaflets.map((leaflet) => leaflet.empresa.categoria.slug))
      ).map((slug) => {
        const leaflet = leaflets.find((l) => l.empresa.categoria.slug === slug);
        return {
          id: leaflet?.empresa.categoria.id || "",
          nome: leaflet?.empresa.categoria.nome || "",
          slug: slug,
        };
      });
      return uniqueCategories;
    },
    enabled: leaflets.length > 0,
  });

  // Extrair empresas únicas dos encartes (código existente)
  const companies = useMemo<Company[]>(() => {
    const uniqueCompanies = Array.from(
      new Set(leaflets.map((leaflet) => leaflet.empresa.slug))
    ).map((slug) => {
      const leaflet = leaflets.find((l) => l.empresa.slug === slug);
      return {
        slug,
        nome: leaflet?.empresa.nome || "",
        logo: leaflet?.empresa.logo || "",
      };
    });
    return uniqueCompanies;
  }, [leaflets]);

  // Inicializa activeCategories com todas as categorias quando elas carregam
  useEffect(() => {
    if (categories.length > 0 && activeCategories.length === 0) {
      setActiveCategories(categories.map((cat) => cat.id));
    }
  }, [categories]);

  // Agrupar encartes por categoria
  const categorizedLeaflets = useMemo<LeafletCategory[]>(() => {
    const grouped: Record<string, LeafletCategory> = {};

    leaflets.forEach((leaflet) => {
      const category = leaflet.empresa.categoria;

      // Inicializa a categoria se ainda não existir
      if (!grouped[category.id]) {
        grouped[category.id] = {
          id: category.id,
          name: category.nome,
          slug: category.slug,
          leaflets: [],
        };
      }

      // Adiciona o encarte à categoria
      grouped[category.id].leaflets.push(leaflet);
    });

    return Object.values(grouped);
  }, [leaflets]);

  // Filtrar encartes baseado nas seleções
  const filteredLeaflets = useMemo(() => {
    let filtered = leaflets;

    // Filtrar por empresa
    if (selectedCompany) {
      filtered = filtered.filter(
        (leaflet) => leaflet.empresa.slug === selectedCompany
      );
    }

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(
        (leaflet) => leaflet.empresa.categoria.slug === selectedCategory
      );
    }

    // Filtrar por categorias ativas
    if (
      activeCategories.length > 0 &&
      activeCategories.length < categories.length
    ) {
      filtered = filtered.filter((leaflet) =>
        activeCategories.includes(leaflet.empresa.categoria.id)
      );
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (leaflet) =>
          leaflet.nome.toLowerCase().includes(term) ||
          leaflet.empresa.nome.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [
    leaflets,
    selectedCompany,
    selectedCategory,
    activeCategories,
    searchTerm,
    categories,
  ]);

  // Filtra categorizedLeaflets baseado em activeCategories
  const filteredCategorizedLeaflets = useMemo(() => {
    if (activeCategories.length === categories.length) {
      // Se todas as categorias estão ativas, aplicar apenas outros filtros
      return categorizedLeaflets
        .map((category) => ({
          ...category,
          leaflets: category.leaflets.filter((leaflet) => {
            let include = true;

            if (selectedCompany) {
              include = include && leaflet.empresa.slug === selectedCompany;
            }

            if (searchTerm) {
              const term = searchTerm.toLowerCase();
              include =
                include &&
                (leaflet.nome.toLowerCase().includes(term) ||
                  leaflet.empresa.nome.toLowerCase().includes(term));
            }

            return include;
          }),
        }))
        .filter((category) => category.leaflets.length > 0);
    } else {
      // Se apenas algumas categorias estão ativas
      return categorizedLeaflets
        .filter((category) => activeCategories.includes(category.id))
        .map((category) => ({
          ...category,
          leaflets: category.leaflets.filter((leaflet) => {
            let include = true;

            if (selectedCompany) {
              include = include && leaflet.empresa.slug === selectedCompany;
            }

            if (searchTerm) {
              const term = searchTerm.toLowerCase();
              include =
                include &&
                (leaflet.nome.toLowerCase().includes(term) ||
                  leaflet.empresa.nome.toLowerCase().includes(term));
            }

            return include;
          }),
        }))
        .filter((category) => category.leaflets.length > 0);
    }
  }, [
    categorizedLeaflets,
    activeCategories,
    categories,
    selectedCompany,
    searchTerm,
  ]);

  // Toggle uma categoria no filtro
  const toggleCategoryFilter = (categoryId: string) => {
    setActiveCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Selecionar todas as categorias
  const selectAllCategories = () => {
    setActiveCategories(categories.map((cat) => cat.id));
  };

  // Limpar filtros de categorias (nenhuma categoria selecionada)
  const clearCategoryFilters = () => {
    setActiveCategories([]);
  };

  return {
    leaflets: filteredLeaflets,
    allLeaflets: leaflets,
    companies,
    categories,
    selectedCompany,
    setSelectedCompany,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    isLoading: isLoadingLeaflets || isLoadingCategories,

    // Novos
    categorizedLeaflets: filteredCategorizedLeaflets,
    activeCategories,
    toggleCategoryFilter,
    selectAllCategories,
    clearCategoryFilters,
  };
}
