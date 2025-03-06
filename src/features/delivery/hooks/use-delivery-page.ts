// Path: src/features/delivery/hooks/use-delivery.ts
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { deliveryService } from "../services/delivery.service";
import { DeliveryProfile } from "../models/delivery-profile";

// Utilidade para verificar se o estabelecimento está aberto
export const checkIfOpen = (profile: DeliveryProfile): boolean => {
  try {
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

    // Verificação de segurança para dias_funcionamento
    if (
      !profile.dias_funcionamento ||
      !Array.isArray(profile.dias_funcionamento) ||
      !profile.dias_funcionamento.includes(currentDay)
    ) {
      return false;
    }

    const openingKey = `abertura_${currentDay}` as keyof typeof profile;
    const closingKey = `fechamento_${currentDay}` as keyof typeof profile;

    const opening = profile[openingKey];
    const closing = profile[closingKey];

    return Boolean(
      opening &&
        closing &&
        currentTime >= String(opening) &&
        currentTime <= String(closing)
    );
  } catch (error) {
    console.error("Error checking if open:", error);
    return false; // Em caso de erro, considera fechado
  }
};

export function useDeliveryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );

  // Buscar subcategorias com staleTime adequado
  const {
    data: subcategories = [],
    isLoading: isLoadingSubcategories,
    error: subcategoriesError,
  } = useQuery({
    queryKey: ["delivery", "subcategories"],
    queryFn: deliveryService.getSubcategories,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Buscar perfis com staleTime adequado
  const {
    data: profiles = [],
    isLoading: isLoadingProfiles,
    error: profilesError,
    refetch: refetchProfiles,
  } = useQuery({
    queryKey: ["delivery", "profiles"],
    queryFn: deliveryService.getProfiles,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Log para depuração
  useEffect(() => {
    console.log("useDelivery hook initialized");

    if (subcategoriesError) {
      console.error("Error fetching subcategories:", subcategoriesError);
    }

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    }

    return () => {
      console.log("useDelivery hook cleanup");
    };
  }, [subcategoriesError, profilesError]);

  // Memoize filteredProfiles para evitar recálculos desnecessários
  const filteredProfiles = (Array.isArray(profiles) ? profiles : [])
    .filter((profile) => {
      try {
        // Verificações de segurança
        if (!profile || typeof profile !== "object") return false;

        // Verificar se nome existe e é uma string
        const profileName = profile.nome || "";
        const matchesSearch =
          typeof profileName === "string" &&
          profileName.toLowerCase().includes((searchQuery || "").toLowerCase());

        // Verificar subcategorias com segurança
        const matchesSubcategories =
          selectedSubcategories.length === 0 ||
          (profile.empresa &&
            profile.empresa.subcategorias &&
            Array.isArray(profile.empresa.subcategorias) &&
            profile.empresa.subcategorias.some(
              (sub) =>
                sub &&
                sub.subcategorias_empresas_id &&
                typeof sub.subcategorias_empresas_id === "object" &&
                sub.subcategorias_empresas_id.slug &&
                selectedSubcategories.includes(
                  sub.subcategorias_empresas_id.slug
                )
            ));

        return matchesSearch && matchesSubcategories;
      } catch (error) {
        console.error("Error filtering profile:", error, profile);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        // Estabelecimentos abertos aparecem primeiro
        const isOpenA = checkIfOpen(a);
        const isOpenB = checkIfOpen(b);

        if (isOpenA && !isOpenB) return -1;
        if (!isOpenA && isOpenB) return 1;
        return 0;
      } catch (error) {
        console.error("Error sorting profiles:", error);
        return 0;
      }
    });

  // Use useCallback para funções que são passadas como props
  const toggleSubcategory = useCallback((slug: string | null) => {
    if (slug === null) {
      setSelectedSubcategories([]);
    } else {
      setSelectedSubcategories((prev) =>
        prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
      );
    }
  }, []);

  const setSelectedSubcategory = useCallback((slug: string | null) => {
    setSelectedSubcategories(slug ? [slug] : []);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    selectedSubcategories,
    toggleSubcategory,
    setSelectedSubcategory,
    subcategories: Array.isArray(subcategories) ? subcategories : [],
    profiles: Array.isArray(profiles) ? profiles : [],
    filteredProfiles,
    isLoading: isLoadingSubcategories || isLoadingProfiles,
    refetchProfiles,
  };
}
