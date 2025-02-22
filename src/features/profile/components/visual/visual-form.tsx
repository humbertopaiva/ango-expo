import React from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  Modal as RNModal,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpload } from "@/components/common/image-upload";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import ColorInput from "@/components/common/color-input";

const formSchema = z.object({
  cor_primaria: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida"),
  cor_secundaria: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida"),
  imagem_01: z.string().nullable(),
  imagem_02: z.string().nullable(),
  imagem_03: z.string().nullable(),
  imagem_04: z.string().nullable(),
  imagem_05: z.string().nullable(),
  imagem_06: z.string().nullable(),
});

type VisualFormData = z.infer<typeof formSchema>;

interface VisualFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateProfileDTO) => void;
  isLoading: boolean;
  profile: Profile;
}

export function VisualForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  profile,
}: VisualFormProps) {
  const form = useForm<VisualFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cor_primaria: profile.cor_primaria || "#000000",
      cor_secundaria: profile.cor_secundaria || "#000000",
      imagem_01: profile.imagem_01 || null,
      imagem_02: profile.imagem_02 || null,
      imagem_03: profile.imagem_03 || null,
      imagem_04: profile.imagem_04 || null,
      imagem_05: profile.imagem_05 || null,
      imagem_06: profile.imagem_06 || null,
    },
  });

  const handleSubmit = (data: VisualFormData): void => {
    const updateData: UpdateProfileDTO = {
      cor_primaria: data.cor_primaria,
      cor_secundaria: data.cor_secundaria,
      imagem_01: data.imagem_01 || undefined,
      imagem_02: data.imagem_02 || undefined,
      imagem_03: data.imagem_03 || undefined,
      imagem_04: data.imagem_04 || undefined,
      imagem_05: data.imagem_05 || undefined,
      imagem_06: data.imagem_06 || undefined,
    };
    onSubmit(updateData);
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent className="bg-white">
        <ModalHeader>
          <Heading size="lg">Editar Identidade Visual</Heading>
        </ModalHeader>

        <ScrollView className="p-4">
          <View className="space-y-6">
            <View className="space-y-6">
              <FormControl isInvalid={!!form.formState.errors.cor_primaria}>
                <FormControlLabel>
                  <FormControlLabelText>Cor Primária</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={form.control}
                  name="cor_primaria"
                  render={({ field: { onChange, value } }) => (
                    <ColorInput value={value} onChange={onChange} />
                  )}
                />
                {form.formState.errors.cor_primaria && (
                  <FormControlError>
                    <FormControlErrorText>
                      {form.formState.errors.cor_primaria.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </View>

            <View className="space-y-4">
              <Text className="text-lg font-medium">Galeria de Imagens</Text>
              <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <FormControl
                    key={num}
                    isInvalid={
                      !!form.formState.errors[
                        `imagem_0${num}` as keyof VisualFormData
                      ]
                    }
                  >
                    <FormControlLabel>
                      <FormControlLabelText>Imagem {num}</FormControlLabelText>
                    </FormControlLabel>
                    <Controller
                      control={form.control}
                      name={`imagem_0${num}` as keyof VisualFormData}
                      render={({ field: { onChange, value } }) => (
                        <ImageUpload
                          value={value || ""}
                          onChange={onChange}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </FormControl>
                ))}
              </View>
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
