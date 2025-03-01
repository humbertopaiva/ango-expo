// Path: src/features/profile/view-models/profile.view-model.ts

import { useState, useCallback } from "react";
import { IProfileViewModel } from "./profile.view-model.interface";
import { useProfile } from "../hooks/use-profile";
import { UpdateProfileDTO } from "../models/profile";
import { useToast } from "@gluestack-ui/themed";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";

export function useProfileViewModel(companyId: string): IProfileViewModel {
  const { profile, isLoading, updateProfile, isUpdating } =
    useProfile(companyId);
  const toast = useToast();

  // Local state
  const [state, setState] = useState<{
    activeTab: IProfileViewModel["activeTab"];
    isBasicInfoOpen: boolean;
    isContactInfoOpen: boolean;
    isSocialLinksOpen: boolean;
    isHoursOpen: boolean;
    isVisualOpen: boolean;
    isPaymentOpen: boolean;
    isAdditionalOpen: boolean;
  }>({
    activeTab: "basic",
    isBasicInfoOpen: false,
    isContactInfoOpen: false,
    isSocialLinksOpen: false,
    isHoursOpen: false,
    isVisualOpen: false,
    isPaymentOpen: false,
    isAdditionalOpen: false,
  });

  // Setters
  const setActiveTab = useCallback((tab: IProfileViewModel["activeTab"]) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  const setIsBasicInfoOpen = useCallback((isOpen: boolean) => {
    setState((prev) => ({ ...prev, isBasicInfoOpen: isOpen }));
  }, []);

  const setIsContactInfoOpen = useCallback((isOpen: boolean) => {
    setState((prev) => ({ ...prev, isContactInfoOpen: isOpen }));
  }, []);

  const setIsSocialLinksOpen = useCallback((isOpen: boolean) => {
    setState((prev) => ({ ...prev, isSocialLinksOpen: isOpen }));
  }, []);

  const setIsHoursOpen = useCallback((isOpen: boolean) => {
    setState((prev) => ({ ...prev, isHoursOpen: isOpen }));
  }, []);

  const setIsVisualOpen = useCallback((isOpen: boolean) => {
    setState((prev) => ({ ...prev, isVisualOpen: isOpen }));
  }, []);

  const setIsPaymentOpen = useCallback((isOpen: boolean) => {
    setState((prev) => ({ ...prev, isPaymentOpen: isOpen }));
  }, []);

  const setIsAdditionalOpen = useCallback((isOpen: boolean) => {
    setState((prev) => ({ ...prev, isAdditionalOpen: isOpen }));
  }, []);

  // Função genérica para manipular atualizações
  const handleUpdate = useCallback(
    async (section: string, data: UpdateProfileDTO) => {
      if (!profile?.id) return;

      try {
        await updateProfile({ id: profile.id, data });
        closeModals();
        showSuccessToast(toast, `${section} atualizado com sucesso!`);
      } catch (error) {
        console.error(`Erro ao atualizar ${section}:`, error);
        showErrorToast(
          toast,
          `Não foi possível atualizar ${section}. Tente novamente.`
        );
      }
    },
    [profile, updateProfile, toast]
  );

  // Handlers
  const handleUpdateBasicInfo = useCallback(
    (data: UpdateProfileDTO) => {
      handleUpdate("Informações básicas", data);
    },
    [handleUpdate]
  );

  const handleUpdateContactInfo = useCallback(
    (data: UpdateProfileDTO) => {
      handleUpdate("Informações de contato", data);
    },
    [handleUpdate]
  );

  const handleUpdateSocialLinks = useCallback(
    (data: UpdateProfileDTO) => {
      handleUpdate("Redes sociais", data);
    },
    [handleUpdate]
  );

  const handleUpdateHours = useCallback(
    (data: UpdateProfileDTO) => {
      handleUpdate("Horários de funcionamento", data);
    },
    [handleUpdate]
  );

  const handleUpdateVisual = useCallback(
    (data: UpdateProfileDTO) => {
      handleUpdate("Identidade visual", data);
    },
    [handleUpdate]
  );

  const handleUpdatePayment = useCallback(
    (data: UpdateProfileDTO) => {
      handleUpdate("Opções de pagamento", data);
    },
    [handleUpdate]
  );

  const handleUpdateAdditional = useCallback(
    (data: UpdateProfileDTO) => {
      handleUpdate("Informações adicionais", data);
    },
    [handleUpdate]
  );

  const closeModals = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isBasicInfoOpen: false,
      isContactInfoOpen: false,
      isSocialLinksOpen: false,
      isHoursOpen: false,
      isVisualOpen: false,
      isPaymentOpen: false,
      isAdditionalOpen: false,
    }));
  }, []);

  return {
    // Estados
    profile: profile ?? null,
    isLoading,
    isUpdating,
    activeTab: state.activeTab,

    // Estados de modais
    isBasicInfoOpen: state.isBasicInfoOpen,
    isContactInfoOpen: state.isContactInfoOpen,
    isSocialLinksOpen: state.isSocialLinksOpen,
    isHoursOpen: state.isHoursOpen,
    isVisualOpen: state.isVisualOpen,
    isPaymentOpen: state.isPaymentOpen,
    isAdditionalOpen: state.isAdditionalOpen,

    // Setters
    setActiveTab,
    setIsBasicInfoOpen,
    setIsContactInfoOpen,
    setIsSocialLinksOpen,
    setIsHoursOpen,
    setIsVisualOpen,
    setIsPaymentOpen,
    setIsAdditionalOpen,

    // Handlers
    handleUpdateBasicInfo,
    handleUpdateContactInfo,
    handleUpdateSocialLinks,
    handleUpdateHours,
    handleUpdateVisual,
    handleUpdatePayment,
    handleUpdateAdditional,
    closeModals,
  };
}
