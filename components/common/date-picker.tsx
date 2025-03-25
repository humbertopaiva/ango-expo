// src/components/common/date-picker.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Calendar } from "lucide-react-native";
import { format, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { THEME_COLORS } from "@/src/styles/colors";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  format?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione uma data",
  isInvalid = false,
  errorMessage,
  disabled = false,
  format: dateFormat = "yyyy-MM-dd",
}: DatePickerProps) {
  // Estado para a data que será exibida no picker
  const [date, setDate] = useState(() => {
    if (value) {
      try {
        // Tenta converter a string para objeto Date
        const parsedDate = new Date(value);
        return isValid(parsedDate) ? parsedDate : new Date();
      } catch {
        return new Date();
      }
    }
    return new Date();
  });

  // Estado para controlar a visibilidade do picker
  const [showPicker, setShowPicker] = useState(false);

  // Estado para controlar o texto exibido no input
  const [displayText, setDisplayText] = useState("");

  // Atualiza o texto de exibição sempre que o valor muda
  useEffect(() => {
    if (value) {
      try {
        const dateObj = new Date(value);
        if (isValid(dateObj)) {
          setDisplayText(format(dateObj, "dd/MM/yyyy", { locale: ptBR }));
        } else {
          setDisplayText("");
        }
      } catch {
        setDisplayText("");
      }
    } else {
      setDisplayText("");
    }
  }, [value]);

  // Função para lidar com a mudança de data
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (selectedDate && isValid(selectedDate)) {
      setDate(selectedDate);

      if (Platform.OS === "android") {
        // No Android, confirmamos imediatamente a seleção
        const formattedDate = format(selectedDate, dateFormat);
        onChange(formattedDate);
        setDisplayText(format(selectedDate, "dd/MM/yyyy", { locale: ptBR }));
      }
    }
  };

  // Função para confirmar a seleção (iOS e Web)
  const handleConfirm = () => {
    if (isValid(date)) {
      const formattedDate = format(date, dateFormat);
      onChange(formattedDate);
      setDisplayText(format(date, "dd/MM/yyyy", { locale: ptBR }));
    }
    setShowPicker(false);
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  // Função para abrir o picker
  const openPicker = () => {
    if (!disabled) {
      setShowPicker(true);
    }
  };

  return (
    <View>
      {/* Input que exibe a data selecionada */}
      <Pressable onPress={openPicker} disabled={disabled}>
        <View pointerEvents="none">
          <Input
            isInvalid={isInvalid}
            isDisabled={disabled}
            className="bg-white"
          >
            <InputField
              placeholder={placeholder}
              value={displayText}
              editable={false}
            />
            <InputSlot className="pr-3">
              <InputIcon as={Calendar} color={THEME_COLORS.primary} />
            </InputSlot>
          </Input>
        </View>
      </Pressable>

      {/* Picker para iOS e Web */}
      {(Platform.OS === "ios" || Platform.OS === "web") && (
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <View className="flex-1 justify-end bg-black/30">
            <View className="bg-white p-4 rounded-t-xl">
              <View className="flex-row justify-between items-center mb-4">
                <TouchableOpacity onPress={handleCancel} className="p-2">
                  <Text className="text-red-500 font-medium">Cancelar</Text>
                </TouchableOpacity>
                <Text className="text-lg font-medium">Selecione uma data</Text>
                <TouchableOpacity onPress={handleConfirm} className="p-2">
                  <Text className="text-primary-500 font-medium">
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                locale="pt-BR"
                style={{ height: 200 }}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Picker para Android */}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          locale="pt-BR"
        />
      )}

      {/* Mensagem de erro */}
      {isInvalid && errorMessage && (
        <Text className="text-red-500 text-sm mt-1">{errorMessage}</Text>
      )}
    </View>
  );
}
