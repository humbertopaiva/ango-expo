// Path: @/components/common/status-toggle.tsx
// (Este é um componente comum, então vamos atualizá-lo para suportar as novas funcionalidades)

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Switch } from "@gluestack-ui/themed";
import { CheckCircle2, XCircle } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

interface StatusToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  activeLabel?: string;
  inactiveLabel?: string;
  activeDescription?: string;
  inactiveDescription?: string;
  disabled?: boolean;
  labelOptions?: {
    activeOption: string;
    inactiveOption: string;
  };
}

export function StatusToggle({
  value,
  onChange,
  activeLabel = "Ativo",
  inactiveLabel = "Inativo",
  activeDescription,
  inactiveDescription,
  disabled = false,
  labelOptions,
}: StatusToggleProps) {
  const currentLabel = value ? activeLabel : inactiveLabel;
  const currentDescription = value ? activeDescription : inactiveDescription;

  return (
    <View className="bg-white rounded-lg border border-gray-200 p-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center">
            {value ? (
              <CheckCircle2 size={18} color="#16A34A" />
            ) : (
              <XCircle size={18} color={THEME_COLORS.primary} />
            )}
            <Text
              className={`ml-2 font-medium ${
                value ? "text-green-600" : "text-primary-600"
              }`}
            >
              {currentLabel}
            </Text>
          </View>

          {currentDescription && (
            <Text className="text-gray-600 text-xs mt-1 ml-6">
              {currentDescription}
            </Text>
          )}
        </View>

        {labelOptions ? (
          <View className="flex-row bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <TouchableOpacity
              className={`px-3 py-1.5 ${
                value ? "bg-primary-500" : "bg-transparent"
              }`}
              onPress={() => onChange(true)}
              disabled={disabled}
            >
              <Text
                className={value ? "text-white font-medium" : "text-gray-600"}
              >
                {labelOptions.activeOption}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-3 py-1.5 ${
                !value ? "bg-primary-500" : "bg-transparent"
              }`}
              onPress={() => onChange(false)}
              disabled={disabled}
            >
              <Text
                className={!value ? "text-white font-medium" : "text-gray-600"}
              >
                {labelOptions.inactiveOption}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Switch
            size="sm"
            isDisabled={disabled}
            value={value}
            onToggle={(val) => onChange(val)}
            trackColor={{
              true: THEME_COLORS.primary,
              false: "#D1D5DB",
            }}
          />
        )}
      </View>
    </View>
  );
}
