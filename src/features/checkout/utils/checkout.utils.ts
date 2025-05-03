// Path: src/features/checkout/utils/checkout.utils.ts

import { Linking } from "react-native";
import { CheckoutData } from "../models/checkout";
import { CartProcessorService } from "../services/cart-processor.service";

/**
 * Aplicar máscara de telefone no formato (99) 9 9999-9999
 * @param phone Número de telefone (apenas dígitos)
 * @returns Número formatado ou string vazia se vazio
 */
export function maskPhoneNumber(phone: string): string {
  // Se o valor for vazio ou undefined, retorna string vazia
  if (!phone) return "";

  // Remover qualquer caracter não numérico
  const numericValue = phone.replace(/\D/g, "");

  // Se não tiver dígitos, retorna string vazia
  if (numericValue.length === 0) return "";

  // Aplicar máscara dependendo do comprimento
  if (numericValue.length <= 2) {
    return `(${numericValue}`;
  } else if (numericValue.length <= 3) {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
  } else if (numericValue.length <= 7) {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(
      2,
      3
    )} ${numericValue.slice(3)}`;
  } else if (numericValue.length <= 11) {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(
      2,
      3
    )} ${numericValue.slice(3, 7)}-${numericValue.slice(7)}`;
  } else {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(
      2,
      3
    )} ${numericValue.slice(3, 7)}-${numericValue.slice(7, 11)}`;
  }
}

/**
 * Formatar mensagem WhatsApp para pedido
 * @param checkoutData Dados do checkout
 * @returns Mensagem formatada
 */
export function formatWhatsAppMessage(checkoutData: CheckoutData): string {
  return CartProcessorService.formatWhatsAppMessage(checkoutData);
}

/**
 * Enviar mensagem WhatsApp
 * @param message Mensagem a enviar
 * @param phone Número de telefone
 * @returns Promise<boolean> Sucesso do envio
 */
export async function sendWhatsAppMessage(
  message: string,
  phone: string
): Promise<boolean> {
  try {
    // Remover caracteres não numéricos do telefone
    const cleanedPhone = phone.replace(/\D/g, "");

    // Construir URL
    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(
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
    console.error("Erro ao enviar mensagem WhatsApp:", error);
    return false;
  }
}
