// Path: src/features/products/screens/variation-edit-screen.tsx

import React, { useRef, useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "@gluestack-ui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { Tag } from "lucide-react-native";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import {
  VariationTypeForm,
  VariationTypeFormRef,
} from "../components/variation-type-form";
import { FormActions } from "@/components/custom/form-actions";
import { useVariationTypes } from "../hooks/use-variation-types";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import { THEME_COLORS } from "@/src/styles/colors";

export function VariationEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const { variations, updateVariation, isUpdating, isLoading, refetch } =
    useVariationTypes();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<VariationTypeFormRef>(null);

  // Forçar refetch ao montar o componente
  useEffect(() => {
    refetch();
  }, [refetch, id]);

  // Encontrar a variação pelo ID
  const variation = variations.find((v) => v.id === id);

  const handleSubmit = async (data: { nome: string; variacao: string[] }) => {
    if (!id) {
      showErrorToast(toast, "ID da variação não encontrado");
      return;
    }

    try {
      setIsSubmitting(true);

      await updateVariation({
        id,
        data: {
          nome: data.nome,
          variacao: data.variacao,
        },
      });

      showSuccessToast(toast, "Tipo de variação atualizado com sucesso!");

      // Forçar refetch imediatamente
      await refetch();

      // Navegar de volta após breve delay
      setTimeout(() => {
        router.push("/admin/products/variations/types");
      }, 500);
    } catch (error) {
      console.error("Erro ao atualizar tipo de variação:", error);
      showErrorToast(toast, "Erro ao atualizar tipo de variação");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Exibir loading se estiver carregando dados
  if (isLoading || (!variation && !isLoading)) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <AdminScreenHeader
          title="Editar Variação"
          backTo="/admin/products/variations/types"
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text className="mt-4 text-gray-500">
            Carregando dados da variação...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AdminScreenHeader
        title="Editar Variação"
        backTo="/admin/products/variations/types"
      />

      <ScrollView className="flex-1 p-4">
        <View className="bg-blue-50 p-4 rounded-lg mb-6">
          <View className="flex-row items-center mb-2">
            <Tag size={20} color="#1E40AF" />
            <Text className="ml-2 text-blue-800 font-medium">
              Editando: {variation?.nome}
            </Text>
          </View>
          <Text className="text-blue-700">
            Você está editando um tipo de variação existente. Altere o nome ou
            as opções de variação conforme necessário.
          </Text>
        </View>

        <VariationTypeForm
          ref={formRef}
          initialData={variation}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting || isUpdating}
        />

        <View className="h-20" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <FormActions
          primaryAction={{
            label:
              isSubmitting || isUpdating ? "Salvando..." : "Salvar Alterações",
            onPress: () => formRef.current?.handleSubmit(),
            isLoading: isSubmitting || isUpdating,
          }}
          secondaryAction={{
            label: "Cancelar",
            onPress: () => router.back(),
            variant: "outline",
            isDisabled: isSubmitting || isUpdating,
          }}
        />
      </View>
    </SafeAreaView>
  );
}
