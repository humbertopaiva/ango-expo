import React from "react";
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
} from "@gluestack-ui/themed";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";

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
    <Dialog isOpen={open} onClose={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <Text className="text-xl font-semibold">
            Editar Informações de Contato
          </Text>
        </DialogHeader>

        <ScrollView className="p-4">
          <View className="space-y-4">
            <FormControl isInvalid={!!form.formState.errors.endereco}>
              <FormControl.Label>Endereço</FormControl.Label>
              <Controller
                control={form.control}
                name="endereco"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <Input.Input
                      placeholder="Endereço completo"
                      onChangeText={onChange}
                      value={value}
                    />
                  </Input>
                )}
              />
              {form.formState.errors.endereco && (
                <FormControl.Error>
                  <FormControl.Error.Text>
                    {form.formState.errors.endereco.message}
                  </FormControl.Error.Text>
                </FormControl.Error>
              )}
            </FormControl>

            <View className="grid grid-cols-2 gap-4">
              <FormControl isInvalid={!!form.formState.errors.telefone}>
                <FormControl.Label>Telefone</FormControl.Label>
                <Controller
                  control={form.control}
                  name="telefone"
                  render={({ field: { onChange, value } }) => (
                    <Input>
                      <Input.Input
                        placeholder="(00) 0000-0000"
                        onChangeText={onChange}
                        value={value}
                      />
                    </Input>
                  )}
                />
                {form.formState.errors.telefone && (
                  <FormControl.Error>
                    <FormControl.Error.Text>
                      {form.formState.errors.telefone.message}
                    </FormControl.Error.Text>
                  </FormControl.Error>
                )}
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.whatsapp}>
                <FormControl.Label>WhatsApp</FormControl.Label>
                <Controller
                  control={form.control}
                  name="whatsapp"
                  render={({ field: { onChange, value } }) => (
                    <Input>
                      <Input.Input
                        placeholder="(00) 00000-0000"
                        onChangeText={onChange}
                        value={value}
                      />
                    </Input>
                  )}
                />
              </FormControl>
            </View>

            <FormControl isInvalid={!!form.formState.errors.email}>
              <FormControl.Label>Email</FormControl.Label>
              <Controller
                control={form.control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <Input.Input
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
                <FormControl.Error>
                  <FormControl.Error.Text>
                    {form.formState.errors.email.message}
                  </FormControl.Error.Text>
                </FormControl.Error>
              )}
            </FormControl>

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
