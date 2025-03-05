// src/features/delivery/hooks/use-delivery-page.ts
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { deliveryService } from "../services/delivery.service";
import _ from "lodash";

export function useDeliveryPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );

  // Busca perfis de delivery com tratamento de erros
  const { data: profiles = [], isLoading: isLoadingProfiles } = useQuery({
    queryKey: ["delivery-profiles"],
    queryFn: async () => {
      try {
        return await deliveryService.getDeliveryProfiles();
      } catch (error) {
        console.error("Erro ao buscar perfis de delivery:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Busca subcategorias com tratamento de erros
  const { data: subcategories = [], isLoading: isLoadingSubcategories } =
    useQuery({
      queryKey: ["delivery-subcategories"],
      queryFn: async () => {
        try {
          return await deliveryService.getDeliverySubcategories();
        } catch (error) {
          console.error("Erro ao buscar subcategorias:", error);
          return [];
        }
      },
      staleTime: 5 * 60 * 1000,
      retry: 1,
    });

  // Busca produtos com tratamento de erros
  const { data: showcaseProducts = [], isLoading: isLoadingShowcase } =
    useQuery({
      queryKey: ["delivery-showcase"],
      queryFn: async () => {
        try {
          return await deliveryService.getDeliveryShowcase();
        } catch (error) {
          console.error("Erro ao buscar produtos em destaque:", error);
          return [];
        }
      },
      staleTime: 5 * 60 * 1000,
      retry: 1,
    });

  // Filtra os estabelecimentos baseado na subcategoria selecionada com validação
  const filteredProfiles = useMemo(() => {
    try {
      if (!Array.isArray(profiles) || profiles.length === 0) return [];
      if (!selectedSubcategory) return profiles;

      return profiles.filter((profile) => {
        if (
          !profile ||
          !profile.empresa ||
          !Array.isArray(profile.empresa.subcategorias)
        ) {
          return false;
        }

        return profile.empresa.subcategorias
          .filter(
            (sub) =>
              sub &&
              sub.subcategorias_empresas_id &&
              sub.subcategorias_empresas_id.slug !== "delivery"
          )
          .some(
            (sub) =>
              sub &&
              sub.subcategorias_empresas_id &&
              sub.subcategorias_empresas_id.slug === selectedSubcategory
          );
      });
    } catch (error) {
      console.error("Erro ao filtrar perfis:", error);
      return [];
    }
  }, [profiles, selectedSubcategory]);

  // Agrupa produtos por empresa com validação
  const groupedShowcaseProducts = useMemo(() => {
    try {
      if (
        !Array.isArray(filteredProfiles) ||
        !Array.isArray(showcaseProducts) ||
        filteredProfiles.length === 0 ||
        showcaseProducts.length === 0
      ) {
        return {};
      }

      const filteredCompanySlugs = filteredProfiles
        .filter((profile) => profile && profile.empresa && profile.empresa.slug)
        .map((profile) => profile.empresa.slug);

      if (filteredCompanySlugs.length === 0) return {};

      const filteredProducts = showcaseProducts.filter(
        (product) =>
          product &&
          product.empresa &&
          product.empresa.slug &&
          filteredCompanySlugs.includes(product.empresa.slug)
      );

      return _.groupBy(filteredProducts, "empresa.slug");
    } catch (error) {
      console.error("Erro ao agrupar produtos:", error);
      return {};
    }
  }, [showcaseProducts, filteredProfiles]);

  return {
    profiles: filteredProfiles || [],
    subcategories: subcategories || [],
    selectedSubcategory,
    setSelectedSubcategory,
    showcaseProducts: groupedShowcaseProducts || {},
    isLoading: isLoadingProfiles || isLoadingSubcategories || isLoadingShowcase,
  };
}
