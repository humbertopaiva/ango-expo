// Path: src/components/common/currency-input.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { X } from "lucide-react-native";
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
  // Estilos simples passados como props
  style?: ViewStyle;
  className?: string;
  labelClassName?: string;
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
  // Props de estilo
  style,
  className = "",
  labelClassName = "",
}: CurrencyInputProps) {
  // Estado para controlar o texto exibido no input
  const [displayValue, setDisplayValue] = useState("");

  // Flag para controlar a inicialização
  const isInitialMount = useRef(true);

  // Função para formatar valor em centavos para exibição (Ex: 1200 -> "12,00")
  const formatFromCents = (cents: number): string => {
    if (cents === 0) return "";

    // Divide por 100 para converter de centavos para reais
    const reais = cents / 100;

    return reais.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Função para converter valor de exibição para centavos (Ex: "12,00" -> 1200)
  const parseToCents = (val: string): number => {
    if (!val) return 0;

    // Remove todos os caracteres não numéricos
    const numericValue = val.replace(/\D/g, "");
    return parseInt(numericValue) || 0;
  };

  // Atualiza o display quando o valor externo muda
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      if (value) {
        // Converte o valor inicial para centavos
        const cents = parseToCents(value);
        setDisplayValue(formatFromCents(cents));
      }
      return;
    }

    if (value) {
      const cents = parseToCents(value);
      setDisplayValue(formatFromCents(cents));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  // Processa a entrada de números
  const handleNumberInput = (text: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = text.replace(/\D/g, "");

    // Converte para número inteiro (centavos)
    const cents = parseInt(numericValue) || 0;

    // Formata e atualiza a exibição
    const formattedValue = formatFromCents(cents);
    setDisplayValue(formattedValue);

    // Emite o valor em centavos
    // Para manter a compatibilidade, convertemos centavos para o formato "12,00"
    const valueForForm = (cents / 100).toFixed(2).replace(".", ",");
    onChangeValue(valueForForm);
  };

  // Função para limpar o input
  const clearInput = () => {
    setDisplayValue("");
    onChangeValue("");
  };

  // Verifica se deve mostrar o botão de limpar
  const showClearButton = !!displayValue && !disabled;

  return (
    <View style={style}>
      {label && (
        <Text
          className={`text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      )}

      <Input
        isInvalid={isInvalid}
        isDisabled={disabled}
        className={`bg-white ${className}`}
      >
        <InputSlot className="pl-3">
          <Text className="text-gray-500 font-medium">R$</Text>
        </InputSlot>

        <InputField
          placeholder={placeholder}
          value={displayValue}
          onChangeText={handleNumberInput}
          keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
        />

        {/* Botão de limpar - aparece apenas quando há valor */}
        {showClearButton && (
          <InputSlot className="pr-3">
            <TouchableOpacity
              onPress={clearInput}
              className="p-1"
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
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
