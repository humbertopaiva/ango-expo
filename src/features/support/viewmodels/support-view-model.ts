// Path: src/features/support/viewmodels/support-view-model.ts
import { useState, useEffect } from "react";
import { supportService } from "../services/support-service";
import { SupportInfo } from "../models/support";
import { useToast } from "@gluestack-ui/themed";
import { toastUtils } from "@/src/utils/toast.utils";

export function useSupportViewModel() {
  const [supportInfo, setSupportInfo] = useState<SupportInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const toast = useToast();

  useEffect(() => {
    loadSupportInfo();
  }, []);

  const loadSupportInfo = () => {
    try {
      setIsLoading(true);
      const data = supportService.getSupportInfo();
      setSupportInfo(data);
      setMessage(data.defaultMessage);
    } catch (err) {
      console.error("Erro ao carregar informações de suporte:", err);
      toastUtils.error(toast, "Erro ao carregar informações de suporte");
    } finally {
      setIsLoading(false);
    }
  };

  const sendWhatsAppMessage = async () => {
    if (!supportInfo) return false;

    try {
      const success = await supportService.sendWhatsAppMessage(
        supportInfo.contact.phone,
        message
      );

      if (success) {
        toastUtils.success(toast, "Redirecionando para o WhatsApp");
        return true;
      } else {
        toastUtils.error(toast, "Não foi possível abrir o WhatsApp");
        return false;
      }
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      toastUtils.error(toast, "Erro ao enviar mensagem");
      return false;
    }
  };

  return {
    supportInfo,
    isLoading,
    message,
    setMessage,
    sendWhatsAppMessage,
  };
}
