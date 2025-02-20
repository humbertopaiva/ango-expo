import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalContent,
  ModalHeader,
  Button,
  FormControl,
  Input,
  Heading,
} from "@gluestack-ui/themed";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";
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
          <Heading size="lg">Editar Redes Sociais</Heading>
        </ModalHeader>

        <ScrollView className="p-4">
          <View className="space-y-4">
            <FormControl isInvalid={!!form.formState.errors.instagram}>
              <FormControl.Label>Instagram</FormControl.Label>
              <Controller
                control={form.control}
                name="instagram"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <Input.Input
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
                <FormControl.Error>
                  <FormControl.Error.Text>
                    {form.formState.errors.instagram.message}
                  </FormControl.Error.Text>
                </FormControl.Error>
              )}
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.facebook}>
              <FormControl.Label>Facebook</FormControl.Label>
              <Controller
                control={form.control}
                name="facebook"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <Input.Input
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
                <FormControl.Error>
                  <FormControl.Error.Text>
                    {form.formState.errors.facebook.message}
                  </FormControl.Error.Text>
                </FormControl.Error>
              )}
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.tiktok}>
              <FormControl.Label>TikTok</FormControl.Label>
              <Controller
                control={form.control}
                name="tiktok"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <Input.Input
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
                <FormControl.Error>
                  <FormControl.Error.Text>
                    {form.formState.errors.tiktok.message}
                  </FormControl.Error.Text>
                </FormControl.Error>
              )}
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.youtube}>
              <FormControl.Label>YouTube</FormControl.Label>
              <Controller
                control={form.control}
                name="youtube"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <Input.Input
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
                <FormControl.Error>
                  <FormControl.Error.Text>
                    {form.formState.errors.youtube.message}
                  </FormControl.Error.Text>
                </FormControl.Error>
              )}
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.twitter}>
              <FormControl.Label>Twitter</FormControl.Label>
              <Controller
                control={form.control}
                name="twitter"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <Input.Input
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
                <FormControl.Error>
                  <FormControl.Error.Text>
                    {form.formState.errors.twitter.message}
                  </FormControl.Error.Text>
                </FormControl.Error>
              )}
            </FormControl>

            <FormControl isInvalid={!!form.formState.errors.linkedin}>
              <FormControl.Label>LinkedIn</FormControl.Label>
              <Controller
                control={form.control}
                name="linkedin"
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <Input.Input
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
                <FormControl.Error>
                  <FormControl.Error.Text>
                    {form.formState.errors.linkedin.message}
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
      </ModalContent>
    </Modal>
  );
}
