// Path: src/features/profile/components/contact/contact-form.tsx
import React, { useEffect } from "react";
import { View, ScrollView, Platform } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react-native";

import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";
import { FormField } from "@/components/custom/form-field";
import { SectionCard } from "@/components/custom/section-card";

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
      endereco: profile.endereco || "",
      telefone: profile.telefone || "",
      whatsapp: profile.whatsapp || "",
      email: profile.email || "",
    },
  });

  useEffect(() => {
    if (profile && open) {
      form.reset({
        endereco: profile.endereco || "",
        telefone: profile.telefone || "",
        whatsapp: profile.whatsapp || "",
        email: profile.email || "",
      });
    }
  }, [profile, form.reset, open]);

  const handleSubmit = (data: ContactFormData) => {
    const updateData: UpdateProfileDTO = {
      endereco: data.endereco,
      telefone: data.telefone,
      whatsapp: data.whatsapp || undefined,
      email: data.email,
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
            Editar Informações de Contato
          </Heading>
          <Text size="sm" className="text-typography-500 mt-1">
            Atualize as informações de contato da sua empresa
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
            {/* Seção de Endereço */}
            <SectionCard
              title="Endereço"
              icon={<MapPin size={22} color="#0891B2" />}
            >
              <View className="gap-4 flex flex-col py-4">
                <FormField
                  control={form.control}
                  name="endereco"
                  label="Endereço Completo"
                  placeholder="Rua, número, bairro, cidade, estado, CEP"
                  error={form.formState.errors.endereco}
                />
              </View>
            </SectionCard>

            {/* Seção de Telefones */}
            <SectionCard
              title="Telefones"
              icon={<Phone size={22} color="#0891B2" />}
            >
              <View className="gap-4 flex flex-col py-4">
                <FormField
                  control={form.control}
                  name="telefone"
                  label="Telefone Principal"
                  placeholder="(00) 0000-0000"
                  error={form.formState.errors.telefone}
                  keyboardType="phone-pad"
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  label="WhatsApp (Opcional)"
                  placeholder="(00) 00000-0000"
                  error={form.formState.errors.whatsapp}
                  keyboardType="phone-pad"
                />
              </View>
            </SectionCard>

            {/* Seção de Email */}
            <SectionCard
              title="Email"
              icon={<Mail size={22} color="#0891B2" />}
            >
              <View className="gap-4 flex flex-col py-4">
                <FormField
                  control={form.control}
                  name="email"
                  label="Email de Contato"
                  placeholder="email@exemplo.com"
                  error={form.formState.errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
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
