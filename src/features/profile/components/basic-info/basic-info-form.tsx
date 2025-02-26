// src/features/profile/components/basic-info/basic-info-form.tsx
import React, { useEffect } from "react";
import { View, ScrollView, Platform } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, FileText, Info } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ImageUpload } from "@/components/common/image-upload";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";
import { SectionCard } from "@/components/custom/section-card";
import { FormField } from "@/components/custom/form-field";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Textarea, TextareaInput } from "@gluestack-ui/themed";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Icon, CloseIcon } from "@/components/ui/icon";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  logo: z.string().nullable().optional(),
  banner: z.string().nullable().optional(),
  status: z.enum(["ativo", "ativa", "inativo", "inativa"]).default("ativa"),
});

type BasicInfoFormData = z.infer<typeof formSchema>;

interface BasicInfoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateProfileDTO) => void;
  isLoading: boolean;
  profile: Profile;
}

export function BasicInfoForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  profile,
}: BasicInfoFormProps) {
  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: profile.nome || "",
      descricao: profile.descricao || "",
      logo: profile.logo || null,
      banner: profile.banner || null,
      status: profile.status as "ativo" | "inativo",
    },
  });

  useEffect(() => {
    if (profile && open) {
      form.reset({
        nome: profile.nome || "",
        descricao: profile.descricao || "",
        logo: profile.logo || null,
        banner: profile.banner || null,
        status: profile.status as "ativo" | "inativo",
      });
    }
  }, [profile, form.reset, open]);

  const handleSubmit = (data: BasicInfoFormData) => {
    const updateData: UpdateProfileDTO = {
      nome: data.nome,
      descricao: data.descricao,
      logo: data.logo || undefined,
      banner: data.banner || undefined,
    };
    onSubmit(updateData);
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="lg"
      useRNModal={Platform.OS !== "web"}
    >
      <ModalBackdrop />
      <ModalContent
        className="max-w-4xl rounded-xl"
        style={{
          marginHorizontal: 16,
          marginVertical: 24,
          marginTop: 40, // Adicional superior para evitar corte
          marginBottom: 40, // Adicional inferior para evitar corte
          maxHeight: "90%", // Limitar a altura máxima a 90% da tela
        }}
      >
        <ModalHeader className="border-b border-gray-200 px-4 py-4 flex flex-col">
          <View className="w-full flex">
            <ModalCloseButton className="justify-end items-end">
              <Icon
                as={CloseIcon}
                size="lg"
                className="stroke-primary-500 group-[:hover]/modal-close-button:stroke-background-700"
              />
            </ModalCloseButton>
          </View>
          <Heading size="md" className="text-typography-950">
            Editar Informações Básicas
          </Heading>
          <Text size="sm" className="text-typography-500 mt-1">
            Atualize as informações básicas da sua empresa
          </Text>
        </ModalHeader>

        <ModalBody className="">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 24,
              gap: 24,
            }}
          >
            {/* Seção de informações gerais */}
            <SectionCard
              title="Informações Gerais"
              icon={<Building2 size={22} color="#0891B2" />}
            >
              <View className="gap-4 flex flex-col">
                <FormField
                  control={form.control}
                  name="nome"
                  label="Nome da Empresa"
                  placeholder="Nome da sua empresa ou estabelecimento"
                  error={form.formState.errors.nome}
                />

                <FormControl isInvalid={!!form.formState.errors.descricao}>
                  <FormControlLabel>
                    <FormControlLabelText className="text-sm font-medium text-gray-700">
                      Descrição
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={form.control}
                    name="descricao"
                    render={({ field: { onChange, value } }) => (
                      <Textarea h={200}>
                        {/* Definindo altura fixa para o componente */}
                        <TextareaInput
                          placeholder="Descreva o que sua empresa faz, produtos, serviços e diferenciais"
                          onChangeText={onChange}
                          value={value}
                          multiline={true}
                          textAlignVertical="top"
                          style={{
                            height: 200, // Altura fixa em pixels
                            minHeight: 200, // Altura mínima garantida
                          }}
                          className="bg-white border border-gray-200 rounded-md p-4 text-base"
                        />
                      </Textarea>
                    )}
                  />
                  {form.formState.errors.descricao && (
                    <FormControlError>
                      <FormControlErrorText className="text-red-500 text-xs mt-1">
                        {form.formState.errors.descricao.message}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                <View className="flex-row items-start mt-2 gap-2">
                  <Info size={16} color="#0891B2" className="mr-2 mt-0.5" />
                  <Text className="text-gray-600 text-sm flex-1">
                    Uma boa descrição ajuda seus clientes a entenderem melhor o
                    seu negócio. Seja claro, direto e destaque seus
                    diferenciais.
                  </Text>
                </View>
              </View>
            </SectionCard>

            {/* Seção de imagens */}
            <SectionCard
              title="Imagens da Marca"
              icon={<FileText size={22} color="#0891B2" />}
            >
              <View className="gap-6">
                {/* Logo */}
                <View>
                  <FormControl isInvalid={!!form.formState.errors.logo}>
                    <FormControlLabel>
                      <FormControlLabelText className="text-sm font-medium text-gray-700">
                        Logo
                      </FormControlLabelText>
                    </FormControlLabel>

                    <Controller
                      control={form.control}
                      name="logo"
                      render={({ field: { onChange, value } }) => (
                        <View className="mt-2">
                          <ImageUpload
                            value={value || ""}
                            onChange={onChange}
                            disabled={isLoading}
                          />
                        </View>
                      )}
                    />

                    {form.formState.errors.logo && (
                      <FormControlError>
                        <FormControlErrorText className="text-red-500 text-xs mt-1">
                          {form.formState.errors.logo.message}
                        </FormControlErrorText>
                      </FormControlError>
                    )}
                  </FormControl>

                  <View className="flex-row items-start mt-2 gap-2">
                    <Info size={16} color="#0891B2" className="mr-2 mt-0.5" />
                    <Text className="text-gray-600 text-sm flex-1">
                      A logo deve ter fundo transparente e boa resolução.
                      Tamanho
                    </Text>
                  </View>
                </View>

                {/* Banner */}
                <View>
                  <FormControl isInvalid={!!form.formState.errors.banner}>
                    <FormControlLabel>
                      <FormControlLabelText className="text-sm font-medium text-gray-700">
                        Banner
                      </FormControlLabelText>
                    </FormControlLabel>

                    <Controller
                      control={form.control}
                      name="banner"
                      render={({ field: { onChange, value } }) => (
                        <View className="mt-2">
                          <View className="w-full aspect-[5/2] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                            <ImageUpload
                              value={value || ""}
                              onChange={onChange}
                              disabled={isLoading}
                            />
                          </View>
                        </View>
                      )}
                    />

                    {form.formState.errors.banner && (
                      <FormControlError>
                        <FormControlErrorText className="text-red-500 text-xs mt-1">
                          {form.formState.errors.banner.message}
                        </FormControlErrorText>
                      </FormControlError>
                    )}
                  </FormControl>

                  <View className="flex-row items-start mt-2">
                    <Info size={16} color="#0891B2" className="mr-2 mt-0.5" />
                    <Text className="text-gray-600 text-sm flex-1">
                      O banner deve ter proporção 4:1 para melhor visualização.
                      Tamanho recomendado: 1200x300 pixels.
                    </Text>
                  </View>
                </View>
              </View>
            </SectionCard>
          </ScrollView>
        </ModalBody>

        <ModalFooter className="border-t border-gray-200 p-4">
          <Button
            variant="outline"
            action="primary"
            onPress={onClose}
            disabled={isLoading}
            className="flex-1 mr-3"
          >
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button
            onPress={form.handleSubmit(handleSubmit)}
            disabled={isLoading}
            className="flex-1"
          >
            <ButtonText>{isLoading ? "Salvando..." : "Salvar"}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
