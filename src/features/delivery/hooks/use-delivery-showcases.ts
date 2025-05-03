// Path: src/features/delivery/hooks/use-delivery-showcases.ts
import { useQuery } from "@tanstack/react-query";
import {
  deliveryShowcaseService,
  DELIVERY_SHOWCASE_CACHE_KEY,
} from "../services/delivery-showcase.service";
import { DeliveryProfile } from "../models/delivery-profile";
import { DeliveryShowcaseItem } from "../models/delivery-showcase-item";
import { CompanyWithShowcase } from "../models/company-with-showcase";
import { useCallback, useMemo } from "react";

export function useDeliveryShowcases(profiles: DeliveryProfile[]) {
  // Extrair slugs das empresas
  const companySlugs = useMemo(
    () =>
      profiles
        .filter((profile) => profile.empresa && profile.empresa.slug)
        .map((profile) => profile.empresa.slug),
    [profiles]
  );

  // Buscar vitrines para múltiplas empresas usando slugs
  const { data: showcases = {}, isLoading } = useQuery({
    queryKey: [DELIVERY_SHOWCASE_CACHE_KEY, companySlugs],
    queryFn: () => deliveryShowcaseService.getMultipleShowcases(companySlugs),
    enabled: companySlugs.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2,
    refetchOnWindowFocus: true,
  });

  // Função para obter itens de vitrine por slug
  const getShowcaseItemsBySlug = useCallback(
    (slug: string): DeliveryShowcaseItem[] => {
      return showcases[slug] || [];
    },
    [showcases]
  );

  // Verifica quais empresas têm vitrines disponíveis
  const companiesWithShowcases = useMemo(() => {
    return profiles.filter((profile) => {
      return (
        profile.empresa?.slug &&
        showcases[profile.empresa.slug] &&
        showcases[profile.empresa.slug].length > 0
      );
    });
  }, [profiles, showcases]);

  // Mapeia empresas com suas vitrines
  const companiesWithShowcaseMapped = useMemo(() => {
    return companiesWithShowcases.map((profile) => ({
      ...profile,
      showcaseItems: showcases[profile.empresa.slug] || [],
    })) as CompanyWithShowcase[];
  }, [companiesWithShowcases, showcases]);

  return {
    showcases,
    isLoading,
    getShowcaseItemsBySlug,
    companiesWithShowcases,
    companiesWithShowcaseMapped,
  };
}
