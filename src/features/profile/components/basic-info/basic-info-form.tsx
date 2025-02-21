import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  Input,
  Textarea,
  TextareaInput,
} from "@gluestack-ui/themed";
import { ImageUpload } from "@/components/common/image-upload";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { InputField } from "@/components/ui/input";
import { ButtonText } from "@/components/ui/button";

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
              <FormControl.Label>Nome da Empresa</FormControl.Label>
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
                <FormControl.Error>
                  <FormControl.Error.Text>
                    {form.formState.errors.nome.message}
                  </FormControl.Error.Text>
                </FormControl.Error>
              )}
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.descricao}>
              <FormControl.Label>Descrição</FormControl.Label>
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
                <FormControl.Error>
                  <FormControl.Error.Text>
                    {form.formState.errors.descricao.message}
                  </FormControl.Error.Text>
                </FormControl.Error>
              )}
            </FormControl>

            <View className="space-y-6">
              <FormControl isInvalid={!!form.formState.errors.logo}>
                <FormControl.Label>Logo</FormControl.Label>
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
                  <FormControl.Error>
                    <FormControl.Error.Text>
                      {form.formState.errors.logo.message}
                    </FormControl.Error.Text>
                  </FormControl.Error>
                )}
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.banner}>
                <FormControl.Label>Banner</FormControl.Label>
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
                  <FormControl.Error>
                    <FormControl.Error.Text>
                      {form.formState.errors.banner.message}
                    </FormControl.Error.Text>
                  </FormControl.Error>
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
