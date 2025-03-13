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
import {
  formatWhatsAppMessage,
  sendWhatsAppMessage,
} from "../utils/checkout.utils";
import { z } from "zod";

export function useCheckoutViewModel() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();
  const cartViewModel = useCartViewModel();
  const toast = useToast();

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
      return z.object({
        fullName: z.string().min(5, "Nome completo é obrigatório"),
        whatsapp: z
          .string()
          .min(11, "Número de WhatsApp inválido")
          .max(15, "Número de WhatsApp inválido"),
        address: z.string().optional(),
        number: z.string().optional(),
        neighborhood: z.string().optional(),
        reference: z.string().optional(),
      });
    } else {
      // Para entrega, validar todos os campos
      return z.object({
        fullName: z.string().min(5, "Nome completo é obrigatório"),
        whatsapp: z
          .string()
          .min(11, "Número de WhatsApp inválido")
          .max(15, "Número de WhatsApp inválido"),
        address: z.string().min(5, "Endereço é obrigatório"),
        number: z.string().min(1, "Número é obrigatório"),
        neighborhood: z.string().min(3, "Bairro é obrigatório"),
        reference: z.string().optional(),
      });
    }
  }, [checkout.deliveryType]);

  // Inicializar checkout com dados do carrinho
  const initialize = useCallback(() => {
    if (cartViewModel.isEmpty || !companySlug) {
      router.replace(`/(drawer)/empresa/${companySlug}`);
      return;
    }

    initCheckout(
      cartViewModel.items,
      cartViewModel.items[0]?.companyId || "",
      companySlug,
      cartViewModel.companyName || "",
      parseFloat(
        cartViewModel.subtotal.replace(/[^\d,]/g, "").replace(",", ".")
      ),
      parseFloat(cartViewModel.total.replace(/[^\d,]/g, "").replace(",", "."))
    );
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

  // Salvar dados pessoais e avançar
  const savePersonalInfo = async (data: PersonalInfo) => {
    try {
      updatePersonalInfo(data);
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

  // Concluir o pedido
  const finalizeOrder = async () => {
    setIsProcessing(true);

    try {
      // Construir mensagem para WhatsApp
      const message = formatWhatsAppMessage(checkout);

      // Número da empresa (idealmente seria obtido do perfil da empresa)
      // Por enquanto, usamos um número de exemplo
      const companyPhone = "5532999999999"; // Substitua pelo número real

      // Enviar mensagem para o WhatsApp
      await sendWhatsAppMessage(message, companyPhone);

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

  // Construir mensagem para WhatsApp
  const constructWhatsAppMessage = (): string => {
    const {
      items,
      personalInfo,
      paymentInfo,
      deliveryType,
      companyName,
      total,
    } = checkout;

    // Cabeçalho
    let message = `*NOVO PEDIDO - ${companyName}*\n\n`;

    // Tipo de entrega
    message += `*Tipo de entrega:* ${
      deliveryType === CheckoutDeliveryType.DELIVERY
        ? "Entrega"
        : "Retirada no local"
    }\n\n`;

    // Dados do cliente
    message += `*DADOS DO CLIENTE:*\n`;
    message += `Nome: ${personalInfo.fullName}\n`;
    message += `WhatsApp: ${personalInfo.whatsapp}\n`;

    // Endereço (se for entrega)
    if (deliveryType === CheckoutDeliveryType.DELIVERY) {
      message += `\n*ENDEREÇO DE ENTREGA:*\n`;
      message += `${personalInfo.address}, ${personalInfo.number}\n`;
      message += `Bairro: ${personalInfo.neighborhood}\n`;
      message += `Cidade: Lima Duarte (MG)\n`;

      if (personalInfo.reference) {
        message += `Ponto de referência: ${personalInfo.reference}\n`;
      }
    }

    // Itens do pedido
    message += `\n*ITENS DO PEDIDO:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.quantity}x ${item.name} - ${
        item.totalPriceFormatted
      }\n`;

      if (item.observation) {
        message += `   Obs: ${item.observation}\n`;
      }
    });

    // Forma de pagamento
    message += `\n*PAGAMENTO:*\n`;
    let paymentMethodText = "";

    switch (paymentInfo.method) {
      case CheckoutPaymentMethod.PIX:
        paymentMethodText = "PIX";
        break;
      case CheckoutPaymentMethod.CREDIT_CARD:
        paymentMethodText = "Cartão de Crédito";
        break;
      case CheckoutPaymentMethod.DEBIT_CARD:
        paymentMethodText = "Cartão de Débito";
        break;
      case CheckoutPaymentMethod.CASH:
        paymentMethodText = "Dinheiro";
        if (paymentInfo.change) {
          paymentMethodText += ` (Troco para R$ ${paymentInfo.change})`;
        }
        break;
    }

    message += `Forma de pagamento: ${paymentMethodText}\n`;
    message += `Total: ${formatCurrency(total)}\n\n`;

    // Agradecimento
    message += `Obrigado pelo seu pedido!`;

    return message;
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
