// Path: src/features/leaflets/components/leaflet-form.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import {
  Input,
  FormControl,
  VStack,
  Alert,
  AlertText,
  AlertIcon,
  useToast,
  Switch,
  HStack,
  Divider,
} from "@gluestack-ui/themed";
import { AlertCircle, FileText, Check, X } from "lucide-react-native";
import { leafletFormSchema, LeafletFormData } from "../schemas/leaflet.schema";
import { ImageUpload } from "@/components/common/image-upload";

import { DatePicker } from "@/components/common/date-picker";
import { useLeafletsContext } from "../contexts/use-leaflets-context";
import { THEME_COLORS } from "@/src/styles/colors";
import { toastUtils } from "@/src/utils/toast.utils";
import { Button, ButtonText } from "@/components/ui/button";
import { PdfUpload } from "./pdf-upload";
import {
  FormToastAlert,
  ToastType,
} from "@/components/custom/form-toast-alert";

interface LeafletFormScreenProps {
  leafletId?: string;
}

export function LeafletFormScreen({ leafletId }: LeafletFormScreenProps) {
  const params = useLocalSearchParams<{ id: string }>();
  const id = leafletId || params.id;
  const isEditing = !!id;
  const toast = useToast();

  const vm = useLeafletsContext();
  const {
    leaflets,
    handleCreateLeaflet,
    handleUpdateLeaflet,
    isCreating,
    isUpdating,
  } = vm;

  const leaflet = leaflets.find((l) => l.id === id);
  const isLoading = isCreating || isUpdating;
  const primaryColor = THEME_COLORS.primary;

  // Gerenciamento de abas
  const [activeTab, setActiveTab] = useState("info");
  // Estado local para rastrear o status atual
  const [statusValue, setStatusValue] = useState("ativo");
  // Estado para alternar entre upload de imagens individuais ou PDF
  const [uploadMode, setUploadMode] = useState<"images" | "pdf">("images");
  // Estados para o toast personalizado
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("error");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      pdf: null,
    },
    mode: "onSubmit",
  });

  // Função auxiliar para mostrar o toast personalizado
  const showCustomToast = (message: string, type: ToastType = "error") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  // Monitorar o valor do PDF para atualizar o modo de upload
  const pdfValue = form.watch("pdf");

  useEffect(() => {
    if (pdfValue) {
      setUploadMode("pdf");
    } else {
      // Verificar se há imagens
      const hasImages = [
        form.getValues("imagem_01"),
        form.getValues("imagem_02"),
        form.getValues("imagem_03"),
        form.getValues("imagem_04"),
        form.getValues("imagem_05"),
        form.getValues("imagem_06"),
        form.getValues("imagem_07"),
        form.getValues("imagem_08"),
      ].some(Boolean);

      if (!hasImages) {
        setUploadMode("images");
      }
    }
  }, [pdfValue]);

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
        pdf: leaflet.pdf,
      });
      setStatusValue(leaflet.status);

      // Definir modo de upload com base nos dados existentes
      if (leaflet.pdf) {
        setUploadMode("pdf");
      } else {
        setUploadMode("images");
      }
    }
  }, [leaflet, form.reset, isSubmitting]);

  // Efeito para sincronizar o estado local com o valor do formulário
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "status") {
        setStatusValue(value.status || "ativo");
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Handler para erros de validação
  const onError: SubmitErrorHandler<LeafletFormData> = (errors) => {
    console.log("Validation errors:", errors);

    // Mapear nomes amigáveis para os campos
    const fieldLabels: Record<string, string> = {
      nome: "Nome",
      validade: "Data de validade",
      status: "Status",
      banner: "Banner",
      imagem_01: "Adicione o conteúdo: Seja em PDF ou imagens",
      imagem_02: "Página 2",
      imagem_03: "Página 3",
      imagem_04: "Página 4",
      imagem_05: "Página 5",
      imagem_06: "Página 6",
      imagem_07: "Página 7",
      imagem_08: "Página 8",
      pdf: "Arquivo PDF",
      root: "Conteúdo",
    };

    // Construir mensagem de erro
    const errorFields = Object.keys(errors);

    if (errorFields.length > 0) {
      // Verificar se há erros de refinamento (errors.root)
      if (errors.root?.message) {
        // Mostrar erro de conteúdo (pelo menos uma imagem ou PDF necessário)
        showCustomToast(errors.root.message, "error");
        return;
      }

      // Para o toast, mostre uma mensagem mais curta
      let toastMsg = "Campos obrigatórios: ";

      // Limitar a quantidade de campos mostrados no toast
      if (errorFields.length <= 3) {
        toastMsg += errorFields
          .map((field) => fieldLabels[field] || field)
          .join(", ");
      } else {
        const firstFields = errorFields.slice(0, 2);
        toastMsg +=
          firstFields.map((field) => fieldLabels[field] || field).join(", ") +
          ` e mais ${errorFields.length - 2} campos`;
      }

      // Mostrar toast personalizado
      showCustomToast(toastMsg, "error");
    }
  };

  const onSubmit = async (data: LeafletFormData) => {
    try {
      setIsSubmitting(true);

      // Validação adicional para garantir que há pelo menos uma imagem ou PDF
      const hasImages = [
        data.imagem_01,
        data.imagem_02,
        data.imagem_03,
        data.imagem_04,
        data.imagem_05,
        data.imagem_06,
        data.imagem_07,
        data.imagem_08,
      ].some((image) => image && image.length > 0);

      const hasPdf = data.pdf && data.pdf.length > 0;

      if (!hasImages && !hasPdf) {
        showCustomToast(
          "O encarte deve ter pelo menos uma imagem ou um arquivo PDF",
          "error"
        );
        setIsSubmitting(false);
        return;
      }

      // Se está no modo PDF, limpar os campos de imagens
      if (uploadMode === "pdf" && data.pdf) {
        data.imagem_01 = null;
        data.imagem_02 = null;
        data.imagem_03 = null;
        data.imagem_04 = null;
        data.imagem_05 = null;
        data.imagem_06 = null;
        data.imagem_07 = null;
        data.imagem_08 = null;
      }

      // Se está no modo de imagens, limpar o campo de PDF
      if (uploadMode === "images") {
        data.pdf = null;
      }

      if (isEditing && id) {
        await handleUpdateLeaflet(id, data);
        showCustomToast("Encarte atualizado com sucesso!", "success");
        toastUtils.success(toast, "Encarte atualizado com sucesso!");
      } else {
        await handleCreateLeaflet(data);
        showCustomToast("Encarte criado com sucesso!", "success");
        toastUtils.success(toast, "Encarte criado com sucesso!");
      }

      // Aguarda um momento antes de voltar para evitar race conditions
      setTimeout(() => {
        router.back();
      }, 500);
    } catch (error) {
      console.error("Erro ao submeter formulário:", error);
      showCustomToast(
        `Erro ao ${isEditing ? "atualizar" : "criar"} encarte`,
        "error"
      );
      toastUtils.error(
        toast,
        `Erro ao ${isEditing ? "atualizar" : "criar"} encarte`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para alternar o modo de upload
  const toggleUploadMode = (mode: "images" | "pdf") => {
    if (mode === uploadMode) return;

    // Confirme com o usuário se houver dados que serão perdidos
    if (mode === "pdf" && countImages() > 0) {
      if (
        !confirm(
          "Ao mudar para o modo PDF, todas as imagens individuais serão removidas. Deseja continuar?"
        )
      ) {
        return;
      }
    }

    if (mode === "images" && pdfValue) {
      if (
        !confirm(
          "Ao mudar para o modo de imagens, o PDF será removido. Deseja continuar?"
        )
      ) {
        return;
      }
      form.setValue("pdf", null);
    }

    setUploadMode(mode);
  };

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
    <SafeAreaView className="flex-1 bg-background">
      {/* Toast personalizado */}
      <FormToastAlert
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
        message={toastMessage}
        type={toastType}
        duration={5000}
      />

      {/* Tabs Nav */}
      <View className="flex-row border-b border-gray-200 bg-white">
        <TouchableOpacity
          onPress={() => setActiveTab("info")}
          className={`flex-1 py-6 ${
            activeTab === "info" ? `border-b-2 border-primary-500` : ""
          }`}
        >
          <Text
            className={`text-center ${
              activeTab === "info"
                ? "text-primary-600 font-medium"
                : "text-gray-600"
            }`}
          >
            Informações
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("content")}
          className={`flex-1 py-6 ${
            activeTab === "content" ? `border-b-2 border-primary-500` : ""
          }`}
        >
          <Text
            className={`text-center ${
              activeTab === "content"
                ? "text-primary-600 font-medium"
                : "text-gray-600"
            }`}
          >
            Conteúdo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === "info" ? (
        <ScrollView className="flex-1 px-4 bg-white">
          <VStack space="lg" className="py-6">
            {/* Nome */}
            <FormControl isInvalid={!!form.formState.errors.nome}>
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700">
                  Nome do Encarte <Text className="text-red-500">*</Text>
                </Text>
              </FormControl.Label>
              <Controller
                control={form.control}
                name="nome"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <Input.Input
                      placeholder="Ex: Ofertas da Semana"
                      onChangeText={onChange}
                      value={value}
                      className="bg-white border border-gray-200"
                    />
                  </Input>
                )}
              />
              {form.formState.errors.nome && (
                <FormControl.Error>
                  <Text className="text-sm text-red-500">
                    {form.formState.errors.nome.message}
                  </Text>
                </FormControl.Error>
              )}
            </FormControl>

            {/* Validade */}
            <FormControl isInvalid={!!form.formState.errors.validade}>
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700">
                  Data de Validade <Text className="text-red-500">*</Text>
                </Text>
              </FormControl.Label>
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
                    disabled={isLoading}
                  />
                )}
              />
              {form.formState.errors.validade && (
                <FormControl.Error>
                  <Text className="text-sm text-red-500">
                    {form.formState.errors.validade.message}
                  </Text>
                </FormControl.Error>
              )}
            </FormControl>

            {/* Status como Switch/Toggle */}
            <FormControl
              isInvalid={!!form.formState.errors.status}
              className="mb-2"
            >
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Status do Encarte
                </Text>
              </FormControl.Label>

              <Controller
                control={form.control}
                name="status"
                render={({ field: { onChange, value } }) => (
                  <View className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <HStack justifyContent="space-between" alignItems="center">
                      <HStack space="sm" alignItems="center">
                        {statusValue === "ativo" ? (
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
                            statusValue === "ativo"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {statusValue === "ativo" ? "Ativo" : "Inativo"}
                        </Text>
                      </HStack>

                      <Switch
                        value={statusValue === "ativo"}
                        onValueChange={(newValue) => {
                          const newStatus = newValue ? "ativo" : "inativo";
                          setStatusValue(newStatus);
                          onChange(newStatus);
                        }}
                        disabled={isLoading}
                        trackColor={{ false: "#EF4444", true: "#10B981" }}
                        thumbColor={
                          statusValue === "ativo" ? "#ffffff" : "#ffffff"
                        }
                      />
                    </HStack>

                    <Text className="text-xs text-gray-500 mt-2">
                      {statusValue === "ativo"
                        ? "O encarte está visível para os clientes."
                        : "O encarte está oculto e não aparecerá para os clientes."}
                    </Text>
                  </View>
                )}
              />

              {form.formState.errors.status && (
                <FormControl.Error>
                  <Text className="text-sm text-red-500">
                    {form.formState.errors.status.message}
                  </Text>
                </FormControl.Error>
              )}
            </FormControl>

            {/* Banner Principal */}
            <FormControl isInvalid={!!form.formState.errors.banner}>
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700">
                  Banner Principal <Text className="text-red-500">*</Text>
                </Text>
              </FormControl.Label>
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
                    disabled={isLoading}
                  />
                )}
              />
              {form.formState.errors.banner && (
                <FormControl.Error>
                  <Text className="text-sm text-red-500">
                    {form.formState.errors.banner.message}
                  </Text>
                </FormControl.Error>
              )}
            </FormControl>
          </VStack>
        </ScrollView>
      ) : (
        <ScrollView className="flex-1 px-4 bg-white">
          <VStack space="lg" className="py-6">
            {/* Seletor de modo de upload */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Formato do Encarte
              </Text>
              <View className="flex-row border border-gray-200 rounded-lg">
                <TouchableOpacity
                  onPress={() => toggleUploadMode("images")}
                  className={`flex-1 py-3 px-4 rounded-l-lg ${
                    uploadMode === "images" ? "bg-primary-500" : "bg-gray-50"
                  }`}
                >
                  <Text
                    className={`text-center font-medium ${
                      uploadMode === "images" ? "text-white" : "text-gray-600"
                    }`}
                  >
                    Imagens Individuais
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => toggleUploadMode("pdf")}
                  className={`flex-1 py-3 px-4 rounded-r-lg ${
                    uploadMode === "pdf" ? "bg-primary-500" : "bg-gray-50"
                  }`}
                >
                  <Text
                    className={`text-center font-medium ${
                      uploadMode === "pdf" ? "text-white" : "text-gray-600"
                    }`}
                  >
                    Arquivo PDF
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-gray-500 mt-2">
                {uploadMode === "images"
                  ? "Carregue até 8 imagens individuais para seu encarte."
                  : "Carregue um único arquivo PDF contendo todas as páginas do encarte."}
              </Text>
            </View>

            {/* Alerta de validação para conteúdo obrigatório */}
            <Alert className="mb-4 bg-amber-50 border border-amber-200">
              <AlertIcon as={AlertCircle} color="#F59E0B" />
              <AlertText className="ml-3 text-amber-700">
                O encarte deve ter pelo menos uma imagem ou um arquivo PDF
              </AlertText>
            </Alert>

            {uploadMode === "images" ? (
              // Imagens individuais
              <>
                <Alert className="mb-4 bg-blue-50 border border-blue-200">
                  <AlertIcon as={AlertCircle} color="#3B82F6" />
                  <AlertText className="ml-3 text-blue-700">
                    Recomendamos utilizar imagens no formato vertical (3:4) para
                    melhor visualização
                  </AlertText>
                </Alert>

                {/* Imagens das páginas */}
                {Array.from({ length: 8 }).map((_, index) => (
                  <FormControl
                    key={`imagem_${String(index + 1).padStart(2, "0")}`}
                    isInvalid={
                      !!form.formState.errors[
                        `imagem_${String(index + 1).padStart(
                          2,
                          "0"
                        )}` as keyof LeafletFormData
                      ]
                    }
                    className="mb-6"
                  >
                    <FormControl.Label>
                      <Text className="text-sm font-medium text-gray-700">
                        Página {index + 1}
                      </Text>
                    </FormControl.Label>
                    <Controller
                      control={form.control}
                      name={
                        `imagem_${String(index + 1).padStart(
                          2,
                          "0"
                        )}` as keyof LeafletFormData
                      }
                      render={({ field: { onChange, value } }) => (
                        <ImageUpload
                          value={value || ""}
                          onChange={onChange}
                          disabled={isLoading}
                        />
                      )}
                    />
                    {form.formState.errors[
                      `imagem_${String(index + 1).padStart(
                        2,
                        "0"
                      )}` as keyof LeafletFormData
                    ] && (
                      <FormControl.Error>
                        <Text className="text-sm text-red-500">
                          {
                            form.formState.errors[
                              `imagem_${String(index + 1).padStart(
                                2,
                                "0"
                              )}` as keyof LeafletFormData
                            ]?.message
                          }
                        </Text>
                      </FormControl.Error>
                    )}
                  </FormControl>
                ))}
              </>
            ) : (
              // Upload de PDF
              <>
                <Alert className="mb-4 bg-blue-50 border border-blue-200">
                  <AlertIcon as={AlertCircle} color="#3B82F6" />
                  <AlertText className="ml-3 text-blue-700">
                    O PDF deve estar no formato ideal para visualização em
                    dispositivos móveis. Recomendamos um tamanho máximo de 10MB.
                  </AlertText>
                </Alert>

                <FormControl
                  isInvalid={!!form.formState.errors.pdf}
                  className="mb-6"
                >
                  <FormControl.Label>
                    <Text className="text-sm font-medium text-gray-700">
                      Arquivo PDF do Encarte
                    </Text>
                  </FormControl.Label>
                  <Controller
                    control={form.control}
                    name="pdf"
                    render={({ field: { onChange, value } }) => (
                      <PdfUpload
                        value={value || ""}
                        onChange={(newValue) => {
                          console.log("PDF URL sendo salva:", newValue);
                          onChange(newValue);
                        }}
                        disabled={isLoading}
                      />
                    )}
                  />
                  {form.formState.errors.pdf && (
                    <FormControl.Error>
                      <Text className="text-sm text-red-500">
                        {form.formState.errors.pdf.message}
                      </Text>
                    </FormControl.Error>
                  )}
                </FormControl>
              </>
            )}
          </VStack>
        </ScrollView>
      )}

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
            onPress={() => router.back()}
            disabled={isLoading}
            className="flex-1 border-gray-300 h-14"
            style={{ borderColor: primaryColor }}
          >
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button
            onPress={form.handleSubmit(onSubmit, onError)}
            disabled={isLoading}
            className="flex-1 bg-primary-500 h-14"
            style={{ backgroundColor: primaryColor }}
          >
            <ButtonText>
              {isLoading ? "Salvando..." : "Salvar Encarte"}
            </ButtonText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
