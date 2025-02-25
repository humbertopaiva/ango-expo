// components/custom/ActionCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Edit3 } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";

interface ActionCardProps {
  title: string;
  children: React.ReactNode;
  actionLabel?: string;
  actionIcon?: React.ElementType;
  onAction?: () => void;
  footer?: React.ReactNode;
}

export function ActionCard({
  title,
  children,
  actionLabel = "Editar",
  actionIcon = Edit3,
  onAction,
  footer,
}: ActionCardProps) {
  const Icon = actionIcon;

  return (
    <Card className="bg-white mb-4">
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold">{title}</Text>
          {onAction && (
            <Button variant="outline" size="sm" onPress={onAction}>
              <Icon size={16} color="#000000" className="mr-2" />
              <ButtonText>{actionLabel}</ButtonText>
            </Button>
          )}
        </View>
      </View>

      <View className="p-4 space-y-4">{children}</View>

      {footer && <View className="p-4 border-t border-gray-200">{footer}</View>}
    </Card>
  );
}
