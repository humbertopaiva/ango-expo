// Path: src/components/custom/status-badge.tsx
import React from "react";
import { View, Text } from "react-native";

type StatusType = "aberto" | "fechado" | "disponivel" | "indisponivel" | "info";

interface StatusBadgeProps {
  status: StatusType;
  customLabel?: string;
  className?: string;
  textClassName?: string;
}

export function StatusBadge({
  status,
  customLabel,
  className = "",
  textClassName = "",
}: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "aberto":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
        };
      case "fechado":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
        };
      case "disponivel":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
        };
      case "indisponivel":
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
        };
      case "info":
        return {
          bg: "bg-primary-100",
          text: "text-primary-800",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
        };
    }
  };

  const { bg, text } = getStatusStyles();

  return (
    <View className={`px-2 py-1 rounded-full ${bg} ${className}`}>
      <Text className={`text-xs font-medium ${text} ${textClassName}`}>
        {customLabel || status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
}
