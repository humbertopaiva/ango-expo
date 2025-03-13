// Path: src/features/checkout/utils/checkout.utils.ts
import { CartItem } from "@/src/features/cart/models/cart";
import {
  CheckoutData,
  CheckoutDeliveryType,
  CheckoutPaymentMethod,
} from "../models/checkout";
import { formatCurrency } from "@/src/utils/format.utils";
import { Linking } from "react-native";

/**
 * Formata a mensagem para envio via WhatsApp
 */
export function formatWhatsAppMessage(checkout: CheckoutData): string {
  const { items, personalInfo, paymentInfo, deliveryType, companyName, total } =
    checkout;

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
}

/**
 * Envia mensagem pelo WhatsApp
 */
export async function sendWhatsAppMessage(
  message: string,
  phoneNumber: string
): Promise<void> {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  const canOpen = await Linking.canOpenURL(whatsappUrl);

  if (canOpen) {
    await Linking.openURL(whatsappUrl);
  } else {
    throw new Error("Não foi possível abrir o WhatsApp");
  }
}
