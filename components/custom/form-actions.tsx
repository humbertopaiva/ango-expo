// src/components/custom/form-actions.tsx

import { View, Platform } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  variant?: "solid" | "outline" | "link";
  colorScheme?: "primary" | "secondary" | "success" | "danger" | "warning";
  isDisabled?: boolean;
  className?: string;
}

interface FormActionsProps {
  primaryAction: ActionButtonProps;
  secondaryAction?: ActionButtonProps;
  tertiaryAction?: ActionButtonProps;
  fixed?: boolean;
  direction?: "row" | "column";
  alignment?: "start" | "center" | "end" | "between" | "around" | "evenly";
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function FormActions({
  primaryAction,
  secondaryAction,
  tertiaryAction,
  fixed = false,
  direction = "row",
  alignment = "end",
  spacing = "md",
  className = "",
}: FormActionsProps) {
  // Mapping for alignment classes
  const alignmentClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  // Mapping for spacing classes
  const spacingClasses = {
    none: "gap-0",
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  // Mapping for color scheme classes
  const colorSchemeClasses = {
    primary: "",
    secondary: "bg-gray-600",
    success: "bg-green-500",
    danger: "bg-red-500",
    warning: "bg-yellow-500",
  };

  // Container classes based on props
  const containerClasses = `
    ${direction === "row" ? "flex-row" : "flex-col"}
    ${alignmentClasses[alignment]}
    ${spacingClasses[spacing]}
    ${className}
  `;

  const renderButton = ({
    label,
    onPress,
    isLoading,
    variant = "solid",
    colorScheme = "primary",
    isDisabled,
    className = "",
  }: ActionButtonProps) => {
    const buttonColorClass =
      variant === "solid" ? colorSchemeClasses[colorScheme] : "";

    return (
      <Button
        variant={variant}
        onPress={onPress}
        disabled={isDisabled || isLoading}
        className={`flex-1 h-14 ${buttonColorClass} ${className}`}
      >
        <ButtonText>{isLoading ? "Processando..." : label}</ButtonText>
      </Button>
    );
  };

  return (
    <View className={containerClasses}>
      {tertiaryAction && renderButton(tertiaryAction)}
      {secondaryAction && renderButton(secondaryAction)}
      {renderButton(primaryAction)}
    </View>
  );
}
