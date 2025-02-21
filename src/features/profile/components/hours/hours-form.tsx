import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormControl, Input, Switch } from "@gluestack-ui/themed";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { InputField } from "@/components/ui/input";
import { ButtonText } from "@/components/ui/button";

const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const formSchema = z.object({
  dias_funcionamento: z.array(z.string()),
  abertura_segunda: z.string().regex(timePattern, "Formato inválido (HH:MM)"),
  fechamento_segunda: z.string().regex(timePattern, "Formato inválido (HH:MM)"),
  abertura_terca: z.string().regex(timePattern, "Formato inválido (HH:MM)"),
  fechamento_terca: z.string().regex(timePattern, "Formato inválido (HH:MM)"),
  abertura_quarta: z.string().regex(timePattern, "Formato inválido (HH:MM)"),
  fechamento_quarta: z.string().regex(timePattern, "Formato inválido (HH:MM)"),
  abertura_quinta: z.string().regex(timePattern, "Formato inválido (HH:MM)"),
  fechamento_quinta: z.string().regex(timePattern, "Formato inválido (HH:MM)"),
  abertura_sexta: z.string().regex(timePattern, "Formato inválido (HH:MM)"),
  fechamento_sexta: z.string().regex(timePattern, "Formato inválido (HH:MM)"),
  abertura_sabado: z.string().regex(timePattern, "Formato inválido (HH:MM)"),
  fechamento_sabado: z.string().regex(timePattern, "Formato inválido (HH:MM)"),
  abertura_domingo: z.string().regex(timePattern, "Formato inválido (HH:MM)"),
  fechamento_domingo: z.string().regex(timePattern, "Formato inválido (HH:MM)"),
});

type HoursFormData = z.infer<typeof formSchema>;

interface HoursFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateProfileDTO) => void;
  isLoading: boolean;
  profile: Profile;
}

const formatTime = (time: string | null): string => {
  if (!time) return "08:00";
  if (time.includes(":")) {
    const [hours, minutes] = time.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  }
  return time;
};

