// src/features/profile/components/contact/contact-form.tsx
import React from "react";
import { View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";
import { ModalForm } from "@/components/custom/modal-form";
import { FormField } from "@/components/custom/form-field";

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
    <ModalForm
      isOpen={open}
      onClose={onClose}
      onSubmit={form.handleSubmit(handleSubmit)}
      isLoading={isLoading}
      title="Editar Informações de Contato"
      subtitle="Atualize as informações de contato da sua empresa"
    >
      <View className="space-y-4">
        <FormField
          control={form.control}
          name="endereco"
          label="Endereço"
          placeholder="Endereço completo"
          error={form.formState.errors.endereco}
        />

        <View className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="telefone"
            label="Telefone"
            placeholder="(00) 0000-0000"
            error={form.formState.errors.telefone}
            keyboardType="phone-pad"
          />

          <FormField
            control={form.control}
            name="whatsapp"
            label="WhatsApp"
            placeholder="(00) 00000-0000"
            error={form.formState.errors.whatsapp}
            keyboardType="phone-pad"
          />
        </View>

        <FormField
          control={form.control}
          name="email"
          label="Email"
          placeholder="email@exemplo.com"
          error={form.formState.errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
    </ModalForm>
  );
}
