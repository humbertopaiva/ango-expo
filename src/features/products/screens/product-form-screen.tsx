// src/features/products/screens/product-form-screen.tsx
import React, { useEffect } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
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
  TextareaInput,
} from "@gluestack-ui/themed";
import { ArrowLeft } from "lucide-react-native";
import { productFormSchema, ProductFormData } from "../schemas/product.schema";
import { useProducts } from "../hooks/use-products";
// import { Product } from "../models/product";
import { useCategories } from "../../categories/hooks/use-categories";
import { Textarea } from "@gluestack-ui/themed";
import { ImageUpload } from "@/components/common/image-upload";

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
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
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
          ...data,
          estoque: 0,
        });
      }
      router.back();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <HStack space="md" alignItems="center">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold">
            {isEditing ? "Editar Produto" : "Novo Produto"}
          </Text>
        </HStack>
      </View>

      {/* Form */}
      <ScrollView className="flex-1 px-4">
        <VStack space="lg" className="py-6">
          {/* Nome */}
          <FormControl isInvalid={!!errors.nome}>
            <FormControl.Label>Nome</FormControl.Label>
            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, value } }) => (
                <Input>
                  <Input.Input
                    placeholder="Digite o nome do produto"
                    onChangeText={onChange}
                    value={value}
                  />
                </Input>
              )}
            />
            {errors.nome && (
              <FormControl.Error>
                <FormControl.Error.Text>
                  {errors.nome.message}
                </FormControl.Error.Text>
              </FormControl.Error>
            )}
          </FormControl>

          {/* Imagem */}
          <FormControl isInvalid={!!errors.imagem}>
            <FormControl.Label>Imagem do Produto</FormControl.Label>
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
            {errors.imagem && (
              <FormControl.Error>
                <FormControl.Error.Text>
                  {errors.imagem.message}
                </FormControl.Error.Text>
              </FormControl.Error>
            )}
          </FormControl>

          {/* Descrição */}
          <FormControl isInvalid={!!errors.descricao}>
            <FormControl.Label>Descrição</FormControl.Label>
            <Controller
              control={control}
              name="descricao"
              render={({ field: { onChange, value } }) => (
                <Textarea>
                  <TextareaInput
                    placeholder="Digite a descrição do produto"
                    onChangeText={onChange}
                    value={value}
                  />
                </Textarea>
              )}
            />
            {errors.descricao && (
              <FormControl.Error>
                <FormControl.Error.Text>
                  {errors.descricao.message}
                </FormControl.Error.Text>
              </FormControl.Error>
            )}
          </FormControl>

          {/* Categoria */}
          <FormControl isInvalid={!!errors.categoria}>
            <FormControl.Label>Categoria</FormControl.Label>
            <Controller
              control={control}
              name="categoria"
              render={({ field: { onChange, value } }) => (
                <Select
                  selectedValue={value?.toString()}
                  onValueChange={(val) => onChange(parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectInput placeholder="Selecione uma categoria" />
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
              )}
            />
          </FormControl>

          {/* Preço */}
          <FormControl isInvalid={!!errors.preco}>
            <FormControl.Label>Preço</FormControl.Label>
            <Controller
              control={control}
              name="preco"
              render={({ field: { onChange, value } }) => (
                <Input>
                  <Input.Input
                    placeholder="0,00"
                    keyboardType="numeric"
                    onChangeText={onChange}
                    value={value}
                  />
                </Input>
              )}
            />
            {errors.preco && (
              <FormControl.Error>
                <FormControl.Error.Text>
                  {errors.preco.message}
                </FormControl.Error.Text>
              </FormControl.Error>
            )}
          </FormControl>

          {/* Status */}
          <FormControl>
            <FormControl.Label>Status</FormControl.Label>
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

          {/* Opções de Pagamento */}
          <View className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <Text className="font-medium text-base">Opções de Pagamento</Text>

            {/* Parcelamento */}
            <Controller
              control={control}
              name="parcelamento_cartao"
              render={({ field: { onChange, value } }) => (
                <HStack space="md" alignItems="center">
                  <Switch value={value} onValueChange={onChange} />
                  <Text className="text-sm text-gray-600">
                    {value
                      ? "Permite Parcelamento"
                      : "Não Permite Parcelamento"}
                  </Text>
                </HStack>
              )}
            />

            {/* Parcelas sem Juros */}
            <Controller
              control={control}
              name="parcelas_sem_juros"
              render={({ field: { onChange, value } }) => (
                <HStack space="md" alignItems="center">
                  <Switch value={value} onValueChange={onChange} />
                  <Text className="text-sm text-gray-600">
                    {value ? "Parcelas sem Juros" : "Parcelas com Juros"}
                  </Text>
                </HStack>
              )}
            />

            {/* Desconto à Vista */}
            <FormControl isInvalid={!!errors.desconto_avista}>
              <FormControl.Label>Desconto à Vista (%)</FormControl.Label>
              <Controller
                control={control}
                name="desconto_avista"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <Input.Input
                      placeholder="0"
                      keyboardType="numeric"
                      onChangeText={(text) => onChange(parseFloat(text) || 0)}
                      value={value?.toString()}
                    />
                  </Input>
                )}
              />
              {errors.desconto_avista && (
                <FormControl.Error>
                  <FormControl.Error.Text>
                    {errors.desconto_avista.message}
                  </FormControl.Error.Text>
                </FormControl.Error>
              )}
            </FormControl>
          </View>
        </VStack>
      </ScrollView>

      {/* Footer */}
      <View className="px-4 py-4 border-t border-gray-200">
        <HStack space="md" justifyContent="flex-end">
          <Button
            variant="outline"
            onPress={() => router.back()}
            disabled={isLoading}
            className="flex-1"
          >
            <Button.Text>Cancelar</Button.Text>
          </Button>
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="flex-1"
          >
            <Button.Text>{isLoading ? "Salvando..." : "Salvar"}</Button.Text>
          </Button>
        </HStack>
      </View>
    </SafeAreaView>
  );
}
