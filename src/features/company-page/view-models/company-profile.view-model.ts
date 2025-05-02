// Path: src/features/company-page/view-models/company-profile.view-model.ts
import { useState, useCallback } from "react";
import { useToast } from "@gluestack-ui/themed";
import { PersonalInfo } from "@/src/features/checkout/models/checkout";
import { userPersistenceService } from "@/src/services/user-persistence.service";
import { toastUtils } from "@/src/utils/toast.utils";

export function useCompanyProfileViewModel() {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<PersonalInfo | null>(null);
  const toast = useToast();

  // Carregar dados do usuário
  const loadUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userPersistenceService.getUserPersonalInfo();
      setUserData(data);
      return data;
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      toastUtils.error(toast, "Erro ao carregar dados");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar dados do usuário
  const saveUserData = useCallback(async (data: PersonalInfo) => {
    setIsLoading(true);
    try {
      await userPersistenceService.saveUserPersonalInfo(data);
      setUserData(data);
      toastUtils.success(toast, "Dados salvos com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      toastUtils.error(toast, "Erro ao salvar dados");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Limpar dados do usuário
  const clearUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      await userPersistenceService.clearUserPersonalInfo();
      setUserData(null);
      toastUtils.success(toast, "Dados removidos com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao limpar dados:", error);
      toastUtils.error(toast, "Erro ao limpar dados");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    userData,
    loadUserData,
    saveUserData,
    clearUserData,
  };
}
