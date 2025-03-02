// src/features/leaflets/components/leaflet-form.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
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
} from "@gluestack-ui/themed";
import { AlertCircle, FileText, Check, X } from "lucide-react-native";
import { leafletFormSchema, LeafletFormData } from "../schemas/leaflet.schema";
import { ImageUpload } from "@/components/common/image-upload";
import { DatePicker } from "@/components/common/date-picker";
import { useLeafletsContext } from "../contexts/use-leaflets-context";
import { THEME_COLORS } from "@/src/styles/colors";
import { toastUtils } from "@/src/utils/toast.utils";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

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

  // Gerenciamento de abas simples
  const [activeTab, setActiveTab] = useState("info");
  // Estado local para rastrear o status atual
  const [statusValue, setStatusValue] = useState("ativo");

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = form;

  useEffect(() => {
    if (leaflet) {
      reset({
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
      setStatusValue(leaflet.status); // Atualiza o estado local
    }
  }, [leaflet, reset]);

  // Efeito para sincronizar o estado local com o valor do formulário
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "status") {
        setStatusValue(value.status || "ativo");
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = async (data: LeafletFormData) => {
    try {
      if (isEditing && id) {
        await handleUpdateLeaflet(id, data);
        toastUtils.success(toast, "Encarte atualizado com sucesso!");
      } else {
        await handleCreateLeaflet(data);
        toastUtils.success(toast, "Encarte criado com sucesso!");
      }
      router.back();
    } catch (error) {
      console.error("Erro ao submeter formulário:", error);
      toastUtils.error(
        toast,
        `Erro ao ${isEditing ? "atualizar" : "criar"} encarte`
      );
    }
  };

  const countImages = () => {
    const values = getValues();
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
          onPress={() => setActiveTab("images")}
          className={`flex-1 py-6 ${
            activeTab === "images" ? `border-b-2 border-primary-500` : ""
          }`}
        >
          <Text
            className={`text-center ${
              activeTab === "images"
                ? "text-primary-600 font-medium"
                : "text-gray-600"
            }`}
          >
            Imagens ({countImages()}/8)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === "info" ? (
        <ScrollView className="flex-1 px-4 bg-white">
          <VStack space="lg" className="py-6">
            {/* Nome */}
            <FormControl isInvalid={!!errors.nome}>
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700">
                  Nome do Encarte
                </Text>
              </FormControl.Label>
              <Controller
                control={control}
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
              {errors.nome && (
                <FormControl.Error>
                  <Text className="text-sm text-red-500">
                    {errors.nome.message}
                  </Text>
                </FormControl.Error>
              )}
            </FormControl>

            {/* Validade */}
            <FormControl isInvalid={!!errors.validade}>
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700">
                  Data de Validade
                </Text>
              </FormControl.Label>
              <Controller
                control={control}
                name="validade"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    value={value}
                    onChange={onChange}
                    placeholder="Selecione a data de validade"
                    isInvalid={!!errors.validade}
                    errorMessage={errors.validade?.message}
                    disabled={isLoading}
                  />
                )}
              />
              {errors.validade && (
                <FormControl.Error>
                  <Text className="text-sm text-red-500">
                    {errors.validade.message}
                  </Text>
                </FormControl.Error>
              )}
            </FormControl>

            {/* Status como Switch/Toggle */}
            <FormControl isInvalid={!!errors.status} className="mb-2">
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Status do Encarte
                </Text>
              </FormControl.Label>

              <Controller
                control={control}
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

              {errors.status && (
                <FormControl.Error>
                  <Text className="text-sm text-red-500">
                    {errors.status.message}
                  </Text>
                </FormControl.Error>
              )}
            </FormControl>

            {/* Banner Principal */}
            <FormControl isInvalid={!!errors.banner}>
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700">
                  Banner Principal
                </Text>
              </FormControl.Label>
              <Text className="text-xs text-gray-500 mb-2">
                Esta imagem será exibida como capa do encarte
              </Text>
              <Controller
                control={control}
                name="banner"
                render={({ field: { onChange, value } }) => (
                  <ImageUpload
                    value={value || ""}
                    onChange={onChange}
                    disabled={isLoading}
                  />
                )}
              />
              {errors.banner && (
                <FormControl.Error>
                  <Text className="text-sm text-red-500">
                    {errors.banner.message}
                  </Text>
                </FormControl.Error>
              )}
            </FormControl>
          </VStack>
        </ScrollView>
      ) : (
        <ScrollView className="flex-1 px-4 bg-white">
          <VStack space="lg" className="py-6">
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
                  !!errors[
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
                  control={control}
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
                {errors[
                  `imagem_${String(index + 1).padStart(
                    2,
                    "0"
                  )}` as keyof LeafletFormData
                ] && (
                  <FormControl.Error>
                    <Text className="text-sm text-red-500">
                      {
                        errors[
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
            onPress={handleSubmit(onSubmit)}
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
