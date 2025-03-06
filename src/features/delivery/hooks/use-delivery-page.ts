// Path: src/features/delivery/hooks/use-delivery.ts
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { deliveryService } from "../services/delivery.service";
import { DeliveryProfile } from "../models/delivery-profile";

// Utilidade para verificar se o estabelecimento está aberto
export const checkIfOpen = (profile: DeliveryProfile): boolean => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentTime = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const days = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];

  const currentDay = days[dayOfWeek];

  if (!profile.dias_funcionamento.includes(currentDay)) {
    return false;
  }

  const opening = profile[`abertura_${currentDay}` as keyof typeof profile];
  const closing = profile[`fechamento_${currentDay}` as keyof typeof profile];

  return Boolean(
    opening && closing && currentTime >= opening && currentTime <= closing
  );
};

export function useDeliveryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );

  const { data: subcategories = [], isLoading: isLoadingSubcategories } =
    useQuery({
      queryKey: ["delivery", "subcategories"],
      queryFn: deliveryService.getSubcategories,
    });

  const {
    data: profiles = [],
    isLoading: isLoadingProfiles,
    refetch: refetchProfiles,
  } = useQuery({
    queryKey: ["delivery", "profiles"],
    queryFn: deliveryService.getProfiles,
  });

  // Filtrar perfis com base na pesquisa e subcategorias selecionadas
  const filteredProfiles = profiles
    .filter((profile) => {
      const matchesSearch = profile.nome
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesSubcategories =
        selectedSubcategories.length === 0 ||
        profile.empresa.subcategorias.some((sub) =>
          selectedSubcategories.includes(sub.subcategorias_empresas_id.slug)
        );

      return matchesSearch && matchesSubcategories;
    })
    .sort((a, b) => {
      // Estabelecimentos abertos aparecem primeiro
      const isOpenA = checkIfOpen(a);
      const isOpenB = checkIfOpen(b);

      if (isOpenA && !isOpenB) return -1;
      if (!isOpenA && isOpenB) return 1;
      return 0;
    });

  const toggleSubcategory = (slug: string | null) => {
    if (slug === null) {
      setSelectedSubcategories([]);
    } else {
      setSelectedSubcategories((prev) =>
        prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
      );
    }
  };

  const setSelectedSubcategory = (slug: string | null) => {
    setSelectedSubcategories(slug ? [slug] : []);
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedSubcategories,
    toggleSubcategory,
    setSelectedSubcategory,
    subcategories,
    profiles,
    filteredProfiles,
    isLoading: isLoadingSubcategories || isLoadingProfiles,
    refetchProfiles,
  };
}
