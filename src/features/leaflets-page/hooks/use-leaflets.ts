// src/features/leaflets/hooks/use-leaflets.ts
import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { leafletService } from "../services/leaflet.service";
import { Category, Company, Leaflet } from "../models/leaflet";
import { LeafletCategory } from "../view-models/leaflets.view-model.interface";

export function useLeaflets() {
  // Estados
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

  // Extrair categorias únicas dos encartes
  const categories = useMemo<Category[]>(() => {
    const uniqueCategories = Array.from(
      new Set(leaflets.map((leaflet) => leaflet.empresa.categoria.id))
    ).map((id) => {
      const leaflet = leaflets.find((l) => l.empresa.categoria.id === id);
      return {
        id: id,
        nome: leaflet?.empresa.categoria.nome || "",
        slug: leaflet?.empresa.categoria.slug || "",
      };
    });
    return uniqueCategories;
  }, [leaflets]);

  // Extrair empresas únicas dos encartes
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

  // Determinar se todas as categorias estão selecionadas
  const allCategoriesSelected = useMemo(() => {
    return (
      activeCategories.length === categories.length &&
      categories.every((cat) => activeCategories.includes(cat.id))
    );
  }, [activeCategories, categories]);

  // Inicializa activeCategories quando as categorias carregam
  useEffect(() => {
    if (categories.length > 0 && activeCategories.length === 0) {
      setActiveCategories(categories.map((cat) => cat.id));
    }
  }, [categories]);

  // Toggle uma única categoria
  const toggleCategoryFilter = useCallback(
    (categoryId: string) => {
      // Caso 1: Todas categorias estão selecionadas (estado "Todas")
      if (allCategoriesSelected) {
        // Seleciona apenas a categoria clicada
        setActiveCategories([categoryId]);
      }
      // Caso 2: A categoria clicada já está selecionada
      else if (activeCategories.includes(categoryId)) {
        // Se é a única categoria selecionada, não faz nada
        if (activeCategories.length === 1) {
          return;
        }
        // Se há mais de uma, remove esta
        setActiveCategories((prev) => prev.filter((id) => id !== categoryId));
      }
      // Caso 3: Mudando de uma categoria individual para outra
      else if (activeCategories.length === 1) {
        // Substitui a categoria atual pela nova (troca direta)
        setActiveCategories([categoryId]);
      }
      // Caso 4: Adicionando mais uma categoria à seleção
      else {
        setActiveCategories((prev) => [...prev, categoryId]);

        // Verifica se após adicionar estamos com todas selecionadas
        const newActiveCategories = [...activeCategories, categoryId];
        if (newActiveCategories.length === categories.length) {
          // Força a atualização para o estado "Todas"
          setActiveCategories(categories.map((cat) => cat.id));
        }
      }
    },
    [activeCategories, allCategoriesSelected, categories]
  );

  // Selecionar todas as categorias
  const selectAllCategories = useCallback(() => {
    setActiveCategories(categories.map((cat) => cat.id));
  }, [categories]);

  // Limpar filtros de categorias (seleciona apenas a primeira)
  const clearCategoryFilters = useCallback(() => {
    if (categories.length > 0) {
      setActiveCategories([categories[0].id]);
    } else {
      setActiveCategories([]);
    }
  }, [categories]);

  // Agrupar encartes por categoria e aplicar filtros
  const categorizedLeaflets = useMemo(() => {
    const grouped: Record<string, LeafletCategory> = {};

    // Primeiro filtramos as categorias ativas
    for (const category of categories) {
      if (activeCategories.includes(category.id)) {
        grouped[category.id] = {
          id: category.id,
          name: category.nome,
          slug: category.slug,
          leaflets: [],
        };
      }
    }

    // Depois preenchemos com os encartes filtrados
    for (const leaflet of leaflets) {
      const categoryId = leaflet.empresa.categoria.id;

      if (activeCategories.includes(categoryId) && grouped[categoryId]) {
        // Aplicar filtros adicionais
        if (selectedCompany && leaflet.empresa.slug !== selectedCompany)
          continue;

        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          if (
            !leaflet.nome.toLowerCase().includes(term) &&
            !leaflet.empresa.nome.toLowerCase().includes(term)
          ) {
            continue;
          }
        }

        // Adicionar à categoria
        grouped[categoryId].leaflets.push(leaflet);
      }
    }

    // Retornar apenas categorias com encartes
    return Object.values(grouped).filter(
      (category) => category.leaflets.length > 0
    );
  }, [categories, activeCategories, leaflets, selectedCompany, searchTerm]);

  return {
    leaflets,
    allLeaflets: leaflets,
    companies,
    categories,
    selectedCompany,
    setSelectedCompany,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    isLoading: isLoadingLeaflets,
    categorizedLeaflets,
    activeCategories,
    allCategoriesSelected,
    toggleCategoryFilter,
    selectAllCategories,
    clearCategoryFilters,
  };
}
