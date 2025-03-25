// Path: src/features/about/viewmodels/about-view-model.ts
import { useState, useEffect } from "react";
import { AboutInfo } from "../models/about";
import { aboutService } from "../services/about-service";
import { whatsappUtils } from "@/src/utils/whatsapp.utils";

export function useAboutViewModel() {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAboutInfo();
  }, []);

  const loadAboutInfo = () => {
    try {
      setIsLoading(true);
      const data = aboutService.getAboutInfo();
      setAboutInfo(data);
    } catch (error) {
      console.error("Erro ao carregar informações sobre a empresa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const contactViaWhatsApp = async () => {
    if (!aboutInfo) return false;

    const message =
      "Olá! Vi o site do Limei e gostaria de fazer parte dessa iniciativa!";
    try {
      return await whatsappUtils.openWhatsApp(
        aboutInfo.contact.whatsapp,
        message
      );
    } catch (error) {
      console.error("Erro ao abrir WhatsApp:", error);
      return false;
    }
  };

  return {
    aboutInfo,
    isLoading,
    contactViaWhatsApp,
  };
}
