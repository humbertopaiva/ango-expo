import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  Button,
  FormControl,
  Input,
} from "@gluestack-ui/themed";
import { Plus, Trash2 } from "lucide-react-native";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";

const formSchema = z.object({
  adicionais: z.array(
    z.object({
      titulo: z.string().min(1, "Título é obrigatório"),
      valor: z.string().min(1, "Valor é obrigatório"),
    })
  ),
  tags: z
    .array(
      z.object({
        value: z.string().min(1, "Tag é obrigatória"),
      })
    )
    .min(1, "Adicione pelo menos uma tag"),
});

type AdditionalFormData = z.infer<typeof formSchema>;

interface AdditionalFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateProfileDTO) => void;
  isLoading: boolean;
  profile: Profile;
}

export function AdditionalForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  profile,
}: AdditionalFormProps) {
  const form = useForm<AdditionalFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adicionais: profile.adicionais || [],
      tags: profile.tags?.map((tag) => ({ value: tag })) || [],
    },
  });

  const {
    fields: adicionaisFields,
    append: appendAdicional,
    remove: removeAdicional,
  } = useFieldArray({
    control: form.control,
    name: "adicionais",
  });

  const {
    fields: tagsFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const handleSubmit = (data: AdditionalFormData) => {
    const updateData: UpdateProfileDTO = {
      adicionais: data.adicionais,
      tags: data.tags.map((tag) => tag.value),
    };
    onSubmit(updateData);
  };

  return (
    <Dialog isOpen={open} onClose={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <Text className="text-xl font-semibold">
            Editar Informações Adicionais
          </Text>
        </DialogHeader>

        <ScrollView className="p-4">
          <View className="space-y-6">
            {/* Informações Adicionais */}
            <View className="space-y-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-medium">
                  Informações Adicionais
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => appendAdicional({ titulo: "", valor: "" })}
                >
                  <Plus size={16} color="#000000" className="mr-2" />
                  <Text>Adicionar</Text>
                </Button>
              </View>

              {adicionaisFields.map((field, index) => (
                <View
                  key={field.id}
                  className="space-y-4 p-4 border rounded-lg"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 space-y-4">
                      <FormControl
                        isInvalid={
                          !!form.formState.errors.adicionais?.[index]?.titulo
                        }
                      >
                        <FormControl.Label>Título</FormControl.Label>
                        <Controller
                          control={form.control}
                          name={`adicionais.${index}.titulo`}
                          render={({ field: { onChange, value } }) => (
                            <Input>
                              <Input.Input
                                placeholder="Ex: Horário especial"
                                onChangeText={onChange}
                                value={value}
                              />
                            </Input>
                          )}
                        />
                      </FormControl>

                      <FormControl
                        isInvalid={
                          !!form.formState.errors.adicionais?.[index]?.valor
                        }
                      >
                        <FormControl.Label>Valor</FormControl.Label>
                        <Controller
                          control={form.control}
                          name={`adicionais.${index}.valor`}
                          render={({ field: { onChange, value } }) => (
                            <Input>
                              <Input.Input
                                placeholder="Ex: Aos domingos"
                                onChangeText={onChange}
                                value={value}
                              />
                            </Input>
                          )}
                        />
                      </FormControl>
                    </View>

                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={() => removeAdicional(index)}
                      className="ml-2"
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </Button>
                  </View>
                </View>
              ))}
            </View>

            {/* Tags */}
            <View className="space-y-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-medium">Tags</Text>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => appendTag({ value: "" })}
                >
                  <Plus size={16} color="#000000" className="mr-2" />
                  <Text>Adicionar</Text>
                </Button>
              </View>

              {tagsFields.map((field, index) => (
                <View key={field.id} className="flex-row space-x-2">
                  <FormControl
                    isInvalid={!!form.formState.errors.tags?.[index]?.value}
                    className="flex-1"
                  >
                    <Controller
                      control={form.control}
                      name={`tags.${index}.value`}
                      render={({ field: { onChange, value } }) => (
                        <Input>
                          <Input.Input
                            placeholder="Ex: delivery"
                            onChangeText={onChange}
                            value={value}
                          />
                        </Input>
                      )}
                    />
                  </FormControl>

                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => removeTag(index)}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </Button>
                </View>
              ))}
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
      </DialogContent>
    </Dialog>
  );
}
