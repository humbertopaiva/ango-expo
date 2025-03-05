// src/features/leaflets/hooks/use-leaflets.ts
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { leafletService } from "../services/leaflet.service";
import { Category, Company, Leaflet } from "../models/leaflet";

export function useLeaflets() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Buscar encartes da API
  const { data: leaflets = [], isLoading } = useQuery({
    queryKey: ["leaflets", "latest"],
    queryFn: leafletService.getLatestLeaflets,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

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

  // Extrair categorias únicas das empresas
  const categories = useMemo<Category[]>(() => {
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
  }, [leaflets, selectedCompany, selectedCategory, searchTerm]);

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
    isLoading,
  };
}
