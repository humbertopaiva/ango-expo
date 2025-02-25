// components/custom/ContentContainer.tsx
import React from "react";
import { View, Platform, ViewStyle } from "react-native";

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: number;
  style?: ViewStyle;
}

export function ContentContainer({
  children,
  className = "",
  maxWidth = 900,
  style,
}: ContentContainerProps) {
  const isWeb = Platform.OS === "web";

  // Classes base para todos os ambientes
  const containerClasses = `w-full px-4 ${className}`;

  // Estilos para centralização e limite de largura
  const containerStyles = isWeb
    ? {
        maxWidth: maxWidth,
        marginLeft: 0,
        marginRight: 0,
        width: "100%",
      }
    : {};

  return <View className="max-w-[900px] mx-auto">{children}</View>;
}
