// Path: src/features/products/components/product-form-modal.tsx
import React, { useEffect } from "react";
import { View, ScrollView, Platform, Text } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon, CloseIcon } from "@/components/ui/icon";
import { ImageUpload } from "@/components/common/image-upload";
import { Product } from "../models/product";
import { productFormSchema, ProductFormData } from "../schemas/product.schema";
import { SectionCard } from "@/components/custom/section-card";
import { FormField } from "@/components/custom/form-field";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
} from "@/components/ui/form-control";
import {
  Input,
  InputField,
  Textarea,
  TextareaInput,
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
  Switch,
} from "@gluestack-ui/themed";
import { DollarSign, Package, Tag, Percent } from "lucide-react-native";
import { useCategories } from "@/src/features/categories/hooks/use-categories";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  isLoading: boolean;
  product?: Product | null;
}

export function ProductFormModal({
  open,
  onClose,
  onSubmit,
  isLoading,
  product,
}: ProductFormModalProps) {
  const { categories } = useCategories();
  const isEditing = !!product;

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

  const { watch } = form;

  useEffect(() => {
    if (product && open) {
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
    } else if (open) {
      form.reset({
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
      });
    }
  }, [product, form.reset, open]);

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="lg"
      useRNModal={Platform.OS !== "web"}
    >
      <ModalBackdrop />
      <ModalContent
        className="max-w-4xl rounded-xl"
        style={{
          marginHorizontal: 16,
          marginVertical: 24,
          marginTop: 40,
          marginBottom: 40,
          maxHeight: "90%",
        }}
      >
        <ModalHeader className="border-b border-gray-200 px-4 py-4 flex flex-col">
          <View className="w-full flex">
            <ModalCloseButton className="justify-end items-end">
              <Icon
                as={CloseIcon}
                size="lg"
                className="stroke-primary-500 group-[:hover]/modal-close-button:stroke-background-700"
              />
            </ModalCloseButton>
          </View>
          <Heading size="md" className="text-typography-950">
            {isEditing ? "Editar Produto" : "Novo Produto"}
          </Heading>
          <Text className="text-typography-500 mt-1 text-sm">
            {isEditing
              ? "Atualize as informações do produto"
              : "Adicione um novo produto ao catálogo"}
          </Text>
        </ModalHeader>

        <ModalBody>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 24,
              gap: 16,
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

                <FormControl isInvalid={!!form.formState.errors.categoria}>
                  <FormControlLabel>
                    <Text className="text-sm font-medium text-gray-700">
                      Categoria
                    </Text>
                  </FormControlLabel>
                  <Controller
                    control={form.control}
                    name="categoria"
                    render={({ field: { onChange, value } }) => {
                      const categoryId = value?.toString() || "0";
                      const categoryName =
                        value === 0
                          ? "Sem categoria"
                          : categories.find((c) => c.id === categoryId)?.nome ||
                            "Sem categoria";

                      return (
                        <Select
                          selectedValue={categoryId}
                          onValueChange={(val) =>
                            onChange(parseInt(val || "0"))
                          }
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
                                  value={category.id}
                                />
                              ))}
                            </SelectContent>
                          </SelectPortal>
                        </Select>
                      );
                    }}
                  />
                  {form.formState.errors.categoria && (
                    <FormControlError>
                      <FormControlErrorText className="text-sm">
                        {form.formState.errors.categoria.message}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
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
                        disabled={isLoading}
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
                    <Text className="text-sm font-medium text-gray-700">
                      Preço
                    </Text>
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

                <FormControl
                  isInvalid={!!form.formState.errors.preco_promocional}
                >
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
                <FormControl>
                  <FormControlLabel>
                    <Text className="text-sm font-medium text-gray-700">
                      Status
                    </Text>
                  </FormControlLabel>
                  <Controller
                    control={form.control}
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
                            <SelectItem
                              label="Indisponível"
                              value="indisponivel"
                            />
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    )}
                  />
                </FormControl>
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
                    {watch("parcelamento_cartao")
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
                        disabled={isLoading}
                      />
                    )}
                  />
                </View>

                {Boolean(watch("parcelamento_cartao")) && (
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
                    {watch("parcelas_sem_juros")
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
                        disabled={isLoading}
                      />
                    )}
                  />
                </View>

                <FormControl
                  isInvalid={!!form.formState.errors.desconto_avista}
                >
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
        </ModalBody>

        <ModalFooter className="border-t border-gray-200 p-4">
          <Button
            variant="outline"
            action="primary"
            onPress={onClose}
            disabled={isLoading}
            className="flex-1 mr-3"
          >
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button
            onPress={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            className="flex-1"
          >
            <ButtonText>{isLoading ? "Salvando..." : "Salvar"}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
