// Path: src/features/delivery/hooks/use-delivery-showcases.ts
import { useQuery } from "@tanstack/react-query";
import { deliveryShowcaseService } from "../services/delivery-showcase.service";
import { DeliveryProfile } from "../models/delivery-profile";
import { DeliveryShowcaseItem } from "../models/delivery-showcase-item";
import { CompanyWithShowcase } from "../models/company-with-showcase";

export function useDeliveryShowcases(profiles: DeliveryProfile[]) {
  // Extrair slugs das empresas (em vez de IDs)
  const companySlugs = profiles
    .filter((profile) => profile.empresa && profile.empresa.slug)
    .map((profile) => profile.empresa.slug);

  // Buscar vitrines para múltiplas empresas usando slugs
  const { data: showcases = {}, isLoading } = useQuery({
    queryKey: ["delivery", "showcases", companySlugs],
    queryFn: () => deliveryShowcaseService.getMultipleShowcases(companySlugs),
    enabled: companySlugs.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Função para obter itens de vitrine por slug
  const getShowcaseItemsBySlug = (slug: string): DeliveryShowcaseItem[] => {
    return showcases[slug] || [];
  };

  // Verifica quais empresas têm vitrines disponíveis
  const companiesWithShowcases = profiles.filter((profile) => {
    return (
      profile.empresa?.slug &&
      showcases[profile.empresa.slug] &&
      showcases[profile.empresa.slug].length > 0
    );
  });

  console.log("PROFILES", profiles);

  return {
    showcases,
    isLoading,
    getShowcaseItemsBySlug,
    companiesWithShowcases,
    companiesWithShowcaseMapped: companiesWithShowcases.map((profile) => ({
      ...profile,
      showcaseItems: showcases[profile.empresa.slug] || [],
    })) as CompanyWithShowcase[],
  };
}
