// src/features/categories/screens/category-form-screen.tsx
import React, { useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
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
  useToast,
} from "@gluestack-ui/themed";
import {
  categoryFormSchema,
  CategoryFormData,
} from "../schemas/category.schema";
import { useCategories } from "../hooks/use-categories";
import { Category } from "../models/category";
import ScreenHeader from "@/components/ui/screen-header";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";

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
    }
  }, [category, reset]);

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
        showSuccessToast(toast, "Categoria atualizada com sucesso!");
      } else {
        await createCategory({ data });
        showSuccessToast(toast, "Categoria criada com sucesso!");
      }
      // Navega de volta para a listagem de categorias
      router.push("/admin/categories");
    } catch (error) {
      console.error("Error submitting form:", error);
      showErrorToast(
        toast,
        `Erro ao ${isEditing ? "atualizar" : "criar"} a categoria`
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScreenHeader
        title={isEditing ? "Editar Categoria" : "Nova Categoria"}
        showBackButton={true}
      />
      <View className="flex-1">
        {/* Form */}
        <ScrollView className="flex-1 px-4">
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
                      className="bg-gray-50"
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

            {/* Status */}
            <FormControl>
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700">
                  Status
                </Text>
              </FormControl.Label>
              <Controller
                control={control}
                name="categoria_ativa"
                render={({ field: { onChange, value } }) => (
                  <HStack space="md" alignItems="center">
                    <Switch value={value} onValueChange={onChange} />
                    <Text className="text-sm text-gray-600">
                      {value ? "Ativa" : "Inativa"}
                    </Text>
                  </HStack>
                )}
              />
            </FormControl>
          </VStack>
        </ScrollView>

        {/* Footer */}
        <View className="px-4 py-4 border-t border-gray-200">
          <HStack space="md" justifyContent="flex-end">
            <Button
              variant="outline"
              onPress={() => router.push("/admin/categories")}
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
      </View>
    </SafeAreaView>
  );
}
