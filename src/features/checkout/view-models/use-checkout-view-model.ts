// Path: src/features/checkout/view-models/use-checkout-view-model.ts

import { useState, useCallback, useEffect, useMemo } from "react";
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
import { CartProcessorService } from "../services/cart-processor.service";
import { userPersistenceService } from "@/src/services/user-persistence.service";
import { useOrderStore } from "@/src/features/orders/stores/order.store";
import { z } from "zod";
import { api } from "@/src/services/api";
import { storage } from "@/src/lib/storage";
import { DeliveryInfoService } from "../../cart/services/delivery-info.service";
import { DeliveryConfigService } from "../services/delivery-config.service";
import { useDeliveryConfig } from "../hooks/use-delivery-config";

export function useCheckoutViewModel() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [stepsValidation, setStepsValidation] = useState([
    true,
    false,
    false,
    false,
  ]);

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
    nextStep: storeNextStep,
    prevStep: storePrevStep,
    goToStep: storeGoToStep,
    resetCheckout,
  } = useCheckoutStore();

  // Buscar o ID da empresa a partir do checkout ou do carrinho
  const companyId = useMemo(() => {
    return checkout?.companyId || cartViewModel.items[0]?.companyId;
  }, [checkout?.companyId, cartViewModel.items]);

  // Usar o hook de delivery config
  const { data: deliveryConfig, isLoading: isLoadingDeliveryConfig } =
    useDeliveryConfig(companyId, companySlug);

  // Extrair bairros da configuração - usando useMemo para otimização
  const neighborhoods = useMemo(() => {
    if (
      deliveryConfig?.especificar_bairros_atendidos &&
      deliveryConfig?.bairros_atendidos
    ) {
      return deliveryConfig.bairros_atendidos;
    }
    return [];
  }, [deliveryConfig]);

  // Efeito para atualizar o checkout quando a configuração for carregada
  useEffect(() => {
    if (deliveryConfig && checkout) {
      // Atualizar a taxa de entrega no checkout
      const deliveryFee = DeliveryConfigService.getDeliveryFee(deliveryConfig);
      if (
        deliveryFee > 0 &&
        checkout.deliveryType === CheckoutDeliveryType.DELIVERY
      ) {
        // Recalcular o total com a nova taxa
        const newTotal = checkout.subtotal + deliveryFee;

        // Atualizar taxa e total no checkout
        checkout.deliveryFee = deliveryFee;
        checkout.total = newTotal;
      }

      console.log("DELIVERY CONFIG: ", deliveryConfig);
    }
  }, [deliveryConfig, checkout]);

  // Criar um schema dinâmico baseado no tipo de entrega
  const getDynamicPersonalInfoSchema = useCallback(() => {
    if (checkout.deliveryType === CheckoutDeliveryType.PICKUP) {
      // Para retirada, validar apenas nome e whatsapp
      return personalInfoSchema.pick({
        fullName: true,
        whatsapp: true,
      });
    } else {
      // Para entrega, validar todos os campos obrigatórios
      const schema = personalInfoSchema.extend({
        address: z.string().min(5, "Endereço é obrigatório"),
        number: z.string().min(1, "Número é obrigatório"),
        neighborhood: z.string().min(3, "Bairro é obrigatório"),
      });

      // Se a empresa especifica bairros, adicionar validação
      if (deliveryConfig?.especificar_bairros_atendidos) {
        return schema.refine(
          (data) => {
            if (!data.neighborhood) return false;
            return DeliveryConfigService.isValidNeighborhood(
              deliveryConfig,
              data.neighborhood
            );
          },
          {
            message: "Selecione um bairro válido da lista",
            path: ["neighborhood"],
          }
        );
      }

      return schema;
    }
  }, [checkout.deliveryType, deliveryConfig]);

  // Form para dados pessoais com schema dinâmico
  const personalInfoForm = useForm<PersonalInfo>({
    resolver: zodResolver(getDynamicPersonalInfoSchema()),
    defaultValues: checkout.personalInfo,
    mode: "onChange", // Validar ao digitar
  });

  // Form para método de pagamento com validação
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
      // Usar o storage em vez de localStorage
      await storage.setItem(
        "cached_checkout",
        JSON.stringify({
          ...checkout,
          timestamp: Date.now(),
        })
      );
      console.log("Estado do checkout salvo no cache com sucesso");
    } catch (error) {
      console.error("Erro ao salvar cache do checkout:", error);
    }
  }, [checkout]);

  const getCachedCheckout = useCallback(async () => {
    try {
      // Usar o storage em vez de localStorage
      const cachedData = await storage.getItem("cached_checkout");
      if (!cachedData) return null;

      const parsed = JSON.parse(cachedData);

      // Verificar se o cache é recente (menos de 30 minutos)
      const now = Date.now();
      if (now - parsed.timestamp > 30 * 60 * 1000) {
        await storage.removeItem("cached_checkout");
        console.log("Cache do checkout expirado - removido");
        return null;
      }

      return parsed;
    } catch (error) {
      console.error("Erro ao recuperar cache do checkout:", error);
      return null;
    }
  }, []);

  // Helper para limpar cache
  const clearCheckoutCache = useCallback(async () => {
    try {
      await storage.removeItem("cached_checkout");
      console.log("Cache do checkout limpo com sucesso");
    } catch (error) {
      console.error("Erro ao limpar cache:", error);
    }
  }, []);

  // IMPORTANTE: As funções de validação precisam ser declaradas antes de qualquer função que as use
  // Função para validar o passo de dados pessoais
  const validatePersonalInfo = useCallback(() => {
    const { fullName, whatsapp, address, number, neighborhood } =
      checkout.personalInfo;

    // Validação básica independente do tipo de entrega
    const basicInfoValid = !!(
      fullName &&
      fullName.length >= 5 &&
      whatsapp &&
      whatsapp.length >= 11
    );

    // Se não for entrega, apenas valida informações básicas
    if (checkout.deliveryType === CheckoutDeliveryType.PICKUP) {
      return basicInfoValid;
    }

    // Para entrega, valida também o endereço
    const addressValid = !!(
      address &&
      address.length >= 5 &&
      number &&
      number.length >= 1 &&
      neighborhood &&
      neighborhood.length >= 3
    );

    // Se a empresa especifica bairros, verificar se o bairro é atendido
    if (
      deliveryConfig?.especificar_bairros_atendidos &&
      deliveryConfig.bairros_atendidos &&
      deliveryConfig.bairros_atendidos.length > 0
    ) {
      return (
        basicInfoValid &&
        addressValid &&
        DeliveryConfigService.isValidNeighborhood(deliveryConfig, neighborhood)
      );
    }

    return basicInfoValid && addressValid;
  }, [checkout.personalInfo, checkout.deliveryType, deliveryConfig]);

  // Função para validar o passo de método de pagamento
  // Modificações na validação do troco
  const validatePaymentInfo = useCallback(() => {
    const { method, change } = checkout.paymentInfo;

    // Se for dinheiro, precisa ter um valor de troco válido
    if (method === CheckoutPaymentMethod.CASH) {
      if (!change) return false;

      // Determinar o valor total correto baseado no tipo de entrega
      const totalValue =
        checkout.deliveryType === CheckoutDeliveryType.PICKUP
          ? checkout.subtotal
          : checkout.total;

      // Verificar se o valor de troco é maior que o total correto
      const changeValue = parseFloat(change.replace(",", "."));
      return !isNaN(changeValue) && changeValue > totalValue;
    }

    // Para outros métodos, só verifica se tem um método selecionado
    return !!method;
  }, [
    checkout.paymentInfo,
    checkout.total,
    checkout.subtotal,
    checkout.deliveryType,
  ]);

  // Atualizar a validação de todos os steps - IMPORTANTE: declarar após as funções acima
  const updateStepsValidation = useCallback(() => {
    const stepValidation = [
      true, // Primeiro passo sempre é válido (resumo)
      validatePersonalInfo(),
      validatePaymentInfo(),
      true, // Último passo (confirmação) também sempre é válido
    ];

    setStepsValidation(stepValidation);
    return stepValidation;
  }, [validatePersonalInfo, validatePaymentInfo]);

  // Validar o step atual
  const validateCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 0: // Resumo do pedido
        return checkout.items.length > 0;
      case 1: // Dados pessoais
        return validatePersonalInfo();
      case 2: // Forma de pagamento
        return validatePaymentInfo();
      case 3: // Confirmação
        return validatePersonalInfo() && validatePaymentInfo();
      default:
        return true;
    }
  }, [currentStep, checkout, validatePersonalInfo, validatePaymentInfo]);

  // Validar um step específico
  const validateStep = useCallback(
    (step: number) => {
      switch (step) {
        case 0: // Resumo do pedido
          return checkout.items.length > 0;
        case 1: // Dados pessoais
          return validatePersonalInfo();
        case 2: // Forma de pagamento
          return validatePaymentInfo();
        case 3: // Confirmação
          return validatePersonalInfo() && validatePaymentInfo();
        default:
          return true;
      }
    },
    [checkout, validatePersonalInfo, validatePaymentInfo]
  );

  // Revalidar ao mudar o tipo de entrega
  useEffect(() => {
    personalInfoForm.clearErrors();

    // Atualizar o resolver com o schema atualizado
    personalInfoForm.reset(checkout.personalInfo);

    // Resetar os campos de endereço ao mudar para retirada
    if (checkout.deliveryType === CheckoutDeliveryType.PICKUP) {
      setTimeout(() => {
        personalInfoForm.trigger(["fullName", "whatsapp"]);
      }, 100);
    } else {
      // Trigger de validação para campos de endereço quando for entrega
      setTimeout(() => {
        personalInfoForm.trigger();
      }, 100);
    }
  }, [checkout.deliveryType, getDynamicPersonalInfoSchema, personalInfoForm]);

  // Observar mudanças no carrinho durante o checkout
  useEffect(() => {
    if (companySlug && currentStep < 3) {
      // Não atualizar na etapa de confirmação
      const currentCart = cartViewModel.items;

      // Verificar se o carrinho foi alterado
      if (
        currentCart.length !== checkout.items.length ||
        JSON.stringify(currentCart.map((i) => i.id).sort()) !==
          JSON.stringify(checkout.items.map((i) => i.id).sort())
      ) {
        console.log(
          "Carrinho modificado durante checkout - atualizando estado"
        );

        // Recalcular o total com a taxa de entrega
        const isDelivery =
          checkout.deliveryType === CheckoutDeliveryType.DELIVERY;
        const deliveryFee = parseFloat(
          cartViewModel.deliveryFee.replace(/[^\d,]/g, "").replace(",", ".")
        );
        const subtotal = CartProcessorService.calculateOrderTotal(currentCart);
        const total = CartProcessorService.calculateOrderTotalWithDelivery(
          currentCart,
          isDelivery,
          deliveryFee
        );

        // Atualizar checkout com novos itens
        initCheckout(
          currentCart,
          checkout.companyId,
          checkout.companySlug,
          checkout.companyName,
          subtotal,
          total
        );

        // Atualizar o cache com os novos dados
        cacheCheckoutState();
      }
    }
  }, [
    cartViewModel.items,
    cartViewModel.deliveryFee,
    companySlug,
    currentStep,
    checkout.companyId,
    checkout.companyName,
    checkout.companySlug,
    checkout.deliveryType,
    checkout.items,
    cacheCheckoutState,
    initCheckout,
  ]);

  const forcedDeliveryFee = (checkout.total - checkout.subtotal).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );

  // Atualizar tipo de entrega
  const setDeliveryType = (type: CheckoutDeliveryType) => {
    updateDeliveryType(type);

    // Recalcular o total com ou sem taxa de entrega
    const subtotal = checkout.subtotal;
    let total = subtotal;

    if (type === CheckoutDeliveryType.DELIVERY && checkout.deliveryFee > 0) {
      total += checkout.deliveryFee;
    }

    // Atualizar o total no checkout
    checkout.total = total;

    // Gravar no cache
    setTimeout(() => {
      cacheCheckoutState();
      // Revalidar o step
      validateCurrentStep();
      updateStepsValidation();
    }, 100);
  };

  // Função para ir para um step específico com validação
  const goToStep = useCallback(
    (step: number) => {
      // Não permitir ir para um step futuro sem validar os steps anteriores
      if (step > currentStep) {
        // Validar todos os steps anteriores
        for (let i = 0; i <= currentStep; i++) {
          if (!validateStep(i)) {
            toastUtils.error(toast, "Complete a etapa atual antes de avançar");
            return;
          }
        }
      }

      // Atualizar a validação de steps
      updateStepsValidation();

      // Ir para o step
      storeGoToStep(step);
    },
    [currentStep, validateStep, storeGoToStep, toast, updateStepsValidation]
  );

  // Função para avançar ao próximo step com validação
  const nextStep = useCallback(() => {
    // Verificar se o step atual é válido
    if (!validateCurrentStep()) {
      // Mensagens de erro específicas para cada step
      switch (currentStep) {
        case 0:
          if (checkout.items.length === 0) {
            toastUtils.error(toast, "Seu carrinho está vazio");
          } else {
            toastUtils.error(toast, "Selecione uma forma de recebimento");
          }
          break;
        case 1:
          if (checkout.deliveryType === CheckoutDeliveryType.DELIVERY) {
            toastUtils.error(
              toast,
              "Preencha todos os campos de endereço corretamente"
            );
          } else {
            toastUtils.error(
              toast,
              "Preencha seu nome e WhatsApp corretamente"
            );
          }
          break;
        case 2:
          if (checkout.paymentInfo.method === CheckoutPaymentMethod.CASH) {
            toastUtils.error(toast, "Informe um valor válido para troco");
          } else {
            toastUtils.error(toast, "Selecione uma forma de pagamento");
          }
          break;
      }
      return false;
    }

    // Atualizar validação de steps
    const validations = updateStepsValidation();

    // Se o step atual é válido, avançar
    storeNextStep();
    return true;
  }, [
    currentStep,
    validateCurrentStep,
    updateStepsValidation,
    storeNextStep,
    checkout,
    toast,
  ]);

  // Função para voltar ao step anterior
  const prevStep = useCallback(() => {
    // Atualizar validação de steps ao voltar
    setTimeout(() => {
      updateStepsValidation();
    }, 100);

    storePrevStep();
    return true;
  }, [storePrevStep, updateStepsValidation]);

  // Inicializar checkout com dados do carrinho e recuperar dados do usuário
  const initialize = useCallback(async () => {
    setIsLoadingUserData(true);

    // Verificar se o carrinho está vazio
    if (cartViewModel.isEmpty || !companySlug) {
      router.replace(`/(drawer)/empresa/${companySlug}`);
      return;
    }

    // Obter a taxa de entrega atual
    const isDelivery = cartViewModel.isDelivery;
    let deliveryFee = parseFloat(
      cartViewModel.deliveryFee.replace(/[^\d,]/g, "").replace(",", ".")
    );

    // Tentar recuperar o estado anterior do checkout do cache
    const cachedCheckout = await getCachedCheckout();
    const currentCartItems = cartViewModel.items;
    const currentCartTotal =
      CartProcessorService.calculateOrderTotal(currentCartItems);

    // Calcular subtotal e total com taxa de entrega
    const subtotal = CartProcessorService.calculateOrderTotal(currentCartItems);
    const total = CartProcessorService.calculateOrderTotalWithDelivery(
      currentCartItems,
      isDelivery,
      deliveryFee
    );

    // Se a taxa de entrega não puder ser analisada, tentar obter da configuração da empresa
    if (isNaN(deliveryFee) || deliveryFee === 0) {
      try {
        // Tentar obter a taxa de entrega da configuração da empresa
        const companyData = await api.get(
          `/api/companies/profile/${companySlug}`
        );
        if (companyData?.data?.data?.delivery) {
          const config = {
            delivery: companyData.data.data.delivery,
          };
          deliveryFee = DeliveryInfoService.getDeliveryFee(config);
        }
      } catch (error) {
        console.error("Erro ao obter taxa de entrega:", error);
        deliveryFee = 0;
      }
    }

    // Se o checkout é para a mesma empresa, combine o estado em cache com o carrinho atual
    if (cachedCheckout && cachedCheckout.companySlug === companySlug) {
      // Compare os itens do cache com os itens atuais do carrinho
      const cachedItemIds = new Set(
        cachedCheckout.items.map((item: any) => item.id)
      );
      const currentItemIds = new Set(currentCartItems.map((item) => item.id));

      // Verificar se há diferenças entre os itens
      const hasNewItems = currentCartItems.some(
        (item) => !cachedItemIds.has(item.id)
      );
      const hasMissingItems = cachedCheckout.items.some(
        (item: any) => !currentItemIds.has(item.id)
      );

      if (hasNewItems || hasMissingItems) {
        // Inicializa com os itens atuais do carrinho, mas mantém os dados pessoais e pagamento
        initCheckout(
          currentCartItems,
          cachedCheckout.companyId,
          cachedCheckout.companySlug,
          cachedCheckout.companyName,
          subtotal,
          total
        );

        // Definir o tipo de entrega para manter a consistência com o carrinho
        updateDeliveryType(
          isDelivery
            ? CheckoutDeliveryType.DELIVERY
            : CheckoutDeliveryType.PICKUP
        );

        // Restaurar dados pessoais e de pagamento do cache
        updatePersonalInfo(cachedCheckout.personalInfo);
        updatePaymentInfo(cachedCheckout.paymentInfo);
      } else {
        // Se os itens são os mesmos, use o cache normalmente
        initCheckout(
          cachedCheckout.items,
          cachedCheckout.companyId,
          cachedCheckout.companySlug,
          cachedCheckout.companyName,
          subtotal,
          total
        );

        // Definir o tipo de entrega para manter a consistência com o carrinho
        updateDeliveryType(
          isDelivery
            ? CheckoutDeliveryType.DELIVERY
            : CheckoutDeliveryType.PICKUP
        );

        updatePersonalInfo(cachedCheckout.personalInfo);
        updatePaymentInfo(cachedCheckout.paymentInfo);
      }

      // Reset dos formulários com dados do cache
      setTimeout(() => {
        personalInfoForm.reset(cachedCheckout.personalInfo);
        paymentInfoForm.reset(cachedCheckout.paymentInfo);
      }, 100);

      // Atualizar validação de steps
      updateStepsValidation();

      setIsLoadingUserData(false);
      return;
    }

    // Se não há cache válido, processa os itens do carrinho
    initCheckout(
      currentCartItems,
      currentCartItems[0]?.companyId || "",
      companySlug,
      cartViewModel.companyName || "",
      subtotal,
      total
    );

    // Configurar o tipo de entrega com base no estado do carrinho
    updateDeliveryType(
      isDelivery ? CheckoutDeliveryType.DELIVERY : CheckoutDeliveryType.PICKUP
    );

    // Tenta recuperar os dados do usuário
    try {
      const savedUserData = await userPersistenceService.getUserPersonalInfo();
      if (savedUserData && savedUserData.fullName && savedUserData.whatsapp) {
        // Atualiza os dados pessoais no checkout
        updatePersonalInfo(savedUserData);

        // Reset do formulário com os dados carregados
        setTimeout(() => {
          personalInfoForm.reset(savedUserData);
          personalInfoForm.trigger();

          // Atualizar validação de steps
          updateStepsValidation();
        }, 100);

        // Mostrar feedback visual de que os dados foram carregados
        toastUtils.info(toast, "Seus dados foram carregados automaticamente");
      }
    } catch (error) {
      console.error("Erro ao recuperar dados do usuário:", error);
    } finally {
      setIsLoadingUserData(false);
    }
  }, [
    cartViewModel,
    companySlug,
    initCheckout,
    updateDeliveryType,
    updatePersonalInfo,
    updatePaymentInfo,
    getCachedCheckout,
    toast,
    personalInfoForm,
    paymentInfoForm,
    updateStepsValidation,
  ]);

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
          return false;
        }

        // Se a empresa especifica bairros, verificar se o bairro selecionado é válido
        if (
          deliveryConfig?.especificar_bairros_atendidos &&
          deliveryConfig.bairros_atendidos &&
          deliveryConfig.bairros_atendidos.length > 0
        ) {
          const isValidNeighborhood = DeliveryConfigService.isValidNeighborhood(
            deliveryConfig,
            data.neighborhood || ""
          );

          if (!isValidNeighborhood) {
            toastUtils.error(
              toast,
              "O bairro selecionado não é atendido para entrega"
            );
            return false;
          }
        }
      }

      // Atualiza no checkout
      updatePersonalInfo(data);

      // Salvar no cache
      await cacheCheckoutState();

      // Persiste localmente para reuso futuro
      await userPersistenceService.saveUserPersonalInfo(data);

      // Atualizar validação de steps
      const validations = updateStepsValidation();

      // Avança para o próximo passo
      storeNextStep();
      return true;
    } catch (error) {
      console.error("Erro ao salvar dados pessoais:", error);
      toastUtils.error(toast, "Erro ao salvar seus dados");
      return false;
    }
  };

  // Salvar método de pagamento e avançar
  const savePaymentInfo = async (data: PaymentInfo) => {
    try {
      // Validação especial para pagamento em dinheiro (cash)
      if (data.method === CheckoutPaymentMethod.CASH) {
        if (!data.change) {
          toastUtils.error(toast, "Informe um valor para troco");
          return false;
        }

        // Determinar o valor total correto baseado no tipo de entrega
        const totalValue =
          checkout.deliveryType === CheckoutDeliveryType.PICKUP
            ? checkout.subtotal
            : checkout.total;

        // Certifique-se de que o valor de troco é um número válido e maior que o total do pedido
        const changeValue = parseFloat(data.change.replace(",", "."));

        if (isNaN(changeValue)) {
          toastUtils.error(toast, "Valor de troco inválido");
          return false;
        }

        if (changeValue <= totalValue) {
          toastUtils.error(
            toast,
            `Valor para troco deve ser maior que ${totalValue.toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              }
            )}`
          );
          return false;
        }
      }

      updatePaymentInfo(data);

      // Salvar no cache
      await cacheCheckoutState();

      // Atualizar validação de steps
      updateStepsValidation();

      storeNextStep();
      return true;
    } catch (error) {
      console.error("Erro ao salvar forma de pagamento:", error);
      toastUtils.error(toast, "Erro ao salvar forma de pagamento");
      return false;
    }
  };

  // Finalizar o pedido e criar um registro no OrderStore
  const finalizeOrder = async () => {
    setIsProcessing(true);

    try {
      // Validar todas as etapas antes de finalizar
      if (!validateStep(1) || !validateStep(2)) {
        toastUtils.error(
          toast,
          "Complete todas as etapas antes de finalizar o pedido"
        );
        setIsProcessing(false);
        return false;
      }

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

      // Processar os itens para obter o subtotal
      const subtotal = CartProcessorService.calculateOrderTotal(checkout.items);

      // Obter o valor da taxa de entrega
      const deliveryFee =
        checkout.deliveryType === CheckoutDeliveryType.DELIVERY
          ? checkout.deliveryFee
          : 0;

      // Calcular o total final com base no tipo de entrega
      const finalTotal =
        checkout.deliveryType === CheckoutDeliveryType.PICKUP
          ? subtotal
          : subtotal + deliveryFee;

      // Preparar itens para o OrderStore, mantendo a estrutura original de cada item
      const orderItems = [...checkout.items];

      // Criar pedido no OrderStore com os valores corretos
      const order = orderStore.createOrder(
        orderItems,
        checkout.companyId,
        checkout.companySlug,
        checkout.companyName,
        companyPhone
      );

      // Atualizar o pedido com os valores corretos
      order.deliveryFee = deliveryFee;
      order.total = finalTotal; // Usar o total final calculado corretamente

      // Construir mensagem para WhatsApp usando o serviço
      const message = CartProcessorService.formatWhatsAppMessage(checkout);

      // Número da empresa
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
      return true;
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      toastUtils.error(toast, "Erro ao enviar pedido");
      return false;
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

      toastUtils.error(toast, "Não foi possível abrir o WhatsApp");
      return false;
    } catch (error) {
      console.error("Erro ao abrir WhatsApp:", error);
      return false;
    }
  };

  // Efeito para atualizar a validação dos steps quando necessário
  useEffect(() => {
    updateStepsValidation();
  }, [checkout, updateStepsValidation]);

  return {
    // Estado
    checkout,
    currentStep,
    isProcessing,
    isLoadingUserData,
    stepsValidation,
    deliveryConfig,
    isLoadingDeliveryConfig,
    neighborhoods,

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
    nextStep,
    prevStep,
    validateCurrentStep,
    validateStep,
    updateStepsValidation,
    forcedDeliveryFee,
  };
}
