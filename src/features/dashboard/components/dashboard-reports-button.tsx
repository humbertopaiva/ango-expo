// Path: src/features/dashboard/components/dashboard-reports-button.tsx
import React from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import { BarChart } from "lucide-react-native";

interface DashboardReportsButtonProps {
  primaryColor?: string;
}

export function DashboardReportsButton({
  primaryColor = "#F4511E",
}: DashboardReportsButtonProps) {
  const handlePress = () => {
    // Aqui você iria navegar para a página de relatórios
    // Por enquanto, mostrar um alerta
    Alert.alert(
      "Em breve",
      "A funcionalidade de relatórios estará disponível em breve!"
    );
  };

  return (
    <TouchableOpacity
      className="mb-6 py-4 px-4 rounded-xl flex-row items-center justify-center bg-secondary-500"
      onPress={handlePress}
    >
      <BarChart size={20} color="white" />
      <Text className="ml-2 text-white font-semibold text-md">
        Acessar Relatórios
      </Text>
    </TouchableOpacity>
  );
}
