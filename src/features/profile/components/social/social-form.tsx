// Path: src/features/profile/components/social/social-form.tsx
import React, { useEffect } from "react";
import { View, ScrollView, Platform } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
} from "lucide-react-native";

import { SectionCard } from "@/components/custom/section-card";
import { FormField } from "@/components/custom/form-field";

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
import {
  extractUsername,
  formatSocialUrl,
  SocialNetwork,
  validateUsername,
} from "@/src/utils/social.utils";

const createSocialSchema = (network: SocialNetwork) => {
  return z
    .string()
    .trim()
    .transform((val) => val.replace(/^@/, ""))
    .refine((val) => !val || validateUsername(network, val), {
      message: "Nome de usuário inválido",
    })
    .transform((val) => (val ? formatSocialUrl(network, val) : ""))
    .or(z.literal(""));
};

const formSchema = z.object({
  facebook: createSocialSchema("facebook"),
  instagram: createSocialSchema("instagram"),
  tiktok: createSocialSchema("tiktok"),
  youtube: createSocialSchema("youtube"),
  twitter: createSocialSchema("twitter"),
  linkedin: createSocialSchema("linkedin"),
});

type SocialFormData = z.infer<typeof formSchema>;

interface SocialFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateProfileDTO) => void;
  isLoading: boolean;
  profile: Profile;
}

export function SocialForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  profile,
}: SocialFormProps) {
  const form = useForm<SocialFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facebook: profile.facebook || "",
      instagram: profile.instagram || "",
      tiktok: profile.tiktok || "",
      youtube: profile.youtube || "",
      twitter: profile.twitter || "",
      linkedin: profile.linkedin || "",
    },
  });

  useEffect(() => {
    if (profile && open) {
      form.reset({
        facebook: profile.facebook || "",
        instagram: profile.instagram || "",
        tiktok: profile.tiktok || "",
        youtube: profile.youtube || "",
        twitter: profile.twitter || "",
        linkedin: profile.linkedin || "",
      });
    }
  }, [profile, form.reset, open]);

  const handleSubmit = (data: SocialFormData) => {
    const updateData: UpdateProfileDTO = {
      facebook: typeof data.facebook === "string" ? data.facebook : undefined,
      instagram:
        typeof data.instagram === "string" ? data.instagram : undefined,
      tiktok: typeof data.tiktok === "string" ? data.tiktok : undefined,
      youtube: typeof data.youtube === "string" ? data.youtube : undefined,
      twitter: typeof data.twitter === "string" ? data.twitter : undefined,
      linkedin: typeof data.linkedin === "string" ? data.linkedin : undefined,
    };
    onSubmit(updateData);
  };

  const socialNetworks = [
    {
      name: "Instagram",
      field: "instagram" as keyof SocialFormData,
      icon: Instagram,
      color: "#E1306C",
      placeholder: "@sua-empresa",
      helpText: "Digite apenas seu nome de usuário, exemplo: @sua-empresa",
    },
    {
      name: "Facebook",
      field: "facebook" as keyof SocialFormData,
      icon: Facebook,
      color: "#1877F2",
      placeholder: "sua-empresa",
      helpText: "Digite apenas o nome da sua página",
    },
    {
      name: "TikTok",
      field: "tiktok" as keyof SocialFormData,
      icon: Youtube,
      color: "#000000",
      placeholder: "@sua-empresa",
      helpText: "Digite apenas seu nome de usuário, exemplo: @sua-empresa",
    },
    {
      name: "YouTube",
      field: "youtube" as keyof SocialFormData,
      icon: Youtube,
      color: "#FF0000",
      placeholder: "@sua-empresa",
      helpText: "Digite apenas seu nome de usuário, exemplo: @sua-empresa",
    },
    {
      name: "Twitter",
      field: "twitter" as keyof SocialFormData,
      icon: Twitter,
      color: "#1DA1F2",
      placeholder: "@sua-empresa",
      helpText: "Digite apenas seu nome de usuário, exemplo: @sua-empresa",
    },
    {
      name: "LinkedIn",
      field: "linkedin" as keyof SocialFormData,
      icon: Linkedin,
      color: "#0A66C2",
      placeholder: "sua-empresa",
      helpText: "Digite apenas o nome da sua empresa",
    },
  ];

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
            Editar Redes Sociais
          </Heading>
          <Text size="sm" className="text-typography-500 mt-1">
            Atualize as redes sociais da sua empresa
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
            {socialNetworks.map((network) => (
              <SectionCard
                key={network.field}
                title={network.name}
                icon={<network.icon size={22} color={network.color} />}
              >
                <View className="gap-4 flex flex-col py-4">
                  <View>
                    <FormField
                      control={form.control}
                      name={network.field}
                      label={`Perfil do ${network.name}`}
                      placeholder={network.placeholder}
                      error={form.formState.errors[network.field]}
                      autoCapitalize="none"
                    />
                    <Text className="text-sm text-gray-500 mt-1">
                      {network.helpText}
                    </Text>
                  </View>
                </View>
              </SectionCard>
            ))}
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
