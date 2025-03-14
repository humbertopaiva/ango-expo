// Path: src/features/categories/screens/category-form-screen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Platform, ActivityIndicator } from "react-native";
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
import { Check, FolderIcon, X } from "lucide-react-native";
import { Switch } from "@/components/ui/switch";
import { ScrollView } from "react-native";

interface CategoryFormScreenProps {
  categoryId?: string;
}

export function CategoryFormScreen({ categoryId }: CategoryFormScreenProps) {
  const params = useLocalSearchParams<{ id: string }>();
  const id = categoryId || params.id;
  const isEditing = !!id;
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    categories,
    createCategory,
    updateCategory,
    isCreating,
    isUpdating,
    isLoading,
    getCategoryById,
  } = useCategories();

  const category = categories.find((c) => c.id === id);
  const isPending = isCreating || isUpdating || isSubmitting;
  const primaryColor = THEME_COLORS.primary;

  // Estado local para status
  const [statusValue, setStatusValue] = useState(true);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      nome: "",
      categoria_ativa: true,
    },
  });

  // Carregar detalhes da categoria ao iniciar
  useEffect(() => {
    const loadCategory = async () => {
      if (isEditing && id) {
        // Primeiro tenta usar os dados do estado global
        if (category) {
          form.reset({
            nome: category.nome,
            categoria_ativa: category.categoria_ativa,
          });
          setStatusValue(category.categoria_ativa);
          return;
        }

        // Caso não encontre, busca do servidor
        try {
          const fetchedCategory = await getCategoryById(id);
          if (fetchedCategory) {
            form.reset({
              nome: fetchedCategory.nome,
              categoria_ativa: fetchedCategory.categoria_ativa,
            });
            setStatusValue(fetchedCategory.categoria_ativa);
          }
        } catch (error) {
          console.error("Erro ao carregar categoria:", error);
          toastUtils.error(
            toast,
            "Não foi possível carregar os dados da categoria"
          );
        }
      }
    };

    loadCategory();
  }, [id, isEditing, category, form.reset, getCategoryById, toast]);

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
      setIsSubmitting(true);

      if (isEditing && id) {
        await updateCategory({
          id,
          data: {
            nome: data.nome,
            categoria_ativa: data.categoria_ativa,
          },
        });
        toastUtils.success(toast, "Categoria atualizada com sucesso!");
      } else {
        await createCategory({
          nome: data.nome,
          categoria_ativa: data.categoria_ativa,
        });
        toastUtils.success(toast, "Categoria criada com sucesso!");
      }

      // Tempo para que a navegação ocorra após a animação do toast
      setTimeout(() => {
        router.push("/admin/categories");
      }, 100);
    } catch (error) {
      console.error("Error submitting form:", error);
      toastUtils.error(
        toast,
        `Erro ao ${isEditing ? "atualizar" : "criar"} a categoria`
      );
      setIsSubmitting(false);
    }
  };

  // Renderiza um indicador de carregamento enquanto busca os dados
  if (isEditing && isLoading && !category) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScreenHeader
          title={isEditing ? "Editar Categoria" : "Nova Categoria"}
          showBackButton={true}
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScreenHeader
        title={isEditing ? "Editar Categoria" : "Nova Categoria"}
        subtitle="Crie ou atualize informações da categoria"
        showBackButton={true}
      />
      <View className="flex-1">
        {/* Form */}
        <ScrollView
          className="flex-1 px-4 bg-white"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <VStack space="lg" className="py-6">
            {/* Nome */}
            <FormControl isInvalid={!!form.formState.errors.nome}>
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700">Nome</Text>
              </FormControl.Label>
              <Controller
                control={form.control}
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
              {form.formState.errors.nome && (
                <FormControl.Error>
                  <FormControl.Error.Text>
                    {form.formState.errors.nome.message}
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
                control={form.control}
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
                        disabled={isPending}
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
              disabled={isPending}
              className="flex-1 border-gray-300 h-14"
              style={{ borderColor: primaryColor }}
            >
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button
              onPress={form.handleSubmit(onSubmit)}
              disabled={isPending}
              className="flex-1 bg-primary-500 h-14"
              style={{ backgroundColor: primaryColor }}
            >
              <ButtonIcon>
                {isPending ? null : <FolderIcon size={18} color="white" />}
              </ButtonIcon>
              <ButtonText>
                {isPending ? "Salvando..." : "Salvar Categoria"}
              </ButtonText>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
