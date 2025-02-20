import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormControl, Input } from "@gluestack-ui/themed";
import { ImageUpload } from "@/components/common/image-upload";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";

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

  const validateHexColor = (value: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
  };

  const handleColorChange = (
    onChange: (value: string) => void,
    value: string
  ) => {
    // Remove espaços e caracteres inválidos
    let formattedValue = value.replace(/[^A-Fa-f0-9#]/g, "");

    // Adiciona # se não existir
    if (!formattedValue.startsWith("#")) {
      formattedValue = "#" + formattedValue;
    }

    // Limita o tamanho do HEX
    if (formattedValue.length > 7) {
      formattedValue = formattedValue.slice(0, 7);
    }

    onChange(formattedValue);
  };

  const handleSubmit = (data: VisualFormData) => {
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
            <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormControl isInvalid={!!form.formState.errors.cor_primaria}>
                <FormControl.Label>Cor Primária</FormControl.Label>
                <Controller
                  control={form.control}
                  name="cor_primaria"
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-row items-center space-x-2">
                      <View className="flex-1">
                        <Input>
                          <Input.Input
                            placeholder="#000000"
                            value={value}
                            onChangeText={(text) =>
                              handleColorChange(onChange, text)
                            }
                            maxLength={7}
                          />
                        </Input>
                      </View>
                      <View
                        className="w-10 h-10 rounded border"
                        style={{
                          backgroundColor: validateHexColor(value)
                            ? value
                            : "#000000",
                        }}
                      />
                    </View>
                  )}
                />
                {form.formState.errors.cor_primaria && (
                  <FormControl.Error>
                    <FormControl.Error.Text>
                      {form.formState.errors.cor_primaria.message}
                    </FormControl.Error.Text>
                  </FormControl.Error>
                )}
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.cor_secundaria}>
                <FormControl.Label>Cor Secundária</FormControl.Label>
                <Controller
                  control={form.control}
                  name="cor_secundaria"
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-row items-center space-x-2">
                      <View className="flex-1">
                        <Input>
                          <Input.Input
                            placeholder="#000000"
                            value={value}
                            onChangeText={(text) =>
                              handleColorChange(onChange, text)
                            }
                            maxLength={7}
                          />
                        </Input>
                      </View>
                      <View
                        className="w-10 h-10 rounded border"
                        style={{
                          backgroundColor: validateHexColor(value)
                            ? value
                            : "#000000",
                        }}
                      />
                    </View>
                  )}
                />
                {form.formState.errors.cor_secundaria && (
                  <FormControl.Error>
                    <FormControl.Error.Text>
                      {form.formState.errors.cor_secundaria.message}
                    </FormControl.Error.Text>
                  </FormControl.Error>
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
                    <FormControl.Label>Imagem {num}</FormControl.Label>
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
      </ModalContent>
    </Modal>
  );
}