export function HoursForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  profile,
}: HoursFormProps) {
  const weekDays = [
    { key: "segunda", label: "Segunda-feira" },
    { key: "terca", label: "Terça-feira" },
    { key: "quarta", label: "Quarta-feira" },
    { key: "quinta", label: "Quinta-feira" },
    { key: "sexta", label: "Sexta-feira" },
    { key: "sabado", label: "Sábado" },
    { key: "domingo", label: "Domingo" },
  ];

  const form = useForm<HoursFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dias_funcionamento: profile.dias_funcionamento || [],
      abertura_segunda: formatTime(profile.abertura_segunda as string | null),
      fechamento_segunda: formatTime(
        profile.fechamento_segunda as string | null
      ),
      abertura_terca: formatTime(profile.abertura_terca as string | null),
      fechamento_terca: formatTime(profile.fechamento_terca as string | null),
      abertura_quarta: formatTime(profile.abertura_quarta as string | null),
      fechamento_quarta: formatTime(profile.fechamento_quarta as string | null),
      abertura_quinta: formatTime(profile.abertura_quinta as string | null),
      fechamento_quinta: formatTime(profile.fechamento_quinta as string | null),
      abertura_sexta: formatTime(profile.abertura_sexta as string | null),
      fechamento_sexta: formatTime(profile.fechamento_sexta as string | null),
      abertura_sabado: formatTime(profile.abertura_sabado as string | null),
      fechamento_sabado: formatTime(profile.fechamento_sabado as string | null),
      abertura_domingo: formatTime(profile.abertura_domingo as string | null),
      fechamento_domingo: formatTime(
        profile.fechamento_domingo as string | null
      ),
    },
  });

  const handleSubmit = (data: HoursFormData) => {
    const updateData: UpdateProfileDTO = {
      dias_funcionamento: data.dias_funcionamento,
      abertura_segunda: data.abertura_segunda,
      fechamento_segunda: data.fechamento_segunda,
      abertura_terca: data.abertura_terca,
      fechamento_terca: data.fechamento_terca,
      abertura_quarta: data.abertura_quarta,
      fechamento_quarta: data.fechamento_quarta,
      abertura_quinta: data.abertura_quinta,
      fechamento_quinta: data.fechamento_quinta,
      abertura_sexta: data.abertura_sexta,
      fechamento_sexta: data.fechamento_sexta,
      abertura_sabado: data.abertura_sabado,
      fechamento_sabado: data.fechamento_sabado,
      abertura_domingo: data.abertura_domingo,
      fechamento_domingo: data.fechamento_domingo,
    };
    onSubmit(updateData);
  };

  const getDayActive = (day: string) =>
    form.watch("dias_funcionamento")?.includes(day) || false;

  const toggleDay = (day: string, active: boolean) => {
    const currentDias = form.getValues("dias_funcionamento");
    let newDias: string[];

    if (active) {
      newDias = [...currentDias, day];
    } else {
      newDias = currentDias.filter((d) => d !== day);
    }

    form.setValue("dias_funcionamento", newDias);
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent className="bg-white">
        <ModalHeader>
          <Heading size="lg">Editar Horários de Funcionamento</Heading>
        </ModalHeader>

        <ScrollView className="p-4">
          <View className="space-y-6">
            {weekDays.map((day) => (
              <View
                key={day.key}
                className="space-y-4 pb-4 border-b border-gray-200"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium">{day.label}</Text>
                  <Switch
                    value={getDayActive(day.key)}
                    onValueChange={(checked) => toggleDay(day.key, checked)}
                  />
                </View>

                <View className="flex-row space-x-4">
                  <FormControl
                    isInvalid={
                      !!form.formState.errors[
                        `abertura_${day.key}` as keyof HoursFormData
                      ]
                    }
                    className="flex-1"
                  >
                    <FormControl.Label>Abertura</FormControl.Label>
                    <Controller
                      control={form.control}
                      name={`abertura_${day.key}` as keyof HoursFormData}
                      render={({ field: { onChange, value } }) => (
                        <Input>
                          <InputField
                            type="time"
                            value={formatTime(value)}
                            onChangeText={onChange}
                            disabled={!getDayActive(day.key)}
                          />
                        </Input>
                      )}
                    />
                    {form.formState.errors[
                      `abertura_${day.key}` as keyof HoursFormData
                    ] && (
                      <FormControl.Error>
                        <FormControl.Error.Text>
                          {
                            form.formState.errors[
                              `abertura_${day.key}` as keyof HoursFormData
                            ]?.message
                          }
                        </FormControl.Error.Text>
                      </FormControl.Error>
                    )}
                  </FormControl>

                  <FormControl
                    isInvalid={
                      !!form.formState.errors[
                        `fechamento_${day.key}` as keyof HoursFormData
                      ]
                    }
                    className="flex-1"
                  >
                    <FormControl.Label>Fechamento</FormControl.Label>
                    <Controller
                      control={form.control}
                      name={`fechamento_${day.key}` as keyof HoursFormData}
                      render={({ field: { onChange, value } }) => (
                        <Input>
                          <InputField
                            type="time"
                            value={formatTime(value)}
                            onChangeText={onChange}
                            disabled={!getDayActive(day.key)}
                          />
                        </Input>
                      )}
                    />
                    {form.formState.errors[
                      `fechamento_${day.key}` as keyof HoursFormData
                    ] && (
                      <FormControl.Error>
                        <FormControl.Error.Text>
                          {
                            form.formState.errors[
                              `fechamento_${day.key}` as keyof HoursFormData
                            ]?.message
                          }
                        </FormControl.Error.Text>
                      </FormControl.Error>
                    )}
                  </FormControl>
                </View>
              </View>
            ))}

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
