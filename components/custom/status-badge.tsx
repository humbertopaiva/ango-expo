// Path: components/custom/status-badge.tsx
import React from "react";
import { View, Text, ViewProps } from "react-native";

interface StatusBadgeProps extends ViewProps {
  status: "aberto" | "fechado" | "disponivel" | "indisponivel" | "info";
  customLabel?: string;
  className?: string;
  textClassName?: string;
}

export function StatusBadge({
  status,
  customLabel,
  className = "",
  textClassName = "",
  ...props
}: StatusBadgeProps) {
  // Configurações padrão com base no status
  const getConfig = () => {
    switch (status) {
      case "aberto":
        return {
          background: "bg-green-100",
          text: "text-green-800",
          label: customLabel || "Aberto",
        };
      case "fechado":
        return {
          background: "bg-red-100",
          text: "text-red-800",
          label: customLabel || "Fechado",
        };
      case "disponivel":
        return {
          background: "bg-green-100",
          text: "text-green-800",
          label: customLabel || "Disponível",
        };
      case "indisponivel":
        return {
          background: "bg-red-100",
          text: "text-red-800",
          label: customLabel || "Indisponível",
        };
      case "info":
        return {
          background: "bg-blue-100",
          text: "text-blue-800",
          label: customLabel || "Info",
        };
      default:
        return {
          background: "bg-gray-100",
          text: "text-gray-800",
          label: customLabel || "Status",
        };
    }
  };

  const config = getConfig();

  return (
    <View
      className={`px-2 py-0.5 rounded-full ${config.background} ${className}`}
      {...props}
    >
      <Text className={`text-xs font-medium ${config.text} ${textClassName}`}>
        {config.label}
      </Text>
    </View>
  );
}
