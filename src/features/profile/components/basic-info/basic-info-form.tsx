import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  Button,
  FormControl,
  Input,
  TextArea,
} from "@gluestack-ui/themed";
import { ImageUpload } from "@/components/common/image-upload";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";

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
    <Dialog isOpen={open} onClose={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <Text className="text-xl font-semibold">
            Editar Informações Básicas
          </Text>
          <Text className="text-sm text-gray-500">
            Atualize as informações básicas da sua empresa
          </Text>
        </DialogHeader>

        <ScrollView className="max-h-[80vh]">
          <View className="space-y-4 p-4">
            <FormControl isInvalid={!!form.formState.errors.nome}>
              <FormControl.Label>Nome da Empresa</FormControl.Label>
              <Controller
                control={form.control}
                name="nome"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <Input.Input
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
                  <TextArea>
                    <TextArea.Input
                      placeholder="Descreva sua empresa"
                      onChangeText={onChange}
                      value={value}
                    />
                  </TextArea>
                )}
              />
            </FormControl>

            <View className="space-y-6">
              <FormControl isInvalid={!!form.formState.errors.logo}>
                <FormControl.Label>Logo</FormControl.Label>
                <Controller
                  control={form.control}
                  name="logo"
                  render={({ field: { onChange, value } }) => (
                    <ImageUpload
                      value={value || ""}
                      onChange={onChange}
                      disabled={isLoading}
                    />
                  )}
                />
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.banner}>
                <FormControl.Label>Banner</FormControl.Label>
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
              </FormControl>
            </View>

            <View className="flex-row justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onPress={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                <Button.Text>Cancelar</Button.Text>
              </Button>
              <Button
                onPress={form.handleSubmit(handleSubmit)}
                disabled={isLoading}
                className="flex-1"
              >
                <Button.Text>
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button.Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </DialogContent>
    </Dialog>
  );
}
