// Path: src/features/custom-products/screens/custom-product-form-screen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Platform, ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useCustomProducts,
  useCustomProductById,
} from "../hooks/use-custom-products";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Switch,
  useToast,
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioIcon,
  RadioLabel,
  CircleIcon,
} from "@gluestack-ui/themed";
import { router, useLocalSearchParams } from "expo-router";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { FormActions } from "@/components/custom/form-actions";
import { SectionCard } from "@/components/custom/section-card";
import { StepsEditor } from "../components/steps-editor";
import {
  CreateCustomProductDTO,
  CustomProductStep,
} from "../models/custom-product";
import {
  MenuSquare,
  Image,
  AlertCircle,
  Tag,
  Percent,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { imageUtils } from "@/src/utils/image.utils";
import { ImagePreview } from "@/components/custom/image-preview";
import { TouchableOpacity } from "react-native";
import { THEME_COLORS } from "@/src/styles/colors";

// Form validation schema
const customProductFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  status: z.boolean().default(false),
  // New fields
  preco_tipo: z.enum(["menor", "media", "maior", "unico"]).default("menor"),
  preco: z.string().optional(),
});

type CustomProductFormData = z.infer<typeof customProductFormSchema>;

export function CustomProductFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const isEditing = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [steps, setSteps] = useState<CustomProductStep[]>([]);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [selectedPriceType, setSelectedPriceType] = useState<string>("menor");

  const { customProduct, isLoading: isLoadingCustomProduct } =
    useCustomProductById(id as string);
  const { createCustomProduct, updateCustomProduct, isCreating, isUpdating } =
    useCustomProducts();

  const form = useForm<CustomProductFormData>({
    resolver: zodResolver(customProductFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      status: false,
      preco_tipo: "menor",
      preco: "",
    },
  });

  useEffect(() => {
    if (isEditing && customProduct) {
      form.reset({
        nome: customProduct.nome,
        descricao: customProduct.descricao,
        status: customProduct.status === "ativo",
        preco_tipo: customProduct.preco_tipo || "menor",
        preco: customProduct.preco || "",
      });

      setSelectedPriceType(customProduct.preco_tipo || "menor");

      // Definir imagem do produto
      setImageUri(customProduct.imagem);

      // Importante: Verificar se temos passos definidos e formatá-los corretamente
      if (
        customProduct.passos &&
        Array.isArray(customProduct.passos) &&
        customProduct.passos.length > 0
      ) {
        // Garanta que temos uma cópia profunda dos dados
        const formattedSteps = customProduct.passos.map((step) => ({
          passo_numero: step.passo_numero,
          qtd_items_step: step.qtd_items_step,
          nome: step.nome || `Passo ${step.passo_numero}`,
          descricao: step.descricao || "",
          produtos: Array.isArray(step.produtos) ? [...step.produtos] : [],
        }));

        // Agora definimos os passos devidamente formatados
        setSteps(formattedSteps);

        // Log para debug
        console.log(
          "Passos formatados para edição:",
          JSON.stringify(formattedSteps)
        );
      } else {
        setSteps([]);
      }
    }
  }, [isEditing, customProduct, form]);

  // Gerenciar as etapas de personalização
  const handleStepsChange = (newSteps: CustomProductStep[]) => {
    setSteps(newSteps);
  };

  // Selecionar imagem
  const handleSelectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIsImageLoading(true);
        const uri = result.assets[0].uri;

        // Validar imagem
        const isValid = await imageUtils.validateImageUrl(uri);
        if (!isValid) {
          showErrorToast(toast, "Formato de imagem inválido");
          setIsImageLoading(false);
          return;
        }

        // Upload da imagem
        const uploadResult = await imageUtils.uploadImage(uri);
        if (uploadResult.error) {
          showErrorToast(toast, "Erro ao fazer upload da imagem");
          setIsImageLoading(false);
          return;
        }

        setImageUri(uploadResult.url);
        setIsImageLoading(false);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      showErrorToast(toast, "Erro ao selecionar imagem");
      setIsImageLoading(false);
    }
  };

  // Remover imagem
  const handleRemoveImage = () => {
    setImageUri(null);
  };

  // Handle price type change
  const handlePriceTypeChange = (value: string) => {
    setSelectedPriceType(value);
    form.setValue("preco_tipo", value as "menor" | "media" | "maior" | "unico");
  };

  // Enviar formulário
  const handleSubmit = async (data: CustomProductFormData) => {
    try {
      // Validar se tem pelo menos um passo
      if (steps.length === 0) {
        showErrorToast(toast, "Adicione pelo menos um passo de personalização");
        return;
      }

      // Validar se cada passo tem pelo menos um produto
      const stepsWithoutProducts = steps.filter(
        (step) => !step.produtos || step.produtos.length === 0
      );
      if (stepsWithoutProducts.length > 0) {
        showErrorToast(
          toast,
          `O passo ${stepsWithoutProducts[0].passo_numero} não possui produtos`
        );
        return;
      }

      // Validar se preço foi informado quando tipo de preço é "unico"
      if (
        data.preco_tipo === "unico" &&
        (!data.preco || data.preco.trim() === "")
      ) {
        showErrorToast(
          toast,
          "Você deve informar um preço quando o tipo é 'Preço único'"
        );
        return;
      }

      setIsSubmitting(true);

      if (isEditing && id) {
        // Atualizar produto personalizado existente
        const updateData = {
          nome: data.nome,
          descricao: data.descricao || "",
          imagem: imageUri,
          status: data.status ? "ativo" : "desativado",
          preco_tipo: data.preco_tipo,
          preco: data.preco_tipo === "unico" ? data.preco : undefined,
          passos: steps,
        };

        await updateCustomProduct({
          id,
          data: updateData,
        });

        showSuccessToast(
          toast,
          "Produto personalizado atualizado com sucesso!"
        );

        // Navegar de volta após um breve atraso
        setTimeout(() => {
          router.push("/admin/custom-products");
        }, 500);
      } else {
        // Para criação, precisamos de todos os campos
        const customProductData = {
          nome: data.nome,
          descricao: data.descricao || "",
          imagem: imageUri,
          status: data.status ? "ativo" : "desativado",
          preco_tipo: data.preco_tipo,
          preco: data.preco_tipo === "unico" ? data.preco : undefined,
          passos: steps,
          empresa: "", // Será preenchido no backend
        };

        await createCustomProduct(customProductData);
        showSuccessToast(toast, "Produto personalizado criado com sucesso!");

        // Navegar de volta após um breve atraso
        setTimeout(() => {
          router.push("/admin/custom-products");
        }, 500);
      }
    } catch (error) {
      console.error("Erro ao salvar produto personalizado:", error);

      // Mostrar detalhes do erro se disponíveis
      if (error instanceof Error) {
        showErrorToast(
          toast,
          `Erro ao ${
            isEditing ? "atualizar" : "criar"
          } produto personalizado: ${error.message}`
        );
      } else {
        showErrorToast(
          toast,
          `Erro ao ${isEditing ? "atualizar" : "criar"} produto personalizado`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Exibir indicador de carregamento quando estiver buscando dados para edição
  if (isEditing && isLoadingCustomProduct && !customProduct) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <AdminScreenHeader
          title="Editar Produto Personalizado"
          backTo="/admin/custom-products"
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#F4511E" />
          <Text className="mt-4 text-gray-500">Carregando dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AdminScreenHeader
        title={
          isEditing
            ? "Editar Produto Personalizado"
            : "Novo Produto Personalizado"
        }
        backTo="/admin/custom-products"
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
        {/* Instruções de uso */}
        <View className="bg-blue-50 p-4 rounded-lg mb-6">
          <View className="flex-row">
            <AlertCircle size={20} color="#1E40AF" className="mr-2 mt-0.5" />
            <View>
              <Text className="text-blue-800 font-medium">
                Como criar produtos personalizados:
              </Text>
              <Text className="text-blue-700 mt-1">
                1. Preencha as informações básicas do produto
              </Text>
              <Text className="text-blue-700">
                2. Configure o tipo de preço do produto
              </Text>
              <Text className="text-blue-700">
                3. Configure os passos de personalização com nomes e descrições
              </Text>
              <Text className="text-blue-700">
                4. Adicione os produtos disponíveis em cada passo
              </Text>
            </View>
          </View>
        </View>

        {/* Informações básicas */}
        <SectionCard
          title="Informações Básicas"
          icon={<MenuSquare size={22} color="#F4511E" />}
        >
          <View className="gap-4 flex flex-col py-4">
            {/* Nome */}
            <FormControl isInvalid={!!form.formState.errors.nome}>
              <FormControlLabel>
                <FormControlLabelText className="text-sm font-medium text-gray-700">
                  Nome do Produto Personalizado{" "}
                  <Text className="text-red-500">*</Text>
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="nome"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Digite o nome do produto personalizado"
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

            {/* Descrição */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText className="text-sm font-medium text-gray-700">
                  Descrição
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="descricao"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Digite uma descrição para o produto personalizado"
                      onChangeText={onChange}
                      value={value ?? ""}
                      multiline={true}
                      numberOfLines={4}
                      className="bg-white min-h-[100px] text-base py-2 px-3"
                    />
                  </Input>
                )}
              />
            </FormControl>

            {/* Imagem */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText className="text-sm font-medium text-gray-700">
                  Imagem
                </FormControlLabelText>
              </FormControlLabel>
              <View className="mt-2">
                {imageUri ? (
                  <View className="items-center">
                    <View className="w-32 h-32 mb-2">
                      <ImagePreview
                        uri={imageUri}
                        containerClassName="rounded-lg"
                        fallbackIcon={() => <Image size={32} color="#6B7280" />}
                      />
                    </View>
                    <View className="flex-row mt-2">
                      <TouchableOpacity
                        onPress={handleSelectImage}
                        className="mr-2 bg-blue-500 px-3 py-2 rounded-md"
                      >
                        <Text className="text-white text-sm">Trocar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleRemoveImage}
                        className="bg-red-500 px-3 py-2 rounded-md"
                      >
                        <Text className="text-white text-sm">Remover</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handleSelectImage}
                    className="flex-row items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
                    disabled={isImageLoading}
                  >
                    {isImageLoading ? (
                      <ActivityIndicator size="small" color="#F4511E" />
                    ) : (
                      <>
                        <Image size={24} color="#6B7280" className="mr-2" />
                        <Text className="text-gray-600">Selecionar imagem</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </FormControl>

            {/* Status (Ativo/Desativado) */}
            <FormControl>
              <View className="flex-row items-center justify-between">
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-medium text-gray-700">
                    Status
                  </FormControlLabelText>
                </FormControlLabel>
                <View className="flex-row items-center">
                  <Text className="mr-2 text-gray-500">
                    {form.watch("status") ? "Ativo" : "Desativado"}
                  </Text>
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field: { onChange, value } }) => (
                      <Switch
                        trackColor={{ false: "#D1D5DB", true: "#F4511E" }}
                        thumbColor="#FFFFFF"
                        ios_backgroundColor="#D1D5DB"
                        onValueChange={onChange}
                        value={value ?? false}
                      />
                    )}
                  />
                </View>
              </View>
            </FormControl>
          </View>
        </SectionCard>

        {/* Configuração de Preço */}
        <SectionCard
          title="Configuração de Preço"
          icon={<Tag size={22} color="#F4511E" />}
        >
          <View className="gap-4 flex flex-col py-4">
            <Text className="text-gray-600 mb-2">
              Escolha como o preço do produto personalizado será definido:
            </Text>

            {/* Tipo de Preço */}
            <FormControl isInvalid={!!form.formState.errors.preco_tipo}>
              <FormControlLabel>
                <FormControlLabelText className="text-sm font-medium text-gray-700">
                  Tipo de Preço
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="preco_tipo"
                render={({ field: { value } }) => (
                  <RadioGroup
                    value={value}
                    onChange={handlePriceTypeChange}
                    className="mt-2 space-y-2"
                  >
                    <Radio value="menor" className="mb-2">
                      <RadioIndicator mr="$2">
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>
                        Menor preço entre os produtos selecionados
                      </RadioLabel>
                    </Radio>
                    <Radio value="media" className="mb-2">
                      <RadioIndicator mr="$2">
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>
                        Média dos preços dos produtos selecionados
                      </RadioLabel>
                    </Radio>
                    <Radio value="maior" className="mb-2">
                      <RadioIndicator mr="$2">
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>
                        Maior preço entre os produtos selecionados
                      </RadioLabel>
                    </Radio>
                    <Radio value="unico" className="mb-2">
                      <RadioIndicator mr="$2">
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>Preço único definido manualmente</RadioLabel>
                    </Radio>
                  </RadioGroup>
                )}
              />
            </FormControl>

            {/* Campo de Preço (visível apenas quando o tipo de preço é "unico") */}
            {selectedPriceType === "unico" && (
              <FormControl isInvalid={!!form.formState.errors.preco}>
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-medium text-gray-700">
                    Preço <Text className="text-red-500">*</Text>
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={form.control}
                  name="preco"
                  render={({ field: { onChange, value } }) => (
                    <Input>
                      <InputField
                        placeholder="Digite o preço do produto (ex: 19.90)"
                        onChangeText={onChange}
                        value={value ?? ""}
                        keyboardType="decimal-pad"
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
            )}

            {/* Explicação sobre o tipo de preço selecionado */}
            <View className="bg-gray-50 p-3 rounded-lg mt-2">
              <View className="flex-row items-center">
                <Percent
                  size={18}
                  color={THEME_COLORS.primary}
                  className="mr-2"
                />
                <Text className="text-gray-700 font-medium">
                  Como funciona:
                </Text>
              </View>
              <Text className="text-gray-600 mt-1">
                {selectedPriceType === "menor" &&
                  "O preço será automaticamente definido como o menor valor entre todos os produtos que o cliente selecionar durante a personalização."}
                {selectedPriceType === "media" &&
                  "O preço será calculado como a média dos valores de todos os produtos que o cliente selecionar durante a personalização."}
                {selectedPriceType === "maior" &&
                  "O preço será automaticamente definido como o maior valor entre todos os produtos que o cliente selecionar durante a personalização."}
                {selectedPriceType === "unico" &&
                  "Você define um preço fixo para este produto personalizado, independente das escolhas do cliente."}
              </Text>
            </View>
          </View>
        </SectionCard>

        {/* Configuração de passos */}
        <StepsEditor initialSteps={steps} onStepsChange={handleStepsChange} />
      </KeyboardAwareScrollView>

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
                : isEditing
                ? "Atualizar Produto"
                : "Criar Produto",
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
