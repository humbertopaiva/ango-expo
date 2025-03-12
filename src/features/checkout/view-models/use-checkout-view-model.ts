// Path: src/features/checkout/view-models/use-checkout-view-model.ts
import { useState, useCallback, useEffect, useRef } from "react";
import { Alert, Linking } from "react-native";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMultiCartStore } from "@/src/features/cart/stores/cart.store";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { companyPageService } from "@/src/features/company-page/services/company-page.service";
import { formatCurrency } from "@/src/utils/format.utils";

// Tipos para o checkout
export type PaymentMethod = "credit" | "debit" | "pix" | "cash" | "transfer";
export type DeliveryMethod = "delivery" | "pickup";

// Esquema de validação com Zod
export const checkoutFormSchema = z.object({
  // Informações pessoais
  personalInfo: z.object({
    name: z
      .string()
      .min(2, "Nome é obrigatório e deve ter pelo menos 2 caracteres"),
    phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  }),

  // Endereço
  address: z.object({
    street: z.string().min(1, "Rua é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    reference: z.string().optional(),
  }),

  // Informações de pagamento
  paymentInfo: z.object({
    method: z.enum(["credit", "debit", "pix", "cash", "transfer"], {
      errorMap: () => ({ message: "Método de pagamento inválido" }),
    }),
    changeFor: z.string().optional(),
  }),

  // Método de entrega
  deliveryMethod: z.enum(["delivery", "pickup"], {
    errorMap: () => ({ message: "Método de entrega inválido" }),
  }),
});

// Inferir tipo a partir do esquema
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

// Tipos compatíveis para migração gradual
export type CheckoutPersonalInfo = CheckoutFormData["personalInfo"];
export type CheckoutAddress = CheckoutFormData["address"];
export type CheckoutPaymentInfo = CheckoutFormData["paymentInfo"];

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
  // Referência para rastrear inicialização
  const initializedRef = useRef(false);

  // Estado da configuração da empresa
  const [companyConfig, setCompanyConfig] = useState<CompanyConfig | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar o formulário com React Hook Form
  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      personalInfo: {
        name: "",
        phone: "",
      },
      address: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "Lima Duarte (MG)",
        reference: "",
      },
      paymentInfo: {
        method: "pix",
        changeFor: "",
      },
      deliveryMethod: "delivery",
    },
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
    trigger,
  } = methods;

  // Observar valores para acesso mais fácil
  const formValues = watch();
  const personalInfo = formValues.personalInfo;
  const address = formValues.address;
  const paymentInfo = formValues.paymentInfo;
  const deliveryMethod = formValues.deliveryMethod;

  // Acesso ao carrinho
  const cartVm = useCartViewModel();
  const multiCartStore = useMultiCartStore();

  // Manter a cidade sempre como Lima Duarte quando em modo de entrega
  useEffect(() => {
    if (deliveryMethod === "delivery" && address.city !== "Lima Duarte (MG)") {
      setValue("address.city", "Lima Duarte (MG)");
    }
  }, [deliveryMethod, address.city]);

  // Setters otimizados
  const setPersonalInfo = useCallback(
    (info: Partial<CheckoutPersonalInfo>) => {
      console.log("Atualizando personalInfo:", info);

      Object.entries(info).forEach(([key, value]) => {
        setValue(`personalInfo.${key}` as any, value, {
          shouldDirty: true,
          shouldValidate: initializedRef.current,
        });
      });
    },
    [setValue]
  );

  const setAddress = useCallback(
    (addressInfo: Partial<CheckoutAddress>) => {
      console.log("Atualizando address:", addressInfo);

      Object.entries(addressInfo).forEach(([key, value]) => {
        setValue(`address.${key}` as any, value, {
          shouldDirty: true,
          shouldValidate: initializedRef.current,
        });
      });
    },
    [setValue]
  );

  const setPaymentInfo = useCallback(
    (info: Partial<CheckoutPaymentInfo>) => {
      console.log("Atualizando paymentInfo:", info);

      Object.entries(info).forEach(([key, value]) => {
        setValue(`paymentInfo.${key}` as any, value, {
          shouldDirty: true,
          shouldValidate: initializedRef.current,
        });
      });
    },
    [setValue]
  );

  const setDeliveryMethod = useCallback(
    (method: DeliveryMethod) => {
      console.log("Atualizando deliveryMethod:", method);
      setValue("deliveryMethod", method, {
        shouldDirty: true,
        shouldValidate: initializedRef.current,
      });
    },
    [setValue]
  );

  // Após a primeira renderização, marcar como inicializado para validar formulários
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
    }
  }, []);

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

  // Validar informações pessoais
  const isPersonalInfoValid = useCallback(async () => {
    try {
      const isPersonalValid = await trigger("personalInfo");

      // Se for retirada, só precisamos dos dados pessoais
      if (deliveryMethod === "pickup") {
        return isPersonalValid;
      }

      // Se for entrega, também precisamos validar o endereço
      const isAddressValid = await trigger("address");

      return isPersonalValid && isAddressValid;
    } catch (error) {
      console.error("Erro ao validar informações pessoais:", error);
      return false;
    }
  }, [trigger, deliveryMethod]);

  // Validar pagamento
  const isPaymentValid = useCallback(async () => {
    try {
      const isValid = await trigger("paymentInfo");

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

      return isValid;
    } catch (error) {
      console.error("Erro ao validar pagamento:", error);
      return false;
    }
  }, [trigger, paymentInfo, cartVm.items]);

  // Para compatibilidade com o código existente
  const isAddressValid = useCallback(async () => {
    if (deliveryMethod === "pickup") {
      return true;
    }

    return await trigger("address");
  }, [trigger, deliveryMethod]);

  // Formatar valor de troco
  const formatChangeValue = useCallback((value: string) => {
    // Remover caracteres não numéricos
    const numericValue = value.replace(/\D/g, "");
    // Converter para número e dividir por 100 para formatar como moeda
    const floatValue = parseFloat(numericValue) / 100;
    // Formatar como moeda
    return formatCurrency(floatValue);
  }, []);

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

  // Finalizar pedido
  const finalizeOrder = useCallback(async () => {
    try {
      // Validar todo o formulário
      const formIsValid = await methods.trigger();

      if (!formIsValid) {
        console.log("Formulário inválido:", errors);
        Alert.alert(
          "Dados incompletos",
          "Por favor, preencha corretamente todos os dados solicitados."
        );
        return false;
      }

      // Verificar se temos as informações necessárias
      if (!companyConfig?.whatsapp) {
        Alert.alert(
          "Erro",
          "Não foi possível obter o contato do estabelecimento."
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
    methods,
    errors,
    companyConfig,
    constructWhatsAppMessage,
    multiCartStore,
  ]);

  // Efeito para depuração
  useEffect(() => {
    if (initializedRef.current) {
      console.log("Estado atual do checkout:", {
        personalInfo,
        address,
        paymentInfo,
        deliveryMethod,
        errors,
        isValid,
      });
    }
  }, [personalInfo, address, paymentInfo, deliveryMethod, errors, isValid]);

  return {
    // Estado
    formMethods: methods,
    control,
    errors,
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
    handleSubmit,

    // Validações
    isPersonalInfoValid,
    isAddressValid,
    isPaymentValid,
    isValid,
  };
}
