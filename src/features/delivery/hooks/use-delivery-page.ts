// Path: src/features/delivery/hooks/use-delivery-page.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const initialized = useRef(false);

  // Referência para os perfis filtrados para evitar recálculos desnecessários
  const filteredProfilesCache = useRef<DeliveryProfile[] | null>(null);
  const prevSearchQuery = useRef(searchQuery);
  const prevSelectedSubcategories = useRef(selectedSubcategories);

  // Buscar subcategorias com staleTime maior e retry melhorado
  const {
    data: subcategories = [],
    isLoading: isLoadingSubcategories,
    error: subcategoriesError,
    refetch: refetchSubcategories,
  } = useQuery({
    queryKey: ["delivery", "subcategories"],
    queryFn: deliveryService.getSubcategories,
    staleTime: 15 * 60 * 1000, // 15 minutos (aumentado para reduzir refetches)
    gcTime: 30 * 60 * 1000, // 30 minutos para garbage collection
    retry: 2, // Limite de 2 tentativas em caso de falha
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // Backoff exponencial
    // ⚠️ Importante: Evitar lazy fetch
    enabled: true,
  });

  // Buscar perfis com staleTime maior e retry melhorado
  const {
    data: profiles = [],
    isLoading: isLoadingProfiles,
    error: profilesError,
    refetch: refetchProfiles,
  } = useQuery({
    queryKey: ["delivery", "profiles"],
    queryFn: deliveryService.getProfiles,
    staleTime: 15 * 60 * 1000, // 15 minutos (aumentado para reduzir refetches)
    gcTime: 30 * 60 * 1000, // 30 minutos para garbage collection
    retry: 2, // Limite de 2 tentativas em caso de falha
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // Backoff exponencial
    // ⚠️ Importante: Evitar lazy fetch
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Função para verificar se os critérios de filtro mudaram
  const haveFilterCriteriaChanged = useCallback(() => {
    const searchQueryChanged = prevSearchQuery.current !== searchQuery;
    const selectedSubcategoriesChanged =
      prevSelectedSubcategories.current.length !==
        selectedSubcategories.length ||
      prevSelectedSubcategories.current.some(
        (cat, idx) => cat !== selectedSubcategories[idx]
      );

    return searchQueryChanged || selectedSubcategoriesChanged;
  }, [searchQuery, selectedSubcategories]);

  // Calcular perfis filtrados apenas quando necessário
  const getFilteredProfiles = useCallback(() => {
    // Se os critérios de filtro não mudaram e já temos resultados em cache, use-os
    if (!haveFilterCriteriaChanged() && filteredProfilesCache.current) {
      return filteredProfilesCache.current;
    }

    // Caso contrário, calcule novamente
    const filtered = (Array.isArray(profiles) ? profiles : [])
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

    // Atualizar cache e referências de estado
    filteredProfilesCache.current = filtered;
    prevSearchQuery.current = searchQuery;
    prevSelectedSubcategories.current = [...selectedSubcategories];

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

  // Função otimizada para refetch apenas quando realmente necessário
  const optimizedRefetch = useCallback(async () => {
    console.log("Realizando refetch otimizado");

    // Invalidar o cache local para forçar um recálculo
    filteredProfilesCache.current = null;

    // Limpar cache do serviço
    await deliveryService.clearCache();

    // Invalidar as queries no React Query para forçar o refetch
    queryClient.invalidateQueries({ queryKey: ["delivery", "profiles"] });
    queryClient.invalidateQueries({ queryKey: ["delivery", "subcategories"] });

    // Executar o refetch de todas as queries
    await Promise.all([refetchProfiles(), refetchSubcategories()]);

    return;
  }, [queryClient, refetchProfiles, refetchSubcategories]);

  // Inicializar uma vez quando o componente monta
  useEffect(() => {
    if (!initialized.current) {
      console.log(
        "Inicializando hook useDeliveryPage e executando refetch inicial"
      );
      // Forçar um refetch inicial para garantir que os dados estejam disponíveis
      optimizedRefetch();
      initialized.current = true;
    }

    // Cleanup function
    return () => {
      console.log("Desmontando hook useDeliveryPage");
      // Limpar o cache ao desmontar para evitar problemas de memória
      filteredProfilesCache.current = null;
    };
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
    isLoading: isLoadingSubcategories || isLoadingProfiles,
    refetchProfiles: optimizedRefetch,
  };
}
