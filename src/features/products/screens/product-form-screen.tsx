// src/features/products/screens/product-form-screen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProducts } from "../hooks/use-products";
import { productFormSchema, ProductFormData } from "../schemas/product.schema";
import ScreenHeader from "@/components/ui/screen-header";
import { SectionCard } from "@/components/custom/section-card";
import { Package, DollarSign } from "lucide-react-native";
import { FormActions } from "@/components/custom/form-actions";
import { useCategories } from "@/src/features/categories/hooks/use-categories";
import { SelectComponent } from "@/components/custom/select";
import { ImageUpload } from "@/components/common/image-upload";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  Switch,
} from "@gluestack-ui/themed";

interface ProductFormScreenProps {
  productId?: string;
}

export function ProductFormScreen({ productId }: ProductFormScreenProps) {
  const params = useLocalSearchParams<{ id: string }>();
  const id = productId || params.id;
  const isEditing = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { products, createProduct, updateProduct, isLoading } = useProducts();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const product = products.find((p) => p.id === id);

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
    },
  });

  // Preparar as opções de categoria para o select
  const categoryOptions = [
    { label: "Sem categoria", value: "0" }, // Valor zero para "Sem categoria"
    ...categories.map((category) => ({
      label: category.nome,
      value: category.id,
    })),
  ];

  useEffect(() => {
    if (product && !isSubmitting) {
      form.reset({
        nome: product.nome,
        descricao: product.descricao,
        preco: product.preco,
        preco_promocional: product.preco_promocional || "",
        categoria: product.categoria,
        imagem: product.imagem,
        parcelamento_cartao: product.parcelamento_cartao,
        parcelas_sem_juros: product.parcelas_sem_juros,
        desconto_avista: product.desconto_avista,
        status: product.status,
        estoque: product.estoque,
      });
    }
  }, [product, form.reset, isSubmitting]);

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);

      // Se categoria for 0, enviamos como null para a API
      const dataToSubmit = {
        ...data,
        categoria: data.categoria === 0 ? null : data.categoria,
      };

      if (isEditing && id) {
        await updateProduct({
          id,
          data: dataToSubmit,
        });
      } else {
        await createProduct({
          ...dataToSubmit,
          estoque: 0,
        });
      }

      // Aguarda um momento antes de voltar para evitar race conditions
      setTimeout(() => {
        router.back();
      }, 100);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  // Renderiza um indicador de carregamento enquanto busca os dados
  if ((isEditing && isLoading) || isCategoriesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScreenHeader
          title={isEditing ? "Editar Produto" : "Novo Produto"}
          showBackButton={true}
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891B2" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader
        title={isEditing ? "Editar Produto" : "Novo Produto"}
        showBackButton={true}
      />

      <ScrollView
        className="flex-1 p-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 180 : 160,
        }} // Espaço extra para os botões de ação e tab bar
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
                  Nome do Produto
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
                  Descrição
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

            {/* Categoria */}
            <Controller
              control={form.control}
              name="categoria"
              render={({ field: { onChange, value } }) => (
                <SelectComponent
                  label="Categoria"
                  options={categoryOptions}
                  value={value}
                  onValueChange={(val) => onChange(parseInt(val || "0"))}
                  placeholder="Selecione uma categoria"
                  isInvalid={!!form.formState.errors.categoria}
                  error={form.formState.errors.categoria?.message}
                />
              )}
            />
          </View>
        </SectionCard>

        {/* Imagem */}
        <SectionCard
          title="Imagem do Produto"
          icon={<Package size={22} color="#0891B2" />}
        >
          <View className="gap-4 flex flex-col py-4">
            <FormControl isInvalid={!!form.formState.errors.imagem}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Imagem
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

        {/* Preços */}
        <SectionCard
          title="Preços"
          icon={<DollarSign size={22} color="#0891B2" />}
        >
          <View className="gap-4 flex flex-col py-4">
            <FormControl isInvalid={!!form.formState.errors.preco}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">Preço</Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="preco"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="0,00"
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                      className="bg-white"
                    />
                  </Input>
                )}
              />
              {form.formState.errors.preco && (
                <FormControlError>
                  <FormControlErrorText className="text-sm">
                    {form.formState.errors.preco.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.preco_promocional}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Preço Promocional
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="preco_promocional"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="0,00"
                      onChangeText={onChange}
                      value={value || ""}
                      keyboardType="numeric"
                      className="bg-white"
                    />
                  </Input>
                )}
              />
            </FormControl>
          </View>
        </SectionCard>

        {/* Status */}
        <SectionCard
          title="Status do Produto"
          icon={<Package size={22} color="#0891B2" />}
        >
          <View className="gap-4 flex flex-col py-4">
            <Controller
              control={form.control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <SelectComponent
                  label="Status"
                  options={[
                    { label: "Disponível", value: "disponivel" },
                    { label: "Indisponível", value: "indisponivel" },
                  ]}
                  value={value}
                  onValueChange={onChange}
                  placeholder="Selecione o status"
                  isInvalid={!!form.formState.errors.status}
                  error={form.formState.errors.status?.message}
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
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-medium text-gray-700">
                {form.watch("parcelamento_cartao")
                  ? "Permite Parcelamento"
                  : "Não Permite Parcelamento"}
              </Text>
              <Controller
                control={form.control}
                name="parcelamento_cartao"
                render={({ field: { onChange, value } }) => (
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </View>

            {Boolean(form.watch("parcelamento_cartao")) && (
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

            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-medium text-gray-700">
                {form.watch("parcelas_sem_juros")
                  ? "Parcelas sem Juros"
                  : "Parcelas com Juros"}
              </Text>
              <Controller
                control={form.control}
                name="parcelas_sem_juros"
                render={({ field: { onChange, value } }) => (
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </View>

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
                      onChangeText={(text) => onChange(Number(text))}
                      value={value?.toString()}
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
        className="absolute bottom-16 left-0 right-0 w-full pb-6 pt-3 bg-white border-t border-gray-200 shadow-lg"
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
