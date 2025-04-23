// Path: src/features/products/screens/variation-new-screen.tsx

import React, { useRef, useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "@gluestack-ui/themed";
import { router } from "expo-router";
import { Tag } from "lucide-react-native";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import {
  VariationTypeForm,
  VariationTypeFormRef,
} from "../components/variation-type-form";
import { FormActions } from "@/components/custom/form-actions";
import useAuthStore from "@/src/stores/auth";
import { useVariationTypes } from "../hooks/use-variation-types";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";

export function VariationNewScreen() {
  const toast = useToast();
  const companyId = useAuthStore((state) => state.getCompanyId());
  const { createVariation, isCreating, refetch } = useVariationTypes();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<VariationTypeFormRef>(null);

  // Forçar refetch ao montar o componente
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSubmit = async (data: { nome: string; variacao: string[] }) => {
    if (!companyId) {
      showErrorToast(toast, "ID da empresa não encontrado");
      return;
    }

    try {
      setIsSubmitting(true);

      // Simplificando o modelo: apenas nome, empresa e os valores da variação
      await createVariation({
        nome: data.nome,
        variacao: data.variacao,
        empresa: companyId,
      });

      showSuccessToast(toast, "Tipo de variação criado com sucesso!");

      // Forçar refetch imediatamente
      await refetch();

      // Navegar de volta após breve delay
      setTimeout(() => {
        router.push("/admin/products/variations/types");
      }, 500);
    } catch (error) {
      console.error("Erro ao criar tipo de variação:", error);
      showErrorToast(toast, "Erro ao criar tipo de variação");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AdminScreenHeader
        title="Nova Variação"
        backTo="/admin/products/variations/types"
      />

      <ScrollView className="flex-1 p-4">
        <View className="bg-blue-50 p-4 rounded-lg mb-6">
          <View className="flex-row items-center mb-2">
            <Tag size={20} color="#1E40AF" />
            <Text className="ml-2 text-blue-800 font-medium">
              O que são variações?
            </Text>
          </View>
          <Text className="text-blue-700">
            Variações são características dos produtos que podem ter diferentes
            opções, como tamanhos, cores ou materiais. Aqui você cria os tipos
            de variação que poderão ser associados a produtos posteriormente.
          </Text>
        </View>

        <VariationTypeForm
          ref={formRef}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting || isCreating}
        />

        <View className="h-20" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <FormActions
          primaryAction={{
            label:
              isSubmitting || isCreating ? "Salvando..." : "Criar Variação",
            onPress: () => formRef.current?.handleSubmit(),
            isLoading: isSubmitting || isCreating,
          }}
          secondaryAction={{
            label: "Cancelar",
            onPress: () => router.back(),
            variant: "outline",
            isDisabled: isSubmitting || isCreating,
          }}
        />
      </View>
    </SafeAreaView>
  );
}
