// Path: src/features/support/services/support-service.ts
import { SupportInfo } from "../models/support";
import { whatsappUtils } from "@/src/utils/whatsapp.utils";

export const supportService = {
  getSupportInfo(): SupportInfo {
    // Em um cenário real, você buscaria isso da API
    return {
      contact: {
        phone: "32988555409",
        email: "suporte@marketplace.com.br",
        hours: "Segunda a Sábado, até 19h",
      },
      defaultMessage:
        "Olá! Estou com uma dúvida sobre o marketplace. Poderia me ajudar?",
    };
  },

  async sendWhatsAppMessage(phone: string, message: string): Promise<boolean> {
    try {
      return await whatsappUtils.openWhatsApp(phone, message);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      return false;
    }
  },
};
