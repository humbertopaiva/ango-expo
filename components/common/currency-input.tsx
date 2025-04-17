// Path: src/components/common/currency-input.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { DollarSign, X } from "lucide-react-native";
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
  // Estado para o valor numérico (em centavos)
  const [amountInCents, setAmountInCents] = useState<number>(0);

  // Estado para controlar o texto exibido no input
  const [displayValue, setDisplayValue] = useState("");

  // Converte o valor inicial para centavos e atualiza o estado
  useEffect(() => {
    if (value) {
      // Converte para número, considerando a vírgula como separador decimal
      const numValue = parseFloat(value.replace(",", ".")) || 0;
      // Converte para centavos
      const cents = Math.round(numValue * 100);
      setAmountInCents(cents);
      // Atualiza o texto exibido
      setDisplayValue(formatCurrency(cents));
    } else {
      setAmountInCents(0);
      setDisplayValue("");
    }
  }, [value]);

  // Formata os centavos para exibição como moeda (Ex: 1234 -> "12,34")
  const formatCurrency = (cents: number): string => {
    if (cents === 0) return "";

    // Converte centavos para a representação decimal
    const value = cents / 100;

    // Formata como moeda brasileira (sem o símbolo R$)
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Processa a entrada de números
  const handleNumberInput = (text: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = text.replace(/\D/g, "");

    // Converte para número inteiro
    const cents = parseInt(numericValue) || 0;

    // Atualiza o estado local
    setAmountInCents(cents);

    // Formata e atualiza a exibição
    const formattedValue = formatCurrency(cents);
    setDisplayValue(formattedValue);

    // Emite o valor atualizado no formato esperado pelo formulário (com vírgula)
    const valueForForm = (cents / 100).toString().replace(".", ",");
    onChangeValue(valueForForm);
  };

  // Manipula o foco no input
  const handleFocus = () => {
    // Se estiver vazio, mostra "0,00" ao receber foco
    if (!displayValue) {
      setDisplayValue("0,00");
    }
  };

  // Manipula a perda de foco
  const handleBlur = () => {
    // Se o valor for zero, limpa o campo ao perder foco
    if (amountInCents === 0) {
      setDisplayValue("");
    }
  };

  // Função para limpar o input
  const clearInput = () => {
    setAmountInCents(0);
    setDisplayValue("");
    onChangeValue("");
  };

  // Verifica se deve mostrar o botão de limpar
  const showClearButton = !!displayValue && !disabled;

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
          onChangeText={handleNumberInput}
          keyboardType="numeric"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {/* Botão de limpar - aparece apenas quando há valor */}
        {showClearButton && (
          <InputSlot className="pr-3">
            <TouchableOpacity
              onPress={clearInput}
              className="p-1" // padding para aumentar a área de toque
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} // aumenta a área de toque
            >
              <X size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </InputSlot>
        )}
      </Input>

      {isInvalid && errorMessage && (
        <Text className="text-red-500 text-sm mt-1">{errorMessage}</Text>
      )}
    </View>
  );
}
