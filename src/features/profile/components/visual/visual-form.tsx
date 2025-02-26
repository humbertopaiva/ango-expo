// Path: src/features/profile/components/visual/visual-form.tsx
import React, { useEffect } from "react";
import { View, ScrollView, Platform } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpload } from "@/components/common/image-upload";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";
import { Palette, Image as ImageIcon } from "lucide-react-native";
import { SectionCard } from "@/components/custom/section-card";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";

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
import ColorInput from "@/components/common/color-input";

const formSchema = z.object({
  cor_primaria: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida"),
  cor_secundaria: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida")
    .nullable()
    .optional(),
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

  useEffect(() => {
    if (profile && open) {
      form.reset({
        cor_primaria: profile.cor_primaria || "#000000",
        cor_secundaria: profile.cor_secundaria || "#000000",
        imagem_01: profile.imagem_01 || null,
        imagem_02: profile.imagem_02 || null,
        imagem_03: profile.imagem_03 || null,
        imagem_04: profile.imagem_04 || null,
        imagem_05: profile.imagem_05 || null,
        imagem_06: profile.imagem_06 || null,
      });
    }
  }, [profile, form.reset, open]);

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
          marginTop: 40,
          marginBottom: 40,
          maxHeight: "90%",
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
            Editar Identidade Visual
          </Heading>
          <Text className="text-sm text-gray-500 mt-1">
            Configure as cores e imagens que representam sua marca
          </Text>
        </ModalHeader>

        <ModalBody>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 24,
              gap: 16,
            }}
          >
            {/* Cores da Marca */}
            <SectionCard
              title="Cores da Marca"
              icon={<Palette size={22} color="#0891B2" />}
            >
              <View className="gap-4 flex flex-col py-4">
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
            </SectionCard>

            {/* Galeria de Imagens */}
            <SectionCard
              title="Galeria de Imagens"
              icon={<ImageIcon size={22} color="#0891B2" />}
            >
              <View className="gap-4 flex flex-col py-4">
                <Text className="text-sm text-gray-600">
                  Estas imagens serão exibidas na sua página. Recomendamos
                  imagens de boa qualidade que mostrem seus produtos ou o
                  ambiente do seu estabelecimento.
                </Text>

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
                    {form.formState.errors[
                      `imagem_0${num}` as keyof VisualFormData
                    ] && (
                      <FormControlError>
                        <FormControlErrorText>
                          {
                            form.formState.errors[
                              `imagem_0${num}` as keyof VisualFormData
                            ]?.message
                          }
                        </FormControlErrorText>
                      </FormControlError>
                    )}
                  </FormControl>
                ))}
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
