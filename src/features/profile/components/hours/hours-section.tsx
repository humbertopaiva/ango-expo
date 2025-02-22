import React from "react";
import { View, Text } from "react-native";
import { Edit3, Clock } from "lucide-react-native";
import { Card } from "@gluestack-ui/themed";
import { Button, ButtonText } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useProfileContext } from "../../contexts/use-profile-context";
import { HoursForm } from "./hours-form";

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
    <View className="space-y-6">
      <Card>
        <View className="p-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold">
              Horários de Funcionamento
            </Text>
            <Button
              variant="outline"
              size="sm"
              onPress={() => vm.setIsHoursOpen(true)}
            >
              <Edit3 size={16} color="#000000" className="mr-2" />
              <ButtonText>Editar</ButtonText>
            </Button>
          </View>
        </View>

        <View className="p-4">
          <View className="space-y-4">
            {weekDays.map((day) => (
              <View
                key={day.key}
                className="flex-row items-center justify-between p-4 rounded-lg border bg-card"
              >
                <View className="flex-row items-center space-x-3">
                  <Clock size={20} color="#6B7280" />
                  <View>
                    <Text className="font-medium">{day.label}</Text>
                    {isOpen(day.key) ? (
                      <Text className="text-sm text-gray-500">
                        {formatTime(day.abertura)} -{" "}
                        {formatTime(day.fechamento)}
                      </Text>
                    ) : (
                      <Text className="text-sm text-gray-500">Fechado</Text>
                    )}
                  </View>
                </View>
                <Badge variant={isOpen(day.key) ? "solid" : "outline"}>
                  {isOpen(day.key) ? "Aberto" : "Fechado"}
                </Badge>
              </View>
            ))}
          </View>
        </View>
      </Card>

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
