import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ImageUpload } from "@/components/common/image-upload";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Textarea, TextareaInput } from "@gluestack-ui/themed";

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
      status: "ativo",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        nome: profile.nome || "",
        descricao: profile.descricao || "",
        logo: profile.logo || null,
        banner: profile.banner || null,
        status: profile.status as "ativo" | "inativo",
      });
    }
  }, [profile, form.reset]);

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
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent className="bg-white">
        <ModalHeader>
          <Heading size="lg">Editar Informações Básicas</Heading>
          <Text className="text-sm text-gray-500">
            Atualize as informações básicas da sua empresa
          </Text>
        </ModalHeader>

        <ScrollView className="p-4">
          <View className="space-y-4">
            <FormControl isInvalid={!!form.formState.errors.nome}>
              <FormControlLabel>
                <FormControlLabelText>Nome da Empresa</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="nome"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Nome da empresa"
                      onChangeText={onChange}
                      value={value}
                    />
                  </Input>
                )}
              />
              {form.formState.errors.nome && (
                <FormControlError>
                  <FormControlErrorText>
                    {form.formState.errors.nome.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.descricao}>
              <FormControlLabel>
                <FormControlLabelText>Descrição</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="descricao"
                render={({ field: { onChange, value } }) => (
                  <Textarea>
                    <TextareaInput
                      placeholder="Descreva sua empresa"
                      onChangeText={onChange}
                      value={value}
                      numberOfLines={3}
                    />
                  </Textarea>
                )}
              />
              {form.formState.errors.descricao && (
                <FormControlError>
                  <FormControlErrorText>
                    {form.formState.errors.descricao.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <View className="space-y-6">
              <FormControl isInvalid={!!form.formState.errors.logo}>
                <FormControlLabel>
                  <FormControlLabelText>Logo</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={form.control}
                  name="logo"
                  render={({ field: { onChange, value } }) => (
                    <View className="min-h-[200px]">
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
                    <FormControlErrorText>
                      {form.formState.errors.logo.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.banner}>
                <FormControlLabel>
                  <FormControlLabelText>Banner</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={form.control}
                  name="banner"
                  render={({ field: { onChange, value } }) => (
                    <View className="min-h-[200px]">
                      <ImageUpload
                        value={value || ""}
                        onChange={onChange}
                        disabled={isLoading}
                      />
                    </View>
                  )}
                />
                {form.formState.errors.banner && (
                  <FormControlError>
                    <FormControlErrorText>
                      {form.formState.errors.banner.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </View>

            <View className="flex-row justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onPress={onClose}
                disabled={isLoading}
                className="flex-1"
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
            </View>
          </View>
        </ScrollView>
      </ModalContent>
    </Modal>
  );
}
