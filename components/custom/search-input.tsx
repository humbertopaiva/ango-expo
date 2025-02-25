// components/custom/SearchInput.tsx
import React from "react";
import { View } from "react-native";
import { Search } from "lucide-react-native";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import { SearchIcon } from "@gluestack-ui/themed";

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
      <Input isDisabled={disabled} className="bg-white">
        <InputSlot className="pl-3 ">
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          className="pl-10"
        />
      </Input>
    </View>
  );
}
