// Path: src/features/products/screens/add-product-variation-screen.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
  useToast,
} from "@gluestack-ui/themed";
import { FormActions } from "@/components/custom/form-actions";
import { useCompanyVariations } from "../hooks/use-company-variations";
import { Layers } from "lucide-react-native";
import { CategorySelectModal } from "@/components/common/category-select-modal";
import { EnhancedSelect } from "@/components/common/enhanced-select";
import { CurrencyInput } from "@/components/common/currency-input";
import useAuthStore from "@/src/stores/auth";
import { useProductVariationItems } from "../hooks/use-product-variations-items";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";

// Schema para validação do formulário
const productVariationFormSchema = z.object({
  variacao: z.string().min(1, "A variação é obrigatória"),
  valor_variacao: z.string().min(1, "O valor da variação é obrigatório"),
  preco: z.string().min(1, "O preço é obrigatório"),
  preco_promocional: z.string().nullable().optional(),
});

type ProductVariationFormData = z.infer<typeof productVariationFormSchema>;

export function AddProductVariationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const { createVariationItem, isCreating } = useProductVariationItems(
    id as string
  );
  const companyId = useAuthStore((state) => state.getCompanyId());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVariationModalVisible, setIsVariationModalVisible] = useState(false);
  const [isValueModalVisible, setIsValueModalVisible] = useState(false);
  const [selectedVariationValues, setSelectedVariationValues] = useState<
    string[]
  >([]);

  // Buscar detalhes do produto
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product-for-variation", id],
    queryFn: async () => {
      const response = await api.get<{ data: any }>(`/api/products/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  // Buscar variações disponíveis
  const { variations, isLoading: isLoadingVariations } = useCompanyVariations();

  // Formulário
  const form = useForm<ProductVariationFormData>({
    resolver: zodResolver(productVariationFormSchema),
    defaultValues: {
      variacao: "",
      valor_variacao: "",
      preco: "",
      preco_promocional: "",
    },
  });

  // Atualizar as opções de valores quando a variação for selecionada
  const handleVariationChange = (variationId: string) => {
    const selectedVariation = variations.find((v) => v.id === variationId);
    if (selectedVariation) {
      setSelectedVariationValues(selectedVariation.variacao || []);
      form.setValue("variacao", variationId);
      form.setValue("valor_variacao", ""); // Reset the value when variation changes
    }
  };

  // Opções para o seletor de variações
  const variationOptions = variations.map((variation) => ({
    label: variation.nome,
    value: variation.id,
  }));

  // Opções para o seletor de valores de variação
  const variationValueOptions = selectedVariationValues.map((value) => ({
    label: value,
    value: value,
  }));

  const onSubmit = async (data: ProductVariationFormData) => {
    if (!id || !companyId) {
      showErrorToast(toast, "Dados incompletos para criar variação");
      return;
    }

    try {
      setIsSubmitting(true);

      await createVariationItem({
        produto: id,
        variacao: data.variacao,
        valor_variacao: data.valor_variacao,
        empresa: companyId,
        preco: data.preco,
        preco_promocional: data.preco_promocional || undefined,
      });

      showSuccessToast(toast, "Variação de produto adicionada com sucesso!");

      // Redirecionar para a página de detalhes do produto após um breve delay
      setTimeout(() => {
        router.push(`/admin/products/view/${id}`);
      }, 500);
    } catch (error) {
      console.error("Erro ao adicionar variação:", error);
      showErrorToast(toast, "Erro ao adicionar variação de produto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AdminScreenHeader
        title="Adicionar Variação"
        backTo={`/admin/products/view/${id}`}
      />

      <ScrollView className="flex-1 p-4">
        <View className="bg-blue-50 p-4 rounded-lg mb-6">
          <View className="flex-row items-center mb-2">
            <Layers size={20} color="#1E40AF" />
            <Text className="ml-2 text-blue-800 font-medium">
              Adicionando variação para: {product?.nome}
            </Text>
          </View>
          <Text className="text-blue-700">
            Adicione uma variação para este produto, como tamanho, cor ou
            qualquer outro tipo de variação que você tenha configurado.
          </Text>
        </View>

        <View className="space-y-6">
          {/* Tipo de Variação */}
          <Controller
            control={form.control}
            name="variacao"
            render={({ field: { value } }) => (
              <>
                <EnhancedSelect
                  label="Tipo de Variação"
                  options={variationOptions}
                  value={value}
                  onSelect={() => setIsVariationModalVisible(true)}
                  placeholder="Selecione o tipo de variação"
                  isInvalid={!!form.formState.errors.variacao}
                  error={form.formState.errors.variacao?.message}
                />

                <CategorySelectModal
                  isVisible={isVariationModalVisible}
                  onClose={() => setIsVariationModalVisible(false)}
                  options={variationOptions}
                  selectedValue={value}
                  onSelect={(selectedValue) => {
                    if (typeof selectedValue === "string") {
                      handleVariationChange(selectedValue);
                    }
                    setIsVariationModalVisible(false);
                  }}
                  title="Selecionar Tipo de Variação"
                />
              </>
            )}
          />

          {/* Valor da Variação */}
          <Controller
            control={form.control}
            name="valor_variacao"
            render={({ field: { value, onChange } }) => (
              <>
                <EnhancedSelect
                  label="Valor da Variação"
                  options={variationValueOptions}
                  value={value}
                  onSelect={() => setIsValueModalVisible(true)}
                  placeholder="Selecione o valor da variação"
                  isInvalid={!!form.formState.errors.valor_variacao}
                  error={form.formState.errors.valor_variacao?.message}
                />

                <CategorySelectModal
                  isVisible={isValueModalVisible}
                  onClose={() => setIsValueModalVisible(false)}
                  options={variationValueOptions}
                  selectedValue={value}
                  onSelect={(selectedValue) => {
                    onChange(selectedValue);
                    setIsValueModalVisible(false);
                  }}
                  title="Selecionar Valor da Variação"
                />
              </>
            )}
          />

          {/* Preço */}
          <Controller
            control={form.control}
            name="preco"
            render={({ field: { onChange, value } }) => (
              <CurrencyInput
                label="Preço"
                value={value}
                onChangeValue={onChange}
                isInvalid={!!form.formState.errors.preco}
                errorMessage={form.formState.errors.preco?.message}
                required
              />
            )}
          />

          {/* Preço Promocional */}
          <Controller
            control={form.control}
            name="preco_promocional"
            render={({ field: { onChange, value } }) => (
              <CurrencyInput
                label="Preço Promocional"
                value={value || ""}
                onChangeValue={onChange}
                isInvalid={!!form.formState.errors.preco_promocional}
                errorMessage={form.formState.errors.preco_promocional?.message}
                placeholder="0,00"
              />
            )}
          />
        </View>
      </ScrollView>

      {/* Botões de Ação */}
      <View className="p-4 bg-white border-t border-gray-200">
        <FormActions
          primaryAction={{
            label:
              isSubmitting || isCreating ? "Salvando..." : "Adicionar Variação",
            onPress: form.handleSubmit(onSubmit),
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
