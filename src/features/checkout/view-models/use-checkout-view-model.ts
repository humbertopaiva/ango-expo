// Path: src/features/checkout/view-models/use-checkout-view-model.ts

import { useState, useCallback, useEffect } from "react";
import { useCheckoutStore } from "../stores/checkout.store";
import {
  CheckoutDeliveryType,
  CheckoutPaymentMethod,
  PersonalInfo,
  personalInfoSchema,
  paymentMethodSchema,
  PaymentInfo,
} from "../models/checkout";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { useToast } from "@gluestack-ui/themed";
import { toastUtils } from "@/src/utils/toast.utils";
import { useLocalSearchParams, router } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Linking } from "react-native";
import { formatCurrency } from "@/src/utils/format.utils";
import { CartProcessorService } from "../services/cart-processor.service";
import { userPersistenceService } from "@/src/services/user-persistence.service";
import { useOrderStore } from "@/src/features/orders/stores/order.store";
import { api } from "@/src/services/api";
import { z } from "zod";

export function useCheckoutViewModel() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();
  const cartViewModel = useCartViewModel();
  const toast = useToast();
  const orderStore = useOrderStore();

  // Acesso ao store de checkout
  const {
    checkout,
    currentStep,
    initCheckout,
    updateDeliveryType,
    updatePersonalInfo,
    updatePaymentInfo,
    nextStep,
    prevStep,
    goToStep,
    resetCheckout,
  } = useCheckoutStore();

  // Criar um schema dinâmico baseado no tipo de entrega
  const getDynamicPersonalInfoSchema = useCallback(() => {
    if (checkout.deliveryType === CheckoutDeliveryType.PICKUP) {
      // Para retirada, validar apenas nome e whatsapp
      return personalInfoSchema.omit({
        address: true,
        number: true,
        neighborhood: true,
        reference: true,
      });
    } else {
      // Para entrega, validar todos os campos obrigatórios com mensagens mais claras
      return personalInfoSchema.extend({
        address: z.string().min(5, "Endereço é obrigatório"),
        number: z.string().min(1, "Número é obrigatório"),
        neighborhood: z.string().min(3, "Bairro é obrigatório"),
        reference: z.string().optional(),
      });
    }
  }, [checkout.deliveryType]);

  // Form para dados pessoais com schema dinâmico
  const personalInfoForm = useForm<PersonalInfo>({
    resolver: zodResolver(getDynamicPersonalInfoSchema()),
    defaultValues: checkout.personalInfo,
    mode: "onChange", // Validar ao digitar
  });

  // Revalidar ao mudar o tipo de entrega
  useEffect(() => {
    personalInfoForm.clearErrors();
    personalInfoForm.reset(checkout.personalInfo);

    // Trigger de validação para campos de endereço quando for entrega
    if (checkout.deliveryType === CheckoutDeliveryType.DELIVERY) {
      setTimeout(() => {
        personalInfoForm.trigger(["address", "number", "neighborhood"]);
      }, 100);
    }
  }, [checkout.deliveryType]);

  // Form para método de pagamento com validação específica para troco
  const paymentInfoForm = useForm<PaymentInfo>({
    resolver: zodResolver(
      paymentMethodSchema.refine(
        (data) => {
          // Se for pagamento em dinheiro, validar o troco
          if (data.method === CheckoutPaymentMethod.CASH && data.change) {
            const changeValue = parseFloat(data.change.replace(",", "."));
            return !isNaN(changeValue) && changeValue > checkout.total;
          }
          return true;
        },
        {
          message: "Valor para troco deve ser maior que o total do pedido",
          path: ["change"],
        }
      )
    ),
    defaultValues: checkout.paymentInfo,
    mode: "onChange",
  });

  // Serviço para caching do checkout
  const cacheCheckoutState = useCallback(async () => {
    try {
      // Usando localStorage para persistir o estado do checkout
      localStorage.setItem(
        "cached_checkout",
        JSON.stringify({
          ...checkout,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Erro ao salvar cache do checkout:", error);
    }
  }, [checkout]);

  const getCachedCheckout = useCallback(async () => {
    try {
      const cachedData = localStorage.getItem("cached_checkout");
      if (!cachedData) return null;

      const parsed = JSON.parse(cachedData);

      // Verificar se o cache é recente (menos de 30 minutos)
      const now = Date.now();
      if (now - parsed.timestamp > 30 * 60 * 1000) {
        localStorage.removeItem("cached_checkout");
        return null;
      }

      return parsed;
    } catch (error) {
      console.error("Erro ao recuperar cache do checkout:", error);
      return null;
    }
  }, []);

  // Inicializar checkout com dados do carrinho e recuperar dados do usuário
  const initialize = useCallback(async () => {
    // Verificar se o carrinho está vazio
    if (cartViewModel.isEmpty || !companySlug) {
      router.replace(`/(drawer)/empresa/${companySlug}`);
      return;
    }

    // Tentar recuperar o estado anterior do checkout do cache
    const cachedCheckout = await getCachedCheckout();

    // Se o checkout é para a mesma empresa e tem dados válidos, use-o
    if (
      cachedCheckout &&
      cachedCheckout.companySlug === companySlug &&
      cachedCheckout.items.length > 0
    ) {
      // Inicializa com os dados em cache
      initCheckout(
        cachedCheckout.items,
        cachedCheckout.companyId,
        cachedCheckout.companySlug,
        cachedCheckout.companyName,
        cachedCheckout.subtotal,
        cachedCheckout.total
      );

      // Atualiza os dados pessoais e pagamento
      updatePersonalInfo(cachedCheckout.personalInfo);
      updatePaymentInfo(cachedCheckout.paymentInfo);

      // Reset dos formulários com dados do cache
      setTimeout(() => {
        personalInfoForm.reset(cachedCheckout.personalInfo);
        paymentInfoForm.reset(cachedCheckout.paymentInfo);
      }, 100);

      return;
    }

    // Se não há cache válido, processa os itens do carrinho
    const totalPrice = CartProcessorService.calculateOrderTotal(
      cartViewModel.items
    );

    // Inicializa o checkout com os dados do carrinho
    initCheckout(
      cartViewModel.items,
      cartViewModel.items[0]?.companyId || "",
      companySlug,
      cartViewModel.companyName || "",
      parseFloat(
        cartViewModel.subtotal.replace(/[^\d,]/g, "").replace(",", ".")
      ),
      totalPrice
    );

    // Tenta recuperar os dados do usuário
    try {
      const savedUserData = await userPersistenceService.getUserPersonalInfo();
      if (savedUserData) {
        // Atualiza os dados pessoais no checkout
        updatePersonalInfo(savedUserData);

        // Reset do formulário com os dados carregados
        setTimeout(() => {
          personalInfoForm.reset(savedUserData);
        }, 100);
      }
    } catch (error) {
      console.error("Erro ao recuperar dados do usuário:", error);
    }
  }, [
    cartViewModel,
    companySlug,
    initCheckout,
    updatePersonalInfo,
    updatePaymentInfo,
  ]);

  // Atualizar tipo de entrega
  const setDeliveryType = (type: CheckoutDeliveryType) => {
    updateDeliveryType(type);

    // Gravar no cache
    setTimeout(() => {
      cacheCheckoutState();
    }, 100);
  };

  // Salvar dados pessoais, persistir localmente e avançar
  const savePersonalInfo = async (data: PersonalInfo) => {
    try {
      // Validação adicional para entrega
      if (checkout.deliveryType === CheckoutDeliveryType.DELIVERY) {
        const addressComplete = !!(
          data.address &&
          data.address.trim().length >= 5 &&
          data.number &&
          data.number.trim().length >= 1 &&
          data.neighborhood &&
          data.neighborhood.trim().length >= 3
        );

        if (!addressComplete) {
          toastUtils.error(
            toast,
            "Preencha todos os campos de endereço corretamente"
          );
          return;
        }
      }

      // Atualiza no checkout
      updatePersonalInfo(data);

      // Salvar no cache
      await cacheCheckoutState();

      // Persiste localmente para reuso futuro
      await userPersistenceService.saveUserPersonalInfo(data);

      // Avança para o próximo passo
      nextStep();
    } catch (error) {
      console.error("Erro ao salvar dados pessoais:", error);
      toastUtils.error(toast, "Erro ao salvar seus dados");
    }
  };

  // Salvar método de pagamento e avançar
  const savePaymentInfo = async (data: PaymentInfo) => {
    try {
      // Validação especial para pagamento em dinheiro (cash)
      if (data.method === CheckoutPaymentMethod.CASH && data.change) {
        // Certifique-se de que o valor de troco é um número válido e maior que o total do pedido
        const changeValue = parseFloat(data.change.replace(",", "."));

        if (isNaN(changeValue)) {
          toastUtils.error(toast, "Valor de troco inválido");
          return;
        }

        if (changeValue <= checkout.total) {
          toastUtils.error(
            toast,
            "Valor para troco deve ser maior que o total do pedido"
          );
          return;
        }
      }

      updatePaymentInfo(data);

      // Salvar no cache
      await cacheCheckoutState();

      nextStep();
    } catch (error) {
      console.error("Erro ao salvar forma de pagamento:", error);
      toastUtils.error(toast, "Erro ao salvar forma de pagamento");
    }
  };

  // Helper para limpar cache
  const clearCheckoutCache = useCallback(() => {
    try {
      localStorage.removeItem("cached_checkout");
    } catch (error) {
      console.error("Erro ao limpar cache:", error);
    }
  }, []);

  // Finalizar o pedido e criar um registro no OrderStore
  const finalizeOrder = async () => {
    setIsProcessing(true);

    try {
      // Buscar o telefone da empresa, se disponível
      let companyPhone = undefined;

      try {
        // Implementação depende de como você acessa os dados da empresa
        const companyData = await api.get(
          `/api/companies/${checkout.companyId}`
        );
        companyPhone = companyData?.data?.data?.whatsapp || undefined;
      } catch (error) {
        console.log("Não foi possível obter o telefone da empresa:", error);
      }

      // Usar o CartProcessorService para processar os itens antes de criar o pedido
      const { mainItems, addons, customItems, totalItems } =
        CartProcessorService.processItems(checkout.items);

      // Recalcular o total real do pedido
      const realTotal = CartProcessorService.calculateOrderTotal(
        checkout.items
      );

      // Preparar itens para o OrderStore, mantendo a estrutura original de cada item
      const orderItems = [...checkout.items];

      // Criar pedido no OrderStore
      const order = orderStore.createOrder(
        orderItems,
        checkout.companyId,
        checkout.companySlug,
        checkout.companyName,
        companyPhone
      );

      // Construir mensagem para WhatsApp usando o serviço
      const message = CartProcessorService.formatWhatsAppMessage(checkout);

      // Número da empresa (idealmente seria obtido do perfil da empresa)
      // Por enquanto, usamos um número de exemplo ou o que foi obtido acima
      const companyWhatsapp = companyPhone || "5532999999999";

      // Enviar mensagem para o WhatsApp
      await sendWhatsAppMessage(message, companyWhatsapp);

      // Limpar cache do checkout
      clearCheckoutCache();

      // Limpar carrinho e checkout
      cartViewModel.clearCart();
      resetCheckout();

      // Redirecionar para a tela de pedidos
      router.replace(`/(drawer)/empresa/${companySlug}/orders`);

      toastUtils.success(toast, "Pedido enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      toastUtils.error(toast, "Erro ao enviar pedido");
    } finally {
      setIsProcessing(false);
    }
  };

  // Função para enviar mensagem via WhatsApp
  const sendWhatsAppMessage = async (
    message: string,
    phone: string
  ): Promise<boolean> => {
    try {
      // Formatar o número de telefone (remover caracteres não numéricos)
      const formattedPhone = phone.replace(/\D/g, "");

      // Criar a URL do WhatsApp
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
        message
      )}`;

      // Verificar se o WhatsApp pode ser aberto
      const canOpen = await Linking.canOpenURL(whatsappUrl);

      if (canOpen) {
        await Linking.openURL(whatsappUrl);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro ao abrir WhatsApp:", error);
      return false;
    }
  };

  // Validar estado atual do checkout
  const validateCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 0: // Resumo do pedido
        return checkout.items.length > 0;

      case 1: // Dados pessoais
        if (checkout.deliveryType === CheckoutDeliveryType.DELIVERY) {
          return !!(
            checkout.personalInfo.fullName &&
            checkout.personalInfo.whatsapp &&
            checkout.personalInfo.address &&
            checkout.personalInfo.number &&
            checkout.personalInfo.neighborhood
          );
        }
        return !!(
          checkout.personalInfo.fullName && checkout.personalInfo.whatsapp
        );

      case 2: // Forma de pagamento
        if (
          checkout.paymentInfo.method === CheckoutPaymentMethod.CASH &&
          !checkout.paymentInfo.change
        ) {
          return false;
        }
        return true;

      default:
        return true;
    }
  }, [currentStep, checkout]);

  // Verificar se o passo atual está válido antes de avançar
  const nextStepWithValidation = useCallback(() => {
    if (validateCurrentStep()) {
      nextStep();
    } else {
      toastUtils.error(
        toast,
        "Por favor, preencha todos os campos obrigatórios"
      );
    }
  }, [nextStep, validateCurrentStep, toast]);

  return {
    // Estado
    checkout,
    currentStep,
    isProcessing,

    // Formulários
    personalInfoForm,
    paymentInfoForm,

    // Ações
    initialize,
    setDeliveryType,
    savePersonalInfo,
    savePaymentInfo,
    finalizeOrder,
    goToStep,
    prevStep,
    nextStep: nextStepWithValidation,
    validateCurrentStep,
  };
}
