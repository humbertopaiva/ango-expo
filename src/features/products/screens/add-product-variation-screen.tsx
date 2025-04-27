// Path: src/features/products/screens/add-product-variation-screen.tsx
import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useCompanyVariations } from "../hooks/use-company-variations";
import { Layers, AlertCircle } from "lucide-react-native";
import { CurrencyInput } from "@/components/common/currency-input";
import { ImageUpload } from "@/components/common/image-upload";
import { StatusToggle } from "@/components/common/status-toggle";
import useAuthStore from "@/src/stores/auth";
import { useProductVariationItems } from "../hooks/use-product-variations-items";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import { SectionCard } from "@/components/custom/section-card";
import { THEME_COLORS } from "@/src/styles/colors";
import { CategorySelectModal } from "@/components/common/category-select-modal";
import { EnhancedSelect } from "@/components/common/enhanced-select";
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
  quantidade_maxima_carrinho: z.preprocess(
    (val) =>
      val === null || val === undefined || val === "" ? null : Number(val),
    z
      .number()
      .min(0, "Quantidade máxima não pode ser negativa")
      .nullable()
      .optional()
  ),
  exibir_produto: z.boolean().default(true),
  exibir_preco: z.boolean().default(true),
});

type ProductVariationFormData = z.infer<typeof productVariationFormSchema>;

