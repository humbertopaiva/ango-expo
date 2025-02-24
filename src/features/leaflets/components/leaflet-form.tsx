// src/features/leaflets/components/leaflet-form.tsx

import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import {
  Input,
  FormControl,
  Button,
  VStack,
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
  Alert,
  AlertText,
  AlertIcon,
} from "@gluestack-ui/themed";
import { ArrowLeft, AlertCircle, FileText } from "lucide-react-native";
import { leafletFormSchema, LeafletFormData } from "../schemas/leaflet.schema";
import { Leaflet } from "../models/leaflet";
import { ImageUpload } from "@/components/common/image-upload";
import { DatePicker } from "@/components/common/date-picker";
import { useLeafletsContext } from "../contexts/use-leaflets-context";

interface LeafletFormScreenProps {
  leafletId?: string;
}

export function LeafletFormScreen({ leafletId }: LeafletFormScreenProps) {
  const params = useLocalSearchParams<{ id: string }>();
  const id = leafletId || params.id;
  const isEditing = !!id;

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

  // Gerenciamento de abas simples
  const [activeTab, setActiveTab] = useState("info");

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
    }
  }, [leaflet, reset]);

  const onSubmit = async (data: LeafletFormData) => {
    try {
      console.log("Formulário submetido:", data);

      if (isEditing && id) {
        console.log("Atualizando encarte existente");
        await handleUpdateLeaflet(id, data);
      } else {
        console.log("Criando novo encarte");
        await handleCreateLeaflet(data);
      }
      console.log("Operação concluída, voltando...");
      router.back();
    } catch (error) {
      console.error("Erro ao submeter formulário:", error);
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
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <View className="flex-row items-center ml-2">
            <FileText size={22} color="#000" className="mr-2" />
            <Text className="text-xl font-semibold">
              {isEditing ? "Editar Encarte" : "Novo Encarte"}
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs Nav */}
      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          onPress={() => setActiveTab("info")}
          className={`flex-1 py-3 ${
            activeTab === "info" ? "border-b-2 border-primary-500" : ""
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
          className={`flex-1 py-3 ${
            activeTab === "images" ? "border-b-2 border-primary-500" : ""
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
        <ScrollView className="flex-1 px-4">
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

            {/* Status */}
            <FormControl isInvalid={!!errors.status}>
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700">
                  Status
                </Text>
              </FormControl.Label>
              <Controller
                control={control}
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
                        <SelectItem label="Ativo" value="ativo" />
                        <SelectItem label="Inativo" value="inativo" />
                      </SelectContent>
                    </SelectPortal>
                  </Select>
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
        <ScrollView className="flex-1 px-4">
          <VStack space="lg" className="py-6">
            <Alert className="mb-4">
              <AlertIcon as={AlertCircle} />
              <AlertText>
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
      <View className="px-4 py-4 border-t border-gray-200">
        <View className="flex-row space-x-4 justify-end">
          <Button
            variant="outline"
            onPress={() => router.back()}
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
        </View>
      </View>
    </SafeAreaView>
  );
}
