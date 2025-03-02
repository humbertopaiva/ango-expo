// src/features/categories/screens/category-form-screen.tsx
import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import {
  Input,
  FormControl,
  VStack,
  HStack,
  useToast,
} from "@gluestack-ui/themed";
import {
  categoryFormSchema,
  CategoryFormData,
} from "../schemas/category.schema";
import { useCategories } from "../hooks/use-categories";
import ScreenHeader from "@/components/ui/screen-header";
import { toastUtils } from "@/src/utils/toast.utils";
import { THEME_COLORS } from "@/src/styles/colors";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Check, X, FolderIcon } from "lucide-react-native";
import { ImageUpload } from "@/components/common/image-upload";
import { Switch } from "@/components/ui/switch";

interface CategoryFormScreenProps {
  categoryId?: string;
}

export function CategoryFormScreen({ categoryId }: CategoryFormScreenProps) {
  const params = useLocalSearchParams<{ id: string }>();
  const id = categoryId || params.id;
  const isEditing = !!id;
  const toast = useToast();

  const { categories, createCategory, updateCategory, isCreating, isUpdating } =
    useCategories();

  const category = categories.find((c) => c.id === id);
  const isLoading = isCreating || isUpdating;
  const primaryColor = THEME_COLORS.primary;

  // Estado local para status
  const [statusValue, setStatusValue] = useState(true);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      nome: "",
      imagem: null,
      categoria_ativa: true,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    if (category) {
      reset({
        nome: category.nome,
        imagem: category.imagem,
        categoria_ativa: category.categoria_ativa,
      });
      setStatusValue(category.categoria_ativa);
    }
  }, [category, reset]);

  // Efeito para sincronizar o estado local com o valor do formulário
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "categoria_ativa") {
        setStatusValue(value.categoria_ativa || true);
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditing && id) {
        await updateCategory({
          id,
          data: {
            nome: data.nome,
            imagem: data.imagem,
            categoria_ativa: data.categoria_ativa,
          },
        });
        toastUtils.success(toast, "Categoria atualizada com sucesso!");
      } else {
        await createCategory({ data });
        toastUtils.success(toast, "Categoria criada com sucesso!");
      }
      // Navega de volta para a listagem de categorias
      router.push("/admin/categories");
    } catch (error) {
      console.error("Error submitting form:", error);
      toastUtils.error(
        toast,
        `Erro ao ${isEditing ? "atualizar" : "criar"} a categoria`
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScreenHeader
        title={isEditing ? "Editar Categoria" : "Nova Categoria"}
        subtitle="Crie ou atualize informações da categoria"
        showBackButton={true}
      />
      <View className="flex-1">
        {/* Form */}
        <ScrollView className="flex-1 px-4 bg-white">
          <VStack space="lg" className="py-6">
            {/* Nome */}
            <FormControl isInvalid={!!errors.nome}>
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700">Nome</Text>
              </FormControl.Label>
              <Controller
                control={control}
                name="nome"
                render={({ field: { onChange, value, onBlur } }) => (
                  <Input>
                    <Input.Input
                      placeholder="Digite o nome da categoria"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      className="bg-white border border-gray-200"
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
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700">
                  Imagem da Categoria
                </Text>
              </FormControl.Label>
              <Text className="text-xs text-gray-500 mb-2">
                Esta imagem será exibida nos menus e listagens
              </Text>
              <Controller
                control={control}
                name="imagem"
                render={({ field: { onChange, value } }) => (
                  <ImageUpload
                    value={value || ""}
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

            {/* Status como Toggle com feedback visual melhorado */}
            <FormControl>
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Status da Categoria
                </Text>
              </FormControl.Label>
              <Controller
                control={control}
                name="categoria_ativa"
                render={({ field: { onChange, value } }) => (
                  <View className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <HStack justifyContent="space-between" alignItems="center">
                      <HStack space="sm" alignItems="center">
                        {statusValue ? (
                          <View className="w-6 h-6 rounded-full bg-green-100 items-center justify-center">
                            <Check size={14} color="#10B981" />
                          </View>
                        ) : (
                          <View className="w-6 h-6 rounded-full bg-red-100 items-center justify-center">
                            <X size={14} color="#EF4444" />
                          </View>
                        )}
                        <Text
                          className={`font-medium ${
                            statusValue ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {statusValue ? "Ativa" : "Inativa"}
                        </Text>
                      </HStack>

                      <Switch
                        value={statusValue}
                        onValueChange={(newValue) => {
                          setStatusValue(newValue);
                          onChange(newValue);
                        }}
                        disabled={isLoading}
                        trackColor={{ false: "#EF4444", true: "#10B981" }}
                        thumbColor={statusValue ? "#ffffff" : "#ffffff"}
                      />
                    </HStack>

                    <Text className="text-xs text-gray-500 mt-2">
                      {statusValue
                        ? "A categoria está visível para os clientes."
                        : "A categoria está oculta e não aparecerá para os clientes."}
                    </Text>
                  </View>
                )}
              />
            </FormControl>
          </VStack>
        </ScrollView>

        {/* Footer */}
        <View
          className="px-4 py-4 border-t border-gray-200 bg-white"
          style={{
            paddingBottom: Platform.OS === "ios" ? 24 : 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 5,
          }}
        >
          <View className="flex-row gap-4">
            <Button
              variant="outline"
              onPress={() => router.push("/admin/categories")}
              disabled={isLoading}
              className="flex-1 border-gray-300 h-14"
              style={{ borderColor: primaryColor }}
            >
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="flex-1 bg-primary-500 h-14"
              style={{ backgroundColor: primaryColor }}
            >
              <ButtonIcon>
                {isLoading ? null : <FolderIcon size={18} color="white" />}
              </ButtonIcon>
              <ButtonText>
                {isLoading ? "Salvando..." : "Salvar Categoria"}
              </ButtonText>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
