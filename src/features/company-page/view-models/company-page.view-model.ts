// Path: src/features/company-page/view-models/company-page.view-model.ts

import { useQuery } from "@tanstack/react-query";
import { companyPageService } from "../services/company-page.service";
import {
  CategoryFilterData,
  ICompanyPageViewModel,
} from "./company-page.view-model.interface";
import { customProductService } from "../services/custom-product.service";
import { useCallback, useState, useMemo } from "react";
import { ProductAddonList } from "../models/product-addon-list";
import { productAddonsService } from "../services/product-addons.service";
import { THEME_COLORS } from "@/src/styles/colors";
import { useDeliveryConfig } from "@/src/features/checkout/hooks/use-delivery-config";
import { CompanyConfig } from "../models/company-config";

export function useCompanyPageViewModel(
  companySlug: string
): ICompanyPageViewModel {
  // Existing state
  const [isCategoryFilterVisible, setIsCategoryFilterVisible] = useState(true);
  const [categoryFilterData, setCategoryFilterData] =
    useState<CategoryFilterData | null>(null);
  const [isCartConfirmationVisible, setIsCartConfirmationVisible] =
    useState(false);
  const [lastAddedToCartItem, setLastAddedToCartItem] = useState(null);

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

  // Usar o query para obter a configuração padrão da empresa
  const { data: originalConfig = null, isLoading: isLoadingConfig } = useQuery({
    queryKey: ["company-config", companySlug],
    queryFn: () => companyPageService.getCompanyConfig(companySlug),
    staleTime: 5 * 60 * 1000,
    enabled: !!companySlug,
  });

  // Usar nosso novo hook useDeliveryConfig
  const companyId = profile?.empresa?.id || profile?.id;
  const { data: deliveryConfig, isLoading: isLoadingDeliveryConfig } =
    useDeliveryConfig(companyId, companySlug);

  // Manter compatibilidade com a interface existente usando config
  // Criar uma versão fundida do config que respeita os tipos
  const config = useMemo(() => {
    if (!originalConfig && !deliveryConfig) return null;

    // Se temos ambos os configs, mesclamos os dados de entrega
    if (originalConfig && deliveryConfig) {
      return {
        ...originalConfig,
        delivery: {
          ...originalConfig.delivery,
          // Sobrescrever apenas as propriedades que existem no deliveryConfig
          // e que são compatíveis com o tipo CompanyConfig.delivery
          ...(deliveryConfig && {
            tempo_estimado_entrega: deliveryConfig.tempo_estimado_entrega,
            especificar_bairros_atendidos:
              deliveryConfig.especificar_bairros_atendidos,
            bairros_atendidos: deliveryConfig.bairros_atendidos,
            observacoes: deliveryConfig.observacoes || "",
            mostrar_info_delivery: deliveryConfig.mostrar_info_delivery,
            habilitar_carrinho: deliveryConfig.habilitar_carrinho,
            taxa_entrega: deliveryConfig.taxa_entrega,
            pedido_minimo: deliveryConfig.pedido_minimo,
          }),
        },
      };
    }

    // Se temos apenas o originalConfig, retornamos ele
    if (originalConfig) {
      return originalConfig;
    }

    // Se temos apenas o deliveryConfig, criamos um objeto compatível
    if (deliveryConfig) {
      const companyConfigDelivery: CompanyConfig = {
        delivery: {
          tempo_estimado_entrega: deliveryConfig.tempo_estimado_entrega,
          especificar_bairros_atendidos:
            deliveryConfig.especificar_bairros_atendidos,
          bairros_atendidos: deliveryConfig.bairros_atendidos,
          observacoes: deliveryConfig.observacoes || "",
          mostrar_info_delivery: deliveryConfig.mostrar_info_delivery,
          habilitar_carrinho: deliveryConfig.habilitar_carrinho,
          taxa_entrega: deliveryConfig.taxa_entrega,
          pedido_minimo: deliveryConfig.pedido_minimo,
        },
      };
      return companyConfigDelivery;
    }

    return null;
  }, [originalConfig, deliveryConfig]);

  const { data: showcaseProducts = [], isLoading: isLoadingShowcase } =
    useQuery({
      queryKey: ["company-showcase", companySlug],
      queryFn: () => companyPageService.getCompanyShowcase(companySlug),
      staleTime: 5 * 60 * 1000,
      enabled: !!companySlug,
    });

  const { data: customProducts = [], isLoading: isLoadingCustomProducts } =
    useQuery({
      queryKey: ["company-custom-products", companySlug],
      queryFn: async () => {
        if (!profile) return [];
        const companyId = profile.empresa?.id || profile.id;

        return customProductService.getCompanyCustomProducts(companyId);
      },
      enabled: !!profile,
      staleTime: 0,
    });

  // Verificar se deve mostrar informações de delivery
  const shouldShowDeliveryInfo = () => {
    if (deliveryConfig) {
      return hasDelivery() && deliveryConfig.mostrar_info_delivery !== false;
    }

    // Verifica na configuração original como fallback
    return (
      hasDelivery() &&
      (config?.delivery?.mostrar_info_delivery === true ||
        config?.delivery?.mostrar_info_delivery === null)
    );
  };

  const showCartConfirmation = useCallback((itemData: any) => {
    setLastAddedToCartItem(itemData);
    setIsCartConfirmationVisible(true);
  }, []);

  const hideCartConfirmation = useCallback(() => {
    setIsCartConfirmationVisible(false);
  }, []);

  const setCategoryFilterVisible = useCallback(
    (visible: boolean, data: CategoryFilterData) => {
      setIsCategoryFilterVisible(visible);
      setCategoryFilterData(data);
    },
    []
  );

  const getProductAddonLists = useCallback(
    async (productId: string): Promise<ProductAddonList[]> => {
      if (!products || !profile) return [];

      // Encontrar o produto pelo ID
      const product = products.find((p) => p.id === productId);
      if (!product || !product.categoria?.id) return [];

      // Buscar listas de adicionais para a categoria do produto
      return await productAddonsService.getAddonListsByCategory(
        product.categoria.id,
        profile.empresa?.id!
      );
    },
    [products, profile]
  );

  // Verificar se o carrinho está habilitado
  const isCartEnabled = () => {
    if (deliveryConfig) {
      return deliveryConfig.habilitar_carrinho !== false;
    }

    return config?.delivery?.habilitar_carrinho !== false;
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
    customProducts,
    isLoading:
      isLoadingProfile ||
      isLoadingProducts ||
      isLoadingConfig ||
      isLoadingDeliveryConfig ||
      isLoadingShowcase,
    primaryColor: THEME_COLORS.primary,
    secondaryColor: profile?.cor_secundaria ?? "#FFFFFF",
    isCategoryFilterVisible,
    categoryFilterData,
    isCartConfirmationVisible,
    lastAddedToCartItem,
    getFormattedAddress,
    getFormattedWorkingHours,
    getWhatsAppLink,
    hasDelivery,
    shouldShowDeliveryInfo,
    isCartEnabled,
    getGalleryImages,
    getProductAddonLists,
    setCategoryFilterVisible,
    showCartConfirmation,
    hideCartConfirmation,
  };
}
