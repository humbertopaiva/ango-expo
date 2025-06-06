// Path: src/features/products/screens/product-form-screen.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProducts } from "../hooks/use-products";
import { productFormSchema, ProductFormData } from "../schemas/product.schema";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  useToast,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  ButtonGroup,
  Button,
  ButtonText,
  Heading,
} from "@gluestack-ui/themed";
import { router } from "expo-router";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";

import { CurrencyInput } from "@/components/common/currency-input";
import { StatusToggle } from "@/components/common/status-toggle";
import { EnhancedSelect } from "@/components/common/enhanced-select";
import { SectionCard } from "@/components/custom/section-card";
import { ImageUpload } from "@/components/common/image-upload";
import { useCategories } from "@/src/features/categories/hooks/use-categories";
import {
  Package,
  DollarSign,
  AlertTriangle,
  Layers,
} from "lucide-react-native";
import { FormActions } from "@/components/custom/form-actions";
import { CategorySelectModal } from "@/components/common/category-select-modal";
import { CreateProductDTO } from "../models/product";
import useAuthStore from "@/src/stores/auth";
import { VariationSelector } from "../components/variation-selector";
import { ProductVisibilityOptions } from "../components/product-visibility-options";
import {
  FormToastAlert,
  ToastType,
} from "@/components/custom/form-toast-alert";

interface ProductFormScreenProps {
  productId?: string;
}

