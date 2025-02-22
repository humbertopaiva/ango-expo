// TimeInput.tsx - Componente separado para melhor organização
import React, { useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Input, InputField } from "../ui/input";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TimeInput({ value, onChange, disabled }: TimeInputProps) {
  const [showPicker, setShowPicker] = useState(false);

  const parseTimeString = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  };

  if (Platform.OS === "web") {
    // Na web, usamos um input com máscara
    return (
      <Input>
        <InputField
          value={value}
          onChangeText={(text) => {
            // Implementa a máscara HH:MM
            const numbers = text.replace(/\D/g, "");

            if (numbers.length <= 2) {
              onChange(numbers);
            } else if (numbers.length <= 4) {
              const hours = numbers.substring(0, 2);
              const minutes = numbers.substring(2);
              if (parseInt(hours) > 23) {
                onChange("23:" + minutes);
              } else if (parseInt(minutes) > 59) {
                onChange(hours + ":59");
              } else {
                onChange(hours + ":" + minutes);
              }
            }
          }}
          placeholder="HH:MM"
          maxLength={5}
          keyboardType="numeric"
          editable={!disabled}
        />
      </Input>
    );
  }

  // No mobile, usamos o DateTimePicker nativo
  return (
    <View>
      <TouchableOpacity onPress={() => !disabled && setShowPicker(true)}>
        <Input>
          <InputField value={value} editable={false} placeholder="HH:MM" />
        </Input>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={parseTimeString(value)}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate && event.type !== "dismissed") {
              const hours = selectedDate.getHours().toString().padStart(2, "0");
              const minutes = selectedDate
                .getMinutes()
                .toString()
                .padStart(2, "0");
              onChange(`${hours}:${minutes}`);
            }
          }}
        />
      )}
    </View>
  );
}
