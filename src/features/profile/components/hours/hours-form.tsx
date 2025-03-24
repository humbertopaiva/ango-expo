// Path: src/features/profile/components/hours/hours-form.tsx
import React, { useEffect } from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Clock } from "lucide-react-native";
import { Switch } from "@/components/ui/switch";

import { Profile, UpdateProfileDTO } from "../../models/profile";
import { TimePicker } from "@/components/common/time-picker";
import { SectionCard } from "@/components/custom/section-card";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";

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
import { Icon, CloseIcon } from "@/components/ui/icon";
import { THEME_COLORS } from "@/src/styles/colors";

const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const formSchema = z.object({
  dias_funcionamento: z.array(z.string()).min(1, "Selecione pelo menos um dia"),
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

type FormData = z.infer<typeof formSchema>;

interface HoursFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateProfileDTO) => void;
  isLoading: boolean;
  profile: Profile;
}

const formatTime = (time: string | null): string => {
  if (!time) return "08:00";

  // Se o tempo incluir segundos (HH:MM:SS), remove os segundos
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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dias_funcionamento: profile.dias_funcionamento || [],
      abertura_segunda: formatTime(profile.abertura_segunda),
      fechamento_segunda: formatTime(profile.fechamento_segunda),
      abertura_terca: formatTime(profile.abertura_terca),
      fechamento_terca: formatTime(profile.fechamento_terca),
      abertura_quarta: formatTime(profile.abertura_quarta),
      fechamento_quarta: formatTime(profile.fechamento_quarta),
      abertura_quinta: formatTime(profile.abertura_quinta),
      fechamento_quinta: formatTime(profile.fechamento_quinta),
      abertura_sexta: formatTime(profile.abertura_sexta),
      fechamento_sexta: formatTime(profile.fechamento_sexta),
      abertura_sabado: formatTime(profile.abertura_sabado),
      fechamento_sabado: formatTime(profile.fechamento_sabado),
      abertura_domingo: formatTime(profile.abertura_domingo),
      fechamento_domingo: formatTime(profile.fechamento_domingo),
    },
  });

  useEffect(() => {
    if (profile && open) {
      form.reset({
        dias_funcionamento: profile.dias_funcionamento || [],
        abertura_segunda: formatTime(profile.abertura_segunda),
        fechamento_segunda: formatTime(profile.fechamento_segunda),
        abertura_terca: formatTime(profile.abertura_terca),
        fechamento_terca: formatTime(profile.fechamento_terca),
        abertura_quarta: formatTime(profile.abertura_quarta),
        fechamento_quarta: formatTime(profile.fechamento_quarta),
        abertura_quinta: formatTime(profile.abertura_quinta),
        fechamento_quinta: formatTime(profile.fechamento_quinta),
        abertura_sexta: formatTime(profile.abertura_sexta),
        fechamento_sexta: formatTime(profile.fechamento_sexta),
        abertura_sabado: formatTime(profile.abertura_sabado),
        fechamento_sabado: formatTime(profile.fechamento_sabado),
        abertura_domingo: formatTime(profile.abertura_domingo),
        fechamento_domingo: formatTime(profile.fechamento_domingo),
      });
    }
  }, [profile, form.reset, open]);

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const toggleDay = (day: string) => {
    const currentDays = form.getValues("dias_funcionamento");
    const isActive = currentDays.includes(day);

    const newDays = isActive
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    form.setValue("dias_funcionamento", newDays, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const isDayActive = (day: string) => {
    return form.watch("dias_funcionamento").includes(day);
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
            Horários de Funcionamento
          </Heading>
          <Text className="text-sm text-gray-500 mt-1">
            Configure os dias e horários de funcionamento
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
            {weekDays.map((day) => (
              <SectionCard
                key={day.key}
                title={day.label}
                icon={<Clock size={22} color={THEME_COLORS.primary} />}
              >
                <View className="gap-4 flex flex-col py-4">
                  <FormControl>
                    <View className="flex-row items-center justify-between mb-4">
                      <FormControlLabel>
                        <FormControlLabelText className="text-base font-medium">
                          {isDayActive(day.key) ? "Aberto" : "Fechado"}
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Switch
                        value={isDayActive(day.key)}
                        onValueChange={() => toggleDay(day.key)}
                        disabled={isLoading}
                      />
                    </View>
                  </FormControl>

                  {isDayActive(day.key) && (
                    <View className="flex-row gap-4">
                      <FormControl
                        isInvalid={
                          !!form.formState.errors[
                            `abertura_${day.key}` as keyof FormData
                          ]
                        }
                        className="flex-1"
                      >
                        <FormControlLabel>
                          <FormControlLabelText>Abertura</FormControlLabelText>
                        </FormControlLabel>
                        <Controller
                          control={form.control}
                          name={`abertura_${day.key}` as keyof FormData}
                          render={({ field: { onChange, value } }) => (
                            <TimePicker
                              value={Array.isArray(value) ? value[0] : value}
                              onChange={onChange}
                              disabled={!isDayActive(day.key) || isLoading}
                              isInvalid={
                                !!form.formState.errors[
                                  `abertura_${day.key}` as keyof FormData
                                ]
                              }
                            />
                          )}
                        />
                        {form.formState.errors[
                          `abertura_${day.key}` as keyof FormData
                        ] && (
                          <FormControlError>
                            <FormControlErrorText>
                              {
                                form.formState.errors[
                                  `abertura_${day.key}` as keyof FormData
                                ]?.message
                              }
                            </FormControlErrorText>
                          </FormControlError>
                        )}
                      </FormControl>

                      <FormControl
                        isInvalid={
                          !!form.formState.errors[
                            `fechamento_${day.key}` as keyof FormData
                          ]
                        }
                        className="flex-1"
                      >
                        <FormControlLabel>
                          <FormControlLabelText>
                            Fechamento
                          </FormControlLabelText>
                        </FormControlLabel>
                        <Controller
                          control={form.control}
                          name={`fechamento_${day.key}` as keyof FormData}
                          render={({ field: { onChange, value } }) => (
                            <TimePicker
                              value={Array.isArray(value) ? value[0] : value}
                              onChange={onChange}
                              disabled={!isDayActive(day.key) || isLoading}
                              isInvalid={
                                !!form.formState.errors[
                                  `fechamento_${day.key}` as keyof FormData
                                ]
                              }
                            />
                          )}
                        />
                        {form.formState.errors[
                          `fechamento_${day.key}` as keyof FormData
                        ] && (
                          <FormControlError>
                            <FormControlErrorText>
                              {
                                form.formState.errors[
                                  `fechamento_${day.key}` as keyof FormData
                                ]?.message
                              }
                            </FormControlErrorText>
                          </FormControlError>
                        )}
                      </FormControl>
                    </View>
                  )}
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
