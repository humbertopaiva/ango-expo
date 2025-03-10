// Path: src/features/company-page/components/delivery-category-header.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";

interface DeliveryCategoryHeaderProps {
  title: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export function DeliveryCategoryHeader({
  title,
  count,
  isExpanded,
  onToggle,
}: DeliveryCategoryHeaderProps) {
  const vm = useCompanyPageContext();
  const primaryColor = vm.primaryColor || "#F4511E";

  return (
    <TouchableOpacity
      onPress={onToggle}
      className="flex-row items-center justify-between p-4 border-b border-gray-100"
      style={{
        backgroundColor: isExpanded ? `${primaryColor}10` : "transparent",
      }}
    >
      <View className="flex-row items-center flex-1">
        <View>
          <Text className="text-lg font-bold text-gray-800">{title}</Text>
          <Text className="text-sm text-gray-500">
            {count} {count === 1 ? "item" : "itens"}
          </Text>
        </View>
      </View>

      <View
        className="w-8 h-8 rounded-full items-center justify-center"
        style={{ backgroundColor: `${primaryColor}20` }}
      >
        {isExpanded ? (
          <ChevronUp size={18} color={primaryColor} />
        ) : (
          <ChevronDown size={18} color={primaryColor} />
        )}
      </View>
    </TouchableOpacity>
  );
}
