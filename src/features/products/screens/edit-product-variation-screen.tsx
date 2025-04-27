// Path: src/features/products/screens/edit-product-variation-screen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
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
  Textarea,
  TextareaInput,
  useToast,
} from "@gluestack-ui/themed";
import { FormActions } from "@/components/custom/form-actions";
import { Layers, AlertCircle } from "lucide-react-native";
import { CurrencyInput } from "@/components/common/currency-input";
import { ImageUpload } from "@/components/common/image-upload";
import { StatusToggle } from "@/components/common/status-toggle";
import { useProductVariationItems } from "../hooks/use-product-variations-items";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import { SectionCard } from "@/components/custom/section-card";
import { THEME_COLORS } from "@/src/styles/colors";
import { VariationVisibilityOptions } from "../components/variation-visibility-options";

// Schema para validação do formulário
const productVariationFormSchema = z.object({
  variacao: z.string().min(1, "A variação é obrigatória"),
  valor_variacao: z.string().min(1, "O valor da variação é obrigatório"),
  preco: z.string().min(1, "O preço é obrigatório"),
  preco_promocional: z.string().nullable().optional(),
  descricao: z.string().nullable().optional(),
  imagem: z.string().nullable().optional(),
  disponivel: z.boolean().default(true),

  // Novos campos
  exibir_produto: z.boolean().default(true),
  exibir_preco: z.boolean().default(true),
  quantidade_maxima_carrinho: z.preprocess(
    (val) =>
      val === null || val === undefined || val === "" ? null : Number(val),
    z
      .number()
      .min(0, "Quantidade máxima não pode ser negativa")
      .nullable()
      .optional()
  ),
});

type ProductVariationFormData = z.infer<typeof productVariationFormSchema>;

