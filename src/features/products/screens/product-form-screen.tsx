// Path: src/features/products/screens/product-form-screen.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProducts } from "../hooks/use-products";
import { productFormSchema, ProductFormData } from "../schemas/product.schema";
import { ProductVariationDTO } from "../models/product";
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
import { Package, DollarSign, Tag, Layers } from "lucide-react-native";
import { FormActions } from "@/components/custom/form-actions";
import { CategorySelectModal } from "@/components/common/category-select-modal";
import { VariationSelector } from "../components/variation-selector";
import { ProductVariationsForm } from "../components/product-variations-form";

import useAuthStore from "@/src/stores/auth";
import { api } from "@/src/services/api";
import { useProductVariations } from "../hooks/use-product-variations";
import { ProductVariationsSummary } from "../components/product-variations-summary";

interface ProductFormScreenProps {
  productId?: string;
}

export function ProductFormScreen({ productId }: ProductFormScreenProps) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [variationValues, setVariationValues] = useState<string[]>([]);
  const [isCreatingVariations, setIsCreatingVariations] = useState(false);
  const [variationName, setVariationName] = useState<string>("");

  const { products, createProduct, updateProduct, isLoading } = useProducts();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const companyId = useAuthStore((state) => state.getCompanyId());

  const { variations } = useProductVariations(productId);

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
      parcelas_sem_juros: false,
      desconto_avista: 0,
      status: "disponivel",
      estoque: 0,
      tem_variacao: false,
      variacao: undefined,
      variacoes_produtos: [],
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

      // Verificar se o produto tem variação
      const temVariacao = product.tem_variacao || false;

      // Verificar qual é a variação, se houver
      let variacaoId = null;
      if (product.variacao) {
        if (typeof product.variacao === "object" && "id" in product.variacao) {
          variacaoId = product.variacao.id;
          setVariationName(product.variacao.nome || "");

          // Se temos o objeto da variação com os valores, atualizar os valores
          if (
            "variacao" in product.variacao &&
            Array.isArray(product.variacao.variacao)
          ) {
            setVariationValues(product.variacao.variacao);
          }
        } else {
          variacaoId = product.variacao;

          // Buscar os valores da variação
          fetchVariationValues(variacaoId);
        }
      }

      form.reset({
        nome: product.nome,
        descricao: product.descricao,
        preco: product.preco,
        preco_promocional: product.preco_promocional || "",
        categoria: categoryId, // Usa o valor correto da categoria
        imagem: product.imagem,
        parcelamento_cartao: product.parcelamento_cartao,
        desconto_avista: product.desconto_avista,
        status: product.status,
        estoque: product.estoque,
        tem_variacao: temVariacao,
        variacao: variacaoId,
      });

      // Se o produto tem variações, carregar os produtos variados
      if (temVariacao && productId) {
        fetchProductVariations(productId);
      }
    }
  }, [product, form.reset, isSubmitting, getProductCategoryId]);

  // Função para buscar os valores de uma variação
  const fetchVariationValues = async (variationId: string) => {
    try {
      const response = await api.get(`/api/products/variations/${variationId}`);
      if (response.data?.data) {
        setVariationName(response.data.data.nome || "");
        if (response.data.data?.variacao) {
          setVariationValues(response.data.data.variacao);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar valores da variação:", error);
    }
  };

  // Função para buscar os produtos variados
  const fetchProductVariations = async (productId: string) => {
    try {
      const response = await api.get(`/api/products/${productId}/variations`);

      if (response.data?.data) {
        // Mapear os produtos variados para o formato do formulário
        const variations = response.data.data.map((item: any) => ({
          id: item.id,
          valor_variacao: item.valor_variacao,
          preco: item.produto?.preco || "",
          preco_promocional: item.produto?.preco_promocional || "",
          imagem: item.produto?.imagem || null,
          status: item.produto?.status || "disponivel",
        }));

        form.setValue("variacoes_produtos", variations);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos variados:", error);
    }
  };

  // Handler para mudança de variação
  const handleVariationChange = (
    variationId: string,
    values: string[],
    name: string
  ) => {
    setVariationValues(values);
    setVariationName(name);

    // Se já temos produtos variados no formulário, resetar apenas se a variação mudou
    if (form.getValues("variacoes_produtos")?.length > 0) {
      const currentVariation = form.getValues("variacao");
      if (currentVariation !== variationId) {
        // Se mudou a variação, limpar os produtos variados existentes
        form.setValue(
          "variacoes_produtos",
          // Criar um array com um objeto para cada valor de variação
          values.map((value) => ({
            valor_variacao: value,
            preco: "",
            preco_promocional: "",
            imagem: null,
            status: "disponivel",
          }))
        );
      }
    } else {
      // Se não tem produtos variados, inicializar com os valores da variação
      form.setValue(
        "variacoes_produtos",
        values.map((value) => ({
          valor_variacao: value,
          preco: "",
          preco_promocional: "",
          imagem: null,
          status: "disponivel",
        }))
      );
    }
  };

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Iniciando salvamento do produto");

      // Se categoria for 0, enviamos como null para a API
      const dataToSubmit = {
        ...data,
        categoria: data.categoria === 0 ? null : data.categoria,
        desconto_avista: data.desconto_avista ?? undefined,
        // Se o produto tem variação, o preço fica nulo
        preco: data.tem_variacao ? null : data.preco || undefined,
        // Garantir que variacao seja definido se tem_variacao for true
        variacao: data.tem_variacao ? data.variacao : null,
        tem_variacao: data.tem_variacao,
      };

      let productResponse;
      let savedProductId = productId;

      console.log("Dados a serem enviados para o produto:", dataToSubmit);

      if (isEditing && productId) {
        // Atualizar produto existente
        productResponse = await updateProduct({
          id: productId,
          data: dataToSubmit,
        });
        console.log("Produto atualizado com sucesso:", productResponse);
      } else {
        // Criar novo produto
        productResponse = await createProduct(dataToSubmit);
        console.log("Produto criado com sucesso:", productResponse);
        savedProductId = productResponse?.id;
      }

      // Somente cria as variações se o produto tiver variação, uma variação escolhida e um ID de produto
      if (
        data.tem_variacao &&
        data.variacao &&
        savedProductId &&
        data.variacoes_produtos?.length
      ) {
        try {
          console.log("Criando associações de variações");
          // Criar as associações na tabela produto_variado
          await handleSubmitVariations(
            savedProductId,
            data.variacao,
            data.variacoes_produtos
          );
        } catch (variationError) {
          console.error(
            "Erro ao criar associações de variações:",
            variationError
          );
          showErrorToast(
            toast,
            "Erro ao criar associações de variações. O produto foi criado, mas as variações não foram associadas."
          );
        }
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

  // Função para criar/atualizar os produtos variados
  const handleSubmitVariations = async (
    productId: string,
    variationId: string,
    variations: any[]
  ) => {
    try {
      setIsCreatingVariations(true);
      console.log(
        "Iniciando criação de associações para o produto:",
        productId
      );
      console.log("Total de variações a criar:", variations.length);

      // Para cada variação, criar o produto_variado
      for (const variation of variations) {
        try {
          console.log("Processando variação:", variation.valor_variacao);

          // Dados para a criação do produto_variado na tabela produto_variado
          const variationData = {
            produto: productId,
            variacao: variationId,
            valor_variacao: variation.valor_variacao,
            empresa: companyId,
          };

          console.log(
            "Dados a serem enviados para produto_variado:",
            variationData
          );

          // Enviar a requisição para criar a associação na tabela produto_variado
          const response = await api.post(
            `/api/products/variation-items`,
            variationData
          );
          console.log("Associação criada com sucesso:", response.data);
        } catch (error) {
          console.error(
            `Erro ao criar associação ${variation.valor_variacao}:`,
            error
          );
          // Continuar com as próximas variações mesmo se esta falhar
        }
      }
    } catch (error) {
      console.error("Erro ao criar associações de variações:", error);
      throw error;
    } finally {
      setIsCreatingVariations(false);
    }
  };

  // Watcher para o campo tem_variacao, para ajustar o formulário
  const temVariacao = form.watch("tem_variacao");
  const selectedVariation = form.watch("variacao");
  const variacoesProducts = form.watch("variacoes_produtos") || [];

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
                      value={value ?? undefined}
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

        {/* Variação do Produto */}
        <SectionCard
          title="Variações de Produto"
          icon={<Layers size={22} color="#0891B2" />}
        >
          <View className="gap-4 flex flex-col py-4">
            <Controller
              control={form.control}
              name="tem_variacao"
              render={({ field: { onChange, value } }) => (
                <StatusToggle
                  value={value}
                  onChange={onChange}
                  activeLabel="Este produto possui variações"
                  inactiveLabel="Este produto não possui variações"
                  disabled={isSubmitting}
                />
              )}
            />

            {/* Exibir explicação sobre variações de produtos */}
            {temVariacao && (
              <View className="bg-blue-50 rounded-lg p-4 my-2">
                <Text className="text-blue-800 font-medium mb-1">
                  Sobre variações de produto
                </Text>
                <Text className="text-blue-600 text-sm">
                  Ao marcar um produto como tendo variações, você precisará
                  selecionar o tipo de variação (ex: Tamanho, Cor) e depois
                  escolher quais valores das variações deseja associar a este
                  produto.
                </Text>
              </View>
            )}

            {/* Mostrar seletor de tipo de variação se tem_variacao for true */}
            {temVariacao && (
              <Controller
                control={form.control}
                name="variacao"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <VariationSelector
                    value={value}
                    onChange={onChange}
                    onVariationChange={handleVariationChange}
                    error={error?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            )}

            {/* Mostrar botão para gerenciar variações se o produto já existe */}
            {temVariacao && productId && (
              <View className="mt-4">
                <ProductVariationsSummary
                  variations={variations}
                  variationName={variationName || "Variações"}
                  onPressManage={() =>
                    router.push(`/admin/products/${productId}/variations`)
                  }
                />
              </View>
            )}

            {/* Mostrar formulário de variações se tem_variacao for true e uma variação foi selecionada */}
            {temVariacao && selectedVariation && (
              <View className="mt-2">
                <View className="bg-gray-50 rounded-lg p-4 mb-4">
                  <Text className="text-lg font-semibold text-gray-800 mb-2">
                    Variações Disponíveis: {variationName}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Estas são as variações que serão associadas ao produto. As
                    configurações de preço e detalhes podem ser feitas na página
                    de gerenciamento após a criação do produto.
                  </Text>
                </View>

                <Controller
                  control={form.control}
                  name="variacoes_produtos"
                  render={({ field: { onChange, value } }) => (
                    <ProductVariationsForm
                      variations={value || []}
                      variationValues={variationValues}
                      onChange={onChange}
                      isLoading={isSubmitting}
                    />
                  )}
                />
              </View>
            )}
          </View>
        </SectionCard>

        {/* Preços - apenas se não tiver variação */}
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
                    value={value}
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

        {/* Status do Produto - Usando o StatusToggle */}
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
                  activeLabel="Aceita pagamento parcelado"
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

      {/* Botões de ação */}
      <View
        className="absolute bottom-0 left-0 right-0 w-full pb-6 pt-3 bg-white border-t border-gray-200 shadow-lg"
        style={{ paddingBottom: Platform.OS === "ios" ? 24 : 16 }}
      >
        <FormActions
          primaryAction={{
            label:
              isSubmitting || isCreatingVariations ? "Salvando..." : "Salvar",
            onPress: form.handleSubmit(handleSubmit),
            isLoading: isSubmitting || isCreatingVariations,
          }}
          secondaryAction={{
            label: "Cancelar",
            onPress: () => router.back(),
            variant: "outline",
            isDisabled: isSubmitting || isCreatingVariations,
          }}
          className="px-4 w-full"
          spacing="sm"
        />
      </View>
    </SafeAreaView>
  );
}
