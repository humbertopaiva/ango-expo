// src/features/profile/components/basic-info/basic-info-form.tsx
import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ImageUpload } from "@/components/common/image-upload";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";
import { ModalForm } from "@/components/custom/modal-form";
import { FormField } from "@/components/custom/form-field";
import { Textarea, TextareaInput } from "@gluestack-ui/themed";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";

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
    <ModalForm
      isOpen={open}
      onClose={onClose}
      onSubmit={form.handleSubmit(handleSubmit)}
      isLoading={isLoading}
      title="Editar Informações Básicas"
      subtitle="Atualize as informações básicas da sua empresa"
    >
      <View className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          label="Nome da Empresa"
          placeholder="Nome da empresa"
          error={form.formState.errors.nome}
        />

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
      </View>
    </ModalForm>
  );
}
