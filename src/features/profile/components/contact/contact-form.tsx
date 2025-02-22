import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";

const formSchema = z.object({
  endereco: z.string().min(1, "Endereço é obrigatório"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  whatsapp: z.string().optional(),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
});

type ContactFormData = z.infer<typeof formSchema>;

interface ContactFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateProfileDTO) => void;
  isLoading: boolean;
  profile: Profile;
}

export function ContactForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  profile,
}: ContactFormProps) {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endereco: profile.endereco,
      telefone: profile.telefone,
      whatsapp: profile.whatsapp,
      email: profile.email,
    },
  });

  const handleSubmit = (data: ContactFormData) => {
    const updateData: UpdateProfileDTO = {
      endereco: data.endereco,
      telefone: data.telefone,
      whatsapp: data.whatsapp,
      email: data.email,
    };
    onSubmit(updateData);
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent className="bg-white">
        <ModalHeader>
          <Heading size="lg">Editar Informações de Contato</Heading>
          <Text className="text-sm text-gray-500">
            Atualize as informações de contato da sua empresa
          </Text>
        </ModalHeader>

        <ScrollView className="p-4">
          <View className="space-y-4">
            <FormControl isInvalid={!!form.formState.errors.endereco}>
              <FormControlLabel>
                <FormControlLabelText>Endereço</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="endereco"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Endereço completo"
                      onChangeText={onChange}
                      value={value}
                    />
                  </Input>
                )}
              />
              {form.formState.errors.endereco && (
                <FormControlError>
                  <FormControlErrorText>
                    {form.formState.errors.endereco.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <View className="grid grid-cols-2 gap-4">
              <FormControl isInvalid={!!form.formState.errors.telefone}>
                <FormControlLabel>
                  <FormControlLabelText>Telefone</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={form.control}
                  name="telefone"
                  render={({ field: { onChange, value } }) => (
                    <Input>
                      <InputField
                        placeholder="(00) 0000-0000"
                        onChangeText={onChange}
                        value={value}
                      />
                    </Input>
                  )}
                />
                {form.formState.errors.telefone && (
                  <FormControlError>
                    <FormControlErrorText>
                      {form.formState.errors.telefone.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.whatsapp}>
                <FormControlLabel>
                  <FormControlLabelText>WhatsApp</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={form.control}
                  name="whatsapp"
                  render={({ field: { onChange, value } }) => (
                    <Input>
                      <InputField
                        placeholder="(00) 00000-0000"
                        onChangeText={onChange}
                        value={value}
                      />
                    </Input>
                  )}
                />
                {form.formState.errors.whatsapp && (
                  <FormControlError>
                    <FormControlErrorText>
                      {form.formState.errors.whatsapp.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </View>

            <FormControl isInvalid={!!form.formState.errors.email}>
              <FormControlLabel>
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="email@exemplo.com"
                      onChangeText={onChange}
                      value={value}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </Input>
                )}
              />
              {form.formState.errors.email && (
                <FormControlError>
                  <FormControlErrorText>
                    {form.formState.errors.email.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

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
