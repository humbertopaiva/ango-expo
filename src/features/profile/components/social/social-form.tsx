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
import {
  formatSocialUrl,
  validateUsername,
  extractUsername,
  SocialNetwork,
} from "@/utils/social-utils";
import * as z from "zod";

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
      facebook: data.facebook || undefined,
      instagram: data.instagram || undefined,
      tiktok: data.tiktok || undefined,
      youtube: data.youtube || undefined,
      twitter: data.twitter || undefined,
      linkedin: data.linkedin || undefined,
    };
    onSubmit(updateData);
  };

  return (
    <Dialog isOpen={open} onClose={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <Text className="text-xl font-semibold">Editar Redes Sociais</Text>
        </DialogHeader>

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
              <FormControl.HelperText>
                Digite apenas seu nome de usuário, exemplo: @sua-empresa
              </FormControl.HelperText>
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
              <FormControl.HelperText>
                Digite apenas o nome da sua página
              </FormControl.HelperText>
            </FormControl>

            {/* Repetir o mesmo padrão para as outras redes sociais */}
            {/* ... */}

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
