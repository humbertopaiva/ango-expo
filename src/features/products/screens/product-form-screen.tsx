// Path: src/features/products/screens/product-form-screen.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
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

interface ProductFormScreenProps {
  productId?: string;
}

export function ProductFormScreen({ productId }: ProductFormScreenProps) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [showVariationWarning, setShowVariationWarning] = useState(false);

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
      tem_variacao: false,
    },
  });

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

      form.reset({
        nome: product.nome,
        descricao: product.descricao,
        preco: product.preco || "", // Convertendo para string vazia caso seja null
        preco_promocional: product.preco_promocional || "",
        categoria: categoryId, // Usa o valor correto da categoria
        imagem: product.imagem,
        parcelamento_cartao: product.parcelamento_cartao,
        quantidade_parcelas: product.quantidade_parcelas || "",
        desconto_avista: product.desconto_avista,
        status: product.status,
        tem_variacao: product.tem_variacao || false,
      });
    }
  }, [product, form.reset, isSubmitting, getProductCategoryId]);

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Iniciando salvamento do produto");

      // Se categoria for 0, enviamos como null para a API
      const dataToSubmit: Omit<CreateProductDTO, "empresa"> = {
        ...data,
        categoria: data.categoria === 0 ? null : data.categoria,
        desconto_avista: data.desconto_avista ?? 0,
        // Se tem variação, não enviamos preço nem descrição
        preco: data.tem_variacao ? null : data.preco || "",
        descricao: data.tem_variacao ? undefined : data.descricao,
        status: data.tem_variacao ? "indisponivel" : data.status, // Produto com variação começa indisponível até configurar variações
        parcelas_sem_juros: true, // Sempre true, conforme solicitado
      };

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
      showErrorToast(
        toast,
        `Erro ao ${isEditing ? "atualizar" : "criar"} o produto`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch para o campo tem_variacao
  const temVariacao = form.watch("tem_variacao");

  // Handler para mudança no campo tem_variacao
  const handleTemVariacaoChange = (value: boolean) => {
    // Se estiver marcando como produto com variação
    if (value && !temVariacao) {
      setShowVariationWarning(true);
    } else {
      form.setValue("tem_variacao", value);
    }
  };

  // Confirmação de transformação em produto com variação
  const confirmVariacaoChange = () => {
    form.setValue("tem_variacao", true);
    setShowVariationWarning(false);
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
      <ScrollView
        className="flex-1 p-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 180 : 160,
        }}
      >
        {/* Informações básicas - Primeiro para garantir que o usuário preencha informações essenciais */}
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
                name="tem_variacao"
                render={({ field: { value } }) => (
                  <StatusToggle
                    value={value}
                    onChange={handleTemVariacaoChange}
                    activeLabel="Produto com variações (tamanhos, cores, etc.)"
                    inactiveLabel="Produto simples (sem variações)"
                    disabled={isSubmitting}
                  />
                )}
              />
              {temVariacao && (
                <View className="mt-2 p-3 bg-blue-50 rounded-md">
                  <View className="flex-row">
                    <Layers size={16} color="#1E40AF" className="mt-1 mr-2" />
                    <Text className="text-blue-800 text-sm flex-1">
                      Este produto terá variações. Após criar o produto, você
                      poderá adicionar e configurar as variações específicas.
                    </Text>
                  </View>
                </View>
              )}
            </FormControl>

            {/* Categoria - Usando o EnhancedSelect com modal */}
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

            {/* Descrição - Visível apenas se não for produto com variação */}
            {!temVariacao && (
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

        {/* Preços - Visível apenas se não for produto com variação */}
        {!temVariacao && (
          <SectionCard
            title="Preços"
            icon={<DollarSign size={22} color="#0891B2" />}
          >
            <View className="gap-4 flex flex-col py-4">
              {/* Preço com o novo componente */}
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
                  />
                )}
              />

              {/* Preço promocional com o novo componente */}
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
                  />
                )}
              />
            </View>
          </SectionCard>
        )}

        {/* Status do Produto - Visível apenas se não for produto com variação */}
        {!temVariacao && (
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
            <View className="flex-row mb-2">
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
                • O produto ficará indisponível até configurar as variações
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
            onPress: form.handleSubmit(handleSubmit),
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
