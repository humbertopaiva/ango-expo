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

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent className="bg-white">
        <ModalHeader>
          <Heading size="lg">
            <Text>Editar Redes Sociais</Text>
          </Heading>
          <Text className="text-sm text-gray-500">
            Atualize as redes sociais da sua empresa
          </Text>
        </ModalHeader>

        <ScrollView className="p-4">
          <View className="space-y-4">
            <FormControl isInvalid={!!form.formState.errors.instagram}>
              <FormControlLabel>
                <FormControlLabelText>Instagram</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="instagram"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="@sua-empresa"
                      onChangeText={onChange}
                      value={extractUsername("instagram", value)}
                      autoCapitalize="none"
                    />
                  </Input>
                )}
              />
              <Text className="text-sm text-gray-500 mt-1">
                Digite apenas seu nome de usuário, exemplo: @sua-empresa
              </Text>
              {form.formState.errors.instagram && (
                <FormControlError>
                  <FormControlErrorText>
                    {form.formState.errors.instagram.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.facebook}>
              <FormControlLabel>
                <FormControlLabelText>Facebook</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="facebook"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="sua-empresa"
                      onChangeText={onChange}
                      value={extractUsername("facebook", value)}
                      autoCapitalize="none"
                    />
                  </Input>
                )}
              />
              <Text className="text-sm text-gray-500 mt-1">
                Digite apenas o nome da sua página
              </Text>
              {form.formState.errors.facebook && (
                <FormControlError>
                  <FormControlErrorText>
                    <Text>{form.formState.errors.facebook.message}</Text>
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.tiktok}>
              <FormControlLabel>
                <FormControlLabelText>TikTok</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="tiktok"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="@sua-empresa"
                      onChangeText={onChange}
                      value={extractUsername("tiktok", value)}
                      autoCapitalize="none"
                    />
                  </Input>
                )}
              />
              <Text className="text-sm text-gray-500 mt-1">
                Digite apenas seu nome de usuário, exemplo: @sua-empresa
              </Text>
              {form.formState.errors.tiktok && (
                <FormControlError>
                  <FormControlErrorText>
                    {form.formState.errors.tiktok.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.youtube}>
              <FormControlLabel>
                <FormControlLabelText>YouTube</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="youtube"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="@sua-empresa"
                      onChangeText={onChange}
                      value={extractUsername("youtube", value)}
                      autoCapitalize="none"
                    />
                  </Input>
                )}
              />
              <Text className="text-sm text-gray-500 mt-1">
                Digite apenas seu nome de usuário, exemplo: @sua-empresa
              </Text>
              {form.formState.errors.youtube && (
                <FormControlError>
                  <FormControlErrorText>
                    {form.formState.errors.youtube.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.twitter}>
              <FormControlLabel>
                <FormControlLabelText>Twitter</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="twitter"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="@sua-empresa"
                      onChangeText={onChange}
                      value={extractUsername("twitter", value)}
                      autoCapitalize="none"
                    />
                  </Input>
                )}
              />
              <Text className="text-sm text-gray-500 mt-1">
                Digite apenas seu nome de usuário, exemplo: @sua-empresa
              </Text>
              {form.formState.errors.twitter && (
                <FormControlError>
                  <FormControlErrorText>
                    {form.formState.errors.twitter.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.linkedin}>
              <FormControlLabel>
                <FormControlLabelText>LinkedIn</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="linkedin"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      placeholder="sua-empresa"
                      onChangeText={onChange}
                      value={extractUsername("linkedin", value)}
                      autoCapitalize="none"
                    />
                  </Input>
                )}
              />
              <Text className="text-sm text-gray-500 mt-1">
                Digite apenas o nome da sua empresa
              </Text>
              {form.formState.errors.linkedin && (
                <FormControlError>
                  <FormControlErrorText>
                    {form.formState.errors.linkedin.message}
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
