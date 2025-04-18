// src/features/company-page/view-models/company-page.view-model.ts
import { useQuery } from "@tanstack/react-query";
import { companyPageService } from "../services/company-page.service";
import { ICompanyPageViewModel } from "./company-page.view-model.interface";

export function useCompanyPageViewModel(
  companySlug: string
): ICompanyPageViewModel {
  const { data: profile = null, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["company-profile", companySlug],
    queryFn: () => companyPageService.getCompanyProfile(companySlug),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["company-products", companySlug],
    queryFn: () => companyPageService.getCompanyProducts(companySlug),
    staleTime: 5 * 60 * 1000,
    enabled: !!companySlug,
  });

  const { data: config = null, isLoading: isLoadingConfig } = useQuery({
    queryKey: ["company-config", companySlug],
    queryFn: () => companyPageService.getCompanyConfig(companySlug),
    staleTime: 5 * 60 * 1000,
    enabled: !!companySlug,
  });

  const { data: showcaseProducts = [], isLoading: isLoadingShowcase } =
    useQuery({
      queryKey: ["company-showcase", companySlug],
      queryFn: () => companyPageService.getCompanyShowcase(companySlug),
      staleTime: 5 * 60 * 1000,
      enabled: !!companySlug,
    });

  // Verificar se deve mostrar informações de delivery
  const shouldShowDeliveryInfo = () => {
    return (
      hasDelivery() &&
      (config?.delivery?.mostrar_info_delivery === true ||
        config?.delivery?.mostrar_info_delivery === null)
    );
  };

  // Verificar se o carrinho está habilitado
  const isCartEnabled = () => {
    return config?.delivery?.habilitar_carrinho !== false; // Por padrão, se não estiver definido, considera como true
  };

  // Formatação de endereço
  const getFormattedAddress = () => {
    if (!profile) return "";
    return profile.endereco || "Endereço não informado";
  };

  // Formatação de horário de funcionamento
  const getFormattedWorkingHours = () => {
    if (!profile || !profile.dias_funcionamento) return "Horário não informado";

    // Mapeia os dias de funcionamento para um formato mais legível
    const diasFormatados = profile.dias_funcionamento.map((dia) => {
      switch (dia.toLowerCase()) {
        case "segunda":
          return "Seg";
        case "terca":
          return "Ter";
        case "quarta":
          return "Qua";
        case "quinta":
          return "Qui";
        case "sexta":
          return "Sex";
        case "sabado":
          return "Sáb";
        case "domingo":
          return "Dom";
        default:
          return dia;
      }
    });

    // Se todos os dias da semana estiverem presentes
    if (diasFormatados.length === 7) {
      return "Todos os dias";
    }

    // Se forem dias consecutivos, mostra como intervalo
    if (diasFormatados.length > 2) {
      return `${diasFormatados[0]} à ${
        diasFormatados[diasFormatados.length - 1]
      }`;
    }

    // Caso contrário, lista os dias
    return diasFormatados.join(", ");
  };

  // Link para WhatsApp
  const getWhatsAppLink = () => {
    if (!profile || !profile.whatsapp) return "";
    const phoneNumber = profile.whatsapp.replace(/\D/g, "");
    return `https://wa.me/${phoneNumber}`;
  };

  // Verifica se a empresa tem delivery
  const hasDelivery = () => {
    return (
      profile?.empresa.subcategorias.some(
        (sub) => sub.subcategorias_empresas_id.slug === "delivery"
      ) ?? false
    );
  };

  const getGalleryImages = () => {
    if (!profile) return [];

    const images: string[] = [];

    // Adicionar imagens 01-06 se existirem
    for (let i = 1; i <= 6; i++) {
      const key = `imagem_0${i}` as keyof typeof profile;
      const imageUrl = profile[key] as string | null;

      if (imageUrl) {
        images.push(imageUrl);
      }
    }

    return images;
  };

  return {
    profile,
    products,
    showcaseProducts,
    config,
    isLoading:
      isLoadingProfile ||
      isLoadingProducts ||
      isLoadingConfig ||
      isLoadingShowcase,
    primaryColor: profile?.cor_primaria ?? "#F4511E", // Cor primária padrão do projeto
    secondaryColor: profile?.cor_secundaria ?? "#FFFFFF",
    getFormattedAddress,
    getFormattedWorkingHours,
    getWhatsAppLink,
    hasDelivery,
    shouldShowDeliveryInfo,
    isCartEnabled,
    getGalleryImages,
  };
}
