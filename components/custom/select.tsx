// src/components/custom/select.tsx
import React from "react";
import { View, Text } from "react-native";
import {
  Select as GluestackSelect,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  ChevronDownIcon,
} from "@gluestack-ui/themed";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@gluestack-ui/themed";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface SelectComponentProps {
  label?: string;
  options: SelectOption[];
  value: string | number | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  className?: string;
  testID?: string;
}

export function SelectComponent({
  label,
  options,
  value,
  onValueChange,
  placeholder = "Selecione uma opção",
  error,
  isInvalid,
  isDisabled,
  className = "",
  testID,
}: SelectComponentProps) {
  // Encontrar a opção selecionada para exibir o label correto
  const selectedOption = options.find(
    (option) =>
      option.value !== null &&
      option.value !== undefined &&
      option.value.toString() === (value !== null ? value.toString() : "")
  );

  const selectedLabel = selectedOption ? selectedOption.label : "";

  return (
    <FormControl
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      className={className}
      testID={testID}
    >
      {label && (
        <FormControlLabel>
          <FormControlLabelText className="text-sm font-medium text-gray-700">
            {label}
          </FormControlLabelText>
        </FormControlLabel>
      )}

      <GluestackSelect
        selectedValue={value !== null ? value.toString() : ""}
        onValueChange={onValueChange}
        isDisabled={isDisabled}
        closeOnOverlayClick={true}
      >
        <SelectTrigger className="bg-white rounded-md border border-gray-300">
          <SelectInput
            placeholder={placeholder}
            value={selectedLabel}
            className="flex-1"
          />
          {/* <SelectIcon className="mr-3" icon={<ChevronDownIcon />} /> */}
        </SelectTrigger>

        <SelectPortal>
          <SelectBackdrop />
          <SelectContent maxHeight={300} style={{ zIndex: 999999 }}>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>

            {options.map((option) => (
              <SelectItem
                key={option.value?.toString()}
                label={option.label}
                value={option.value?.toString() || ""}
                isDisabled={option.disabled}
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </GluestackSelect>

      {isInvalid && error && (
        <FormControlError>
          <FormControlErrorText className="text-sm">
            {error}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
