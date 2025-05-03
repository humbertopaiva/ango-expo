// Path: src/features/delivery/hooks/use-delivery-page.ts
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deliveryService,
  DELIVERY_PROFILES_CACHE_KEY,
  DELIVERY_SUBCATEGORIES_CACHE_KEY,
} from "../services/delivery.service";
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
  const queryClient = useQueryClient();

  // Buscar subcategorias com configurações melhoradas
  const {
    data: subcategories = [],
    isLoading: isLoadingSubcategories,
    error: subcategoriesError,
    refetch: refetchSubcategories,
  } = useQuery({
    queryKey: [DELIVERY_SUBCATEGORIES_CACHE_KEY],
    queryFn: deliveryService.getSubcategories,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    enabled: true, // Sempre habilitado
  });

  // Buscar perfis com configurações melhoradas
  const {
    data: profiles = [],
    isLoading: isLoadingProfiles,
    error: profilesError,
    refetch: refetchProfiles,
  } = useQuery({
    queryKey: [DELIVERY_PROFILES_CACHE_KEY],
    queryFn: deliveryService.getProfiles,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    enabled: true, // Sempre habilitado
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Calcular perfis filtrados
  const getFilteredProfiles = useCallback(() => {
    // Se não houver perfis, retorne uma lista vazia
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
      console.log("Nenhum perfil disponível para filtrar");
      return [];
    }

    // Função para filtrar perfis
    const filtered = profiles
      .filter((profile) => {
        try {
          // Verificações de segurança
          if (!profile || typeof profile !== "object") return false;

          // Verificar se nome existe e é uma string
          const profileName = profile.nome || "";
          const matchesSearch =
            typeof profileName === "string" &&
            profileName
              .toLowerCase()
              .includes((searchQuery || "").toLowerCase());

          // Verificar subcategorias com segurança
          const matchesSubcategories =
            selectedSubcategories.length === 0 ||
            (profile.empresa &&
              profile.empresa.subcategorias &&
              Array.isArray(profile.empresa.subcategorias) &&
              profile.empresa.subcategorias.some(
                (sub: any) =>
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
          console.error("Error filtering profile:", error);
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

    return filtered;
  }, [profiles, searchQuery, selectedSubcategories]);

  // Calcular perfis filtrados
  const filteredProfiles = getFilteredProfiles();

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

  // Função otimizada para refresh
  const optimizedRefetch = useCallback(async () => {
    console.log("Realizando refetch otimizado");

    // Invalidar as queries no React Query para forçar o refetch
    queryClient.invalidateQueries({ queryKey: [DELIVERY_PROFILES_CACHE_KEY] });
    queryClient.invalidateQueries({
      queryKey: [DELIVERY_SUBCATEGORIES_CACHE_KEY],
    });

    // Executar o refetch de todas as queries
    await Promise.all([refetchProfiles(), refetchSubcategories()]);

    return;
  }, [queryClient, refetchProfiles, refetchSubcategories]);

  // Calcular empresas abertas
  const openCompanies = useMemo(() => {
    return filteredProfiles.filter((profile) => checkIfOpen(profile));
  }, [filteredProfiles]);

  // Realizar refetch inicial automaticamente quando o hook montar
  useEffect(() => {
    // Força um refetch inicial para garantir dados atuais
    optimizedRefetch();
  }, [optimizedRefetch]);

  return {
    searchQuery,
    setSearchQuery,
    selectedSubcategories,
    toggleSubcategory,
    setSelectedSubcategory,
    subcategories: Array.isArray(subcategories) ? subcategories : [],
    profiles: Array.isArray(profiles) ? profiles : [],
    filteredProfiles,
    openCompanies,
    isLoading: isLoadingSubcategories || isLoadingProfiles,
    refetchProfiles: optimizedRefetch,
  };
}
