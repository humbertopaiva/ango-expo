import React from "react";
import { View, Text } from "react-native";

type Status =
  | "ativo"
  | "inativo"
  | "disponivel"
  | "indisponivel"
  | "aberto"
  | "fechado"
  | string;

interface StatusBadgeProps {
  status: Status;
  customLabel?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

export function StatusBadge({
  status,
  customLabel,
  size = "sm",
}: StatusBadgeProps) {
  // Map status to colors and default labels
  const statusConfig: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    ativo: { bg: "bg-green-100", text: "text-green-800", label: "Ativo" },
    ativa: { bg: "bg-green-100", text: "text-green-800", label: "Ativa" },
    disponivel: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Disponível",
    },
    aberto: { bg: "bg-green-100", text: "text-green-800", label: "Aberto" },
    inativo: { bg: "bg-gray-100", text: "text-gray-800", label: "Inativo" },
    inativa: { bg: "bg-gray-100", text: "text-gray-800", label: "Inativa" },
    indisponivel: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: "Indisponível",
    },
    fechado: { bg: "bg-gray-100", text: "text-gray-800", label: "Fechado" },
  };

  // Get config for the given status or use a default gray style
  const config = statusConfig[status] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    label: status,
  };

  // Size classes
  const sizeClasses = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-1.5 py-0.5 text-sm",
    md: "px-2 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const paddingClasses =
    size === "sm" ? "px-2 py-0.5" : size === "md" ? "px-2 py-1" : "px-3 py-1.5";
  const textSizeClass =
    size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";

  return (
    <View className={`rounded-full ${config.bg} ${paddingClasses}`}>
      <Text className={`${config.text} ${textSizeClass}`}>
        {customLabel || config.label}
      </Text>
    </View>
  );
}
