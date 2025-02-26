// Path: src/features/profile/components/hours/hours-section.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Edit3, Clock } from "lucide-react-native";
import { Badge } from "@/components/ui/badge";

import { useProfileContext } from "../../contexts/use-profile-context";
import { HoursForm } from "./hours-form";
import { Section } from "@/components/custom/section";
import { THEME_COLORS } from "@/src/styles/colors";

const formatTime = (time: string | null): string => {
  if (!time) return "--:--";
  if (time.includes(":")) {
    const [hours, minutes] = time.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  }
  return time;
};

export function HoursSection() {
  const vm = useProfileContext();

  if (!vm.profile) return null;

  const weekDays = [
    {
      key: "segunda",
      label: "Segunda-feira",
      abertura: vm.profile.abertura_segunda,
      fechamento: vm.profile.fechamento_segunda,
    },
    {
      key: "terca",
      label: "Terça-feira",
      abertura: vm.profile.abertura_terca,
      fechamento: vm.profile.fechamento_terca,
    },
    {
      key: "quarta",
      label: "Quarta-feira",
      abertura: vm.profile.abertura_quarta,
      fechamento: vm.profile.fechamento_quarta,
    },
    {
      key: "quinta",
      label: "Quinta-feira",
      abertura: vm.profile.abertura_quinta,
      fechamento: vm.profile.fechamento_quinta,
    },
    {
      key: "sexta",
      label: "Sexta-feira",
      abertura: vm.profile.abertura_sexta,
      fechamento: vm.profile.fechamento_sexta,
    },
    {
      key: "sabado",
      label: "Sábado",
      abertura: vm.profile.abertura_sabado,
      fechamento: vm.profile.fechamento_sabado,
    },
    {
      key: "domingo",
      label: "Domingo",
      abertura: vm.profile.abertura_domingo,
      fechamento: vm.profile.fechamento_domingo,
    },
  ];

  const isOpen = (dia: string) =>
    vm.profile?.dias_funcionamento?.includes(dia) ?? false;

  return (
    <View>
      <Section
        title="Horários de Funcionamento"
        icon={<Clock size={22} color={THEME_COLORS.secondary} />}
        actionIcon={<Edit3 size={18} color="#FFFFFF" />}
        onAction={() => vm.setIsHoursOpen(true)}
      >
        <View className="gap-3">
          {weekDays.map((day) => (
            <View
              key={day.key}
              className="bg-white rounded-md p-4 flex-row items-center space-x-3 border border-gray-100"
            >
              <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
                <Clock
                  size={20}
                  color={isOpen(day.key) ? "#10B981" : "#6B7280"}
                />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700">
                  {day.label}
                </Text>

                {isOpen(day.key) ? (
                  <Text className="text-base text-gray-900 mt-1">
                    {formatTime(day.abertura)} - {formatTime(day.fechamento)}
                  </Text>
                ) : (
                  <Text className="text-sm text-gray-500 italic mt-1">
                    Fechado
                  </Text>
                )}
              </View>

              <Badge
                variant={isOpen(day.key) ? "solid" : "outline"}
                className={isOpen(day.key) ? "bg-green-500" : ""}
              >
                <Text
                  className={isOpen(day.key) ? "text-white" : "text-gray-800"}
                >
                  {isOpen(day.key) ? "Aberto" : "Fechado"}
                </Text>
              </Badge>
            </View>
          ))}
        </View>
      </Section>

      <HoursForm
        open={vm.isHoursOpen}
        onClose={vm.closeModals}
        onSubmit={vm.handleUpdateHours}
        isLoading={vm.isUpdating}
        profile={vm.profile}
      />
    </View>
  );
}
