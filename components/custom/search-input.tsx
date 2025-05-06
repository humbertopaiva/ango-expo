// components/custom/SearchInput.tsx
import React from "react";
import { View } from "react-native";
import { Search } from "lucide-react-native";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import { SearchIcon } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = "Buscar...",
  disabled = false,
}: SearchInputProps) {
  return (
    <View className="relative mb-4">
      <Input
        isDisabled={disabled}
        className="bg-white rounded-xl border border-primary-500 h-12"
      >
        <InputSlot className="pl-3 ">
          <InputIcon as={SearchIcon} color={THEME_COLORS.primary} />
        </InputSlot>
        <InputField
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          className="placeholder:font-medium"
        />
      </Input>
    </View>
  );
}