export function EditProductVariationScreen() {
  const { productId, variationId } = useLocalSearchParams<{
    productId: string;
    variationId: string;
  }>();
  const toast = useToast();
  const {
    variationItems,
    updateVariationItem,
    isUpdating,
    isLoading: isLoadingVariations,
  } = useProductVariationItems(productId as string);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar detalhes do produto
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product-for-variation", productId],
    queryFn: async () => {
      const response = await api.get<{ data: any }>(
        `/api/products/${productId}`
      );
      return response.data.data;
    },
    enabled: !!productId,
  });

  // Encontrar a variação atual
  const currentVariation = variationItems.find(
    (item) => item.id === variationId
  );

  // Formulário
  const form = useForm<ProductVariationFormData>({
    resolver: zodResolver(productVariationFormSchema),
    defaultValues: {
      preco: "",
      preco_promocional: "",
      descricao: "",
      imagem: "",
      disponivel: true,
    },
  });

  // Atualizar os valores do formulário quando a variação for carregada
  useEffect(() => {
    if (currentVariation) {
      form.reset({
        preco: currentVariation.preco || "",
        preco_promocional: currentVariation.preco_promocional || "",
        descricao: currentVariation.descricao || "",
        imagem: currentVariation.imagem || "",
        disponivel: currentVariation.disponivel !== false,

        // Novos campos - use valores padrão caso não estejam definidos
        quantidade_maxima_carrinho:
          currentVariation.quantidade_maxima_carrinho ?? null,
        exibir_produto: currentVariation.exibir_produto !== false, // default true
        exibir_preco: currentVariation.exibir_preco !== false, // default true
      });
    }
  }, [currentVariation, form]);

  const onSubmit = async (data: ProductVariationFormData) => {
    if (!variationId) {
      showErrorToast(toast, "ID da variação não encontrado");
      return;
    }

    try {
      setIsSubmitting(true);

      await updateVariationItem({
        id: variationId,
        data: {
          preco: data.preco,
          preco_promocional: data.preco_promocional || undefined,
          descricao: data.descricao || undefined,
          imagem: data.imagem || undefined,
          disponivel: data.disponivel,
          quantidade_maxima_carrinho: data.quantidade_maxima_carrinho,
          exibir_produto: data.exibir_produto,
          exibir_preco: data.exibir_preco,
        },
      });

      showSuccessToast(toast, "Variação de produto atualizada com sucesso!");

      // Redirecionar para a página de detalhes do produto após um breve delay
      setTimeout(() => {
        router.push(`/admin/products/view/${productId}`);
      }, 500);
    } catch (error) {
      console.error("Erro ao atualizar variação:", error);
      showErrorToast(toast, "Erro ao atualizar variação de produto");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProduct || isLoadingVariations || !currentVariation) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <AdminScreenHeader
          title="Editar Variação"
          backTo={`/admin/products/view/${productId}`}
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
      <ScrollView className="flex-1 p-4">
        <View className="bg-blue-50 p-4 rounded-lg mb-6">
          <View className="flex-row items-center mb-2">
            <Layers size={20} color="#1E40AF" />
            <Text className="ml-2 text-blue-800 font-medium">
              Editando variação: {currentVariation.variacao.nome} -{" "}
              {currentVariation.valor_variacao}
            </Text>
          </View>
          <Text className="text-blue-700">
            Edite as informações desta variação do produto {product?.nome}.
          </Text>
        </View>

        <SectionCard title="Informações Básicas">
          <View className="space-y-6 py-4">
            {/* Descrição */}
            <FormControl isInvalid={!!form.formState.errors.descricao}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Descrição
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="descricao"
                render={({ field: { onChange, value } }) => (
                  <Textarea h={150}>
                    <TextareaInput
                      placeholder="Digite a descrição da variação do produto"
                      onChangeText={onChange}
                      value={value || ""}
                      multiline={true}
                      textAlignVertical="top"
                      style={{
                        height: 150,
                        minHeight: 150,
                      }}
                      className="bg-white border border-gray-200 rounded-md p-4 text-base"
                    />
                  </Textarea>
                )}
              />
              {form.formState.errors.descricao && (
                <FormControlError>
                  <FormControlErrorText>
                    {form.formState.errors.descricao.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Imagem */}
            <FormControl isInvalid={!!form.formState.errors.imagem}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Imagem da Variação
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="imagem"
                render={({ field: { onChange, value } }) => (
                  <ImageUpload
                    value={value || ""}
                    onChange={onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
              {form.formState.errors.imagem && (
                <FormControlError>
                  <FormControlErrorText>
                    {form.formState.errors.imagem.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
              {product?.imagem && !form.watch("imagem") && (
                <View className="mt-2 p-3 bg-yellow-50 rounded-md">
                  <View className="flex-row">
                    <AlertCircle
                      size={16}
                      color="#B45309"
                      className="mt-1 mr-2"
                    />
                    <Text className="text-yellow-800 text-sm flex-1">
                      Se nenhuma imagem for fornecida, a imagem do produto
                      principal será utilizada.
                    </Text>
                  </View>
                </View>
              )}
            </FormControl>

            {/* Status */}
            <FormControl>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Disponibilidade
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="disponivel"
                render={({ field: { onChange, value } }) => (
                  <StatusToggle
                    value={value}
                    onChange={onChange}
                    activeLabel="Disponível para venda"
                    inactiveLabel="Indisponível"
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormControl>
          </View>
        </SectionCard>

        <SectionCard title="Opções de Visibilidade">
          <VariationVisibilityOptions
            control={form.control}
            isSubmitting={isSubmitting || isUpdating}
          />
        </SectionCard>

        <SectionCard title="Preços">
          <View className="space-y-6 py-4">
            {/* Preço */}
            <Controller
              control={form.control}
              name="preco"
              render={({ field: { onChange, value } }) => (
                <CurrencyInput
                  label="Preço"
                  value={value || ""}
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
                  errorMessage={
                    form.formState.errors.preco_promocional?.message
                  }
                  placeholder="0,00"
                />
              )}
            />
          </View>
        </SectionCard>
      </ScrollView>

      {/* Botões de Ação */}
      <View className="p-4 bg-white border-t border-gray-200">
        <FormActions
          primaryAction={{
            label:
              isSubmitting || isUpdating ? "Salvando..." : "Salvar Alterações",
            onPress: form.handleSubmit(onSubmit),
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
