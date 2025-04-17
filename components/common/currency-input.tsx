// Path: src/components/common/currency-input.tsx
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { DollarSign } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

interface CurrencyInputProps {
  value: string;
  onChangeValue: (value: string) => void;
  label?: string;
  placeholder?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
}

export function CurrencyInput({
  value,
  onChangeValue,
  label,
  placeholder = "0,00",
  isInvalid = false,
  errorMessage,
  disabled = false,
  required = false,
}: CurrencyInputProps) {
  // Estado para o texto formatado exibido no input
  const [displayValue, setDisplayValue] = useState("");

  // Formatar o valor quando ele muda externamente
  useEffect(() => {
    if (value) {
      // Converte para número e formata para exibição
      const numberValue = parseFloat(value.replace(",", "."));
      if (!isNaN(numberValue)) {
        setDisplayValue(formatCurrency(numberValue));
      } else {
        setDisplayValue("");
      }
    } else {
      setDisplayValue("");
    }
  }, [value]);

  // Formatar valor como moeda brasileira sem o símbolo R$
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Converter de string formatada para número
  const parseFormattedValue = (formattedValue: string): string => {
    // Remove todos os caracteres não numéricos exceto vírgula
    const cleaned = formattedValue.replace(/[^\d,]/g, "");

    // Substitui vírgula por ponto para compatibilidade com número
    const normalized = cleaned.replace(",", ".");

    return normalized;
  };

  // Lidar com a mudança do texto no input
  const handleChangeText = (text: string) => {
    // Remover tudo exceto números e vírgula
    let cleanedText = text.replace(/[^\d,]/g, "");

    // Garantir que só exista uma vírgula
    const commaCount = (cleanedText.match(/,/g) || []).length;
    if (commaCount > 1) {
      const parts = cleanedText.split(",");
      cleanedText = parts[0] + "," + parts.slice(1).join("");
    }

    // Estruturar o valor como dinheiro
    let numberValue: number;

    if (cleanedText === "" || cleanedText === ",") {
      numberValue = 0;
    } else {
      // Se terminar com vírgula, adicionar um zero para manter a formatação
      if (cleanedText.endsWith(",")) {
        cleanedText += "0";
      }

      // Converter para número
      numberValue = parseFloat(cleanedText.replace(",", "."));
    }

    // Atualizar o estado local e emitir o valor atualizado
    if (!isNaN(numberValue)) {
      setDisplayValue(formatCurrency(numberValue));
      onChangeValue(numberValue.toString().replace(".", ","));
    }
  };

  return (
    <View>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      )}

      <Input isInvalid={isInvalid} isDisabled={disabled} className="bg-white">
        <InputSlot className="pl-3">
          <InputIcon as={DollarSign} color={THEME_COLORS.primary} />
        </InputSlot>
        <InputField
          placeholder={placeholder}
          value={displayValue}
          onChangeText={handleChangeText}
          keyboardType="numeric"
        />
      </Input>

      {isInvalid && errorMessage && (
        <Text className="text-red-500 text-sm mt-1">{errorMessage}</Text>
      )}
    </View>
  );
}
