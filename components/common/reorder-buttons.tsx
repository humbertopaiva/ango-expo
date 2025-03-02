// Path: src/components/common/reorder-buttons.tsx
import React from "react";
import { View } from "react-native";
import { ArrowUp, ArrowDown } from "lucide-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface ReorderButtonsProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  primaryColor?: string;
}

export function ReorderButtons({
  onMoveUp,
  onMoveDown,
  primaryColor = "#F4511E",
}: ReorderButtonsProps) {
  return (
    <View className="h-12 w-12 bg-gray-50 rounded-lg justify-center items-center">
      <View className="flex-row">
        <TouchableOpacity
          onPress={onMoveUp}
          disabled={!onMoveUp}
          className={`p-2 rounded-full ${
            !onMoveUp ? "opacity-30" : "bg-white shadow-sm"
          }`}
        >
          <ArrowUp size={16} color={primaryColor} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onMoveDown}
          disabled={!onMoveDown}
          className={`p-2 rounded-full ml-1 ${
            !onMoveDown ? "opacity-30" : "bg-white shadow-sm"
          }`}
        >
          <ArrowDown size={16} color={primaryColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
