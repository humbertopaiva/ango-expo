// Path: src/features/checkout/view-models/use-checkout-view-model.ts
import { useState, useCallback, useEffect } from "react";
import { Alert, Linking } from "react-native";
import { useMultiCartStore } from "@/src/features/cart/stores/cart.store";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { companyPageService } from "@/src/features/company-page/services/company-page.service";
import { formatCurrency } from "@/src/utils/format.utils";

// Tipos para o checkout
export type PaymentMethod = "credit" | "debit" | "pix" | "cash" | "transfer";
export type DeliveryMethod = "delivery" | "pickup";

export interface CheckoutAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  reference?: string;
}

export interface CheckoutPersonalInfo {
  name: string;
  phone: string;
}

export interface CheckoutPaymentInfo {
  method: PaymentMethod;
  changeFor?: string; // Valor para troco, apenas para método 'cash'
}

export interface CompanyConfig {
  companyId?: string;
  companySlug?: string;
  companyName?: string;
  primaryColor?: string;
  whatsapp?: string;
  deliveryConfig?: {
    neighborhoods?: string[];
    specifyNeighborhoods?: boolean;
    deliveryFee?: string;
    minOrderValue?: string;
    estimatedTime?: number;
    notes?: string;
  };
}

export function useCheckoutViewModel() {
  // Estado do checkout
  const [companyConfig, setCompanyConfig] = useState<CompanyConfig | null>(
    null
  );
  const [personalInfo, setPersonalInfo] = useState<CheckoutPersonalInfo>({
    name: "",
    phone: "",
  });
  const [address, setAddress] = useState<CheckoutAddress>({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    reference: "",
  });
  const [paymentInfo, setPaymentInfo] = useState<CheckoutPaymentInfo>({
    method: "pix",
    changeFor: "",
  });
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("delivery");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Garantir que o valor da cidade seja sempre "Lima Duarte (MG)"
    if (deliveryMethod === "delivery" && address.city !== "Lima Duarte (MG)") {
      setAddress((prev) => ({
        ...prev,
        city: "Lima Duarte (MG)",
      }));
    }
  }, [deliveryMethod, address.city, setAddress]);

  // Acesso ao carrinho
  const cartVm = useCartViewModel();
  const multiCartStore = useMultiCartStore();

  // Carregar configuração da empresa
  const loadCompanyConfig = useCallback(async (companySlug: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const [profile, config] = await Promise.all([
        companyPageService.getCompanyProfile(companySlug),
        companyPageService.getCompanyConfig(companySlug),
      ]);

      if (profile) {
        setCompanyConfig({
          companyId: profile.id,
          companySlug: profile.empresa.slug,
          companyName: profile.nome,
          primaryColor: profile.cor_primaria,
          whatsapp: profile.whatsapp,
          deliveryConfig: {
            neighborhoods: config?.delivery?.bairros_atendidos || [],
            specifyNeighborhoods:
              config?.delivery?.especificar_bairros_atendidos || false,
            deliveryFee: config?.delivery?.taxa_entrega || "0",
            minOrderValue: config?.delivery?.pedido_minimo || "0",
            estimatedTime: config?.delivery?.tempo_estimado_entrega || 30,
            notes: config?.delivery?.observacoes || "",
          },
        });
      }
    } catch (err) {
      console.error("Erro ao carregar configuração da empresa:", err);
      setError("Não foi possível carregar a configuração da empresa.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Validações
  const isPersonalInfoValid = useCallback(() => {
    try {
      // Validação básica de nome e telefone
      if (!personalInfo.name || personalInfo.name.trim() === "") {
        return false;
      }

      const phoneDigits = personalInfo.phone.replace(/\D/g, "");
      if (phoneDigits.length < 10) {
        return false;
      }

      // Se for retirada, só precisamos do nome e telefone
      if (deliveryMethod === "pickup") {
        return true;
      }

      // Para entrega, validamos o endereço (exceto cidade que é automática)
      if (!address.street || address.street.trim() === "") {
        return false;
      }

      if (!address.number || address.number.trim() === "") {
        return false;
      }

      if (!address.neighborhood || address.neighborhood.trim() === "") {
        return false;
      }

      // A cidade é automaticamente "Lima Duarte (MG)", então não precisamos validar

      // Se chegou aqui, tudo está válido
      return true;
    } catch (error) {
      console.error("Erro na validação de informações pessoais:", error);
      return false;
    }
  }, [personalInfo, address, deliveryMethod]);

  // Para compatibilidade com o código existente, mantemos isAddressValid
  // mas ele agora sempre retorna true pois validamos o endereço junto com os dados pessoais
  const isAddressValid = useCallback(() => {
    return true;
  }, []);

  /**
   * Verifica se as informações de pagamento estão válidas
   */
  const isPaymentValid = useCallback(() => {
    // Verificar se um método de pagamento foi selecionado
    if (!paymentInfo.method) {
      return false;
    }

    // Para pagamento em dinheiro, verificar se o troco está correto
    if (paymentInfo.method === "cash" && paymentInfo.changeFor) {
      try {
        // Extrair valor numérico da string formatada (removendo R$, espaços e trocando vírgula por ponto)
        const changeValueRaw = paymentInfo.changeFor
          .replace(/[^\d,]/g, "") // Remove tudo exceto dígitos e vírgula
          .replace(",", "."); // Substitui vírgula por ponto para conversão

        // Converter para número
        const changeValue = parseFloat(changeValueRaw);

        // Calcular total do pedido
        const orderTotal = cartVm.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Verificar se o valor para troco é maior que o total do pedido
        return !isNaN(changeValue) && changeValue >= orderTotal;
      } catch (error) {
        console.error("Erro ao validar troco:", error);
        return false;
      }
    }

    // Para outros métodos de pagamento, consideramos válido
    return true;
  }, [paymentInfo, cartVm.items]);

  // Formatar valor de troco
  const formatChangeValue = useCallback((value: string) => {
    // Remover caracteres não numéricos
    const numericValue = value.replace(/\D/g, "");
    // Converter para número e dividir por 100 para formatar como moeda
    const floatValue = parseFloat(numericValue) / 100;
    // Formatar como moeda
    return formatCurrency(floatValue);
  }, []);

  // Finalizar pedido
  const finalizeOrder = useCallback(async () => {
    try {
      // Verificar se temos as informações necessárias
      if (!companyConfig?.whatsapp) {
        Alert.alert(
          "Erro",
          "Não foi possível obter o contato do estabelecimento."
        );
        return false;
      }

      if (!isPersonalInfoValid()) {
        Alert.alert(
          "Dados incompletos",
          "Por favor, preencha corretamente todos os dados solicitados."
        );
        return false;
      }

      if (!isPaymentValid()) {
        Alert.alert(
          "Pagamento inválido",
          "Por favor, verifique as informações de pagamento."
        );
        return false;
      }

      // Construir a mensagem para o WhatsApp
      const message = constructWhatsAppMessage();

      // Formato do número: remover caracteres não numéricos
      const phoneNumber = companyConfig.whatsapp.replace(/\D/g, "");

      // URL do WhatsApp
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;

      // Abrir o WhatsApp
      const canOpen = await Linking.canOpenURL(whatsappUrl);

      if (canOpen) {
        await Linking.openURL(whatsappUrl);

        // Limpar o carrinho após finalizar o pedido
        if (companyConfig.companySlug) {
          multiCartStore.clearCart(companyConfig.companySlug);
        }

        return true;
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível abrir o WhatsApp. Verifique se o aplicativo está instalado."
        );
        return false;
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      return false;
    }
  }, [
    companyConfig,
    personalInfo,
    address,
    paymentInfo,
    deliveryMethod,
    cartVm.items,
    isPersonalInfoValid,
    isPaymentValid,
  ]);

  // Construir mensagem para o WhatsApp
  const constructWhatsAppMessage = useCallback(() => {
    // Cabeçalho com informações do cliente
    let message = `🛒 *NOVO PEDIDO* 🛒\n\n`;
    message += `👤 *DADOS DO CLIENTE*\n`;
    message += `Nome: ${personalInfo.name}\n`;
    message += `Telefone: ${personalInfo.phone}\n\n`;

    // Método de entrega e endereço se for delivery
    if (deliveryMethod === "delivery") {
      message += `📍 *ENDEREÇO DE ENTREGA*\n`;
      message += `Rua: ${address.street}, ${address.number}\n`;
      if (address.complement) message += `Complemento: ${address.complement}\n`;
      message += `Bairro: ${address.neighborhood}\n`;
      message += `Cidade: ${address.city}\n`;
      if (address.reference)
        message += `Ponto de referência: ${address.reference}\n`;
      message += `\n`;
    } else {
      message += `🏬 *RETIRADA NO LOCAL*\n\n`;
    }

    // Lista de produtos
    message += `📋 *ITENS DO PEDIDO*\n`;

    cartVm.items.forEach((item, index) => {
      message += `${index + 1}. ${item.quantity}x ${item.name} - ${
        item.priceFormatted
      } cada = ${item.totalPriceFormatted}\n`;

      // Adicionar observação do item, se houver
      if (item.observation) {
        message += `   Obs: ${item.observation}\n`;
      }
    });

    message += `\n`;

    // Resumo do pedido
    const subtotal = cartVm.subtotal;
    const deliveryFee =
      deliveryMethod === "delivery" &&
      companyConfig?.deliveryConfig?.deliveryFee
        ? formatCurrency(
            parseFloat(companyConfig.deliveryConfig.deliveryFee) / 100
          )
        : "R$ 0,00";

    const total =
      deliveryMethod === "delivery" &&
      companyConfig?.deliveryConfig?.deliveryFee
        ? formatCurrency(
            cartVm.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ) +
              parseFloat(companyConfig.deliveryConfig.deliveryFee) / 100
          )
        : cartVm.total;

    message += `💰 *RESUMO DO PEDIDO*\n`;
    message += `Subtotal: ${subtotal}\n`;
    if (deliveryMethod === "delivery") {
      message += `Taxa de entrega: ${deliveryFee}\n`;
    }
    message += `Total: ${total}\n\n`;

    // Forma de pagamento
    message += `💳 *FORMA DE PAGAMENTO*\n`;

    let paymentMethodText = "";
    switch (paymentInfo.method) {
      case "credit":
        paymentMethodText = "Cartão de Crédito";
        break;
      case "debit":
        paymentMethodText = "Cartão de Débito";
        break;
      case "pix":
        paymentMethodText = "PIX";
        break;
      case "cash":
        paymentMethodText = "Dinheiro";
        break;
      case "transfer":
        paymentMethodText = "Transferência Bancária";
        break;
    }

    message += `Método: ${paymentMethodText}\n`;

    // Se for dinheiro e tiver troco
    if (paymentInfo.method === "cash" && paymentInfo.changeFor) {
      message += `Troco para: ${paymentInfo.changeFor}\n`;
    }

    return message;
  }, [
    personalInfo,
    address,
    deliveryMethod,
    paymentInfo,
    cartVm.items,
    cartVm.subtotal,
    cartVm.total,
    companyConfig,
  ]);

  return {
    // Estado
    companyConfig,
    personalInfo,
    address,
    paymentInfo,
    deliveryMethod,
    isLoading,
    error,

    // Setters
    setPersonalInfo,
    setAddress,
    setPaymentInfo,
    setDeliveryMethod,

    // Ações
    loadCompanyConfig,
    finalizeOrder,
    formatChangeValue,

    // Validações
    isPersonalInfoValid,
    isAddressValid,
    isPaymentValid,
  };
}