export function AddProductVariationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { createVariationItem, isCreating } = useProductVariationItems(
    id as string
  );
  const companyId = useAuthStore((state) => state.getCompanyId());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValueModalVisible, setIsValueModalVisible] = useState(false);
  const [loadedVariation, setLoadedVariation] = useState<any>(null);
  const [variationValues, setVariationValues] = useState<string[]>([]);
  const [alreadyUsedValues, setAlreadyUsedValues] = useState<string[]>([]);

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

  // Buscar items de variações já existentes
  const { variationItems, isLoading: isLoadingVariationItems } =
    useProductVariationItems(id as string);

  // Formulário
  const form = useForm<ProductVariationFormData>({
    resolver: zodResolver(productVariationFormSchema),
    defaultValues: {
      variacao: "",
      valor_variacao: "",
      preco: "",
      preco_promocional: "",
      descricao: "",
      imagem: product?.imagem || null,
      disponivel: true,
      quantidade_maxima_carrinho: null,
      exibir_produto: true,
      exibir_preco: true,
    },
  });

  // Efeito para atualizar a imagem padrão quando os dados do produto forem carregados
  useEffect(() => {
    if (product?.imagem) {
      form.setValue("imagem", product.imagem);
    }
  }, [product, form]);

  // Efeito para carregar a variação do produto
  useEffect(() => {
    if (product && product.variacao) {
      // Se a variação é um objeto com id
      const variationId =
        typeof product.variacao === "object"
          ? product.variacao.id
          : product.variacao;

      if (variationId) {
        const foundVariation = variations.find((v) => v.id === variationId);
        if (foundVariation) {
          setLoadedVariation(foundVariation);
          setVariationValues(foundVariation.variacao || []);

          // Carregar valores já usados em outras variações deste produto
          const usedValues = variationItems
            .filter((item) => item.variacao.id === variationId)
            .map((item) => item.valor_variacao);

          setAlreadyUsedValues(usedValues);

          // Atualizar o formulário com a variação correta
          form.setValue("variacao", variationId);
        }
      }
    }
  }, [product, variations, variationItems, form]);

  // Filtrar as opções de valores de variação para remover as já usadas
  const availableVariationValues = useMemo(() => {
    return variationValues.filter(
      (value) => !alreadyUsedValues.includes(value)
    );
  }, [variationValues, alreadyUsedValues]);

  // Atualizar as opções do seletor
  const variationValueOptions = availableVariationValues.map((value) => ({
    label: value,
    value: value,
  }));

  // Função para invalidar todas as queries relacionadas
  const invalidateAllRelatedQueries = async () => {
    console.log("Invalidando todas as queries relacionadas");

    // Invalidar primeiro as queries específicas de variações
    await queryClient.invalidateQueries({
      queryKey: ["product-variation-items", id],
    });

    // Depois, invalidar queries de produtos específicos
    await queryClient.invalidateQueries({
      queryKey: ["product-details", id],
    });

    await queryClient.invalidateQueries({
      queryKey: ["product-for-variation", id],
    });

    // Por fim, invalidar queries gerais
    await queryClient.invalidateQueries({
      queryKey: ["products"],
    });

    await queryClient.invalidateQueries({
      queryKey: ["product-variation-items"],
    });

    console.log("Queries invalidadas com sucesso");
  };

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
        descricao: data.descricao || undefined,
        imagem: data.imagem || undefined,
        disponivel: data.disponivel,
        quantidade_maxima_carrinho: data.quantidade_maxima_carrinho,
        exibir_produto: data.exibir_produto,
        exibir_preco: data.exibir_preco,
      });

      showSuccessToast(toast, "Variação de produto adicionada com sucesso!");

      queryClient.removeQueries({ queryKey: ["product-variation-items", id] });
      queryClient.removeQueries({ queryKey: ["product-details", id] });

      try {
        await queryClient.fetchQuery({
          queryKey: ["product-variation-items", id],
          queryFn: async () => {
            const response = await api.get(`/api/products/${id}/variations`, {
              params: { _t: Date.now() },
            });
            return response.data.data;
          },
          staleTime: 0,
        });
      } catch (error) {
        console.error("Erro ao buscar variações:", error);
      }

      router.push(`/admin/products/view/${id}`);
    } catch (error) {
      console.error("Erro ao adicionar variação:", error);
      showErrorToast(toast, "Erro ao adicionar variação de produto");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProduct || isLoadingVariations || isLoadingVariationItems) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <AdminScreenHeader
          title="Adicionar Variação"
          backTo={`/admin/products/view/${id}`}
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text className="mt-4 text-gray-500">
            Carregando dados do produto...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
            Adicione uma variação para este produto usando o tipo de variação já
            configurado.
          </Text>
        </View>

        <SectionCard title="Dados da Variação">
          <View className="space-y-6 py-4">
            {/* Tipo de Variação (read-only, mostrando a variação do produto) */}
            <FormControl isInvalid={!!form.formState.errors.variacao}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Tipo de Variação
                </Text>
              </FormControlLabel>

              <View className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <Text className="text-gray-700">
                  {loadedVariation ? loadedVariation.nome : "Carregando..."}
                </Text>
              </View>

              {alreadyUsedValues.length > 0 && (
                <Text className="text-xs text-gray-500 mt-1">
                  Variações já usadas: {alreadyUsedValues.join(", ")}
                </Text>
              )}

              <Controller
                control={form.control}
                name="variacao"
                render={({ field: { value } }) => (
                  <View className="hidden">
                    <Text>{value}</Text>
                  </View>
                )}
              />

              {form.formState.errors.variacao && (
                <FormControlError>
                  <FormControlErrorText>
                    {form.formState.errors.variacao.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

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

            {availableVariationValues.length === 0 && (
              <View className="p-3 bg-yellow-50 rounded-md">
                <View className="flex-row">
                  <AlertCircle
                    size={16}
                    color="#B45309"
                    className="mt-1 mr-2"
                  />
                  <Text className="text-yellow-800 text-sm flex-1">
                    Todos os valores dessa variação já foram utilizados. Para
                    adicionar mais valores, edite o tipo de variação.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </SectionCard>

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
            isSubmitting={isSubmitting || isCreating}
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
              isSubmitting || isCreating ? "Salvando..." : "Adicionar Variação",
            onPress: form.handleSubmit(onSubmit),
            isLoading: isSubmitting || isCreating,
            isDisabled: availableVariationValues.length === 0,
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
