// Path: src/utils/whatsapp.utils.ts

import { Linking } from "react-native";

export const whatsappUtils = {
  /**
   * Formata um número de telefone para ser usado com a API do WhatsApp
   * @param phone Número de telefone (pode conter formatação)
   * @returns Número formatado para API do WhatsApp
   */
  formatPhoneForWhatsApp(phone: string): string {
    // Remover todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, "");

    // Se não começar com o código do país, adicionar o código do Brasil
    return cleaned.startsWith("55") ? cleaned : `55${cleaned}`;
  },

  /**
   * Abre o WhatsApp com uma mensagem predefinida
   * @param phone Número de telefone (com ou sem formatação)
   * @param message Mensagem a ser enviada
   * @returns Promise que resolve para true se o WhatsApp foi aberto com sucesso
   */
  async openWhatsApp(phone: string, message: string = ""): Promise<boolean> {
    try {
      const formattedPhone = this.formatPhoneForWhatsApp(phone);
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
        message
      )}`;

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
  },

  /**
   * Cria uma mensagem padrão para um pedido
   * @param orderId ID do pedido
   * @param orderDate Data do pedido
   * @param additionalInfo Informações adicionais
   * @returns String formatada para mensagem
   */
  createOrderMessage(
    orderId: string,
    orderDate: Date,
    additionalInfo: string = ""
  ): string {
    const orderCode = orderId.replace("order_", "").substring(0, 6);
    const formattedDate = new Date(orderDate).toLocaleDateString();

    let message = `Olá! Gostaria de falar sobre meu pedido #${orderCode} feito em ${formattedDate}.`;

    if (additionalInfo) {
      message += ` ${additionalInfo}`;
    }

    return message;
  },
};
