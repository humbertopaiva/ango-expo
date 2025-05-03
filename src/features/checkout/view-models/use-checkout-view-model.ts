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
      // Para entrega, validar todos os campos
      return personalInfoSchema;
    }
  }, [checkout.deliveryType]);

  // Inicializar checkout com dados do carrinho e recuperar dados do usuário
  const initialize = useCallback(async () => {
    if (cartViewModel.isEmpty || !companySlug) {
      router.replace(`/(drawer)/empresa/${companySlug}`);
      return;
    }

    // Processa os itens para obter o total real
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
        // Importante para garantir que o formulário seja preenchido corretamente
        setTimeout(() => {
          personalInfoForm.reset(savedUserData);
        }, 100);
      }
    } catch (error) {
      console.error("Erro ao recuperar dados do usuário:", error);
    }
  }, [cartViewModel, companySlug]);

  // Form para dados pessoais com schema dinâmico
  const personalInfoForm = useForm<PersonalInfo>({
    resolver: zodResolver(getDynamicPersonalInfoSchema()),
    defaultValues: checkout.personalInfo,
    mode: "onChange", // Validar ao digitar
  });

  useEffect(() => {
    personalInfoForm.clearErrors();
    personalInfoForm.reset(checkout.personalInfo);
  }, [checkout.deliveryType]);

  // Form para método de pagamento
  const paymentInfoForm = useForm<PaymentInfo>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: checkout.paymentInfo,
  });

  // Atualizar tipo de entrega
  const setDeliveryType = (type: CheckoutDeliveryType) => {
    updateDeliveryType(type);
  };

  // Salvar dados pessoais, persistir localmente e avançar
  const savePersonalInfo = async (data: PersonalInfo) => {
    try {
      // Atualiza no checkout
      updatePersonalInfo(data);

      // Persiste localmente
      await userPersistenceService.saveUserPersonalInfo(data);

      // Avança para o próximo passo
      nextStep();
    } catch (error) {
      console.error("Erro ao salvar dados pessoais:", error);
      toastUtils.error(toast, "Erro ao salvar seus dados");
    }
  };

  // Salvar método de pagamento e avançar
  const savePaymentInfo = (data: PaymentInfo) => {
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
      nextStep();
    } catch (error) {
      console.error("Erro ao salvar forma de pagamento:", error);
      toastUtils.error(toast, "Erro ao salvar forma de pagamento");
    }
  };

  // Finalizar o pedido e criar um registro no OrderStore
  const finalizeOrder = async () => {
    setIsProcessing(true);

    try {
      // Buscar o telefone da empresa, se disponível
      let companyPhone = undefined;

      try {
        // Implementação depende de como você acessa os dados da empresa
        // Pode ser via context, API, ou outro mecanismo
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
    nextStep,
  };
}