export function ProductFormScreen({ productId }: ProductFormScreenProps) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [showVariationWarning, setShowVariationWarning] = useState(false);
  const [selectedVariationType, setSelectedVariationType] = useState<
    string | null
  >(null);

  const [selectedVariationName, setSelectedVariationName] =
    useState<string>("");
  const [variationValues, setVariationValues] = useState<string[]>([]);

  // Estados para o toast personalizado
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("error");

  const { products, createProduct, updateProduct, isLoading } = useProducts();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const product = productId
    ? products.find((p) => p.id === productId)
    : undefined;
  const isEditing = !!productId;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      preco: "",
      preco_promocional: "",
      categoria: 0,
      imagem: null,
      parcelamento_cartao: false,
      quantidade_parcelas: "",
      desconto_avista: 0,
      status: "disponivel",
      variacao: null,
      is_variacao_enabled: false,
      quantidade_maxima_carrinho: null,
      exibir_produto: true,
      exibir_preco: true,
    },
    mode: "onSubmit",
  });

  // Função auxiliar para mostrar o toast personalizado
  const showCustomToast = (message: string, type: ToastType = "error") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  // Esta função auxiliar ajuda a obter o valor correto da categoria para o formulário
  const getProductCategoryId = useCallback(() => {
    if (!product || !product.categoria) return 0;

    // Check if categoria is an object with an id property
    if (
      typeof product.categoria === "object" &&
      product.categoria !== null &&
      "id" in product.categoria
    ) {
      return product.categoria.id;
    }

    // Otherwise return the categoria directly (should be a number)
    return product.categoria;
  }, [product]);

  // Função para lidar com a mudança na seleção de variação
  const handleVariationChange = useCallback(
    (variationId: string | null, values: string[], name: string) => {
      setSelectedVariationType(variationId);
      setVariationValues(values);
      setSelectedVariationName(name);

      // Atualizar o formulário
      form.setValue("variacao", variationId);
    },
    [form]
  );

  // Preparar as opções de categoria para o select
  const categoryOptions = useMemo(
    () => [
      { label: "Sem categoria", value: 0 }, // Valor zero para "Sem categoria"
      ...categories.map((category) => ({
        label: category.nome,
        value: category.id,
      })),
    ],
    [categories]
  );

  useEffect(() => {
    if (product && !isSubmitting) {
      // Obtém o ID da categoria corretamente
      const categoryId = getProductCategoryId();

      // Verificar se o produto tem variação
      const hasVariation = !!product.variacao;
      const variationId =
        typeof product.variacao === "object"
          ? product.variacao?.id
          : product.variacao;

      form.reset({
        nome: product.nome,
        descricao: product.descricao,
        preco: product.preco || "",
        preco_promocional: product.preco_promocional || "",
        categoria: categoryId,
        imagem: product.imagem,
        parcelamento_cartao: product.parcelamento_cartao,
        quantidade_parcelas: product.quantidade_parcelas || "",
        desconto_avista: product.desconto_avista,
        status: product.status,
        variacao: variationId,
        is_variacao_enabled: hasVariation,

        // Novos campos
        quantidade_maxima_carrinho: product.quantidade_maxima_carrinho,
        exibir_produto: product.exibir_produto !== false, // default true se não definido
        exibir_preco: product.exibir_preco !== false, // default true se não definido
      });

      // Se o produto tem variação, atualize os estados relacionados
      if (hasVariation && variationId) {
        setSelectedVariationType(variationId);
      }
    }
  }, [product, form.reset, isSubmitting, getProductCategoryId]);

  // Handler para mudança no campo is_variacao_enabled
  const handleVariacaoEnabledChange = (value: boolean) => {
    // Se estiver marcando como produto com variação
    if (value && !form.watch("is_variacao_enabled")) {
      setShowVariationWarning(true);
    } else {
      form.setValue("is_variacao_enabled", value);

      // Se estiver desmarcando, limpe os campos de variação
      if (!value) {
        form.setValue("variacao", null);
        setSelectedVariationType(null);
        setVariationValues([]);
        setSelectedVariationName("");
      }
    }
  };

  // Confirmação de transformação em produto com variação
  const confirmVariacaoChange = () => {
    form.setValue("is_variacao_enabled", true);
    setShowVariationWarning(false);
  };

  // Handler para erros de validação
  const onError: SubmitErrorHandler<ProductFormData> = (errors) => {
    console.log("Validation errors:", errors);

    // Mapear nomes amigáveis para os campos
    const fieldLabels: Record<string, string> = {
      nome: "Nome",
      preco: "Preço",
      preco_promocional: "Preço promocional",
      descricao: "Descrição",
      categoria: "Categoria",
      variacao: "Variação",
      imagem: "Imagem",
      quantidade_parcelas: "Quantidade de parcelas",
      parcelas_sem_juros: "Parcelas sem juros",
      desconto_avista: "Desconto à vista",
      status: "Status",
      is_variacao_enabled: "Produto com variação",
      quantidade_maxima_carrinho: "Quantidade máxima no carrinho",
      exibir_produto: "Visibilidade do produto",
      exibir_preco: "Visibilidade do preço",
    };

    // Construir mensagem de erro
    const errorFields = Object.keys(errors);

    if (errorFields.length > 0) {
      // Para o toast, mostre uma mensagem mais curta
      let toastMsg = "Campos obrigatórios: ";

      // Limitar a quantidade de campos mostrados no toast
      if (errorFields.length <= 3) {
        toastMsg += errorFields
          .map((field) => fieldLabels[field] || field)
          .join(", ");
      } else {
        const firstFields = errorFields.slice(0, 2);
        toastMsg +=
          firstFields.map((field) => fieldLabels[field] || field).join(", ") +
          ` e mais ${errorFields.length - 2} campos`;
      }

      // Mostrar toast personalizado
      showCustomToast(toastMsg, "error");

      // Também mostrar o alert nativo com detalhes completos
      let alertMsg = "Por favor, revise os campos obrigatórios:\n\n";
      const fieldNamesList = errorFields
        .map((field) => fieldLabels[field] || field)
        .join("\n• ");
      alertMsg += "• " + fieldNamesList;
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Iniciando salvamento do produto");

      // Obter o ID da empresa do store
      const companyId = useAuthStore.getState().getCompanyId();

      if (!companyId) {
        showErrorToast(toast, "ID da empresa não encontrado");
        showCustomToast("ID da empresa não encontrado", "error");
        setIsSubmitting(false);
        return;
      }

      // Tratamento do campo variacao
      const variacao = data.is_variacao_enabled ? data.variacao : null;

      // Se categoria for 0, enviamos como null para a API
      const dataToSubmit: CreateProductDTO = {
        ...data,
        empresa: companyId, // Adicionando o ID da empresa
        categoria: data.categoria === 0 ? null : data.categoria,
        descricao: data.descricao ?? "", // Garantir que seja string
        desconto_avista: data.desconto_avista ?? 0,
        // Definir a variação conforme o estado is_variacao_enabled
        variacao: variacao ?? null,
        // Configura o status conforme necessário
        status: data.status || "disponivel",
        parcelas_sem_juros: true, // Sempre true, conforme solicitado
      };

      // Remover is_variacao_enabled que é apenas para controle no frontend
      delete (dataToSubmit as any).is_variacao_enabled;

      console.log("Dados a serem enviados para o produto:", dataToSubmit);

      if (isEditing && productId) {
        // Atualizar produto existente
        await updateProduct({
          id: productId,
          data: dataToSubmit,
        });
        console.log("Produto atualizado com sucesso");
      } else {
        // Criar novo produto
        await createProduct(dataToSubmit);
        console.log("Produto criado com sucesso");
      }

      // Mostrar mensagem de sucesso
      showCustomToast(
        `Produto ${isEditing ? "atualizado" : "criado"} com sucesso!`,
        "success"
      );

      showSuccessToast(
        toast,
        `Produto ${isEditing ? "atualizado" : "criado"} com sucesso!`
      );

      // Aguarda um momento antes de voltar para evitar race conditions
      setTimeout(() => {
        router.back();
      }, 500);
    } catch (error) {
      console.error("Error submitting form:", error);
      showCustomToast(
        `Erro ao ${isEditing ? "atualizar" : "criar"} o produto`,
        "error"
      );
      showErrorToast(
        toast,
        `Erro ao ${isEditing ? "atualizar" : "criar"} o produto`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderiza um indicador de carregamento enquanto busca os dados
  if ((isEditing && isLoading) || isCategoriesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891B2" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Toast personalizado */}
      <FormToastAlert
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
        message={toastMessage}
        type={toastType}
        duration={5000}
      />

      <ScrollView
        className="flex-1 p-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 180 : 160,
        }}
      >
        {/* Informações básicas */}
        <SectionCard
          title="Informações Básicas"
          icon={<Package size={22} color="#0891B2" />}
        >
          <View className="gap-4 flex flex-col py-4">
            <FormControl isInvalid={!!form.formState.errors.nome}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Nome do Produto <Text className="text-red-500">*</Text>
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="nome"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Digite o nome do produto"
                      onChangeText={onChange}
                      value={value ?? ""}
                      className="bg-white"
                    />
                  </Input>
                )}
              />
              {form.formState.errors.nome && (
                <FormControlError>
                  <FormControlErrorText className="text-sm">
                    {form.formState.errors.nome.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Tipo de Produto (com ou sem variação) */}
            <FormControl>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Tipo de Produto
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="is_variacao_enabled"
                render={({ field: { value } }) => (
                  <StatusToggle
                    value={value}
                    onChange={handleVariacaoEnabledChange}
                    activeLabel="Produto com variações (tamanhos, cores, etc.)"
                    inactiveLabel="Produto simples (sem variações)"
                    disabled={isSubmitting}
                  />
                )}
              />
              {form.watch("is_variacao_enabled") && (
                <View className="mt-4">
                  <Controller
                    control={form.control}
                    name="variacao"
                    render={({ field: { value, onChange } }) => (
                      <VariationSelector
                        value={value ?? null}
                        onChange={onChange}
                        onVariationChange={handleVariationChange}
                        error={form.formState.errors.variacao?.message}
                        disabled={isSubmitting}
                        productId={productId}
                      />
                    )}
                  />
                  {selectedVariationType && (
                    <View className="mt-2 p-3 bg-blue-50 rounded-md">
                      <View className="flex-row gap-2">
                        <Layers
                          size={16}
                          color="#1E40AF"
                          className="mt-1 mr-2"
                        />
                        <Text className="text-blue-800 text-sm flex-1">
                          Variação selecionada: {selectedVariationName}. As
                          opções disponíveis são: {variationValues.join(", ")}.
                          Você poderá criar variações específicas após salvar
                          este produto.
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </FormControl>

            {/* Categoria */}
            <Controller
              control={form.control}
              name="categoria"
              render={({ field: { value, onChange } }) => (
                <>
                  <EnhancedSelect
                    label="Categoria"
                    options={categoryOptions}
                    value={value}
                    onSelect={() => setIsCategoryModalVisible(true)}
                    placeholder="Selecione uma categoria"
                    isInvalid={!!form.formState.errors.categoria}
                    error={form.formState.errors.categoria?.message}
                  />

                  <CategorySelectModal
                    isVisible={isCategoryModalVisible}
                    onClose={() => setIsCategoryModalVisible(false)}
                    options={categoryOptions}
                    selectedValue={value}
                    onSelect={(selectedValue) => {
                      onChange(Number(selectedValue));
                      setIsCategoryModalVisible(false);
                    }}
                    title="Selecionar Categoria"
                  />
                </>
              )}
            />

            {/* Descrição - apenas se não for produto com variação */}
            {!form.watch("is_variacao_enabled") && (
              <FormControl isInvalid={!!form.formState.errors.descricao}>
                <FormControlLabel>
                  <Text className="text-sm font-medium text-gray-700">
                    Descrição <Text className="text-red-500">*</Text>
                  </Text>
                </FormControlLabel>
                <Controller
                  control={form.control}
                  name="descricao"
                  render={({ field: { onChange, value } }) => (
                    <Textarea h={200}>
                      <TextareaInput
                        placeholder="Digite a descrição do produto"
                        onChangeText={onChange}
                        value={value ?? ""}
                        multiline={true}
                        textAlignVertical="top"
                        style={{
                          height: 200,
                          minHeight: 200,
                        }}
                        className="bg-white border border-gray-200 rounded-md p-4 text-base"
                      />
                    </Textarea>
                  )}
                />
                {form.formState.errors.descricao && (
                  <FormControlError>
                    <FormControlErrorText className="text-sm">
                      {form.formState.errors.descricao.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            )}
          </View>
        </SectionCard>

        {/* Imagem */}
        <SectionCard
          title="Imagem Principal do Produto"
          icon={<Package size={22} color="#0891B2" />}
        >
          <View className="gap-4 flex flex-col py-4">
            <FormControl isInvalid={!!form.formState.errors.imagem}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Imagem Principal
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
                  <FormControlErrorText className="text-sm">
                    {form.formState.errors.imagem.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </View>
        </SectionCard>

        {/* Preços - apenas se não for produto com variação */}
        {!form.watch("is_variacao_enabled") && (
          <SectionCard
            title="Preços"
            icon={<DollarSign size={22} color="#0891B2" />}
          >
            <View className="flex-row gap-4 w-full">
              {/* Preço */}
              <Controller
                control={form.control}
                name="preco"
                render={({ field: { onChange, value } }) => (
                  <CurrencyInput
                    label="Preço"
                    value={value || ""} // Garantir que sempre seja string
                    onChangeValue={onChange}
                    isInvalid={!!form.formState.errors.preco}
                    errorMessage={form.formState.errors.preco?.message}
                    disabled={isSubmitting}
                    required
                    style={{ flex: 1 }} // Para ocupar 50% do espaço
                    className="h-12" // Altura maior para destaque
                  />
                )}
              />

              {/* Preço promocional */}
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
                    disabled={isSubmitting}
                    placeholder="0,00"
                    style={{ flex: 1 }} // Para ocupar 50% do espaço
                    className="h-12" // Altura maior para destaque
                  />
                )}
              />
            </View>
          </SectionCard>
        )}

        <ProductVisibilityOptions
          control={form.control}
          isSubmitting={isSubmitting}
        />

        {/* Status do Produto - apenas se não for produto com variação */}
        {!form.watch("is_variacao_enabled") && (
          <SectionCard
            title="Status do Produto"
            icon={<Package size={22} color="#0891B2" />}
          >
            <View className="gap-4 flex flex-col py-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Disponibilidade
              </Text>
              <Controller
                control={form.control}
                name="status"
                render={({ field: { onChange, value } }) => (
                  <StatusToggle
                    value={value === "disponivel"}
                    onChange={(newValue) => {
                      onChange(newValue ? "disponivel" : "indisponivel");
                    }}
                    disabled={isSubmitting}
                  />
                )}
              />
            </View>
          </SectionCard>
        )}

        {/* Opções de Pagamento */}
        <SectionCard
          title="Opções de Pagamento"
          icon={<DollarSign size={22} color="#0891B2" />}
        >
          <View className="gap-4 flex flex-col py-4">
            {/* Checkbox para Parcelamento */}
            <Controller
              control={form.control}
              name="parcelamento_cartao"
              render={({ field: { onChange, value } }) => (
                <StatusToggle
                  value={value}
                  onChange={onChange}
                  activeLabel="Aceita pagamento parcelado sem juros"
                  inactiveLabel="Não aceita pagamento parcelado"
                  disabled={isSubmitting}
                />
              )}
            />

            {/* Quantidade de parcelas (aparece apenas se parcelamento_cartao for true) */}
            {form.watch("parcelamento_cartao") && (
              <FormControl
                isInvalid={!!form.formState.errors.quantidade_parcelas}
              >
                <FormControlLabel>
                  <Text className="text-sm font-medium text-gray-700">
                    Quantidade de Parcelas
                  </Text>
                </FormControlLabel>
                <Controller
                  control={form.control}
                  name="quantidade_parcelas"
                  render={({ field: { onChange, value } }) => (
                    <Input>
                      <InputField
                        placeholder="Ex: 12"
                        onChangeText={onChange}
                        value={value ?? ""}
                        keyboardType="numeric"
                        className="bg-white"
                      />
                    </Input>
                  )}
                />
                {form.formState.errors.quantidade_parcelas && (
                  <FormControlError>
                    <FormControlErrorText className="text-sm">
                      {form.formState.errors.quantidade_parcelas.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            )}

            {/* Desconto à vista */}
            <FormControl isInvalid={!!form.formState.errors.desconto_avista}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Desconto à Vista (%)
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="desconto_avista"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="0"
                      onChangeText={(text) => onChange(Number(text) || 0)}
                      value={value?.toString() || "0"}
                      keyboardType="numeric"
                      className="bg-white"
                    />
                  </Input>
                )}
              />
              {form.formState.errors.desconto_avista && (
                <FormControlError>
                  <FormControlErrorText className="text-sm">
                    {form.formState.errors.desconto_avista.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </View>
        </SectionCard>
      </ScrollView>

      {/* Diálogo de aviso sobre produtos com variação */}
      <AlertDialog
        isOpen={showVariationWarning}
        onClose={() => setShowVariationWarning(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="lg">Atenção</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <View className="flex-row mb-2 gap-2">
              <AlertTriangle size={24} color="#F59E0B" className="mr-2" />
              <Text className="text-gray-700 flex-1">
                Ao transformar este produto em um produto com variação:
              </Text>
            </View>
            <View className="ml-8 mb-4">
              <Text className="text-gray-600 mb-1">
                • Os preços serão definidos em cada variação
              </Text>
              <Text className="text-gray-600 mb-1">
                • A descrição será específica para cada variação
              </Text>
              <Text className="text-gray-600">
                • Após salvar, você precisará configurar as variações
                específicas
              </Text>
            </View>
            <Text className="text-gray-700">Deseja continuar?</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup>
              <Button
                variant="outline"
                onPress={() => setShowVariationWarning(false)}
              >
                <ButtonText>Cancelar</ButtonText>
              </Button>
              <Button onPress={confirmVariacaoChange}>
                <ButtonText>Confirmar</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Botões de ação */}
      <View
        className="absolute bottom-0 left-0 right-0 w-full pb-6 pt-3 bg-white border-t border-gray-200 shadow-lg"
        style={{ paddingBottom: Platform.OS === "ios" ? 24 : 16 }}
      >
        <FormActions
          primaryAction={{
            label: isSubmitting ? "Salvando..." : "Salvar",
            onPress: form.handleSubmit(onSubmit, onError),
            isLoading: isSubmitting,
          }}
          secondaryAction={{
            label: "Cancelar",
            onPress: () => router.back(),
            variant: "outline",
            isDisabled: isSubmitting,
          }}
          className="px-4 w-full"
          spacing="sm"
        />
      </View>
    </SafeAreaView>
  );
}
