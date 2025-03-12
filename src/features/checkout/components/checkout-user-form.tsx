// Path: src/features/checkout/components/checkout-user-form.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { Card, VStack, HStack } from "@gluestack-ui/themed";
import { User, Phone } from "lucide-react-native";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import { formatPhoneNumber } from "@/src/utils/format.utils";

export function CheckoutUserForm() {
  const { personalInfo, setPersonalInfo, companyConfig } =
    useCheckoutViewModel();

  // Estado local para o telefone formatado
  const [formattedPhone, setFormattedPhone] = useState(
    formatPhoneNumber(personalInfo.phone || "")
  );

  // Atualizar nome
  const handleNameChange = (value: string) => {
    setPersonalInfo({
      ...personalInfo,
      name: value,
    });
  };

  // Atualizar telefone com formatação
  const handlePhoneChange = (value: string) => {
    // Manter apenas dígitos
    const numericValue = value.replace(/\D/g, "");

    // Formatar para exibição
    const formatted = formatPhoneNumber(numericValue);
    setFormattedPhone(formatted);

    // Atualizar o estado com o valor numérico
    setPersonalInfo({
      ...personalInfo,
      phone: numericValue,
    });
  };

  // Cor primária da empresa ou valor padrão
  const primaryColor = companyConfig?.primaryColor || "#F4511E";

  return (
    <Card className="p-4 border border-gray-100 overflow-hidden">
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Suas Informações
      </Text>

      <VStack space="lg">
        {/* Campo de nome completo */}
        <VStack space="xs">
          <HStack space="sm" alignItems="center">
            <User size={18} color={primaryColor} />
            <Text className="font-medium text-gray-700">Nome completo</Text>
          </HStack>

          <TextInput
            value={personalInfo.name}
            onChangeText={handleNameChange}
            placeholder="Digite seu nome completo"
            className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 text-gray-800"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
          />

          <Text className="text-xs text-gray-500 mt-1">
            Digite seu nome completo para identificação do pedido
          </Text>
        </VStack>

        {/* Campo de telefone */}
        <VStack space="xs">
          <HStack space="sm" alignItems="center">
            <Phone size={18} color={primaryColor} />
            <Text className="font-medium text-gray-700">WhatsApp</Text>
          </HStack>

          <TextInput
            value={formattedPhone}
            onChangeText={handlePhoneChange}
            placeholder="(00) 00000-0000"
            className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 text-gray-800"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            maxLength={15} // (99) 99999-9999
          />

          <Text className="text-xs text-gray-500 mt-1">
            Digite seu número de WhatsApp para contato
          </Text>
        </VStack>
      </VStack>
    </Card>
  );
}
