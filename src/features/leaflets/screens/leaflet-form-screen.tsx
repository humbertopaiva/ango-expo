// src/features/leaflets/screens/leaflet-form-screen.tsx

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
import { useLeaflets } from "../hooks/use-leaflets";
import { leafletFormSchema, LeafletFormData } from "../schemas/leaflet.schema";
import ScreenHeader from "@/components/ui/screen-header";
import { SectionCard } from "@/components/custom/section-card";
import { FileText, Calendar, Image as ImageIcon } from "lucide-react-native";
import { FormActions } from "@/components/custom/form-actions";
import { ImageUpload } from "@/components/common/image-upload";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  Input,
  InputField,
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
} from "@gluestack-ui/themed";
import { useToast } from "@/src/hooks/use-toast";
import { DatePicker } from "@/components/common/date-picker";

interface LeafletFormScreenProps {
  leafletId?: string;
}

export function LeafletFormScreen({ leafletId }: LeafletFormScreenProps) {
  const toast = useToast();
  const params = useLocalSearchParams<{ id: string }>();
  const id = leafletId || params.id;
  const isEditing = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { leaflets, createLeaflet, updateLeaflet, isLoading } = useLeaflets();
  const leaflet = leaflets.find((l) => l.id === id);

  const form = useForm<LeafletFormData>({
    resolver: zodResolver(leafletFormSchema),
    defaultValues: {
      nome: "",
      validade: "",
      status: "ativo",
      banner: null,
      imagem_01: null,
      imagem_02: null,
      imagem_03: null,
      imagem_04: null,
      imagem_05: null,
      imagem_06: null,
      imagem_07: null,
      imagem_08: null,
    },
  });

  useEffect(() => {
    if (leaflet && !isSubmitting) {
      form.reset({
        nome: leaflet.nome,
        validade: leaflet.validade,
        status: leaflet.status,
        banner: leaflet.banner,
        imagem_01: leaflet.imagem_01,
        imagem_02: leaflet.imagem_02,
        imagem_03: leaflet.imagem_03,
        imagem_04: leaflet.imagem_04,
        imagem_05: leaflet.imagem_05,
        imagem_06: leaflet.imagem_06,
        imagem_07: leaflet.imagem_07,
        imagem_08: leaflet.imagem_08,
      });
    }
  }, [leaflet, form.reset, isSubmitting]);

  const handleSubmit = async (data: LeafletFormData) => {
    try {
      setIsSubmitting(true);

      if (isEditing && id) {
        await updateLeaflet({
          id,
          data: data,
        });
        toast.show({
          title: "Encarte atualizado",
          description: "O encarte foi atualizado com sucesso!",
          type: "success",
        });
      } else {
        await createLeaflet(data);
        toast.show({
          title: "Encarte criado",
          description: "O encarte foi criado com sucesso!",
          type: "success",
        });
      }

      // Aguarda um momento antes de voltar para evitar race conditions
      setTimeout(() => {
        router.back();
      }, 100);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.show({
        title: "Erro",
        description: `Ocorreu um erro ao ${
          isEditing ? "atualizar" : "criar"
        } o encarte.`,
        type: "error",
      });
      setIsSubmitting(false);
    }
  };

  // Renderiza um indicador de carregamento enquanto busca os dados
  if (isEditing && isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScreenHeader
          title={isEditing ? "Editar Encarte" : "Novo Encarte"}
          showBackButton={true}
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891B2" />
        </View>
      </SafeAreaView>
    );
  }

  // Conta o número de imagens preenchidas
  const countImages = () => {
    const values = form.getValues();
    return [
      values.imagem_01,
      values.imagem_02,
      values.imagem_03,
      values.imagem_04,
      values.imagem_05,
      values.imagem_06,
      values.imagem_07,
      values.imagem_08,
    ].filter(Boolean).length;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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
          icon={<FileText size={22} color="#0891B2" />}
        >
          <View className="gap-4 flex flex-col py-4">
            <FormControl isInvalid={!!form.formState.errors.nome}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Nome do Encarte
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="nome"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Digite o nome do encarte"
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

            <FormControl isInvalid={!!form.formState.errors.validade}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Data de Validade
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="validade"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    value={value}
                    onChange={onChange}
                    placeholder="Selecione a data de validade"
                    isInvalid={!!form.formState.errors.validade}
                    errorMessage={form.formState.errors.validade?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
              {form.formState.errors.validade && (
                <FormControlError>
                  <FormControlErrorText className="text-sm">
                    {form.formState.errors.validade.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.status}>
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
                    <SelectTrigger className="bg-white rounded-md border border-gray-300">
                      <SelectInput placeholder="Selecione o status" />
                      <SelectIcon>
                        <ChevronDownIcon />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicator />
                        <SelectItem label="Ativo" value="ativo" />
                        <SelectItem label="Inativo" value="inativo" />
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                )}
              />
              {form.formState.errors.status && (
                <FormControlError>
                  <FormControlErrorText className="text-sm">
                    {form.formState.errors.status.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </View>
        </SectionCard>

        {/* Banner Principal */}
        <SectionCard
          title="Banner Principal"
          icon={<ImageIcon size={22} color="#0891B2" />}
        >
          <View className="gap-4 flex flex-col py-4">
            <FormControl isInvalid={!!form.formState.errors.banner}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Banner Principal
                </Text>
              </FormControlLabel>
              <Text className="text-xs text-gray-500 mb-2">
                Esta imagem será exibida como capa do encarte
              </Text>
              <Controller
                control={form.control}
                name="banner"
                render={({ field: { onChange, value } }) => (
                  <ImageUpload
                    value={value || ""}
                    onChange={onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
              {form.formState.errors.banner && (
                <FormControlError>
                  <FormControlErrorText className="text-sm">
                    {form.formState.errors.banner.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </View>
        </SectionCard>

        {/* Imagens das Páginas */}
        <SectionCard
          title={`Páginas do Encarte (${countImages()}/8)`}
          icon={<FileText size={22} color="#0891B2" />}
        >
          <View className="gap-6 flex flex-col py-4">
            <Text className="text-sm text-gray-500">
              Recomendamos utilizar imagens no formato vertical (3:4) para
              melhor visualização
            </Text>

            {/* Página 1 */}
            <FormControl isInvalid={!!form.formState.errors.imagem_01}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Página 1
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="imagem_01"
                render={({ field: { onChange, value } }) => (
                  <ImageUpload
                    value={value || ""}
                    onChange={onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormControl>

            {/* Página 2 */}
            <FormControl isInvalid={!!form.formState.errors.imagem_02}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Página 2
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="imagem_02"
                render={({ field: { onChange, value } }) => (
                  <ImageUpload
                    value={value || ""}
                    onChange={onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormControl>

            {/* Página 3 */}
            <FormControl isInvalid={!!form.formState.errors.imagem_03}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Página 3
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="imagem_03"
                render={({ field: { onChange, value } }) => (
                  <ImageUpload
                    value={value || ""}
                    onChange={onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormControl>

            {/* Página 4 */}
            <FormControl isInvalid={!!form.formState.errors.imagem_04}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Página 4
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="imagem_04"
                render={({ field: { onChange, value } }) => (
                  <ImageUpload
                    value={value || ""}
                    onChange={onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormControl>

            {/* Página 5 */}
            <FormControl isInvalid={!!form.formState.errors.imagem_05}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Página 5
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="imagem_05"
                render={({ field: { onChange, value } }) => (
                  <ImageUpload
                    value={value || ""}
                    onChange={onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormControl>

            {/* Página 6 */}
            <FormControl isInvalid={!!form.formState.errors.imagem_06}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Página 6
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="imagem_06"
                render={({ field: { onChange, value } }) => (
                  <ImageUpload
                    value={value || ""}
                    onChange={onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormControl>

            {/* Página 7 */}
            <FormControl isInvalid={!!form.formState.errors.imagem_07}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Página 7
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="imagem_07"
                render={({ field: { onChange, value } }) => (
                  <ImageUpload
                    value={value || ""}
                    onChange={onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormControl>

            {/* Página 8 */}
            <FormControl isInvalid={!!form.formState.errors.imagem_08}>
              <FormControlLabel>
                <Text className="text-sm font-medium text-gray-700">
                  Página 8
                </Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="imagem_08"
                render={({ field: { onChange, value } }) => (
                  <ImageUpload
                    value={value || ""}
                    onChange={onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormControl>
          </View>
        </SectionCard>
      </ScrollView>

      {/* Botões de ação */}
      <View
        className="absolute bottom-0 left-0 right-0 w-full pb-6 pt-3 bg-white border-t border-gray-200 shadow-lg"
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
