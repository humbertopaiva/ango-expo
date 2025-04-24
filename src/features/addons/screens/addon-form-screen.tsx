// Path: src/features/addons/screens/addon-form-screen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Platform } from "react-native";
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
import { SectionCard } from "@/components/custom/section-card";
import { THEME_COLORS } from "@/src/styles/colors";
import { Plus } from "lucide-react-native";

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

  const { addonsList, isLoading: isLoadingAddon } = useAddonsListById(id);
  const { createAddonsList, updateAddonsList, isCreating, isUpdating } =
    useAddons();

  const form = useForm<AddonsFormData>({
    resolver: zodResolver(addonsFormSchema),
    defaultValues: {
      nome: "",
    },
  });

  // Initialize form values when editing
  useEffect(() => {
    if (isEditing && addonsList) {
      form.reset({
        nome: addonsList.nome,
      });

      // Set selected categories
      const categoryIds = addonsList.categorias.map(
        (cat) => cat.categorias_produto_id.id
      );
      setSelectedCategories(categoryIds);

      // Set selected products
      const productIds = addonsList.produtos.map((prod) => prod.produtos_id.id);
      setSelectedProducts(productIds);
    }
  }, [isEditing, addonsList, form]);

  const handleSubmit = async (data: AddonsFormData) => {
    try {
      setIsSubmitting(true);

      // Prepare categories and products in the expected format
      const categoriesData = selectedCategories.map((catId) => ({
        categorias_produto_id: catId,
      }));

      const productsData = selectedProducts.map((prodId) => ({
        produtos_id: prodId,
      }));

      if (isEditing && id) {
        // Update existing addon list
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
        // Create new addon list
        await createAddonsList({
          nome: data.nome,
          empresa: "", // This will be set in the hook
          categorias: categoriesData,
          produtos: productsData,
        });

        showSuccessToast(toast, "Lista de adicionais criada com sucesso!");
      }

      // Navigate back after a brief delay
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AdminScreenHeader
        title={
          isEditing ? "Editar Lista de Adicionais" : "Nova Lista de Adicionais"
        }
        backTo="/admin/addons"
      />

      <ScrollView
        className="flex-1 p-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 180 : 160,
        }}
      >
        {/* Informações básicas */}
        <SectionCard
          title="Informações Básicas"
          icon={<Plus size={22} color={THEME_COLORS.primary} />}
        >
          <View className="gap-4 flex flex-col py-4">
            <FormControl isInvalid={!!form.formState.errors.nome}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
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
          </View>
        </SectionCard>

        {/* Category and Product Selector */}
        <CategoryProductSelector
          selectedCategories={selectedCategories}
          selectedProducts={selectedProducts}
          onCategoriesChange={setSelectedCategories}
          onProductsChange={setSelectedProducts}
        />
      </ScrollView>

      {/* Botões de ação */}
      <View
        className="absolute bottom-0 left-0 right-0 w-full pb-6 pt-3 bg-white border-t border-gray-200 shadow-lg"
        style={{ paddingBottom: Platform.OS === "ios" ? 24 : 16 }}
      >
        <FormActions
          primaryAction={{
            label:
              isSubmitting || isCreating || isUpdating
                ? "Salvando..."
                : "Salvar",
            onPress: form.handleSubmit(handleSubmit),
            isLoading: isSubmitting || isCreating || isUpdating,
          }}
          secondaryAction={{
            label: "Cancelar",
            onPress: () => router.back(),
            variant: "outline",
            isDisabled: isSubmitting || isCreating || isUpdating,
          }}
          className="px-4 w-full"
          spacing="sm"
        />
      </View>
    </SafeAreaView>
  );
}
