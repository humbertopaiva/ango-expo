// src/features/products/screens/product-form-screen.tsx
import React, { useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import {
  Input,
  FormControl,
  Button,
  Switch,
  VStack,
  HStack,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectItem,
  ChevronDownIcon,
  Textarea,
  TextareaInput,
} from "@gluestack-ui/themed";
import { ArrowLeft, DollarSign, Tag, Percent } from "lucide-react-native";
import { productFormSchema, ProductFormData } from "../schemas/product.schema";
import { useProducts } from "../hooks/use-products";
import { useCategories } from "../../categories/hooks/use-categories";
import { FormField } from "@/components/custom/form-field";
import { ActionCard } from "@/components/custom/action-card";
import { ImageUpload } from "@/components/common/image-upload";
import ScreenHeader from "@/components/ui/screen-header";
import { ProductFormSkeleton } from "../components/product-form-skeleton";
import { FormActions } from "@/components/custom/form-actions";

interface ProductFormScreenProps {
  productId?: string;
}

export function ProductFormScreen({ productId }: ProductFormScreenProps) {
  const params = useLocalSearchParams<{ id: string }>();
  const id = productId || params.id;
  const isEditing = !!id;

  const { products, createProduct, updateProduct, isCreating, isUpdating } =
    useProducts();
  const { categories } = useCategories();

  const product = products.find((p) => p.id === id);
  const isLoading = isCreating || isUpdating;

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = form;

  useEffect(() => {
    if (product) {
      reset({
        nome: product.nome,
        descricao: product.descricao,
        preco: product.preco,
        preco_promocional: product.preco_promocional,
        categoria: product.categoria,
        imagem: product.imagem,
        parcelamento_cartao: product.parcelamento_cartao,
        parcelas_sem_juros: product.parcelas_sem_juros,
        desconto_avista: product.desconto_avista,
        status: product.status,
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing && id) {
        await updateProduct({
          id,
          data: {
            nome: data.nome,
            descricao: data.descricao,
            preco: data.preco,
            preco_promocional: data.preco_promocional,
            categoria: data.categoria === 0 ? undefined : data.categoria,
            imagem: data.imagem,
            parcelamento_cartao: data.parcelamento_cartao,
            parcelas_sem_juros: data.parcelas_sem_juros,
            desconto_avista: data.desconto_avista,
            status: data.status,
          },
        });
      } else {
        await createProduct({
          nome: data.nome,
          descricao: data.descricao,
          preco: data.preco,
          preco_promocional: data.preco_promocional,
          categoria: data.categoria,
          imagem: data.imagem,
          parcelamento_cartao: data.parcelamento_cartao,
          parcelas_sem_juros: data.parcelas_sem_juros,
          desconto_avista: data.desconto_avista,
          status: data.status,
          estoque: 0,
        });
      }
      router.back();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Mostra o skeleton enquanto estiver carregando produtos (para edição)
  if (isEditing && isLoading) {
    return <ProductFormSkeleton />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <ScreenHeader
        title={isEditing ? "Editar Produto" : "Novo Produto"}
        showBackButton={true}
      />

      {/* Form */}
      <ScrollView className="flex-1 container mx-auto px-4">
        <VStack space="lg" className="py-6">
          {/* Informações básicas */}
          <ActionCard title="Informações Básicas">
            <FormField
              control={control}
              name="nome"
              label="Nome do Produto"
              placeholder="Digite o nome do produto"
              error={errors.nome}
            />

            <Controller
              control={control}
              name="descricao"
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={!!errors.descricao}>
                  <FormControl.Label>
                    <Text className="text-sm font-medium text-gray-700">
                      Descrição
                    </Text>
                  </FormControl.Label>
                  <Textarea>
                    <TextareaInput
                      placeholder="Digite a descrição do produto"
                      onChangeText={onChange}
                      value={value}
                    />
                  </Textarea>
                  {errors.descricao && (
                    <FormControl.Error>
                      <Text className="text-sm text-red-500">
                        {errors.descricao.message}
                      </Text>
                    </FormControl.Error>
                  )}
                </FormControl>
              )}
            />

            <FormControl isInvalid={!!errors.categoria}>
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700">
                  Categoria
                </Text>
              </FormControl.Label>
              <Controller
                control={control}
                name="categoria"
                render={({ field: { onChange, value } }) => {
                  // Encontra a categoria atual para exibição
                  const categoryName =
                    value === 0
                      ? "Sem categoria"
                      : categories.find((c) => c.id === value.toString())
                          ?.nome || "";

                  return (
                    <Select
                      selectedValue={value?.toString()}
                      onValueChange={(val) => onChange(parseInt(val))}
                    >
                      <SelectTrigger>
                        <SelectInput
                          placeholder="Selecione uma categoria"
                          value={categoryName}
                        />
                        <SelectIcon>
                          <ChevronDownIcon />
                        </SelectIcon>
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicator />
                          <SelectItem label="Sem categoria" value="0" />
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              label={category.nome}
                              value={category.id.toString()}
                            />
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  );
                }}
              />
            </FormControl>
          </ActionCard>

          {/* Imagem */}
          <ActionCard title="Imagem do Produto">
            <Controller
              control={control}
              name="imagem"
              render={({ field: { onChange, value } }) => (
                <ImageUpload
                  value={value}
                  onChange={onChange}
                  disabled={isLoading}
                />
              )}
            />
          </ActionCard>

          {/* Preços */}
          <ActionCard title="Preços">
            <FormField
              control={control}
              name="preco"
              label="Preço"
              placeholder="0,00"
              keyboardType="numeric"
              error={errors.preco}
              leftIcon={<DollarSign size={20} color="#6B7280" />}
            />

            <FormField
              control={control}
              name="preco_promocional"
              label="Preço Promocional"
              placeholder="0,00"
              keyboardType="numeric"
              error={errors.preco_promocional}
              leftIcon={<Tag size={20} color="#6B7280" />}
            />
          </ActionCard>

          {/* Status */}
          <ActionCard title="Status do Produto">
            <FormControl>
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700">
                  Status
                </Text>
              </FormControl.Label>
              <Controller
                control={control}
                name="status"
                render={({ field: { onChange, value } }) => (
                  <Select selectedValue={value} onValueChange={onChange}>
                    <SelectTrigger>
                      <SelectInput placeholder="Selecione o status" />
                      <SelectIcon>
                        <ChevronDownIcon />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicator />
                        <SelectItem label="Disponível" value="disponivel" />
                        <SelectItem label="Indisponível" value="indisponivel" />
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                )}
              />
            </FormControl>
          </ActionCard>

          {/* Opções de Pagamento */}
          <ActionCard title="Opções de Pagamento">
            <Controller
              control={control}
              name="parcelamento_cartao"
              render={({ field: { onChange, value } }) => (
                <HStack space="md" alignItems="center" className="mb-4">
                  <Switch value={value} onValueChange={onChange} />
                  <Text className="text-sm text-gray-600">
                    {value
                      ? "Permite Parcelamento"
                      : "Não Permite Parcelamento"}
                  </Text>
                </HStack>
              )}
            />

            {/* Quantidade de Parcelas */}
            {Boolean(watch("parcelamento_cartao")) && (
              <FormField
                control={control}
                name="quantidade_parcelas"
                label="Quantidade de Parcelas"
                placeholder="Ex: 12"
                keyboardType="numeric"
                error={errors.quantidade_parcelas}
              />
            )}

            {/* Parcelas sem Juros */}
            <Controller
              control={control}
              name="parcelas_sem_juros"
              render={({ field: { onChange, value } }) => (
                <HStack space="md" alignItems="center" className="my-4">
                  <Switch value={value} onValueChange={onChange} />
                  <Text className="text-sm text-gray-600">
                    {value ? "Parcelas sem Juros" : "Parcelas com Juros"}
                  </Text>
                </HStack>
              )}
            />

            <FormField
              control={control}
              name="desconto_avista"
              label="Desconto à Vista (%)"
              placeholder="0"
              keyboardType="numeric"
              error={errors.desconto_avista}
              leftIcon={<Percent size={20} color="#6B7280" />}
            />
          </ActionCard>
        </VStack>
      </ScrollView>

      {/* Footer */}
      <FormActions
        fixed={true}
        primaryAction={{
          label: "Salvar",
          onPress: handleSubmit(onSubmit),
          isLoading: isLoading,
          colorScheme: "primary",
        }}
        secondaryAction={{
          label: "Cancelar",
          onPress: () => router.back(),
          variant: "outline",
          isDisabled: isLoading,
        }}
      />
    </SafeAreaView>
  );
}
