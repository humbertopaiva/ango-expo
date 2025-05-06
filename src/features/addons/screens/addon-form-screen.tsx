// Path: src/features/addons/screens/addon-form-screen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAddons } from "../hooks/use-addons";
import { useAddonsListById } from "../hooks/use-addons";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  Input,
  InputField,
  useToast,
} from "@gluestack-ui/themed";
import { router, useLocalSearchParams } from "expo-router";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { FormActions } from "@/components/custom/form-actions";
import { CategoryProductSelector } from "../components/category-product-selector";
import { ListIcon, AlertCircle } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

// Form validation schema
const addonsFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
});

type AddonsFormData = z.infer<typeof addonsFormSchema>;

export function AddonFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const isEditing = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const { addonsList, isLoading: isLoadingAddon } = useAddonsListById(
    id as string
  );
  const { createAddonsList, updateAddonsList, isCreating, isUpdating } =
    useAddons();

  const form = useForm<AddonsFormData>({
    resolver: zodResolver(addonsFormSchema),
    defaultValues: {
      nome: "",
    },
  });

  // Inicializar valores do formulário quando estiver editando
  useEffect(() => {
    if (isEditing && addonsList) {
      form.reset({
        nome: addonsList.nome,
      });

      // Definir categorias selecionadas
      const categoryIds =
        addonsList.categorias?.map((cat) =>
          Number(cat.categorias_produto_id.id)
        ) || [];
      setSelectedCategories(categoryIds);

      // Definir produtos selecionados
      const productIds =
        addonsList.produtos?.map((prod) => prod.produtos_id.id) || [];
      setSelectedProducts(productIds);
    }
  }, [isEditing, addonsList, form]);

  const handleSubmit = async (data: AddonsFormData) => {
    try {
      setIsSubmitting(true);

      // Se não há produtos selecionados, exibir um aviso
      if (selectedProducts.length === 0) {
        showErrorToast(toast, "Selecione pelo menos um produto adicional");
        setIsSubmitting(false);
        return;
      }

      const categoriesData = selectedCategories.map((catId) => ({
        categorias_produto_id: catId,
      }));

      const productsData = selectedProducts.map((prodId) => ({
        produtos_id: prodId,
      }));

      if (isEditing && id) {
        // Atualizar lista de adicionais existente
        await updateAddonsList({
          id,
          data: {
            nome: data.nome,
            categorias: categoriesData,
            produtos: productsData,
          },
        });

        showSuccessToast(toast, "Lista de adicionais atualizada com sucesso!");
      } else {
        // Criar nova lista de adicionais
        await createAddonsList({
          nome: data.nome,
          empresa: "", // Será definido no hook
          categorias: categoriesData,
          produtos: productsData,
        });

        showSuccessToast(toast, "Lista de adicionais criada com sucesso!");
      }

      // Navegar de volta após um breve atraso
      setTimeout(() => {
        router.push("/admin/addons");
      }, 500);
    } catch (error) {
      console.error("Erro ao salvar lista de adicionais:", error);
      showErrorToast(
        toast,
        `Erro ao ${isEditing ? "atualizar" : "criar"} lista de adicionais`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Exibir indicador de carregamento quando estiver buscando dados para edição
  if (isEditing && isLoadingAddon && !addonsList) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <AdminScreenHeader
          title="Editar Lista de Adicionais"
          backTo="/admin/addons"
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text className="mt-4 text-gray-500">Carregando dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminScreenHeader
        title={
          isEditing ? "Editar Lista de Adicionais" : "Nova Lista de Adicionais"
        }
        backTo="/admin/addons"
      />

      <KeyboardAwareScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 180 : 160,
          paddingTop: 16,
          paddingHorizontal: 16,
        }}
        enableResetScrollToCoords={false}
        resetScrollToCoords={{ x: 0, y: 0 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
      >
        {/* Tutorial Card */}
        <View className="bg-blue-50 p-4 rounded-xl mb-6 border-l-4 border-blue-600">
          <View className="flex-row">
            <AlertCircle size={22} color="#1E40AF" className="mr-3" />
            <View>
              <Text className="text-blue-800 font-semibold text-base">
                Como criar uma lista de adicionais:
              </Text>
              <View className="ml-1 mt-2 gap-1">
                <Text className="text-blue-700">
                  1. Dê um nome para a lista de adicionais
                </Text>
                <Text className="text-blue-700">
                  2. Selecione os produtos que farão parte desta lista
                </Text>
                <Text className="text-blue-700">
                  3. Escolha as categorias onde estes adicionais estarão
                  disponíveis
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Informações básicas */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <View className="flex-row items-center border-b border-gray-100 pb-3 mb-4">
            <ListIcon size={20} color={THEME_COLORS.primary} className="mr-2" />
            <Text className="text-lg font-semibold text-gray-800">
              Informações Básicas
            </Text>
          </View>

          <FormControl
            isInvalid={!!form.formState.errors.nome}
            className="mb-2"
          >
            <FormControlLabel>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Nome da Lista de Adicionais{" "}
                <Text className="text-red-500">*</Text>
              </Text>
            </FormControlLabel>
            <Controller
              control={form.control}
              name="nome"
              render={({ field: { onChange, value } }) => (
                <Input>
                  <InputField
                    placeholder="Digite o nome da lista de adicionais"
                    onChangeText={onChange}
                    value={value ?? ""}
                    className="bg-white rounded-lg border-gray-200"
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
        </View>

        {/* Seletor de categorias e produtos */}
        <CategoryProductSelector
          initialCategories={selectedCategories}
          initialProducts={selectedProducts}
          onCategoriesChange={setSelectedCategories}
          onProductsChange={setSelectedProducts}
        />
      </KeyboardAwareScrollView>

      {/* Botões de ação */}
      <View
        className="absolute bottom-0 left-0 right-0 w-full px-4 pb-6 pt-3 bg-white border-t border-gray-200 shadow-lg"
        style={{ paddingBottom: Platform.OS === "ios" ? 24 : 16 }}
      >
        <FormActions
          primaryAction={{
            label:
              isSubmitting || isCreating || isUpdating
                ? "Salvando..."
                : isEditing
                ? "Atualizar Lista"
                : "Criar Lista",
            onPress: form.handleSubmit(handleSubmit),
            isLoading: isSubmitting || isCreating || isUpdating,
          }}
          secondaryAction={{
            label: "Cancelar",
            onPress: () => router.back(),
            variant: "outline",
            isDisabled: isSubmitting || isCreating || isUpdating,
          }}
          className="w-full"
          spacing="sm"
        />
      </View>
    </SafeAreaView>
  );
}
