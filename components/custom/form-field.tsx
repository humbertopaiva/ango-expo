// src/components/custom/form-field.tsx
import React from "react";
import { View } from "react-native";
import {
  Controller,
  Control,
  Path,
  FieldValues,
  FieldError,
} from "react-hook-form";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@gluestack-ui/themed";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  error?: FieldError;
  secureTextEntry?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "number-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  multiline?: boolean;
  numberOfLines?: number;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  error,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "sentences",
  disabled = false,
  leftIcon,
  multiline = false,
  numberOfLines = 1,
}: FormFieldProps<T>) {
  return (
    <FormControl isInvalid={!!error} isDisabled={disabled}>
      <FormControlLabel>
        <FormControlLabelText className="text-sm font-medium text-gray-700">
          {label}
        </FormControlLabelText>
      </FormControlLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Input
            variant="outline"
            size="md"
            isDisabled={disabled}
            isInvalid={!!error}
          >
            {leftIcon && (
              <InputSlot className="pl-3">
                <InputIcon as={() => leftIcon} />
              </InputSlot>
            )}
            <InputField
              placeholder={placeholder}
              onChangeText={onChange}
              value={value != null ? value.toString() : ""}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              multiline={multiline}
              numberOfLines={multiline ? numberOfLines : undefined}
              className="bg-white"
            />
          </Input>
        )}
      />
      {error && (
        <FormControlError>
          <FormControlErrorText className="text-sm">
            {error.message}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
