// Path: src/components/custom/open-status-indicator.tsx
import React from "react";
import { View, Text } from "react-native";

interface OpenStatusIndicatorProps {
  isOpen: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Componente para exibir o status de aberto ou fechado
 */
export function OpenStatusIndicator({
  isOpen,
  size = "md",
  className = "",
}: OpenStatusIndicatorProps) {
  // Configurações baseadas no tamanho
  const getConfig = () => {
    switch (size) {
      case "sm":
        return {
          dotSize: "w-1.5 h-1.5",
          fontSize: "text-xs",
          padding: "px-2 py-0.5",
        };
      case "lg":
        return {
          dotSize: "w-3 h-3",
          fontSize: "text-base",
          padding: "px-4 py-2",
        };
      case "md":
      default:
        return {
          dotSize: "w-2 h-2",
          fontSize: "text-sm",
          padding: "px-3 py-1",
        };
    }
  };

  const { dotSize, fontSize, padding } = getConfig();

  // Cores baseadas no status
  const statusColor = isOpen ? "#22C55E" : "#EF4444"; // verde para aberto, vermelho para fechado
  const statusText = isOpen ? "Aberto agora" : "Fechado";

  return (
    <View
      className={`rounded-full flex-row items-center ${padding} ${className}`}
      style={{ backgroundColor: `${statusColor}20` }}
    >
      <View
        className={`${dotSize} rounded-full mr-1.5`}
        style={{ backgroundColor: statusColor }}
      />
      <Text
        style={{ color: statusColor }}
        className={`font-medium ${fontSize}`}
      >
        {statusText}
      </Text>
    </View>
  );
}
